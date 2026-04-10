## Expense Tracker

### Tech Stack
- React (Vite) — frontend
- Firebase Firestore — backend and database
- react-router-dom — navigation
- date-fns — date formatting

### Screens
- Expense List (/) — all expenses grouped by date
- Add Expense (/add) — form to save amount, category, note, date
- Insights (/insights) — monthly total, category breakdown, smart weekly insight

### Backend Choice
Firebase Firestore — no server needed, free tier, integrates directly with React

### Smart Insight Logic
Compares each category's spending in the last 7 days vs the previous 7 days.
Flags any category that went up more than 20%.

### How to Run
1. Create a Firebase project at console.firebase.google.com
2. Enable Firestore in the Firebase console
3. Copy your Firebase config into src/firebase.js
4. Run: npm install
5. Run: npm run dev

### Trade-offs
- No login — all users share the same Firestore collection
- Aggregation is done client-side, fine for small data sets
