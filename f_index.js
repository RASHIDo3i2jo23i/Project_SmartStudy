const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const registerBtn = document.getElementById("registerBtn");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

const authSection = document.getElementById("authSection");
const dashboardSection = document.getElementById("dashboardSection");

registerBtn.addEventListener("click", async () => {
  const name = regName.value;
  const email = regEmail.value;
  const password = regPassword.value;

  if (!name || !email || !password) return alert("Fill all fields");

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  if (data.token) {
    alert("Registered and logged in!");
    localStorage.setItem("token", data.token);
    showDashboard();
  } else {
    alert("Error: " + (data.msg || data.error));
  }
});

loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  if (!email || !password) return alert("Fill all fields");

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    showDashboard();
  } else {
    alert("Login failed");
  }
});

function showDashboard() {
  authSection.style.display = "none";
  dashboardSection.style.display = "flex";
}


