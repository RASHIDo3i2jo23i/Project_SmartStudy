// Проверяем аутентификацию
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

// Заголовок с токеном
const authHeader = { 'Authorization': 'Bearer ' + token };

// Обработчик логаута
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

// Навигация по секциям
document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = e.target.getAttribute('data-section');
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(section).classList.add('active');
  });
});

// Переключение темы
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

// Загрузка профиля пользователя
async function loadProfile() {
  try {
    const res = await fetch('/api/profile', { headers: authHeader });
    const user = await res.json();
    if (res.ok) {
      document.getElementById('profile-name').textContent = user.name;
      document.getElementById('profile-email').textContent = user.email;
    }
  } catch (err) {
    console.error('Failed to load profile', err);
  }
}

// Загрузка статистики (количество целей, задач, заметок)
async function loadStats() {
  try {
    const [goalsRes, tasksRes, notesRes] = await Promise.all([
      fetch('/api/goals', { headers: authHeader }),
      fetch('/api/tasks', { headers: authHeader }),
      fetch('/api/notes', { headers: authHeader })
    ]);
    const goals = await goalsRes.json();
    const tasks = await tasksRes.json();
    const notes = await notesRes.json();

    document.getElementById('profile-goals').textContent = goals.length;
    document.getElementById('profile-tasks').textContent = tasks.length;
    document.getElementById('profile-notes').textContent = notes.length;
  } catch (err) {
    console.error('Failed to load stats', err);
  }
}

// Загрузка и управление целями (Goals)
async function loadGoals() {
  const res = await fetch('/api/goals', { headers: authHeader });
  const goals = await res.json();
  const list = document.getElementById('goal-list');
  list.innerHTML = '';
  goals.forEach(goal => {
    const li = document.createElement('li');
    li.textContent = goal.title + (goal.deadline ? ` (by ${new Date(goal.deadline).toLocaleDateString()})` : '');
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'btn';
    del.style.marginLeft = '1rem';
    del.addEventListener('click', async () => {
      await fetch('/api/goals/' + goal._id, {
        method: 'DELETE',
        headers: authHeader
      });
      loadGoals();
      loadStats();
    });
    li.appendChild(del);
    list.appendChild(li);
  });
}
document.getElementById('goal-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('goal-title').value;
  const deadline = document.getElementById('goal-deadline').value;
  await fetch('/api/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ title, deadline })
  });
  document.getElementById('goal-form').reset();
  loadGoals();
  loadStats();
});

// Таймер Помодоро (Pomodoro)
let pomodoroDuration = 25 * 60;
let breakDuration = 5 * 60;
let timeLeft = pomodoroDuration;
let isWork = true;
let timerInterval;

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function updateDisplay() {
  document.getElementById('timer-display').textContent = formatTime(timeLeft);
  document.getElementById('pomodoro-status').textContent = isWork ? 'Work session' : 'Break session';
}
document.getElementById('start-pomodoro').addEventListener('click', () => {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      isWork = !isWork;
      timeLeft = isWork ? pomodoroDuration : breakDuration;
      updateDisplay();
    }
  }, 1000);
});
document.getElementById('reset-pomodoro').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  isWork = true;
  timeLeft = pomodoroDuration;
  updateDisplay();
});
updateDisplay();

// GPA Calculator
document.getElementById('add-course').addEventListener('click', () => {
  const row = document.createElement('tr');
  row.innerHTML = '<td><input type="text" placeholder="Course Name"></td>'
                + '<td><input type="number" step="0.01" min="0" max="4"></td>'
                + '<td><input type="number" min="0"></td>';
  document.getElementById('gpa-table-body').appendChild(row);
});
document.getElementById('calc-gpa').addEventListener('click', () => {
  const weighted = document.getElementById('weighted').checked;
  const rows = document.querySelectorAll('#gpa-table-body tr');
  let totalGrade = 0, totalCredits = 0, count = 0;
  rows.forEach(row => {
    const grade = parseFloat(row.cells[1].querySelector('input').value) || 0;
    const credits = parseFloat(row.cells[2].querySelector('input').value) || 0;
    if (!isNaN(grade)) {
      count++;
      if (weighted) {
        totalGrade += grade * credits;
        totalCredits += credits;
      } else {
        totalGrade += grade;
      }
    }
  });
  let gpa = 0;
  if (weighted) {
    gpa = totalCredits ? (totalGrade / totalCredits) : 0;
  } else {
    gpa = count ? (totalGrade / count) : 0;
  }
  document.getElementById('gpa-result').textContent = 'GPA: ' + gpa.toFixed(2);
});

// Заметки (Notes) – загрузка, добавление, удаление
async function loadNotes() {
  const res = await fetch('/api/notes', { headers: authHeader });
  const notes = await res.json();
  const list = document.getElementById('note-list');
  list.innerHTML = '';
  notes.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card';
    const title = document.createElement('h3');
    title.textContent = note.title;
    const content = document.createElement('p');
    content.textContent = note.content;
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'btn';
    del.addEventListener('click', async () => {
      await fetch('/api/notes/' + note._id, {
        method: 'DELETE',
        headers: authHeader
      });
      loadNotes();
      loadStats();
    });
    card.appendChild(title);
    card.appendChild(content);
    card.appendChild(del);
    list.appendChild(card);
  });
}
loadNotes();
document.getElementById('note-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('note-title').value;
  const content = document.getElementById('note-content').value;
  await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ title, content })
  });
  document.getElementById('note-form').reset();
  loadNotes();
  loadStats();
});

// Экспорт заметок в PDF (используем jsPDF)
document.getElementById('export-notes').addEventListener('click', async () => {
  try {
    const res = await fetch('/api/notes', { headers: authHeader });
    const notes = await res.json();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    notes.forEach((note, idx) => {
      doc.setFontSize(14);
      doc.text(note.title, 10, y);
      y += 8;
      doc.setFontSize(12);
      const contentLines = doc.splitTextToSize(note.content, 180);
      doc.text(contentLines, 10, y);
      y += contentLines.length * 7 + 10;
      if (y > 270 && idx < notes.length - 1) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save('notes.pdf');
  } catch (err) {
    console.error('Failed to export notes', err);
  }
});

// Задачи/Планер (Tasks): загрузка, добавление, переключение статуса, удаление
async function loadTasks() {
  const res = await fetch('/api/tasks', { headers: authHeader });
  const tasks = await res.json();
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.done ? 'completed' : '';
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = task.done;
    chk.addEventListener('change', async () => {
      await fetch('/api/tasks/' + task._id, {
        method: 'PUT',
        headers: authHeader
      });
      loadTasks();
      loadStats();
    });
    li.appendChild(chk);
    const span = document.createElement('span');
    span.textContent = task.task;
    li.appendChild(span);
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'btn';
    del.style.marginLeft = 'auto';
    del.addEventListener('click', async () => {
      await fetch('/api/tasks/' + task._id, {
        method: 'DELETE',
        headers: authHeader
      });
      loadTasks();
      loadStats();
    });
    li.appendChild(del);
    list.appendChild(li);
  });
}
loadTasks();
document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = document.getElementById('task-input').value;
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ task })
  });
  document.getElementById('task-form').reset();
  loadTasks();
  loadStats();
});

// Дневник учёбы (Study Diary): загрузка, добавление, удаление
async function loadDiary() {
  const res = await fetch('/api/diary', { headers: authHeader });
  const entries = await res.json();
  const list = document.getElementById('diary-list');
  list.innerHTML = '';
  entries.forEach(entry => {
    const li = document.createElement('li');
    const dateStr = new Date(entry.date).toLocaleDateString();
    li.textContent = `${dateStr}: ${entry.content}`;
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'btn';
    del.style.marginLeft = '1rem';
    del.addEventListener('click', async () => {
      await fetch('/api/diary/' + entry._id, {
        method: 'DELETE',
        headers: authHeader
      });
      loadDiary();
    });
    li.appendChild(del);
    list.appendChild(li);
  });
}
loadDiary();
document.getElementById('diary-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const date = document.getElementById('diary-date').value;
  const content = document.getElementById('diary-content').value;
  await fetch('/api/diary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ date, content })
  });
  document.getElementById('diary-form').reset();
  loadDiary();
});

// Загрузка списка файлов: загрузка, добавление, удаление
async function loadFiles() {
  const res = await fetch('/api/files', { headers: authHeader });
  const files = await res.json();
  const list = document.getElementById('file-list');
  list.innerHTML = '';
  files.forEach(file => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '/' + file.path;
    link.textContent = file.originalName;
    link.target = '_blank';
    li.appendChild(link);
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'btn';
    del.style.marginLeft = '1rem';
    del.addEventListener('click', async () => {
      await fetch('/api/files/' + file._id, {
        method: 'DELETE',
        headers: authHeader
      });
      loadFiles();
    });
    li.appendChild(del);
    list.appendChild(li);
  });
}
loadFiles();
document.getElementById('file-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('file-input');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  await fetch('/api/files', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: formData
  });
  fileInput.value = '';
  loadFiles();
});

// AI Assistant (Mocked)
document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  const box = document.getElementById('chat-box');
  const userDiv = document.createElement('div');
  userDiv.innerHTML = `<strong>You:</strong> ${msg}`;
  box.appendChild(userDiv);
  input.value = '';
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ message: msg })
  });
  const data = await res.json();
  const botDiv = document.createElement('div');
  botDiv.innerHTML = `<strong>Assistant:</strong> ${data.response}`;
  box.appendChild(botDiv);
  box.scrollTop = box.scrollHeight;
});

// Инициализация данных
loadProfile();
loadGoals();
loadNotes();
loadTasks();
loadStats();

// Создаём график производительности (используем Chart.js)
function loadChart() {
  const ctx = document.getElementById('progressChart').getContext('2d');
  // Пример данных: выполненные задачи по дням недели
  const sampleLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sampleData = [3, 5, 2, 8, 4, 7, 6];
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: sampleLabels,
      datasets: [{
        label: 'Tasks Completed',
        data: sampleData,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: '#4CAF50',
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
window.addEventListener('load', loadChart);
