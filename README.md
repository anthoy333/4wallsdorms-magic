# 4WallsDorms

Welcome to 4WallsDorms - a platform helping students and families prepare for move-in day by providing detailed dorm room layouts and packing lists.

🌐 **Live Site**: [https://www.4wallsdorms.com/](https://www.4wallsdorms.com/)

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development](#development)
- [Project Architecture](#project-architecture)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## 🚀 Getting Started

This project is built with Next.js, React, TypeScript, and Tailwind CSS. Follow the instructions below to set up the project locally.

## 📦 Installation

### Step 1: Install Node.js and npm

Before you can run this project, you need to have Node.js and npm installed on your computer.

#### For Windows:
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the setup wizard
4. Restart your computer after installation

#### For macOS:
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS version
3. Run the installer package
4. Or use Homebrew: `brew install node`

#### For Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Verify Installation:
Open your terminal/command prompt and run:
```bash
node --version
npm --version
```
You should see version numbers for both commands.

### Step 2: Clone and Setup the Project

1. **Clone the repository** (or download the project files)
2. **Navigate to the project directory**:
   ```bash
   cd C:\Users\Natal\OneDrive\Desktop\site-latest
   ```
   Or if you're already in the Desktop folder:
   ```bash
   cd site-latest
   ```
3. **Install project dependencies**:
   ```bash
   npm install
   ```
   This will download all the required packages listed in `package.json`.

## 🛠️ Development

### Running the Development Server

To start the development server and begin working on the project:


```bash
npm run dev
```


This will:
- Start the Next.js development server
- Open your browser to `http://localhost:3000`
- Enable hot-reloading (automatic refresh when you make changes)
- Show helpful error messages and debugging information

**Note**: The development server will continue running until you stop it with `Ctrl+C` (or `Cmd+C` on Mac).

## 🏗️ Project Architecture

This project runs **two separate servers** that work together to provide the complete functionality:

### 1. 🌐 Frontend (Next.js)
- **Location**: `site-latest/`
- **Command**: `npm run dev`
- **Port**: http://localhost:3000
- **Purpose**: This runs the main website using Next.js. It handles the UI, routing, and general functionality.

### 2. 🗂️ Backend (File Upload API)
- **Location**: `site-latest/upload-form/`
- **Command**: `npm start`
- **Port**: http://localhost:3001
- **Purpose**: This runs a custom Node.js/Express server to handle file uploads with multer.

**Important**: Make sure to restart this server whenever you change `server.js`.

### 💡 Development Setup Reminder

You'll need **two terminals open**:
- **One terminal** in `site-latest/` running `npm run dev`
- **One terminal** in `site-latest/upload-form/` running `npm start`

That way, both servers are live while you develop.

### Other Available Commands

- **Build for production**: `npm run build`
- **Start production server**: `npm run start`
- **Run linting**: `npm run lint`

## 📁 Project Structure

```
site-latest/
├── app/                 # Next.js App Router pages and layouts
├── components/          # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── public/             # Static assets (images, icons, etc.)
├── styles/             # Global styles and Tailwind CSS
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── next.config.mjs     # Next.js configuration
```



## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel

## 🤝 Contributing & Git Workflow

### Making Changes to the Project
1. **Make sure you have the development environment set up** (see Installation section)

2. **Navigate to the project directory**:
   ```bash
   cd C:\Users\Natal\OneDrive\Desktop\site-latest
   ```

3. **Make your changes and test them locally**:
   ```bash
   npm run dev
   ```

4. **Run the linter to check for issues**:
   ```bash
   npm run lint
   ```

5. **Build the project to ensure it compiles**:
   ```bash
   npm run build
   ```
### Committing and Pushing Changes

6. **Add your changes to git**:
   ```bash
   git add .
   ```

7. **Commit your changes with a descriptive message**:
   ```bash
   git commit -m "Add new feature: describe what you changed"
   ```

   **Note**: You can repeat steps 6-7 multiple times to checkpoint your work locally. Each commit saves a snapshot of your progress without affecting the live website.

8. **Push your changes to the repository** (this will trigger deployment):
   ```bash
   git push origin main
   ```

   **Important**: Only when you run `git push` will your changes be sent to the repository and automatically deployed to the live website.

### 🚀 Automatic Deployment

**Important**: This project has **automatic deployment integration** set up! 

- When you push changes to the `main` branch, Vercel will automatically:
  1. Detect the new commits
  2. Build the project
  3. Deploy the updated version to the live website
  4. Update [https://www.4wallsdorms.com/](https://www.4wallsdorms.com/)

- You can monitor this process in real-time on the [Vercel Dashboard](https://vercel.com/4wallsdorms-projects/4wallsdorms-magic)

- The deployment usually takes 1-3 minutes to complete
- You'll see the deployment status change from "Building" to "y"

### Git Commands Quick Reference

```bash
# Check current status
git status

# Pull latest changes from remote
git pull origin main

# View commit history
git log --oneline

# Undo last commit (keeps changes)
git reset --soft HEAD~1
```

---

**Live Site**: [https://www.4wallsdorms.com/](https://www.4wallsdorms.com/)  
**Deployment Dashboard**: [https://vercel.com/4wallsdorms-projects/4wallsdorms-magic](https://vercel.com/4wallsdorms-projects/4wallsdorms-magic)

*Designed & Developed with ❤️ by Students for Students.* 

## 🚨 **The Problem:**
Your `pnpm-lock.yaml` file is **out of sync** with your `package.json` file. This means the lockfile doesn't match the current dependencies in your project.

## 🔍 **What Caused This:**
- Dependencies were added/updated in `package.json` 
- The `pnpm-lock.yaml` file wasn't regenerated to match
- Vercel uses "frozen-lockfile" mode which requires exact matching

## ✅ **How to Fix It:**

### **Option 1: Regenerate the lockfile locally**
```bash
# Delete the old lockfile
rm pnpm-lock.yaml

# Reinstall dependencies (this creates a new lockfile)
pnpm install

# Commit the new lockfile
git add pnpm-lock.yaml package.json
git commit -m "Update pnpm lockfile"
git push
```

### **Option 2: Update lockfile without deleting**
```bash
# Update the lockfile to match package.json
pnpm install --no-frozen-lockfile

# Commit the updated lockfile
git add pnpm-lock.yaml
git commit -m "Update lockfile to match package.json"
git push
```

### **Option 3: If you're using a different package manager**
If you're actually using `npm` instead of `pnpm`:
```bash
<code_block_to_apply_changes_from>
```

## 🎯 **Quick Summary:**
Your code changes are fine! This is just a **dependency management issue**. Once you regenerate and commit the updated lockfile, your enhanced carousel with flexible video placement will deploy successfully to Vercel! 🚀

The most common solution is **Option 1** - just delete the old lockfile and regenerate it. 