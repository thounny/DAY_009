let currentlyEditingIndex = null;

// Save Markdown Note and display it
document.getElementById("saveNote").addEventListener("click", function () {
  const markdownText = document.getElementById("markdown-editor").value;
  if (!markdownText.trim()) return;

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  const now = new Date();

  // Format date and time
  const date = `${(now.getMonth() + 1).toString().padStart(2, "0")}/${now
    .getDate()
    .toString()
    .padStart(2, "0")}/${now.getFullYear()}`;
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${date} ${hours}:${minutes} ${ampm}`;

  if (currentlyEditingIndex !== null) {
    // Edit existing note
    notes[currentlyEditingIndex].content = markdownText;
    notes[currentlyEditingIndex].lastSaved = formattedTime;
    // Move the edited note to the top
    const editedNote = notes.splice(currentlyEditingIndex, 1)[0];
    notes.unshift(editedNote);
    currentlyEditingIndex = null;
  } else {
    // Add new note and move it to the top
    const newNote = {
      name: "Untitled Note",
      content: markdownText,
      lastSaved: formattedTime,
    };
    notes.unshift(newNote); // Add the new note at the top
  }

  // Save the reordered notes array to localStorage
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
  document.getElementById("markdown-editor").value = ""; // Clear editor
});

// Function to display saved notes and reorder them
function displayNotes() {
  const notesDisplay = document.getElementById("notesDisplay");
  notesDisplay.innerHTML = ""; // Clear previous notes
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    const noteNameInput = document.createElement("input");
    noteNameInput.type = "text";
    noteNameInput.value = note.name;
    noteNameInput.classList.add("note-name");
    noteNameInput.disabled = true;

    const renameBtn = document.createElement("button");
    renameBtn.textContent = "Rename";

    const saveMessage = document.createElement("span");
    saveMessage.classList.add("save-message");
    saveMessage.style.display = "none"; // Hidden initially
    saveMessage.textContent = "Name saved!";

    let originalName = note.name;

    renameBtn.addEventListener("click", function () {
      const isRenaming = noteNameInput.disabled;
      noteNameInput.disabled = !isRenaming;

      if (!isRenaming) {
        originalName = noteNameInput.value; // Track the original name before renaming
        noteNameInput.focus(); // Automatically focus on the input for renaming
      } else {
        // Only save if the name was changed
        if (noteNameInput.value !== originalName) {
          saveNoteName(notes, index, noteNameInput, saveMessage);
        }
      }
    });

    // Save on pressing Enter during rename
    noteNameInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        if (noteNameInput.value !== originalName) {
          saveNoteName(notes, index, noteNameInput, saveMessage);
        }
        noteNameInput.disabled = true; // Disable the input after saving
      }
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", function () {
      currentlyEditingIndex = index;
      editNoteInEditor(note.content);
      document.getElementById("lastSavedTime").textContent = note.lastSaved; // Show the saved time for the selected note
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      notes.splice(index, 1); // Remove the note at the given index
      localStorage.setItem("notes", JSON.stringify(notes));
      displayNotes();
    });

    noteDiv.append(noteNameInput, renameBtn, editBtn, deleteBtn, saveMessage);
    notesDisplay.appendChild(noteDiv);

    // Click on the note name to preview its content
    noteNameInput.addEventListener("click", function () {
      updatePreview(note.content);
      document.getElementById("lastSavedTime").textContent = note.lastSaved; // Show the saved time for the selected note
    });
  });
}

// Function to handle saving the renamed note
function saveNoteName(notes, index, noteNameInput, saveMessage) {
  notes[index].name = noteNameInput.value;
  localStorage.setItem("notes", JSON.stringify(notes));

  // Show save message and hide after 2 seconds
  saveMessage.style.display = "inline";
  setTimeout(() => {
    saveMessage.style.display = "none";
  }, 2000);
}

// Update live Markdown preview
function updatePreview(markdown) {
  document.getElementById("markdownPreview").innerHTML = marked.parse(markdown);
}

// Edit note in the editor (loads the Markdown into the editor for editing)
function editNoteInEditor(note) {
  document.getElementById("markdown-editor").value = note;
  updatePreview(note); // Update the live preview with the loaded note
}

// Display notes when page loads
displayNotes();

// Live preview while typing in the editor
document
  .getElementById("markdown-editor")
  .addEventListener("input", function () {
    const markdownText = document.getElementById("markdown-editor").value;
    updatePreview(markdownText); // Live update the preview as you type
  });

// Function to open the Markdown Note Taker
function openNoteTaker() {
  window.location.href = "./index.html"; // Change to your note taker page
}

// Function to open GitHub in a new tab
function openGitHub() {
  window.open("https://github.com/thounny", "_blank"); // Replace with your GitHub URL
}

// Function to update the clock
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0"); // Add seconds for real-time update
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${minutes}:${seconds} ${ampm}`; // Include seconds
  document.getElementById("clock").textContent = formattedTime;
}

// Update clock every second
setInterval(updateClock, 1000); // Update every 1000 milliseconds (1 second)
updateClock(); // Initial call to set clock immediately

// Function to toggle Start Menu visibility
function toggleStartMenu() {
  const menu = document.getElementById("startMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Function to exit the application
function exitApplication() {
  const menu = document.getElementById("startMenu");
  menu.style.display = "none"; // Close the Start menu
  // Optionally close the window if running in a new tab (may not work in all browsers)
  window.close();
}

// Close the menu when clicking outside
document.addEventListener("click", function (event) {
  const menu = document.getElementById("startMenu");
  if (
    !menu.contains(event.target) &&
    event.target.className !== "start-button"
  ) {
    menu.style.display = "none";
  }
});
