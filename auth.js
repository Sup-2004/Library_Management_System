// Switching between login and signup
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

document.getElementById("showSignup").onclick = () => {
  loginForm.classList.remove("active");
  signupForm.classList.add("active");
};

document.getElementById("showLogin").onclick = () => {
  signupForm.classList.remove("active");
  loginForm.classList.add("active");
};

// Signup
signupForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value.trim();
  const pass = document.getElementById("signupPassword").value;

  if (pass.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  localStorage.setItem("lib_user", JSON.stringify({ email, pass }));
  alert("Account created! Please login.");
  signupForm.reset();
  signupForm.classList.remove("active");
  loginForm.classList.add("active");
});

// Login
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;

  const stored = JSON.parse(localStorage.getItem("lib_user"));
  if (stored && email === stored.email && pass === stored.pass) {
    localStorage.setItem("lib_logged_in", email);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
});
