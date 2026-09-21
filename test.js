const assert = require("assert");
const {
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
} = require("./script.js");

let tests = 0;
let passed = 0;

function test(name, fn) {
  tests++;
  try {
    fn();
    passed++;
    console.log(`PASS: ${name}`);
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err.message);
  }
}

test("createTask builds a task with defaults", () => {
  const task = createTask("Buy milk", 1);
  assert.strictEqual(task.text, "Buy milk");
  assert.strictEqual(task.completed, false);
  assert.strictEqual(task.priority, "medium");
  assert.strictEqual(task.dueDate, null);
});

test("createTask accepts priority and due date", () => {
  const task = createTask("Study", 2, "high", "2026-10-01");
  assert.strictEqual(task.priority, "high");
  assert.strictEqual(task.dueDate, "2026-10-01");
});

test("createTask trims whitespace", () => {
  const task = createTask("  Study  ", 2);
  assert.strictEqual(task.text, "Study");
});

test("createTask rejects empty text", () => {
  assert.throws(() => createTask("   ", 3));
});

test("toggleTask flips completed status", () => {
  const tasks = [{ id: 1, text: "A", completed: false }];
  const updated = toggleTask(tasks, 1);
  assert.strictEqual(updated[0].completed, true);
});

test("removeTask removes the right task", () => {
  const tasks = [
    { id: 1, text: "A", completed: false },
    { id: 2, text: "B", completed: false }
  ];
  const updated = removeTask(tasks, 1);
  assert.strictEqual(updated.length, 1);
  assert.strictEqual(updated[0].id, 2);
});

test("clearCompleted removes only completed tasks", () => {
  const tasks = [
    { id: 1, text: "A", completed: true },
    { id: 2, text: "B", completed: false }
  ];
  const updated = clearCompleted(tasks);
  assert.strictEqual(updated.length, 1);
  assert.strictEqual(updated[0].id, 2);
});

test("filterTasks filters by active/completed", () => {
  const tasks = [
    { id: 1, text: "A", completed: true },
    { id: 2, text: "B", completed: false }
  ];
  assert.strictEqual(filterTasks(tasks, "active").length, 1);
  assert.strictEqual(filterTasks(tasks, "completed").length, 1);
  assert.strictEqual(filterTasks(tasks, "all").length, 2);
});

test("countActive counts only incomplete tasks", () => {
  const tasks = [
    { id: 1, text: "A", completed: true },
    { id: 2, text: "B", completed: false },
    { id: 3, text: "C", completed: false }
  ];
  assert.strictEqual(countActive(tasks), 2);
});

test("editTaskText updates the right task's text", () => {
  const tasks = [{ id: 1, text: "Old", completed: false }];
  const updated = editTaskText(tasks, 1, "New text");
  assert.strictEqual(updated[0].text, "New text");
});

test("editTaskText rejects empty text", () => {
  const tasks = [{ id: 1, text: "Old", completed: false }];
  assert.throws(() => editTaskText(tasks, 1, "   "));
});

test("searchTasks filters case-insensitively", () => {
  const tasks = [
    { id: 1, text: "Buy Milk", completed: false },
    { id: 2, text: "Walk dog", completed: false }
  ];
  const result = searchTasks(tasks, "milk");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].id, 1);
});

test("searchTasks returns all tasks for empty query", () => {
  const tasks = [
    { id: 1, text: "A", completed: false },
    { id: 2, text: "B", completed: false }
  ];
  assert.strictEqual(searchTasks(tasks, "").length, 2);
});

test("isOverdue is true for a past due date on an incomplete task", () => {
  const task = { dueDate: "2020-01-01", completed: false };
  assert.strictEqual(isOverdue(task, "2026-09-21"), true);
});

test("isOverdue is false for a completed task", () => {
  const task = { dueDate: "2020-01-01", completed: true };
  assert.strictEqual(isOverdue(task, "2026-09-21"), false);
});

test("isOverdue is false when there is no due date", () => {
  const task = { dueDate: null, completed: false };
  assert.strictEqual(isOverdue(task, "2026-09-21"), false);
});

test("progressPercent computes correct percentage", () => {
  const tasks = [
    { completed: true },
    { completed: true },
    { completed: false },
    { completed: false }
  ];
  assert.strictEqual(progressPercent(tasks), 50);
});

test("progressPercent is 0 for an empty list", () => {
  assert.strictEqual(progressPercent([]), 0);
});

test("reorderTasks moves a task to a new position", () => {
  const tasks = [
    { id: 1, text: "A" },
    { id: 2, text: "B" },
    { id: 3, text: "C" }
  ];
  const updated = reorderTasks(tasks, 1, 3);
  assert.deepStrictEqual(updated.map(t => t.id), [2, 3, 1]);
});

test("sortByPriority orders high, medium, low", () => {
  const tasks = [
    { id: 1, priority: "low" },
    { id: 2, priority: "high" },
    { id: 3, priority: "medium" }
  ];
  const sorted = sortByPriority(tasks);
  assert.deepStrictEqual(sorted.map(t => t.priority), ["high", "medium", "low"]);
});

console.log(`\n${passed}/${tests} tests passed`);
if (passed !== tests) {
  process.exit(1); // Non-zero exit code makes CI fail
}
