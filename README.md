# Zoya's To-Do List App (Enhanced)

A feature-rich To-Do List web application built with vanilla HTML, CSS, and JavaScript,
with a GitHub Actions CI pipeline and GitHub Pages deployment.

## Live Demo
(https://zoy007.github.io/ToDo/)

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
My application is a To-Do List Manager, built to help users organize and track daily tasks. It goes beyond a basic list by supporting task priorities, due dates, and quick reordering, making it useful for managing real workloads rather than just a flat checklist.

**2. Main features**
Add tasks with a priority level (low/medium/high) and an optional due date
Tasks automatically sort by priority, with overdue tasks highlighted in red
Double-click any task to edit its text in place
Drag and drop to manually reorder tasks
Live search bar to filter tasks as you type
Progress bar showing percentage of tasks completed
Dark/light theme toggle, remembered across visits
Filter tasks by All / Active / Completed
Toast notification when clearing completed tasks
Tasks persist between sessions using browser localStorage

**3. DevOps flow followed**
- Built the app locally and tested every feature in the browser
- Initialized a Git repository and pushed to GitHub
- Made 3+ meaningful commits (initial structure, main feature, bug fix/design improvement)
- Added a GitHub Actions workflow that runs on every push to `main`
- Workflow checks JavaScript syntax and runs the 20-test automated suite
- Deliberately introduced a bug, observed the CI failure, then fixed it and confirmed a passing run
- Deployed the app using GitHub Pages

**4. Problems faced and how they were solved**
I used Github through browser as I didnot have it installed on the desktop so instead of running commands through terminal i used GitHub to make repository and to commit change.
When I intentionally broke a test by changing an expected value in test.js, I had to make sure that I changed a value the test suite actually checks (progressPercent) rather than something unrelated, so the failure was real and not accidental.
After adding the CI workflow, I noticed GitHub showed warnings about Node.js 20 being deprecated and Ubuntu runners updating in the future — these were informational notices about GitHub's infrastructure, not errors in my code, so I confirmed the run still passed and didn't need to change anything.
**5. What you learned from Continuous Integration (CI)**
CI showed me how automated testing can catch mistakes immediately, before they reach real users. Seeing the workflow fail the moment I introduced a bug and pass again the moment I fixed it made it clear why teams rely on CI rather than manually testing before every deployment. It also helped that the core logic (adding, sorting, filtering tasks) was written as separate, pure functions from the UI code, since that's what made it possible to test 20 different behaviors quickly without needing a browser.
