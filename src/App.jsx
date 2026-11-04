import React, { useState, useMemo } from 'react';
import { INITIAL_CATALOG } from './catalogData';

// Constants for eBay unit financial modeling
const FVF_RATE = 0.1325; // 13.25% eBay Final Value Fee
const FVF_FIXED = 0.40;  // $0.40 per order
const ESTIMATED_COGS = {
  print: 1.85,    // Paper + archival ink
  sticker: 0.65,  // Vinyl die-cut
  digital: 0.00   // Zero unit reproduction cost
};
const ESTIMATED_POSTAGE = 3.65; // USPS Ground Advantage 8x10 rigid mailer

export default function App() {
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [search, setSearch] = useState('');
  const [selectedLane, setSelectedLane] = useState('all');

  // Filter & Search logic
  const filteredCatalog = useMemo(() => {
    return catalog.filter(item => {
      const matchSearch = item.sku.toLowerCase().includes(search.toLowerCase()) ||
                          item.title.toLowerCase().includes(search.toLowerCase());
      const matchLane = selectedLane === 'all' || item.lane === selectedLane;
      return matchSearch && matchLane;
    });
  }, [catalog, search, selectedLane]);

  // Aggregate Operational Metrics
  const metrics = useMemo(() => {
    let totalGross = 0;
    let totalNetProfit = 0;
    let filesReady = 0;

    catalog.forEach(item => {
      const price = parseFloat(item.price_usd) || 0;
      const ship = parseFloat(item.shipping_usd) || 0;
      const totalRevenue = price + ship;

      // Fees & Costs
      const fvfFee = (totalRevenue * FVF_RATE) + FVF_FIXED;
      const cogs = ESTIMATED_COGS[item.lane] || 1.85;
      const postage = item.lane === 'digital' ? 0 : ESTIMATED_POSTAGE;
      const netProfit = totalRevenue - fvfFee - cogs - postage;

      totalGross += price;
      totalNetProfit += netProfit;
      if (item.status === 'files-ready') filesReady++;
    });

    const avgMargin = totalGross > 0 ? (totalNetProfit / (totalGross + (catalog.length * 4.95))) * 100 : 0;

    return {
      totalItems: catalog.length,
      filesReady,
      totalGross: totalGross.toFixed(2),
      totalNetProfit: totalNetProfit.toFixed(2),
      avgMargin: avgMargin.toFixed(1)
    };
  }, [catalog]);

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="ops-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span className="brand-badge">40_BUSINESS // 50_OPS</span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>EBAY PIPELINE CONTROL DECK</h1>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Telemetry, Unit Margin Modeling &amp; Inventory Pipeline for <code>catalog.csv</code>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
            ● SYSTEM ONLINE &bull; 18 SKUs
          </span>
        </div>
      </header>

      {/* KPI Summary Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Active Catalog Items</div>
          <div className="kpi-val">{metrics.totalItems}</div>
          <div className="kpi-sub">{metrics.filesReady} Ready for Upload</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Gross Portfolio Value</div>
          <div className="kpi-val">${metrics.totalGross}</div>
          <div className="kpi-sub">Listing Format: Buy It Now</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Net Realizable Profit</div>
          <div className="kpi-val" style={{ color: 'var(--accent-green)' }}>${metrics.totalNetProfit}</div>
          <div className="kpi-sub">Post-FVF, COGS &amp; Shipping</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Average Net Margin</div>
          <div className="kpi-val" style={{ color: 'var(--accent-amber)' }}>{metrics.avgMargin}%</div>
          <div className="kpi-sub">Target: &gt; 45% Net</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="controls-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by SKU or Title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="filter-pills">
          {['all', 'print', 'sticker', 'digital'].map(lane => (
            <button
              key={lane}
              className={`pill-btn ${selectedLane === lane ? 'active' : ''}`}
              onClick={() => setSelectedLane(lane)}
            >
              Lane: {lane.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Operational Table */}
      <div className="data-table-container">
        <table className="ops-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Status</th>
              <th>Lane</th>
              <th>Listing Title</th>
              <th>Price</th>
              <th>Shipping</th>
              <th>eBay Fee (13.25%+$0.40)</th>
              <th>Est. Net Margin</th>
              <th>Art File Asset</th>
            </tr>
          </thead>
          <tbody>
            {filteredCatalog.map(item => {
              const price = parseFloat(item.price_usd) || 0;
              const ship = parseFloat(item.shipping_usd) || 0;
              const total = price + ship;
              const fee = (total * FVF_RATE) + FVF_FIXED;
              const cogs = ESTIMATED_COGS[item.lane] || 1.85;
              const postage = item.lane === 'digital' ? 0 : ESTIMATED_POSTAGE;
              const net = total - fee - cogs - postage;
              const marginPct = ((net / total) * 100).toFixed(1);

              return (
                <tr key={item.sku}>
                  <td className="sku-tag">{item.sku}</td>
                  <td>
                    <span className={`badge ${item.status === 'files-ready' ? 'badge-ready' : 'badge-draft'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.lane}</td>
                  <td style={{ maxWidth: '360px' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{item.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Length: {item.title.length} chars (Limit: 80)
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>${price.toFixed(2)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${ship.toFixed(2)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}>-${fee.toFixed(2)}</td>
                  <td>
                    <span className="margin-positive">${net.toFixed(2)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                      ({marginPct}%)
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                    {item.art_file}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
