
let courses = [
  { id: 1, title: "JavaScript Basics", instructor: "Ali Khan", duration: "3 Weeks", category: "Programming", level: "Beginner" },
  { id: 2, title: "UI/UX Design", instructor: "Sara Malik", duration: "4 Weeks", category: "Design", level: "Intermediate" },
  { id: 3, title: "Flutter App Dev", instructor: "Ahsan Ahmed", duration: "6 Weeks", category: "App Development", level: "Advanced" },
];

// DOM refs
const courseContainer = document.getElementById("courseContainer");
const addForm = document.getElementById("addForm");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");
const filterInstructor = document.getElementById("filterInstructor");
const filterDuration = document.getElementById("filterDuration");
const filterLevel = document.getElementById("filterLevel");
const clearFilters = document.getElementById("clearFilters");

const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const cancelEdit = document.getElementById("cancelEdit");

let nextId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;

// Helper: render the course cards based on current filters/search
function renderCourses() {
  const query = (searchInput.value || "").trim().toLowerCase();
  const cat = filterCategory.value;
  const instr = filterInstructor.value;
  const dur = filterDuration.value;
  const lvl = filterLevel.value;

  const filtered = courses.filter(c => {
    // search matching title or instructor
    const matchesQuery = !query || c.title.toLowerCase().includes(query) || c.instructor.toLowerCase().includes(query);
    const matchesCat = !cat || c.category === cat;
    const matchesInstr = !instr || c.instructor === instr;
    const matchesDur = !dur || c.duration === dur;
    const matchesLvl = !lvl || c.level === lvl;
    return matchesQuery && matchesCat && matchesInstr && matchesDur && matchesLvl;
  });

  courseContainer.innerHTML = filtered.map(c => courseCardHTML(c)).join("");

  // attach listeners for edit/delete
  document.querySelectorAll(".btn-delete").forEach(btn => btn.addEventListener("click", onDelete));
  document.querySelectorAll(".btn-edit").forEach(btn => btn.addEventListener("click", onEdit));
}

function courseCardHTML(c) {
  return `
    <div class="float-hover bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
      <div class="p-6">
        <h3 class="font-semibold text-lg mb-1 text-blue-300">${escapeHTML(c.title)}</h3>
        <p class="text-sm text-gray-400 mb-2">Instructor: <span class="text-gray-200">${escapeHTML(c.instructor)}</span></p>
        <p class="text-sm text-gray-400">Category: <span class="text-gray-200">${escapeHTML(c.category)}</span></p>
        <p class="text-sm text-gray-400">Duration: <span class="text-gray-200">${escapeHTML(c.duration)}</span></p>
        <p class="text-sm text-gray-400 mb-4">Level: <span class="text-gray-200">${escapeHTML(c.level)}</span></p>
        <div class="flex gap-2">
          <button data-id="${c.id}" class="btn-edit px-3 py-1 bg-yellow-500 text-black rounded">Edit</button>
          <button data-id="${c.id}" class="btn-delete px-3 py-1 bg-red-500 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  `;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}

// Populate filter dropdowns based on current courses
function populateFilters() {
  const cats = Array.from(new Set(courses.map(c => c.category))).filter(Boolean).sort();
  const instrs = Array.from(new Set(courses.map(c => c.instructor))).filter(Boolean).sort();
  const durs = Array.from(new Set(courses.map(c => c.duration))).filter(Boolean).sort();
  const lvls = Array.from(new Set(courses.map(c => c.level))).filter(Boolean).sort();

  fillSelect(filterCategory, ['', ...cats]);
  fillSelect(filterInstructor, ['', ...instrs]);
  fillSelect(filterDuration, ['', ...durs]);
  fillSelect(filterLevel, ['', ...lvls]);
}

function fillSelect(selectEl, values) {
  const val = selectEl.value; // keep current selection if possible
  selectEl.innerHTML = values.map(v => `<option value="${escapeHTML(v)}">${v || 'All'}</option>`).join('');
  if (values.includes(val)) selectEl.value = val;
}

// Add course
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const newCourse = {
    id: nextId++,
    title: data.title || 'Untitled',
    instructor: data.instructor || 'Unknown',
    duration: data.duration || '',
    category: data.category || '',
    level: data.level || 'Beginner'
  };
  courses.push(newCourse);
  form.reset();
  populateFilters();
  renderCourses();
});

// Delete handler
function onDelete(e) {
  const id = Number(e.currentTarget.dataset.id);
  courses = courses.filter(c => c.id !== id);
  populateFilters();
  renderCourses();
}

// Edit: open modal and fill with values
function onEdit(e) {
  const id = Number(e.currentTarget.dataset.id);
  const course = courses.find(c => c.id === id);
  if (!course) return;
  editForm.id.value = course.id;
  editForm.title.value = course.title;
  editForm.instructor.value = course.instructor;
  editForm.duration.value = course.duration;
  editForm.category.value = course.category;
  editForm.level.value = course.level || 'Beginner';
  editModal.classList.remove('hidden');
}

// Cancel edit
cancelEdit.addEventListener('click', () => {
  editModal.classList.add('hidden');
});

// Update
editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(editForm).entries());
  const id = Number(data.id);
  const idx = courses.findIndex(c => c.id === id);
  if (idx === -1) return;
  courses[idx] = {
    ...courses[idx],
    title: data.title,
    instructor: data.instructor,
    duration: data.duration,
    category: data.category,
    level: data.level
  };
  editModal.classList.add('hidden');
  populateFilters();
  renderCourses();
});

// Search & filter events
[searchInput, filterCategory, filterInstructor, filterDuration, filterLevel].forEach(el => {
  el.addEventListener('input', () => renderCourses());
  el.addEventListener('change', () => renderCourses());
});

clearFilters.addEventListener('click', () => {
  searchInput.value = '';
  filterCategory.value = '';
  filterInstructor.value = '';
  filterDuration.value = '';
  filterLevel.value = '';
  renderCourses();
});

// Initialize
populateFilters();
renderCourses();

// Expose for debugging
window._courses = courses;
