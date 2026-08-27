# 🚀 AlgoVault - Local Setup & Deployment Guide

A step-by-step guide to clone, run, and deploy **AlgoVault** on your local machine (Windows, macOS, or Linux).

---

## 🐙 1. Fork & Clone the Repository

### 1.1 Fork on GitHub
1. Navigate to the main [AlgoVault GitHub Repository](https://github.com/Somnath0707/AlgoVault).
2. Click the **Fork** button in the top-right corner to create your copy.

### 1.2 Clone to Local Machine
Open your terminal (PowerShell, Command Prompt, or Terminal) and run:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/AlgoVault.git
cd AlgoVault
```

---

## 🛠️ 2. Choose How to Run

Choose **Method A (Docker)** OR **Method B (Native Local Run)** below.

---

### 🐳 Method A: Run with Docker (Recommended for 1-Command Setup)

#### Prerequisites
- Download & install [Docker Desktop](https://www.docker.com/products/docker-desktop/). Make sure Docker Desktop is open and running.

#### Steps
1. Open terminal in the `AlgoVault` root directory:
   ```bash
   cd AlgoVault
   ```
2. Start the containerized services:
   ```bash
   docker compose up -d
   ```
   *Docker will automatically spin up PostgreSQL, Redis, compile the Spring Boot backend, and start the API on `http://localhost:8080`.*

---

### 💻 Method B: Run Natively without Docker

#### Prerequisites
1. **Java 17 or 21**: Download & install [Eclipse Temurin JDK 17/21](https://adoptium.net/).
2. **Node.js 18+**: Download & install [Node.js](https://nodejs.org/).

#### Step B.1: Start the Backend Server (Terminal 1)
```bash
cd AlgoVault/backend
mvn spring-boot:run
```
*(On Windows without global Maven, use `.\mvnw.cmd spring-boot:run`)*.

Wait for: `Started AlgovaultApplication in X seconds`

#### Step B.2: Build the Extension (Terminal 2)
```bash
cd AlgoVault/extension
npm install
npx plasmo build
```
Wait for: `🟢 DONE | Finished in Xms!`

---

## 🧩 3. Load Extension into Google Chrome

1. Open Google Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** (toggle switch in the top-right corner).
3. Click **Load unpacked** (top-left button).
4. Navigate to your project folder and select:
   `AlgoVault/extension/build/chrome-mv3-prod`

---

## 🔑 4. Connect GitHub & Start Practicing

1. Open any problem on [leetcode.com/problems/two-sum/](https://leetcode.com/problems/two-sum/).
2. Click the **AlgoVault Widget** (bottom-right of page) or open the **Sidepanel**.
3. Go to **Settings** $\rightarrow$ **Connect GitHub Account**.
4. Click **Authorize AlgoVault**.
5. Select your target repository and branch.

Your problem submissions, practice timers, Glicko-2 topic ratings, and weakness analytics will now automatically sync to your GitHub repository and local dashboard!
