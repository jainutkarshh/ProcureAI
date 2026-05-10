# PR-to-PO Approval Delay Analysis System - Setup Guide

## 📋 Prerequisites
- **Python 3.9+** (with pip)
- **Node.js 16+** (with npm)
- **Git** (optional)

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Backend Dependencies
```bash
cd e:\PR-po
python -m pip install -r requirements.txt
```

Expected output:
```
Successfully installed fastapi uvicorn pandas numpy joblib scikit-learn xgboost google-generativeai python-dotenv python-multipart pydantic
```

### Step 2: Install Frontend Dependencies
```bash
cd e:\PR-po\pr-to-po-dashboard
npm install
```

Expected output:
```
up to date, audited ... packages
```

### Step 3: Run Both Servers (in separate terminal windows)

**Terminal 1 - Backend:**
```bash
cd e:\PR-po
python backend.py
```
Expected output:
```
Starting PR-to-PO Analysis Backend...
✓ Database initialized at E:\PR-po\pr_to_po.db
API Docs: http://localhost:8000/docs
```

**Terminal 2 - Frontend:**
```bash
cd e:\PR-po\pr-to-po-dashboard
npm run dev
```
Expected output:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

---

## 📁 Project Structure

```
E:\PR-po\
├── backend.py                 # FastAPI server (port 8000)
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (Gemini API key)
├── pr_to_po.db               # SQLite database (auto-created on first run)
├── xgboost_delay_model.pkl   # Pre-trained XGBoost model
├── sample_pr_data.csv        # Sample CSV for testing
│
└── pr-to-po-dashboard/       # React+Vite frontend (port 5173)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx           # Main React component (5 tabs + Vendor History)
        ├── App.css           # Dashboard styles
        ├── main.jsx
        └── index.css
```

---

## 🔑 Environment Configuration

The `.env` file contains your Gemini API key:

```
GEMINI_API_KEY=AIzaSyDvBPfs5PZ6KCKsBJbxkxwlMvq0bUSkWxo
```

⚠️ **IMPORTANT**: This API key is shared for demo purposes only. For production:
1. Generate your own API key at https://aistudio.google.com/app/apikeys
2. Replace the value in `.env`
3. Never commit `.env` to version control

---

## 📊 Database

SQLite database is **automatically created** on backend startup:

**File:** `pr_to_po.db`

**Tables:**
- `pr_events` - All uploaded PRs with SLA data
- `vendor_scores` - Vendor/approver risk scores over time
- `model_versions` - ML model training history
- `model_feedback` - Prediction feedback for fine-tuning

---

## ✅ Verification Checklist

After starting both servers:

- [ ] Backend running: `http://localhost:8000/health` → returns `{"status": "ok", ...}`
- [ ] Frontend running: `http://localhost:5173` → displays dashboard
- [ ] Upload tab works: Select `sample_pr_data.csv` and click "Analyze Data"
- [ ] Database created: Check if `pr_to_po.db` file exists
- [ ] Vendor History tab visible: 5th tab at the top
- [ ] No red error banners in UI

---

## 🐛 Troubleshooting

### Backend fails to start: "ModuleNotFoundError: No module named 'fastapi'"
```bash
# Solution: Install dependencies again
python -m pip install -r requirements.txt
```

### Backend fails: "Address already in use :8000"
```bash
# Another process is using port 8000
# Kill it with:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change port in backend.py line 457:
# uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Frontend: "npm: command not found"
```bash
# Install Node.js from https://nodejs.org/ and restart terminal
```

### Gemini API errors in chat/analysis
- Verify `GEMINI_API_KEY` is set correctly in `.env`
- Test with: `curl http://localhost:8000/health`
- If Gemini fails, features gracefully degrade to show metrics only

### Database errors: "database is locked"
- Restart backend: `Ctrl+C` then `python backend.py`
- Delete `pr_to_po.db` and restart (this clears all uploaded data)

---

## 📝 Sample CSV Format

File: `sample_pr_data.csv`

```csv
pr_number,amount,category,approver,submitted_date,approved_date,status
PR-001,15000,direct,John Smith,2025-01-01 09:00,2025-01-02 14:30,approved
PR-002,50000,capex,Sarah Jones,2025-01-01 10:00,2025-01-01 12:00,approved
PR-003,8500,indirect,Mike Chen,2025-01-02 08:00,2025-01-03 16:00,approved
```

**Required columns:**
- `pr_number` - Unique PR identifier
- `amount` - PR amount (numeric)
- `category` - Type: "direct", "indirect", "capex", "mro"
- `approver` - Person name (treated as "vendor")
- `submitted_date` - Format: "YYYY-MM-DD HH:MM:SS"
- `approved_date` - Format: "YYYY-MM-DD HH:MM:SS"
- `status` - Optional: "approved", "rejected", etc.

---

## 🎯 Key Features

### 1. **Upload & Analyze Tab**
- Upload CSV → Gemini AI analyzes for bottlenecks
- Results show metrics: avg cycle time, SLA breach rate, slowest approver

### 2. **Insights Tab**
- Visual metrics cards (cycle time, SLA breaches, etc.)
- AI-generated bottleneck analysis
- Actionable recommendations

### 3. **Predict Tab**
- Enter PR details (amount, category, approver, etc.)
- XGBoost predicts if PR will breach SLA
- Shows risk level + recommended action
- Gemini explains the prediction

### 4. **Ask AI Tab**
- Free-form questions about approval delays
- Gemini analyzes metrics in context
- Conversational interface

### 5. **Vendor History Tab** ✨ NEW
- All vendors/approvers with risk scores
- Searchable table with color-coded risk levels
- Click "View Details" → full PR history + score trend chart
- Auto-retraining: After 50+ new rows, ML model retrains automatically
- Manual "Retrain Model Now" button for immediate retraining
- Model accuracy displayed

---

## 🔄 Auto-Retraining Workflow

1. User uploads CSV (e.g., 30 PRs)
2. Backend saves rows to `pr_events` table
3. Backend checks: total_rows - last_training_rows >= 50?
4. If YES → Automatically retrain XGBoost on all DB data
5. New model replaces `xgboost_delay_model.pkl`
6. Model version logged to `model_versions` table
7. Frontend shows updated accuracy on Vendor History tab

---

## 📞 Support

For issues:
1. Check terminal output for error messages
2. Run verification checklist above
3. Review this troubleshooting section
4. Restart both servers completely

---

**Version:** 1.0 | **Last Updated:** 2025-01-10
