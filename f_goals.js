console.log("Goals JS loaded");

const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalsList = document.getElementById("goalsList");

async function loadGoals() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login first!");

  const res = await fetch("/api/goals", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();

  goalsList.innerHTML = "";
  data.forEach(g => {
    const li = document.createElement("li");
    li.textContent = g.title;
    goalsList.appendChild(li);
  });
}

addGoalBtn.addEventListener("click", async () => {
  const title = goalInput.value;
  if (!title) return alert("Enter a goal");

  const token = localStorage.getItem("token");
  if (!token) return alert("Login first!");

  await fetch("/api/goals", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title })
  });

  goalInput.value = "";
  loadGoals();
});

loadGoals();
