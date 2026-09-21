// ---------- Pure logic functions (also used by test.js in CI) ----------

function createTask(text, idCounter, priority, dueDate) {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Task text cannot be empty");
  }
  return {
    id: idCounter,
    text: trimmed,
    completed: false,
    priority: priority || "medium",
    dueDate: dueDate || null
  };
}

function toggleTask(tasks, id) {
  return tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
}

function removeTask(tasks, id) {
  return tasks.filter(t => t.id !== id);
}

function clearCompleted(tasks) {
  return tasks.filter(t => !t.completed);
}

function filterTasks(tasks, filter) {
  if (filter === "active") return tasks.filter(t => !t.completed);
  if (filter === "completed") return tasks.filter(t => t.completed);
  return tasks;
}

function countActive(tasks) {
  return tasks.filter(t => !t.completed).length;
}

function editTaskText(tasks, id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) {
    throw new Error("Task text cannot be empty");
  }
  return tasks.map(t => (t.id === id ? { ...t, text: trimmed } : t));
}

function searchTasks(tasks, query) {
  const q = query.trim().toLowerCase();
  if (!q) return tasks;
  return tasks.filter(t => t.text.toLowerCase().includes(q));
}

function isOverdue(task, todayISODate) {
  if (!task.dueDate || task.completed) return false;
  return task.dueDate < todayISODate;
}

function progressPercent(tasks) {
  if (tasks.length === 0) return 0;
  const done = tasks.filter(t => t.completed).length;
  return Math.round((done / tasks.length) * 100);
}

function reorderTasks(tasks, draggedId, targetId) {
  const fromIndex = tasks.findIndex(t => t.id === draggedId);
  const toIndex = tasks.findIndex(t => t.id === targetId);
  if (fromIndex === -1 || toIndex === -1) return tasks;
  const updated = [...tasks];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function sortByPriority(tasks) {
  return [...tasks].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

// Export for Node-based CI tests; ignored by the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createTask,
    toggleTask,
    removeTask,
    clearCompleted,
    filterTasks,
    countActive,
    editTaskText,
    searchTasks,
    isOverdue,
    progressPercent,
    reorderTasks,
    sortByPriority
  };
}

// ---------- Browser UI wiring (skipped when running under Node/CI) ----------

if (typeof document !== "undefined") {
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  let idCounter = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  let currentFilter = "all";
  let searchQuery = "";
  let draggedId = null;

  const form = document.getElementById("todo-form");
  const input = document.getElementById("task-input");
  const priorityInput = document.getElementById("priority-input");
  const dueInput = document.getElementById("due-input");
  const searchInput = document.getElementById("search-input");
  const list = document.getElementById("task-list");
  const countLabel = document.getElementById("task-count");
  const clearBtn = document.getElementById("clear-completed");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const themeToggle = document.getElementById("theme-toggle");
  const toast = document.getElementById("toast");

  function todayISODate() {
    return new Date().toISOString().slice(0, 10);
  }

  function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function render() {
    list.innerHTML = "";
    let visible = filterTasks(tasks, currentFilter);
    visible = searchTasks(visible, searchQuery);
    visible = sortByPriority(visible);

    const today = todayISODate();

    visible.forEach(task => {
      const li = document.createElement("li");
      li.className = `priority-${task.priority}` + (task.completed ? " completed" : "");
      li.draggable = true;
      li.dataset.id = task.id;

      li.addEventListener("dragstart", () => {
        draggedId = task.id;
        li.classList.add("dragging");
      });
      li.addEventListener("dragend", () => li.classList.remove("dragging"));
      li.addEventListener("dragover", e => e.preventDefault());
      li.addEventListener("drop", () => {
        if (draggedId !== null && draggedId !== task.id) {
          tasks = reorderTasks(tasks, draggedId, task.id);
          save();
          render();
        }
      });

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "toggle-btn";
      toggleBtn.textContent = task.completed ? "↺" : "✓";
      toggleBtn.addEventListener("click", () => {
        tasks = toggleTask(tasks, task.id);
        save();
        render();
      });

      const main = document.createElement("div");
      main.className = "task-main";

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;
      span.title = "Double-click to edit";
      span.addEventListener("dblclick", () => {
        span.contentEditable = "true";
        span.focus();
      });
      span.addEventListener("blur", () => {
        span.contentEditable = "false";
        try {
          tasks = editTaskText(tasks, task.id, span.textContent);
          save();
        } catch (err) {
          render(); // revert to previous text if left empty
        }
      });
      span.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          span.blur();
        }
      });

      main.appendChild(span);

      if (task.dueDate) {
        const due = document.createElement("span");
        due.className = "due-label" + (isOverdue(task, today) ? " overdue" : "");
        due.textContent = (isOverdue(task, today) ? "Overdue: " : "Due: ") + task.dueDate;
        main.appendChild(due);
      }

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "✕";
      deleteBtn.addEventListener("click", () => {
        tasks = removeTask(tasks, task.id);
        save();
        render();
      });

      li.appendChild(toggleBtn);
      li.appendChild(main);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });

    countLabel.textContent = `${countActive(tasks)} tasks left`;
    const pct = progressPercent(tasks);
    progressFill.style.width = pct + "%";
    progressLabel.textContent = `${pct}% complete`;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    try {
      const task = createTask(input.value, idCounter++, priorityInput.value, dueInput.value);
      tasks.push(task);
      input.value = "";
      dueInput.value = "";
      save();
      render();
    } catch (err) {
      // Ignore empty input submissions
    }
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    render();
  });

  clearBtn.addEventListener("click", () => {
    const before = tasks.length;
    tasks = clearCompleted(tasks);
    if (tasks.length !== before) showToast("Completed tasks cleared");
    save();
    render();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    themeToggle.textContent = isDark ? "🌙" : "☀️";
    localStorage.setItem("theme", isDark ? "light" : "dark");
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  }

  render();
}
