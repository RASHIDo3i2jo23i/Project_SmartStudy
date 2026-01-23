// Sidebar navigation
const links = document.querySelectorAll('.sidebar a');
const sections = document.querySelectorAll('.section');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.section;
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// GPA Calculator
const semestersDiv = document.getElementById('semesters');
const addSemesterBtn = document.getElementById('add-semester');
const overallGpaSpan = document.getElementById('overall-gpa');
let semesterCount = 0;

addSemesterBtn.addEventListener('click', () => {
  semesterCount++;
  const semDiv = document.createElement('div');
  semDiv.className = 'semester';
  semDiv.innerHTML = `
    <h4>Семестр ${semesterCount}</h4>
    <button class="btn add-course">Добавить предмет</button>
    <div class="courses"></div>
  `;
  semestersDiv.appendChild(semDiv);

  semDiv.querySelector('.add-course').addEventListener('click', () => {
    const coursesDiv = semDiv.querySelector('.courses');
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course';
    courseDiv.innerHTML = `
      <input type="text" placeholder="Название предмета">
      <input type="number" placeholder="Оценка" min="0" max="100">
      <input type="number" placeholder="Кредиты" min="1">
    `;
    coursesDiv.appendChild(courseDiv);
  });
});

// File Upload
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadFileBtn');
const fileList = document.getElementById('fileList');

uploadBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) return alert('Выберите файл');

  const li = document.createElement('li');
  li.textContent = file.name;

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Удалить';
  delBtn.addEventListener('click', () => li.remove());

  li.appendChild(delBtn);
  fileList.appendChild(li);

  fileInput.value = '';
});

// Notes
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');

addNoteBtn.addEventListener('click', () => {
  const text = noteInput.value.trim();
  if (!text) return alert('Введите текст заметки');
  const noteDiv = document.createElement('div');
  noteDiv.className = 'note-card';
  noteDiv.textContent = text;
  notesList.appendChild(noteDiv);
  noteInput.value = '';
});

