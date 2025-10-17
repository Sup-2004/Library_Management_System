// Initialize EmailJS
(function(){
  emailjs.init("15MGZeaHx3exA5fnZ"); // Replace with your actual EmailJS public key
})();

const email = localStorage.getItem("lib_logged_in");

// Function to show in-app notification
function showNotification(msg) {
  const notify = document.getElementById("notify");
  notify.textContent = msg;
  notify.style.display = "block";
  setTimeout(() => notify.style.display = "none", 4000);
}

// Issue book and send email
function issueBook(bookName) {
  if (!email) {
    alert("Please login again!");
    window.location.href = "index.html";
    return;
  }

  // Store issued book locally
  let issued = JSON.parse(localStorage.getItem("issued_books") || "[]");
  issued.push({ name: bookName, date: new Date().toLocaleString() });
  localStorage.setItem("issued_books", JSON.stringify(issued));

  // Show in-page notification
  showNotification(`"${bookName}" issued successfully!`);

  // Send email notification
  emailjs.send("service_mtbqmil", "service_mtbqmil", {
    to_email: email,
    book_name: bookName,
    subject: "Library Book Issued Notification"
  })
  .then(() => console.log("✅ Email sent successfully!"))
  .catch(err => console.error("❌ Email error:", err));
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("lib_logged_in");
  window.location.href = "index.html";
});
