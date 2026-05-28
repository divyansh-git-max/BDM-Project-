# 🍞 Bakery Analytics — BDM Capstone Project

<div align="center">

![Bakery Analytics Banner](https://img.shields.io/badge/IIT%20Madras-BDM%20Capstone-orange?style=for-the-badge&logo=graduation-cap)
![Status](https://img.shields.io/badge/Status-Live%20on%20Vercel-brightgreen?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Data](https://img.shields.io/badge/Data-Kaggle%20Bakery%20Sales-20BEFF?style=for-the-badge&logo=kaggle)

**Optimizing Customer Purchases & Sales Forecasting for The Bread Basket, Edinburgh**

*A data-driven analytics dashboard built as part of the IIT Madras Online BS Degree — Business Decision Making (BDM) Capstone Project*

[🌐 Live Demo](#) · [📊 Dataset](https://www.kaggle.com/datasets/akashdeepkuila/bakery/data) · [📄 Report](./22f3002342_BDM_FINAL.pdf) · [📓 Notebook](./IITM_BDM_PROJECT.ipynb)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Business Problems](#-business-problems)
- [Dataset](#-dataset)
- [Methodology](#-methodology)
- [Key Findings](#-key-findings)
- [Recommendations](#-recommendations)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Running Locally](#-running-locally)
- [Deploying to Vercel](#-deploying-to-vercel)
- [Author](#-author)

---

## 🔍 Overview

This project analyzes the sales performance of **"The Bread Basket"**, a high-traffic bakery located in **Edinburgh, Scotland**. Using historical transactional data spanning **163 days** (Oct 2016 – Apr 2017), two critical business problems were identified and solved using data science techniques.

The result is a fully interactive, single-page analytics dashboard — built with vanilla HTML/CSS/JS, D3.js, Plotly.js, and GSAP — that visualizes all findings and recommendations in a premium dark-themed UI.

| Metric | Value |
|---|---|
| 📦 Total Transactions | 9,465 |
| 🧾 Total Item Records | 20,507 |
| 🛍️ Unique Products | 94 |
| 🛒 Avg Basket Size | 2.16 items |
| 📅 Data Period | 30 Oct 2016 – 9 Apr 2017 |
| ☕ Top Selling Item | Coffee (5,471 sales) |

---

## ❗ Business Problems

### Problem 1 — Low Average Basket Size
> Most customers purchase only **1–2 items per visit**, indicating massive missed revenue opportunities.

- **3,352 transactions (35.4%)** consist of a single item only
- The 75th percentile is just **3 items** — a highly skewed distribution
- Despite strong natural item affinities, cross-selling is entirely absent at POS
- **Method Used:** Market Basket Analysis (Apriori Algorithm)

### Problem 2 — Sales Variability & Operational Inefficiency
> Significant demand swings between days and hours cause **staffing and inventory waste**.

- Saturday peak sales are 3× higher than Monday
- 90%+ of transactions occur between **9 AM – 2 PM**
- The bakery stays open until **1 AM** during winter months with near-zero evening sales
- **Methods Used:** SARIMAX, XGBoost, Facebook Prophet, Monte Carlo Simulation

---

## 📊 Dataset

**Source:** [Kaggle — Bakery Sales](https://www.kaggle.com/datasets/akashdeepkuila/bakery/data) by Akashdeep Kuila

| Column | Type | Description |
|---|---|---|
| `Transaction` | Integer | Unique ID per transaction (9,465 unique) |
| `Item` | Categorical | Name of item sold (94 unique products) |
| `date_time` | Timestamp | Date and time of transaction |
| `period_day` | Categorical | Time block: Morning / Afternoon / Evening / Night |
| `weekday_weekend` | Categorical | Weekday or Weekend |
| `Basket_Size` | Engineered | Items per transaction (derived feature) |

**Descriptive Stats — Basket Size:**

| Stat | Value |
|---|---|
| Mean | 2.16 |
| Std Dev | 1.30 |
| Median (P50) | 2.0 |
| P75 | 3.0 |
| Max | 11 |

---

## 🧪 Methodology

### Problem 1 — Market Basket Analysis (Apriori)

```
Raw Transactions
      │
      ▼
TransactionEncoder (one-hot encoding)
      │
      ▼
Apriori Algorithm
  min_support = 0.02 (≥ 190 of 9,465 transactions)
      │
      ▼
Association Rules
  confidence ≥ 0.10  |  lift ≥ 0.50
      │
      ▼
Lift-ranked item pairs → Bundling strategies
```

**Key metrics extracted:**
- **Support** — How frequently an itemset appears across all transactions
- **Confidence** — Probability that purchasing item X leads to purchasing item Y
- **Lift** — How much more likely two items are bought together vs. by chance (lift > 1 = positive association)

### Problem 2 — Sales Forecasting Pipeline

```
Daily Aggregation → Time Series Decomposition (Trend + Seasonality + Residuals)
      │
      ├── SARIMAX (p,d,q)=(1,1,1) × Seasonal (1,1,1,7) — AIC optimised
      ├── XGBoost — Calendar features (date, month, weekday, day-of-year)
      ├── Facebook Prophet — Additive trend + seasonality + holiday effects
      └── Monte Carlo Simulation — 200 runs, 30-day horizon, Box-Muller sampling
```

**Model Evaluation:**

| Model | RMSE | R² | Use Case |
|---|---|---|---|
| SARIMAX | — | — | Weekly seasonal forecasting |
| XGBoost | **20.95** | **0.697** | Short-term daily prediction |
| Prophet | 28.41 | 0.60 | Mid-term operational planning |
| Monte Carlo | — | — | Buffer stock & risk quantification |

---

## 📈 Key Findings

### Market Basket Insights
- ☕ **Coffee → Toast** has the highest lift (**1.47**) among coffee pairings
- 🍵 **Tea → Cake** is the strongest association in the entire dataset (**lift: 1.60**)
- ☕ Coffee is the central product node — connected to Toast, Medialuna, Pastry, Cake
- 📉 Single-item purchases dominate despite clear natural pairing behaviour

### Sales Pattern Insights
- 📅 **Saturday** is the peak day — sales ~3× higher than Monday/Tuesday
- 🕙 **9 AM – 2 PM** accounts for the majority of all transactions
- 🌙 Evening and night hours (post 5 PM) show negligible sales in winter months
- 📊 Monte Carlo simulation shows mean daily demand of **~105–110 items/day** with wide variability

---

## 💡 Recommendations

### For Problem 1 — Increasing Basket Size

| # | Action | Based On |
|---|---|---|
| 1 | Launch **data-driven combo offers** (Coffee+Cake, Tea+Cake, etc.) | High lift values from Apriori |
| 2 | Add **POS-based upsell prompts** ("Add Cake for £0.50 more?") | Association rules at checkout |
| 3 | **Rearrange store layout** — co-locate pastries near coffee dispensers | Network graph associations |
| 4 | **Weekday loyalty discounts** for multi-item orders (Mon–Thu) | Consistent weekday traffic |

### For Problem 2 — Reducing Operational Inefficiency

| # | Action | Based On |
|---|---|---|
| 1 | **Forecast-based inventory planning** (Prophet weekly + XGBoost daily) | RMSE 20.95 daily accuracy |
| 2 | **Staff scheduling aligned to 9AM–2PM** on weekends | Hourly transaction heatmap |
| 3 | Use **Monte Carlo P95 line** as buffer stock threshold | 200-run demand simulation |
| 4 | **Close earlier on weekdays** during Oct–Apr winter months | Near-zero post-5PM sales |
| 5 | **Off-peak evening promotions** to smooth weekend-heavy demand | Weekly pattern analysis |

---

## 🛠️ Tech Stack

### Dashboard (Frontend)
| Technology | Purpose |
|---|---|
| **HTML5 + Vanilla CSS** | Structure and styling — no frameworks |
| **D3.js v7** | CSV parsing and data aggregation |
| **Plotly.js 2.29** | Interactive charts (bar, scatter, fill bands) |
| **GSAP 3.12 + ScrollTrigger** | Entrance animations and scroll reveals |
| **Google Fonts — Outfit** | Typography |
| **JetBrains Mono** | Monospace for code/metrics |

### Analysis (Python)
| Library | Purpose |
|---|---|
| **Pandas** | Data manipulation and feature engineering |
| **mlxtend** | Apriori algorithm and association rules |
| **statsmodels** | SARIMAX time series modelling |
| **XGBoost** | Gradient-boosted regression |
| **Prophet (Facebook)** | Trend and seasonality forecasting |
| **NumPy / SciPy** | Monte Carlo simulation |
| **Matplotlib / Seaborn / Plotly** | Visualisation in notebook |

---

## 📁 Project Structure

```
BDM Project files/
│
├── index.html                    # ← Main dashboard (self-contained)
├── bakery_sales_revised.csv      # ← Source dataset (loaded by dashboard)
├── vercel.json                   # ← Vercel deployment config
│
├── IITM_BDM_PROJECT.ipynb        # ← Full analysis notebook
├── 22f3002342_BDM_FINAL.pdf      # ← Final BDM report
├── pdf_text.txt                  # ← Extracted report text
│
├── extract_pdf.py                # ← PDF text extraction script
├── style.css                     # ← Legacy styles (superseded by index.html)
├── main.js                       # ← Legacy JS (superseded by index.html)
│
└── README.md                     # ← This file
```

> **Note:** The dashboard is fully self-contained in `index.html` — all CSS, JS, and animations are inline. Only `bakery_sales_revised.csv` needs to be in the same directory for charts to render.

---

## 💻 Running Locally

### Option 1 — Python (Recommended)
```bash
cd "f:\BDM Project files"
python -m http.server 8080
```
Then open **[http://localhost:8080](http://localhost:8080)** in your browser.

### Option 2 — Node.js
```bash
npx serve .
```

### Option 3 — VS Code
Install the **Live Server** extension → right-click `index.html` → **Open with Live Server**

> ⚠️ **Important:** You must serve the files via a local server, not by opening `index.html` directly as a `file://` URL — the CSV fetch will be blocked by CORS otherwise.

---

## 🚀 Deploying to Vercel

This project is configured for **free static deployment on Vercel**.

### Step 1 — Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/bakery-bdm.git
git branch -M main
git push -u origin main
```

### Step 2 — Import to Vercel
1. Go to **[vercel.com](https://vercel.com)** and sign up free (use GitHub)
2. Click **"Add New Project"** → Import your repository
3. Vercel auto-detects it as a **static site** — no config needed
4. Click **Deploy** → live in ~30 seconds ✅

### Step 3 — Your URL
```
https://bakery-bdm.vercel.app
```
Every `git push` to `main` **auto-redeploys** instantly.

---

## 👤 Author

**Divyansh Ajay**
- 🎓 Student Email: `22f3002342@ds.study.iitm.ac.in`
- 🆔 Roll No: `22f3002342`
- 🏛️ IIT Madras — Online BS Degree Program
- 📍 Indian Institute of Technology, Madras, Chennai — 600036

---

## 📄 License

This project is for academic purposes as part of the IIT Madras BDM Capstone.
Dataset sourced from [Kaggle](https://www.kaggle.com/datasets/akashdeepkuila/bakery/data) under public use terms.

---

<div align="center">

Made with ☕ + 🍞 + 📊 for IIT Madras BDM Capstone 2024

</div>
