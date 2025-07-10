# 🌸 Femora

**Femora** is a smart women’s health platform for PCOS detection, menstrual cycle tracking, and personalized AI support. It empowers users to understand and manage their reproductive health using intuitive tools and AI-driven insights.

## ✨ Features

- 📂 **MRI Scan Upload** — Upload medical scans to receive PCOS probability analysis and findings.
- 📅 **Period Tracker** — Log your menstrual cycle and view patterns over time using an interactive calendar.
- 🤖 **Context-Aware AI Chatbot** — Ask health-related questions and receive intelligent responses that consider your unique scan results and period history.
- 📊 **Dashboard** — View progress, stats, and quick actions all in one place.
- 🔒 **Secure Authentication** — Sign in using email/password or Google, with user-specific data storage and privacy.

## 🗂 Project Structure

```Femora/
├── client/ # Frontend (React + Vite)
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── firebaseConfig.ts
│ │ └── ...
├── server/ # Backend (Node.js + Express)
│ ├── routes/
│ ├── services/
│ ├── firebaseAdmin.ts
│ └── ...
└── README.md
```

## 🛠 Setup Instructions

## 1. Clone the repository

```
git clone https://github.com/your-username/femora.git
cd femora
```
## 2. Install dependencies
For both client/ and server/ folders:
```
cd client
npm install

cd ../server
npm install
```
## 3. Start the app

### Start frontend
```
cd client
npm run dev
```
### Start backend
```
cd ../server
npm run dev
```