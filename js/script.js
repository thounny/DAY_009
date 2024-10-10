// Function to open the Markdown Note Taker
function openNoteTaker() {
  window.location.href = "./notes.html"; // Change to your note taker page
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
