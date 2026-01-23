// script.js
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Сначала войдите в систему!');
        document.body.innerHTML = '<h2 class="text-center mt-5">Пожалуйста, авторизуйтесь</h2>';
        return;
    }
    loadGoals();
    loadNotes();
});

// Загрузка существующих целей из backend API
async function loadGoals() {
    try {
        const response = await fetch('/api/goals');
        const goals = await response.json();
        goals.forEach(goal => addGoalToList(goal));
    } catch (error) {
        console.error('Error loading goals:', error);
    }
}

// Добавление цели в список (DOM)
function addGoalToList(goal) {
    const list = document.getElementById('goal-list');
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = goal.text || goal; // если API возвращает {text: ...}
    list.appendChild(li);
}

// Обработчик добавления новой цели
document.getElementById('add-goal-btn').addEventListener('click', async () => {
    const input = document.getElementById('goal-input');
    const text = input.value.trim();
    if (!text) return;
    try {
        const response = await fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const newGoal = await response.json();
        addGoalToList(newGoal);
        input.value = '';
    } catch (error) {
        console.error('Error adding goal:', error);
    }
});

// Загрузка существующих заметок из backend API
async function loadNotes() {
    try {
        const response = await fetch('/api/notes');
        const notes = await response.json();
        notes.forEach(note => addNoteToList(note));
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// Добавление заметки в список (DOM)
function addNoteToList(note) {
    const list = document.getElementById('notes-list');
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = note.text || note;
    list.appendChild(li);
}

// Обработчик добавления новой заметки
document.getElementById('add-note-btn').addEventListener('click', async () => {
    const textarea = document.getElementById('note-input');
    const text = textarea.value.trim();
    if (!text) return;
    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const newNote = await response.json();
        addNoteToList(newNote);
        textarea.value = '';
    } catch (error) {
        console.error('Error adding note:', error);
    }
});

// GPA-калькулятор: добавление новой строки предмета
function addSubjectRow() {
    const rows = document.getElementById('gpa-rows');
    const div = document.createElement('div');
    div.className = 'd-flex mb-2 gpa-row';
    div.innerHTML = `
        <input type="text" class="form-control me-2" placeholder="Предмет">
        <input type="number" class="form-control me-2" placeholder="Оценка">
        <button class="btn btn-danger remove-subject">&times;</button>
    `;
    rows.appendChild(div);
    // Обработчик удаления этой строки
    div.querySelector('.remove-subject').addEventListener('click', () => {
        div.remove();
    });
}

// Событие: добавить предмет
document.getElementById('add-subject-btn').addEventListener('click', addSubjectRow);

// Событие: рассчитать GPA
document.getElementById('calculate-gpa-btn').addEventListener('click', () => {
    const rows = document.querySelectorAll('.gpa-row');
    let sum = 0;
    let count = 0;
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            const grade = parseFloat(input.value);
            if (!isNaN(grade)) {
                sum += grade;
                count++;
            }
        });
    });
    const resultDiv = document.getElementById('gpa-result');
    if (count > 0) {
        const gpa = (sum / count).toFixed(2);
        resultDiv.textContent = 'GPA: ' + gpa;
    } else {
        resultDiv.textContent = '';
    }
});

// Таймер Помодоро
let pomodoroInterval;
let isRunning = false;
let isWork = true;
let minutes = 25, seconds = 0;

// Обновить дисплей таймера
function updatePomodoroDisplay() {
    const timerEl = document.getElementById('pomodoro-timer');
    const labelEl = document.getElementById('pomodoro-label');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
    labelEl.textContent = isWork ? 'Работа' : 'Перерыв';
}

// Запуск таймера
function startPomodoro() {
    if (isRunning) return;
    isRunning = true;
    document.getElementById('start-pomodoro-btn').disabled = true;
    document.getElementById('stop-pomodoro-btn').disabled = false;
    pomodoroInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                // переключаемся между работой и перерывом
                isWork = !isWork;
                if (isWork) {
                    minutes = 25; seconds = 0;
                } else {
                    minutes = 5; seconds = 0;
                }
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }
        updatePomodoroDisplay();
    }, 1000);
}

// Остановка таймера
function stopPomodoro() {
    clearInterval(pomodoroInterval);
    isRunning = false;
    document.getElementById('start-pomodoro-btn').disabled = false;
    document.getElementById('stop-pomodoro-btn').disabled = true;
}

document.getElementById('start-pomodoro-btn').addEventListener('click', startPomodoro);
document.getElementById('stop-pomodoro-btn').addEventListener('click', stopPomodoro);

// Инициализация дисплея при загрузке
updatePomodoroDisplay();

// ИИ-помощник: отправка запроса на backend (OpenAI)
document.getElementById('ask-ai-btn').addEventListener('click', async () => {
    const question = document.getElementById('question-input').value.trim();
    if (!question) return;
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        const data = await response.json();
        const output = data.answer || data.result || '';
        document.getElementById('ai-response').textContent = output;
    } catch (error) {
        console.error('Error fetching AI answer:', error);
    }
});

// При загрузке страницы инициализируем данные
window.addEventListener('load', () => {
    loadGoals();
    loadNotes();
});
