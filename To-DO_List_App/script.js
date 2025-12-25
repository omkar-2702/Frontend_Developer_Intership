console.log("Daily Planner loaded successfully!");

const APP_KEY = "daily_planner_omkar";
const form = document.getElementById("planner-form");
const textInput = document.getElementById("item-text");
const statusBar = document.getElementById("status-bar");
const itemsList = document.getElementById("items-area");
const viewButtons = document.querySelectorAll(".view-btn");
const clearDoneBtn = document.getElementById("clear-done");

let plannerItems = [];
let activeView = "everything";

document.addEventListener("DOMContentLoaded", () => {
    loadPlannerData();
    updateStatusDisplay();
    refreshDisplay();
});

// Add new item
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = textInput.value.trim();
    
    if (!content) {
        showNotification("Please enter some task description!", "warning");
        return;
    }

    const existsAlready = plannerItems.some(item => 
        item.content.toLowerCase() === content.toLowerCase()
    );

    if (existsAlready) {
        showNotification("This task is already in your planner!", "warning");
        return;
    }

    const newItem = {
        id: Date.now().toString(),
        content,
        done: false,
        level: document.getElementById("item-level").value,
        type: document.getElementById("item-type").value,
        targetDate: document.getElementById("target-date").value
    };

    plannerItems.push(newItem);
    savePlannerData();
    refreshDisplay();
    resetForm();
    showNotification("New task added to your planner!", "success");
});

// View switching
viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        viewButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeView = btn.dataset.view;
        refreshDisplay();
    });
});

// Clear completed
clearDoneBtn.addEventListener("click", () => {
    if (plannerItems.some(item => item.done)) {
        plannerItems = plannerItems.filter(item => !item.done);
        savePlannerData();
        refreshDisplay();
        showNotification("Completed tasks cleared!", "info");
    }
});

function showNotification(msg, type) {
    statusBar.textContent = msg;
    statusBar.className = `status-bar ${type}`;
    setTimeout(() => {
        statusBar.textContent = "";
        statusBar.className = "status-bar";
    }, 3000);
}

function resetForm() {
    textInput.value = "";
    document.getElementById("item-level").value = "normal";
    document.getElementById("item-type").value = "office";
    document.getElementById("target-date").value = "";
}

function savePlannerData() {
    localStorage.setItem(APP_KEY, JSON.stringify(plannerItems));
}

function loadPlannerData() {
    try {
        const saved = localStorage.getItem(APP_KEY);
        plannerItems = saved ? JSON.parse(saved) : [];
    } catch (e) {
        plannerItems = [];
        console.error("Could not load planner data:", e);
    }
}

function updateStatusDisplay() {
    const total = plannerItems.length;
    const doneCount = plannerItems.filter(item => item.done).length;
    const pending = total - doneCount;
    statusBar.textContent = `Total: ${total} | Pending: ${pending} | Done: ${doneCount}`;
}

function refreshDisplay() {
    itemsList.innerHTML = "";
    let visibleItems = plannerItems;

    if (activeView === "pending") {
        visibleItems = plannerItems.filter(item => !item.done);
    } else if (activeView === "done") {
        visibleItems = plannerItems.filter(item => item.done);
    }

    if (visibleItems.length === 0) {
        const emptyMsg = document.createElement("li");
        emptyMsg.className = "item-card empty-state";
        emptyMsg.innerHTML = "<p style='text-align:center;color:#a0aec0;'>No tasks here yet. Add one above! 🎯</p>";
        itemsList.appendChild(emptyMsg);
        updateStatusDisplay();
        return;
    }

    visibleItems.forEach(item => {
        const card = createItemCard(item);
        itemsList.appendChild(card);
    });

    updateStatusDisplay();
}

function createItemCard(item) {
    const li = document.createElement("li");
    li.className = `item-card ${item.done ? 'done' : ''}`;
    li.dataset.id = item.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "item-check";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => toggleItem(item.id));

    const title = document.createElement("span");
    title.className = `item-title ${item.done ? 'done' : ''}`;
    title.textContent = item.content;

    const info = document.createElement("div");
    info.className = "item-info";

    const levelTag = document.createElement("span");
    levelTag.className = `tag level-${item.level}`;
    levelTag.textContent = item.level.toUpperCase();

    const typeTag = document.createElement("span");
    typeTag.className = "tag tag-type";
    typeTag.textContent = item.type;

    const dateTag = document.createElement("span");
    dateTag.className = "tag tag-date";
    dateTag.textContent = item.targetDate 
        ? new Date(item.targetDate).toLocaleDateString('en-IN')
        : "No deadline";

    info.append(levelTag, typeTag, dateTag);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "action-btn edit-action";
    editBtn.textContent = "✏️";
    editBtn.title = "Edit";
    editBtn.addEventListener("click", () => modifyItem(item.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "action-btn delete-action";
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Delete";
    deleteBtn.addEventListener("click", () => removeItem(item.id));

    actions.append(editBtn, deleteBtn);

    li.append(checkbox, title, info, actions);
    return li;
}

function toggleItem(id) {
    plannerItems = plannerItems.map(item =>
        item.id === id ? { ...item, done: !item.done } : item
    );
    savePlannerData();
    refreshDisplay();
}

function modifyItem(id) {
    const item = plannerItems.find(i => i.id === id);
    if (!item) return;

    const newContent = prompt("Update your task:", item.content);
    if (newContent === null || newContent.trim() === "") {
        showNotification("Task update cancelled.", "info");
        return;
    }

    item.content = newContent.trim();
    savePlannerData();
    refreshDisplay();
    showNotification("Task updated successfully!", "success");
}

function removeItem(id) {
    if (confirm("Remove this task permanently?")) {
        plannerItems = plannerItems.filter(item => item.id !== id);
        savePlannerData();
        refreshDisplay();
        showNotification("Task removed from planner.", "info");
    }
}
