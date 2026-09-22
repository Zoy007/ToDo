# Zoya's To-Do List App (Enhanced)

A feature-rich To-Do List web application built with vanilla HTML, CSS, and JavaScript,
with a GitHub Actions CI pipeline and GitHub Pages deployment.

## Live Demo
(Add your GitHub Pages link here after deployment)

## Features
- Add tasks with a **priority** (low/medium/high) and an optional **due date**
- Tasks are automatically **sorted by priority**, and overdue tasks are highlighted in red
- **Double-click any task to edit it in place**
- **Drag and drop** to manually reorder tasks
- **Search bar** to filter tasks by text as you type
- **Progress bar** showing % of tasks completed
- **Dark/light theme toggle**, saved across visits
- Toast notification when clearing completed tasks
- Filter by All / Active / Completed
- Tasks persist in the browser via localStorage
- 20 automated tests run on every push via GitHub Actions

## Tech Stack
- HTML5, CSS3, vanilla JavaScript (no frameworks, no libraries)
- GitHub Actions for CI
- GitHub Pages for hosting

## Running Locally
Just open `index.html` in a browser, or run a local server:
```
npx serve .
```

## Running Tests
```
node test.js
```

---

## Assignment Report

**1. Application name and purpose**
[Fill in: Name of app, and what problem it solves]

**2. Main features**
[List the features above in your own words — highlight what makes this more than a basic
to-do list: priority sorting, due dates, inline editing, drag-and-drop, search, dark mode]

**3. DevOps flow followed**
- Built the app locally and tested every feature in the browser
- Initialized a Git repository and pushed to GitHub
- Made 3+ meaningful commits (initial structure, main feature, bug fix/design improvement)
- Added a GitHub Actions workflow that runs on every push to `main`
- Workflow checks JavaScript syntax and runs the 20-test automated suite
- Deliberately introduced a bug, observed the CI failure, then fixed it and confirmed a passing run
- Deployed the app using GitHub Pages

**4. Problems faced and how they were solved**
[Fill in: e.g., getting drag-and-drop to reorder correctly, keeping localStorage in sync
with in-memory state, handling edit-in-place without losing data on empty input]

**5. What you learned from Continuous Integration (CI)**
[Fill in: e.g., how CI catches errors early, how workflows are triggered, why testing pure
logic functions separately from DOM code makes testing much easier]
