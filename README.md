# 🧠 Personal Habit Tracker (MERN Stack)

A full-stack **Personal Habit Tracker** web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
It helps users **track their daily habits**, **visualize progress**, and **stay consistent** with their goals — all in one clean, modern dashboard.

🌐 **Live Demo:** [https://mern-habit-tracker-nete.bolt.host](https://mern-habit-tracker-nete.bolt.host)

---

## 🚀 Overview

This project is built using the core structure and concepts from [MERN-Project](https://github.com/RohanSingh0208/MERN-Project), extending it into a practical full-stack habit tracking app.

Users can:
- Create an account and log in securely.
- Add daily habits and mark them as completed.
- View streaks, progress charts, and insights.
- Edit or delete habits anytime.
- Stay motivated with a clean, responsive UI.

---

## 🧩 Tech Stack

| Layer | Technology Used |
|-------|------------------|
| **Frontend** | React.js, React Router, Axios, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |
| **Deployment** | Bolt.host (Frontend + Backend) |
| **Version Control** | Git & GitHub |

---

## 📸 Features

### 👤 User Authentication
- Secure **signup/login/logout** using JWT.
- Passwords hashed using **bcrypt**.
- Persistent login state with tokens stored in cookies/localStorage.

### ✅ Habit Management
- Add, edit, delete habits easily.
- Set a **frequency** (daily, weekly, custom).
- Track **completion status** for each day.

### 📈 Progress Visualization
- Interactive charts showing streaks and completion rates.
- Color-coded progress indicators.
- Optional weekly/monthly summary view.

### 🕒 History Log
- View a timeline of completed habits.
- Option to mark missed habits later.

### 💡 Responsive Design
- Fully responsive UI using **Tailwind CSS**.
- Mobile-first layout for easy tracking on the go.

---

## 🗂️ Project Structure

MERN-Project/
├── client/ # React Frontend
│ ├── public/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Habit, Dashboard, Auth pages
│ │ ├── context/ # Global state (User, Habits)
│ │ └── App.js
│ └── package.json
│
├── server/ # Node + Express Backend
│ ├── models/ # MongoDB Schemas (User, Habit)
│ ├── routes/ # API Routes
│ ├── controllers/ # Logic for each route
│ ├── middleware/ # Auth middleware
│ └── server.js
│
├── .env.example # Example environment variables
├── package.json
└── README.md
