# ResOps — Resource Intelligence Dashboard

A professional, single-file HTML dashboard for managing resource allocation, billing, onboarding, track rotation, and GenAI training — powered by live Google Sheets data.

![ResOps Dashboard](https://img.shields.io/badge/ResOps-Resource%20Intelligence-3b82f6?style=for-the-badge)
![No Backend](https://img.shields.io/badge/No%20Backend-Single%20HTML%20File-10b981?style=for-the-badge)
![Google Sheets](https://img.shields.io/badge/Data-Google%20Sheets-f59e0b?style=for-the-badge)

---

## ✨ Features

| Module | Description |
|---|---|
| 📊 **Overview** | KPI strip, billing donut, competency mix, allocation histogram, data story |
| 💸 **Billing & Non-Billable** | Highlights resources by 30/60+ day thresholds with severity levels |
| 🧠 **Competency** | Headcount, billable split, avg allocation per competency |
| 📋 **Employee Sheet** | Filterable, sortable master table with slide-out edit drawer |
| 🚀 **Onboarding** | 9-step flow tracker with progress bars per resource |
| 🔄 **Track & Rotation** | Flags resources 12+ months in same track, rotation planner |
| 🤖 **GenAI Training** | 5-module certification tracker per resource |
| 🔔 **Alerts** | Configurable email alert rules, toggle on/off, add custom rules |
| ⚙️ **Data Sources** | Connect multiple Google Sheets, configure thresholds |
| 📖 **How to Connect** | Built-in step-by-step integration guide |

---

## 🚀 Quick Start

### Option A — Open directly
```bash
# Just open in any browser — no server needed
open index.html
```

### Option B — GitHub Pages (recommended)
1. Fork this repo
2. Go to **Settings → Pages → Source: main branch → / (root)**
3. Your dashboard is live at `https://yourusername.github.io/resops`

### Option C — Local server
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## 🔗 Connecting Your Google Sheet

### Step 1 — Publish your sheet as CSV
1. Open your Google Sheet
2. **File → Share → Publish to web**
3. Select your tab (e.g. `data`) → Format: **CSV**
4. Click **Publish**

### Step 2 — Get your Sheet ID
From your sheet URL:
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
```

### Step 3 — Configure the dashboard
Open `index.html` and find line ~316:
```js
const YOUR_SHEET_ID = 'paste-your-sheet-id-here';
const YOUR_TAB      = 'data'; // your tab name
```

Or use the in-app **Data Sources** page to enter Sheet IDs without editing code.

### Step 4 — Refresh
Click **Refresh All Data** in the sidebar. All charts and tables populate from your live sheet.

---

## 📋 Required Column Headers (Resources Sheet)

| Column | Description | Example |
|---|---|---|
| `Code` | Employee ID | 1001 |
| `Name` | Full name | Ayush Mohan |
| `Email` | Work email | ayush@co.com |
| `Contract` | Contract type | Permanent / Contract |
| `Engagement` | Engagement model | T&M / Fixed |
| `Title` | Job title | DevOps Engineer |
| `BillingResourceLevel` | Billing level | DevOps Engineer |
| `Competency` | Practice area | DevOps / Cloud / Data |
| `StartDate` | Project start | 2022-02-04 |
| `EndDate` | Project end | 2027-12-31 |
| `BillingType` | Billing status | Billable / Non-Billable |
| `AllocationPercentage` | % allocated | 100 |
| `ShiftAllowance` | Shift flag | Applicable / Not Applicable |

> **TrackMonths** is auto-calculated from `StartDate` if not present in your sheet.

---

## 🗂️ Multiple Google Sheets Support

Connect separate sheets for each module via **Data Sources** in the sidebar:

| Sheet/Tab | Role | Key Columns |
|---|---|---|
| `Resources` | Main data | All columns above |
| `OnboardingSteps` | Onboarding flow | ResourceCode, StepName, Status, DueDate |
| `RotationPlan` | Rotation tracking | ResourceCode, ProposedTrack, PlannedDate |
| `GenAITraining` | Training modules | ResourceCode, ModuleName, Status, Score |
| `Alerts_Config` | Alert rules | AlertName, Condition, Recipients, Active |

---

## ⚙️ Configuration

### Thresholds (Data Sources page)
| Setting | Default | Description |
|---|---|---|
| Non-Billable Amber | 30 days | Row highlights amber |
| Non-Billable Red | 60 days | Row highlights red, escalate action |
| Track Warning | 12 months | Flag rotation due |
| Track Critical | 18 months | Flag critical rotation |
| Contract Expiry | 30 days | Warn on upcoming contract end |
| Auto-refresh | 0 (off) | Minutes between auto-fetches |

### Alert Rules (Alerts page)
Pre-built rules you can toggle on/off:
- Non-Billable > 30 Days
- Non-Billable > 60 Days
- Track Change Due
- Onboarding Step Overdue
- GenAI Training Overdue
- Contract Expiry < 30 Days
- Laptop Not Returned

Add custom rules with your own conditions and recipient emails — no code needed.

---

## 🔄 Data Refresh

| Method | How | Latency |
|---|---|---|
| Manual | Click **Refresh All Data** in sidebar | On demand |
| Auto-timer | Set interval in Data Sources (e.g. 5 min) | ~5 min + Google cache |
| Apps Script Web App | Deploy as Web App, update fetch URL | Near real-time (<10s) |

> Google caches published CSVs for ~5 minutes. For true real-time, use an Apps Script Web App (see below).

---

## ⚡ Near Real-Time with Apps Script

For live updates without the 5-minute cache delay, deploy this Apps Script in your Google Sheet:

1. Open your sheet → **Extensions → Apps Script**
2. Paste the following:

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('data');
  const data  = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  return ContentService
    .createTextOutput(JSON.stringify({ data: rows, updated: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy → New deployment → Web App → Anyone → Deploy**
4. Copy the Web App URL
5. In `index.html` replace the fetch URL with your Web App URL

---

## 📱 Responsive

Works on desktop, tablet, and mobile. Sidebar collapses to hamburger menu on screens < 640px.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI | Vanilla HTML + CSS (no framework) |
| Charts | Chart.js 4.4.1 (CDN) |
| Fonts | Inter + DM Mono (Google Fonts) |
| Data | Google Sheets CSV export |
| Hosting | Any static host (GitHub Pages, Netlify, etc.) |
| Dependencies | Zero npm packages |

---

## 📁 File Structure

```
resops/
├── index.html          # Everything — single self-contained file
└── README.md           # This file
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 🙋 Support

- Open an issue on GitHub for bugs or feature requests
- See the built-in **How to Connect Sheets** page in the dashboard for integration help

---

*Built for PwC Run & Maintain team resource management. Adaptable for any professional services team.*
