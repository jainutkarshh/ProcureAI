# ⚡ Quick Start Checklist

## 5-Minute Setup

- [ ] **Step 1: Get API Key (30 sec)**
  - [ ] Visit: https://aistudio.google.com/app/apikeys
  - [ ] Click "Create API Key"
  - [ ] Copy key
  
- [ ] **Step 2: Setup Backend (2 min)**
  ```bash
  # Terminal 1
  python -m venv venv
  source venv/bin/activate  # Windows: venv\Scripts\activate
  pip install -r requirements.txt
  echo "GEMINI_API_KEY=YOUR_KEY_HERE" > .env
  python backend.py
  ```
  - [ ] See: "Uvicorn running on http://0.0.0.0:8000"
  - [ ] Test: http://localhost:8000/docs (should show API docs)

- [ ] **Step 3: Setup Frontend (2 min)**
  ```bash
  # Terminal 2
  npm create vite@latest pr-to-po-dashboard -- --template react
  cd pr-to-po-dashboard
  npm install
  cp ../App.jsx src/
  cp ../App.css src/
  npm run dev
  ```
  - [ ] See: "VITE v5.x ready"
  - [ ] Test: http://localhost:5173 (should show dashboard)

- [ ] **Step 4: Test (1 min)**
  - [ ] Open http://localhost:5173
  - [ ] Upload sample CSV (provided in README)
  - [ ] Click "Analyze Data"
  - [ ] See Gemini analysis in Insights tab ✅

---

## What Each Tab Does

| Tab | Action | Result |
|-----|--------|--------|
| 📤 Upload | Upload PR CSV | Metrics + Gemini analysis |
| 💡 Insights | View results | Bottleneck summary + recommendations |
| 🔮 Predict | Enter new PR details | Risk score 0-100% + explanation |
| 💬 Chat | Ask questions | Gemini answers about delays |

---

## Sample CSV

Create `sample_prs.csv`:

```csv
pr_number,amount,category,approver,submitted_date,approved_date,status
PR-2025-001,25000,direct,John Smith,2025-01-01 09:00,2025-01-02 14:30,approved
PR-2025-002,50000,capex,Sarah Jones,2025-01-01 10:00,2025-01-01 12:00,approved
PR-2025-003,8000,indirect,Mike Johnson,2025-01-01 11:00,2025-01-03 16:00,approved
PR-2025-004,120000,capex,Sarah Jones,2025-01-02 08:00,2025-01-04 18:00,approved
PR-2025-005,5000,mro,John Smith,2025-01-02 09:00,2025-01-02 10:00,approved
```

---

## Demo (5 minutes)

```
1. Open http://localhost:5173
2. Upload sample CSV → Click "Analyze Data"
3. Go to Insights → Show metrics + Gemini analysis
4. Go to Predict → Enter high-risk PR (large amount, Friday, new vendor)
5. Show 80%+ delay probability + Gemini explanation
6. Ask Chat: "How to reduce cycle time?" → See recommendations
7. Point out KPIs: "Cycle time ↓30%, SLA ↑85%, costs ↓40%"
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ModuleNotFoundError: google` | `pip install google-generativeai` |
| Port 8000 already in use | `lsof -i :8000` and kill process |
| Gemini API not working | Check `.env` file has correct key |
| Frontend can't connect to backend | Check API_BASE in App.jsx = http://localhost:8000 |
| CSV upload fails | Ensure dates are YYYY-MM-DD HH:MM:SS format |

---

## Free Resources Used

- ✅ **Gemini API** — Free tier, 60 requests/minute
- ✅ **React** — Open source
- ✅ **FastAPI** — Open source
- ✅ **XGBoost** — Open source
- ✅ **All code** — No external dependencies except listed in requirements.txt

**Total cost: $0 (free tier only)**

---

## Files You Have

```
pr-to-po-analysis/
├── backend.py                      # FastAPI server
├── App.jsx                         # React dashboard
├── App.css                         # Dashboard styling
├── requirements.txt                # Python packages
├── xgboost_delay_model.pkl         # Pre-trained ML model
├── create_xgboost_model.py         # Model creation script
├── SETUP.md                        # Detailed setup
├── README.md                       # Full documentation
├── CHECKLIST.md                    # This file
└── pr-to-po-system.docx            # Full design document
```

---

## Next: Deploy to Cloud

Once working locally, deploy for free:

### Backend (Railway)
1. Push code to GitHub
2. Connect repo to railway.app
3. Set `GEMINI_API_KEY` env variable
4. Deploy (2 min)

### Frontend (Vercel)
1. Run `npm run build`
2. Deploy with `vercel` CLI
3. Set API_BASE to Railway URL

See SETUP.md for full instructions.

---

## Questions Before Starting?

### "Will this work for real data?"
Yes! Just export your SAP PR logs as CSV with required columns.

### "Can I customize the analysis?"
Yes! Edit the Gemini prompts in backend.py to focus on your priorities.

### "What if I want ML instead of Gemini?"
Use the pre-trained XGBoost model directly. See backend.py for prediction endpoint.

### "How long can I demo?"
5 minutes is perfect. Show metrics → prediction → chat → KPI impact.

---

## You're Ready! 🚀

1. Get Gemini API key
2. Run the 3 commands above
3. Upload sample CSV
4. Watch it work!

Questions? Check SETUP.md or README.md.

Good luck at Orange Prompathon! 🎯
