# eBay Ops Dashboard — React Control Deck (`ebay-ops-dashboard-react`)

> *"Real-time financial telemetry, unit margin modeling, and inventory pipeline visualization."*

A high-performance **Vite + React** dashboard built for managing the e-commerce print, sticker, and digital fulfillment pipeline around [`40_BUSINESS/ebay/catalog.csv`](file:///root/40_BUSINESS/ebay/catalog.csv).

Located in [`10_DEV/11_PROJECTS/ebay-ops-dashboard-react/`](file:///root/10_DEV/11_PROJECTS/ebay-ops-dashboard-react/).

---

## 1. Features

- **Unit Financial Telemetry:** Dynamically calculates eBay Final Value Fees (`13.25% + $0.40`), Lane-specific COGS (`print: $1.85`, `sticker: $0.65`, `digital: $0.00`), and actual USPS mailer postage (`$3.65`).
- **Catalog Management:** Live search across all 18 SKUs, title character length validator (warning if approaching eBay's 80-character limit), and lane filters.
- **KPI Deck:** Instant readout of Gross Portfolio Valuation, Net Realizable Profit, and Average Net Margin percentage.

---

## 2. Quick Preview

Run the production preview locally:
```bash
cd /root/10_DEV/11_PROJECTS/ebay-ops-dashboard-react
npx vite preview --port 3001 --host 127.0.0.1
```
Visit `http://localhost:3001` in your browser.
