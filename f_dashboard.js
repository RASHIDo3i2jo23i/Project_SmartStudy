// ===== DASHBOARD MENU =====
const menuBtns = document.querySelectorAll(".menuBtn");
const blocks = document.querySelectorAll(".block");

menuBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    blocks.forEach(b => b.style.display = "none");
    document.getElementById(btn.dataset.block).style.display = "block";
  });
});

// ===== GOALS =====
const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalsCards = document.getElementById("goalsCards");

addGoalBtn.addEventListener("click", () => {
  if (!goalInput.value) return alert("Enter a goal");
  const div = document.createElement("div");
  div.className = "card";
  div.textContent = `${goalInput.value} (${document.getElementById("goalDate").value})`;
  goalsCards.appendChild(div);
  goalInput.value = "";
});

// ===== NOTES =====
const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesCards = document.getElementById("notesCards");

addNoteBtn.addEventListener("click", () => {
  if (!noteInput.value) return alert("Enter a note");
  const div = document.createElement("div");
  div.className = "card note";
  div.textContent = noteInput.value;
  notesCards.appendChild(div);
  noteInput.value = "";
});

// ===== TODO =====
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");

addTodoBtn.addEventListener("click", () => {
  if (!todoInput.value) return alert("Enter task");
  const li = document.createElement("li");
  li.textContent = todoInput.value;
  todoList.appendChild(li);
  todoInput.value = "";
});

// ===== GPA =====
const addCourseBtn = document.getElementById("addCourseBtn");
const coursesList = document.getElementById("coursesList");
const gpaResult = document.getElementById("gpaResult");
const gpaMode = document.getElementById("gpaMode");
let courses = [];

addCourseBtn.addEventListener("click", () => {
  const name = document.getElementById("courseName").value;
  const grade = document.getElementById("courseGrade").value.toUpperCase();
  const credits = Number(document.getElementById("courseCredits").value);

  if (!name || !grade || (!credits && gpaMode.value === "weighted")) return alert("Fill all fields");

  courses.push({name, grade, credits: credits || 0});
  updateGPA();
  renderCourses();
  document.getElementById("courseName").value = "";
  document.getElementById("courseGrade").value = "";
  document.getElementById("courseCredits").value = "";
});

function renderCourses() {
  coursesList.innerHTML = "";
  courses.forEach(c => {
    const li = document.createElement("div");
    li.className = "card";
    li.textContent = `${c.name} - ${c.grade} (${c.credits} credits)`;
    coursesList.appendChild(li);
  });
}

function updateGPA() {
  let totalPoints = 0, totalCredits = 0;
  courses.forEach(c => {
    const points = {A:4,B:3,C:2,D:1,F:0}[c.grade] || 0;
    if (gpaMode.value === "weighted") {
      totalPoints += points * c.credits;
      totalCredits += c.credits;
    } else {
      totalPoints += points;
      totalCredits += 1;
    }
  });
  const gpa = totalCredits ? (totalPoints/totalCredits).toFixed(2) : "0.00";
  gpaResult.textContent = `GPA: ${gpa}`;
}

// ===== POMODORO =====
const pomodoroTime = document.getElementById("timerDisplay");
const startPomodoroBtn = document.getElementById("startPomodoroBtn");
const pausePomodoroBtn = document.getElementById("pausePomodoroBtn");
const resetPomodoroBtn = document.getElementById("resetPomodoroBtn");
let pomodoroSeconds = 25*60;
let pomodoroInterval = null;
let cycles = 0;

function displayPomodoro() {
  const m = String(Math.floor(pomodoroSeconds/60)).padStart(2,'0');
  const s = String(pomodoroSeconds%60).padStart(2,'0');
  pomodoroTime.textContent = `${m}:${s}`;
  document.getElementById("pomodoroBar").style.width = `${(25*60 - pomodoroSeconds)/1500*100}%`;
}

startPomodoroBtn.addEventListener("click", () => {
  clearInterval(pomodoroInterval);
  pomodoroInterval = setInterval(() => {
    if(pomodoroSeconds > 0) pomodoroSeconds--;
    else { pomodoroSeconds = 25*60; cycles++; document.getElementById("pomodoroCycles").textContent = cycles; }
    displayPomodoro();
  },1000);
});

pausePomodoroBtn.addEventListener("click", () => clearInterval(pomodoroInterval));
resetPomodoroBtn.addEventListener("click", () => {pomodoroSeconds = 25*60; cycles = 0; displayPomodoro(); document.getElementById("pomodoroCycles").textContent = cycles;});

displayPomodoro();






