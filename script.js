// === LOGIN ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("issuedBooks", JSON.stringify([]));

    window.location.href = "dashboard.html";
  });
}

// === DASHBOARD ===
const userGreeting = document.getElementById("userGreeting");
const accName = document.getElementById("accName");
const accEmail = document.getElementById("accEmail");
const accBooksIssued = document.getElementById("accBooksIssued");

if (userGreeting && accName && accEmail) {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  userGreeting.textContent = `Hello, ${username}! Welcome to the Smart Library.`;
  accName.textContent = username;
  accEmail.textContent = email;
}

// === Book Data (Expanded) ===
const books = [
  { name: "Introduction to Algorithms", author: "Cormen", location: "Shelf A1", available: true },
  { name: "Clean Code", author: "Robert C. Martin", location: "Shelf B2", available: true },
  { name: "Python Crash Course", author: "Eric Matthes", location: "Shelf C3", available: true },
  { name: "Artificial Intelligence", author: "Stuart Russell", location: "Shelf D4", available: true },
  { name: "Deep Learning", author: "Ian Goodfellow", location: "Shelf E2", available: false },
  { name: "Computer Networks", author: "Andrew S. Tanenbaum", location: "Shelf F1", available: true },
  { name: "Database System Concepts", author: "Silberschatz", location: "Shelf G3", available: true },
  { name: "Operating System Concepts", author: "Galvin", location: "Shelf H2", available: false },
  { name: "Data Structures in C", author: "Seymour Lipschutz", location: "Shelf I5", available: true },
  { name: "Java The Complete Reference", author: "Herbert Schildt", location: "Shelf J3", available: true }
];

const bookList = document.getElementById("bookList");
const issuedBooksList = document.getElementById("issuedBooksList");
const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");

function renderBooks(filter = "") {
  bookList.innerHTML = "";
  const filtered = books.filter(b => b.name.toLowerCase().includes(filter.toLowerCase()));

  filtered.forEach((book, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${book.name}</td>
      <td>${book.author}</td>
      <td>${book.location}</td>
      <td class="${book.available ? "status-available" : "status-issued"}">
        ${book.available ? "Available" : "Issued"}
      </td>
      <td>
        <button ${book.available ? "" : "disabled"} onclick="issueBook(${index})">
          ${book.available ? "Issue" : "N/A"}
        </button>
      </td>
    `;
    bookList.appendChild(tr);
  });
}
renderBooks();

// === Real-time Search and Availability Display ===
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    renderBooks(query);

    const match = books.find(b => b.name.toLowerCase() === query);
    if (match) {
      searchResult.textContent = match.available
        ? `✅ "${match.name}" is available at ${match.location}.`
        : `❌ "${match.name}" is currently issued.`;
    } else if (query.length > 0) {
      searchResult.textContent = "No matching book found.";
    } else {
      searchResult.textContent = "";
    }
  });
}

// === Issue Book ===
function issueBook(index) {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const issued = JSON.parse(localStorage.getItem("issuedBooks")) || [];
  const book = books[index];

  if (!book.available) return;

  book.available = false;
  issued.push(book.name);
  localStorage.setItem("issuedBooks", JSON.stringify(issued));

  renderBooks(searchInput.value);
  renderIssuedBooks();

  emailjs.send("service_mtbqmil", "template_bra4cky", {
    to_email: email,
    from_name: "Smart Library",
    user_name: username,
    book_name: book.name,
    message: `You have issued "${book.name}" located at ${book.location}. Please return within 7 days.`,
  })
  .then(() => alert("📧 Email notification sent!"))
  .catch((err) => console.error("Email failed:", err));
}

// === Render Issued Books and Account Counter ===
function renderIssuedBooks() {
  const issued = JSON.parse(localStorage.getItem("issuedBooks")) || [];
  issuedBooksList.innerHTML = "";
  issued.forEach((b) => {
    const li = document.createElement("li");
    li.textContent = b;
    issuedBooksList.appendChild(li);
  });
  if (accBooksIssued) accBooksIssued.textContent = issued.length;
}
renderIssuedBooks();

// === Logout ===
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}
