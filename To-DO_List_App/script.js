// Keys
const STORAGE_KEY = "todo_list_tasks";

// DOM elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const message = document.getElementById("message");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");

// State
let tasks = [];
let currentFilter = "all";

// Load tasks on start
document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromStorage();
  renderTasks();
});

// Form submit: add task (UPDATED with duplicate prevention)
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  
  if (!text) {
    showMessage("Task cannot be empty.", "error");
    return;
  }

  // NEW: Check for duplicate tasks (case-insensitive)
  const duplicateTask = tasks.find(task => 
    task.text.toLowerCase() === text.toLowerCase()
  );
  
  if (duplicateTask) {
    showMessage(`Task "${text}" already exists!`, "error");
    taskInput.value = "";
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
    priority: "medium" // default priority; can be extended later
  };

  tasks.push(newTask);
  saveTasksToStorage();
  renderTasks();
  taskInput.value = "";
  showMessage("Task added successfully.", "success");
});

// Filter buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Show message
function showMessage(text, type) {
  message.textContent = text;
  message.className = "message " + (type || "");
  if (text) {
    setTimeout(() => {
      message.textContent = "";
      message.className = "message";
    }, 2000);
  }
}

// Local storage helpers
function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
  } catch (error) {
    tasks = [];
    console.error("Failed to load tasks from storage", error);
  }
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  if (filteredTasks.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.textContent = "No tasks to show.";
    emptyLi.style.textAlign = "center";
    emptyLi.style.color = "#6b7280";
    emptyLi.style.fontSize = "0.9rem";
    taskList.appendChild(emptyLi);
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    const mainDiv = document.createElement("div");
    mainDiv.className = "task-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskCompleted(task.id));

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;
    if (task.completed) {
      textSpan.classList.add("completed");
    }

    const prioritySpan = document.createElement("span");
    prioritySpan.className = `task-priority priority-${task.priority}`;
    prioritySpan.textContent = task.priority;

    mainDiv.appendChild(checkbox);
    mainDiv.appendChild(textSpan);
    mainDiv.appendChild(prioritySpan);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(mainDiv);
    li.appendChild(actionsDiv);
    taskList.appendChild(li);
  });
}

// Toggle completed
function toggleTaskCompleted(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasksToStorage();
  renderTasks();
}

// Edit task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const newText = prompt("Edit task:", task.text);
  if (newText === null) return; // cancel

  const trimmed = newText.trim();
  if (!trimmed) {
    showMessage("Task cannot be empty.", "error");
    return;
  }

  // ALSO check for duplicates during edit (excluding current task)
  const duplicateTask = tasks.find(t => 
    t.id !== id && t.text.toLowerCase() === trimmed.toLowerCase()
  );
  
  if (duplicateTask) {
    showMessage(`Task "${trimmed}" already exists!`, "error");
    return;
  }

  task.text = trimmed;
  saveTasksToStorage();
  renderTasks();
  showMessage("Task updated.", "success");
}

// Delete task
function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  tasks = tasks.filter((t) => t.id !== id);
  saveTasksToStorage();
  renderTasks();
  showMessage("Task deleted.", "success");
}
