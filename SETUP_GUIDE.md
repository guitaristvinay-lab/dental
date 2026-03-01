# 🔥 Firebase Setup Guide for Karishma Dental Clinic
## (Beginner-Friendly — No Coding Required!)

---

## ✅ STEP 1 — Create a Free Firebase Account

1. Open your browser and go to 👉 **https://console.firebase.google.com**
2. Sign in with your **Google account** (Gmail)
3. Click **"Create a project"** or **"Add project"**
4. Type a name like: `karishma-dental-clinic`
5. Click **"Continue"** → Disable Google Analytics (optional) → Click **"Create project"**
6. Wait for it to create, then click **"Continue"**

---

## ✅ STEP 2 — Register Your Website (Web App)

1. On the Firebase project page, click the **Web icon** `</>`
2. In "App nickname", type: `Dental Website`
3. Click **"Register app"**
4. You will see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXX",
  authDomain: "karishma-dental.firebaseapp.com",
  projectId: "karishma-dental",
  storageBucket: "karishma-dental.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

5. **COPY** all those values (keep this browser tab open!)

---

## ✅ STEP 3 — Paste Config Into Your Website

1. Open the file: **`firebase-config.js`** (in your project folder)
2. Replace each placeholder with the real value from Step 2:

```javascript
const firebaseConfig = {
  apiKey:            "PASTE apiKey HERE",
  authDomain:        "PASTE authDomain HERE",
  projectId:         "PASTE projectId HERE",
  storageBucket:     "PASTE storageBucket HERE",
  messagingSenderId: "PASTE messagingSenderId HERE",
  appId:             "PASTE appId HERE"
};
```

3. **Save the file** (Ctrl + S)

---

## ✅ STEP 4 — Set Up Firestore Database

1. Go back to **https://console.firebase.google.com** and click your project
2. In the left sidebar, click **"Build"** → **"Firestore Database"**
3. Click **"Create database"**
4. Select **"Start in test mode"** → Click **"Next"**
5. Choose a server location (e.g., `asia-south1` for India) → Click **"Enable"**
6. Done! ✅

---

## ✅ STEP 5 — Open With a Local Server

> ⚠️ Firebase requires the site to be served via HTTP (not opened as a file).
> Use one of these methods:

### Option A — VS Code (Easiest)
1. Install **VS Code** from https://code.visualstudio.com
2. Install the **"Live Server"** extension (by Ritwick Dey)
3. Open your project folder in VS Code
4. Right-click `index.html` → **"Open with Live Server"**
5. Your site opens at `http://127.0.0.1:5500`

### Option B — Use any web host
Upload your 5 files to any hosting service (Firebase Hosting, Netlify, etc.)

---

## 🎯 That's It! Test Your Setup

1. Open your website via Live Server
2. Fill out the appointment form and submit it
3. Go to `admin.html` to see the appointment saved!

---

## 📁 Your Project Files

```
project/
├── index.html          ← Main website
├── style.css           ← All styles
├── script.js           ← JavaScript + Firebase calls
├── firebase-config.js  ← 🔴 PASTE YOUR CREDENTIALS HERE
├── firebase-service.js ← Firebase functions (don't edit)
├── admin.html          ← View all appointments
└── SETUP_GUIDE.md      ← This file
```

---

## ❓ Need Help?

If something doesn't work, check the browser console:
- Press **F12** → Click **"Console"** tab
- Look for red error messages and share them

---

*Made with ❤️ for Karishma Dental Clinic*
