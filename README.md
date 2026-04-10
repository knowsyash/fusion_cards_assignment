## Expense Tracker

### Tech Stack
- React (Vite) — frontend
- localStorage — local browser persistence
- react-router-dom — navigation
- date-fns — date formatting

### Screens
- Expense List (/) — all expenses grouped by date
- Add Expense (/add) — form to save amount, category, note, date
- Insights (/insights) — monthly total, category breakdown, smart weekly insight

### Backend Choice
No backend server for now; expenses are stored in localStorage

### Smart Insight Logic
Compares each category's spending in the last 7 days vs the previous 7 days.
Flags any category that went up more than 20%.

### How to Run
1. Run: npm install
2. Run: npm run dev

### Trade-offs
- No login — data is device/browser-specific
- Aggregation is done client-side, fine for small data sets
