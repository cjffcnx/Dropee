# 💧 Dropee — Drop it. Share it.

> **Fast, anonymous file sharing with no login required.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://mongodb.com)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa)](https://web.dev/pwa)

---

## ✨ Features

- 🚀 **Blazing fast file transfer** — Upload and share files in seconds
- 📁 **Multiple file types** — ZIP, images, PDFs, code, text, and more
- 🔐 **No login required** — Anonymous sharing with auto-generated user IDs
- 📧 **Email sharing** — Send download links directly via email
- 📱 **SMS sharing** — Send share links via Twilio SMS
- 🔗 **Shareable links** — Auto-generated short links using your 6-char ID
- 📋 **Code/Text snippets** — Share code with language syntax highlighting
- 📜 **Transfer history** — View your recent file and snippet transfers
- 📶 **Offline support** — Queue uploads offline with IndexedDB, sync when online
- 📱 **PWA** — Install Dropee as a native app on any device
- ⏰ **Auto-expiry** — Files expire after 15 days, snippets after 30 days
- 🛡️ **Rate limiting** — Prevents abuse (10 uploads per 15 minutes per IP)
- 🎨 **Glassmorphism UI** — Beautiful dark navy + red-pink design

---

## 📁 Folder Structure

```
Dropee/
├── README.md
├── package.json                  (root workspace with concurrently)
├── .gitignore
├── dropee-frontend/              (React 18 + Vite + TailwindCSS + PWA)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   ├── index.html
│   ├── public/
│   │   ├── dropee-icon-192x192.png
│   │   ├── dropee-icon-512x512.png
│   │   └── manifest.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── config.js
│       ├── store/useStore.js     (Zustand global state)
│       ├── utils/
│       │   ├── generateUserId.js
│       │   ├── storeUser.js
│       │   └── formatFileSize.js
│       ├── hooks/
│       │   └── useOfflineQueue.js
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── AddSnippet.jsx
│       │   ├── ViewSnippet.jsx
│       │   ├── ViewShared.jsx
│       │   └── History.jsx
│       ├── components/
│       │   ├── layout/           (Navbar, Footer)
│       │   ├── upload/           (DropZone, FileList, UploadProgress)
│       │   ├── share/            (ShareModal, LinkDisplay, RecipientInput)
│       │   ├── snippet/          (SnippetEditor, SnippetViewer)
│       │   ├── ui/               (Button, Toast, LoadingScreen, ...)
│       │   └── history/          (HistoryList)
│       └── sw/
│           └── serviceWorker.js
└── dropee-backend/               (Node.js + Express + MongoDB)
    ├── package.json
    ├── example.env
    ├── app.js
    ├── config/secrets.js
    ├── database/dbConfig.js
    ├── model/
    │   ├── fileModel.js          (TTL: 15 days)
    │   ├── codeModel.js          (TTL: 30 days)
    │   └── historyModel.js
    ├── services/
    │   ├── multerConfig.js       (100MB limit, disk storage)
    │   ├── emailService.js       (Nodemailer Gmail SMTP)
    │   └── smsService.js         (Twilio)
    ├── controller/
    │   ├── fileController.js
    │   ├── codeController.js
    │   └── historyController.js
    ├── route/
    │   ├── fileRoute.js
    │   ├── codeRoute.js
    │   └── historyRoute.js
    └── views/
        └── linkExpired.ejs
```

---

## 🔧 Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB** (local or Atlas)
- **Gmail account** (for email sending — use App Password)
- **Twilio account** (optional, for SMS)

---

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/cjffcnx/Dropee.git
cd Dropee
```

### 2. Install all dependencies

```bash
npm install
cd dropee-backend && npm install
cd ../dropee-frontend && npm install
cd ..
```

### 3. Configure the backend

```bash
cd dropee-backend
cp example.env .env
# Edit .env with your credentials
```

**`.env` configuration:**
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/dropee
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
BASE_URL=http://localhost:4000
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
TWILIO_NUMBER=+1234567890
```

> 💡 For Gmail: Enable 2FA and create an **App Password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### 4. Configure the frontend (optional)

```bash
cd dropee-frontend
cp .env.example .env
# VITE_API_URL=http://localhost:4000/
```

### 5. Run the app

```bash
# From root — runs both frontend and backend
npm run dev

# Or separately:
npm run backend    # Starts backend on http://localhost:4000
npm run frontend   # Starts frontend on http://localhost:5173
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/files/sendFile` | Upload files + send email/SMS |
| `GET` | `/api/v1/files/:userId` | Get shared files by userId |
| `GET` | `/download/:fileName` | Download a specific file |
| `POST` | `/api/v1/code` | Create a code/text snippet |
| `GET` | `/api/v1/code/:id` | Get a snippet by ID |
| `GET` | `/api/v1/history/:userId` | Get last 50 transfers for user |

### Upload Files — `POST /api/v1/files/sendFile`

**Form data:**
```
files[]      — File(s) to upload (multipart/form-data)
userId       — 6-char alphanumeric user ID (required)
email        — Recipient email (optional)
phone        — Recipient phone number (optional)
```

**Response:**
```json
{
  "status": 200,
  "userId": "ABC123",
  "downloadLinks": ["http://localhost:4000/download/1234567890-file.zip"],
  "fileNames": ["file.zip"],
  "message": "Files uploaded successfully"
}
```

### Create Snippet — `POST /api/v1/code`

**Body:**
```json
{
  "title": "My React Hook",
  "text": "const [state, setState] = useState(null);",
  "language": "JavaScript",
  "userId": "ABC123"
}
```

**Response:**
```json
{ "status": 200, "id": "65abc123def456", "message": "Snippet created successfully" }
```

---

## 🌐 Deployment Guide

### Frontend — Vercel

1. Connect your GitHub repo to [vercel.com](https://vercel.com)
2. Set **Root Directory** to `dropee-frontend`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.railway.app/`

### Backend — Railway

1. Connect your GitHub repo to [railway.app](https://railway.app)
2. Set **Root Directory** to `dropee-backend`
3. Add all environment variables from `example.env`
4. Railway auto-detects Node.js and runs `npm start`

### Database — MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user and get the connection string
3. Set `MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dropee`

---

## 📱 PWA Installation

Dropee is a Progressive Web App — install it on any device:

- **Desktop Chrome**: Click the install icon (⊕) in the address bar
- **Android**: Tap "Add to Home Screen" in Chrome's menu
- **iOS Safari**: Tap Share → "Add to Home Screen"

Features when installed:
- Works offline with queued uploads
- Native app-like experience
- Home screen icon

---

## 🎨 Design System

| Color Role | Hex Code | Usage |
|---|---|---|
| Primary Background | `#0f0f23` | Main page background |
| Secondary Background | `#1a1a2e` | Navbar, footer |
| Card Background | `#16213e` | Glass cards |
| Accent Primary | `#e94560` | Buttons, highlights |
| Accent Secondary | `#0f3460` | Secondary actions |
| Text Primary | `#eaeaea` | Main text |
| Text Muted | `#a0a0b0` | Labels, descriptions |
| Success | `#00b894` | Success states |
| Error | `#e17055` | Error states |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please ensure your PR:
- Follows the existing code style
- Has no breaking changes
- Includes a clear description

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License — Copyright (c) 2024 Dropee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

<div align="center">
  <strong>💧 Dropee</strong> — Built with ❤️ for fast, private file sharing<br/>
  <em>Drop it. Share it.</em>
</div>