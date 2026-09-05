import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import apiClient from "../api/client";
import styles from "./Reports.module.css";

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

function formatMoney(value) {
  return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Reports() {
  const [bookings, setBookings] = useState([]);
  const [supplierMap, setSupplierMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [rangeType, setRangeType] = useState("month");
  const [customStart, setCustomStart] = useState(toDateStr(new Date()));
  const [customEnd, setCustomEnd] = useState(toDateStr(new Date()));
  const [includeProfit, setIncludeProfit] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get("/bookings"),
      apiClient.get("/suppliers"),
    ]).then(([bookingsRes, suppliersRes]) => {
      setBookings(bookingsRes.data);
      const map = {};
      suppliersRes.data.forEach((s) => { map[s.id] = s.name; });
      setSupplierMap(map);
      setLoading(false);
    });
  }, []);

  function getRange() {
    const now = new Date();
    if (rangeType === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      return { start: toDateStr(start), end: toDateStr(now) };
    }
    if (rangeType === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: toDateStr(start), end: toDateStr(now) };
    }
    return { start: customStart, end: customEnd };
  }

  if (loading) return <p>Loading...</p>;

  const { start, end } = getRange();

  const filtered = bookings.filter((b) => {
    const created = b.created_at.slice(0, 10);
    return created >= start && created <= end;
  });

  const totalSales = filtered.reduce((sum, b) => sum + parseFloat(b.sale_amount), 0);
  const totalProfit = filtered.reduce((sum, b) => sum + parseFloat(b.profit), 0);

  const byDay = {};
  filtered.forEach((b) => {
    const day = b.created_at.slice(0, 10);
    byDay[day] = (byDay[day] || 0) + parseFloat(b.sale_amount);
  });
  const chartData = Object.keys(byDay).sort().map((day) => ({ day, sales: byDay[day] }));

  function exportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("AL-MAARIB Travels - Sales report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Range: ${start} to ${end}`, 14, 24);
    doc.text(`Total sales: ${formatMoney(totalSales)}`, 14, 31);
    if (includeProfit) doc.text(`Total profit: ${formatMoney(totalProfit)}`, 14, 37);
    doc.text(`Bookings: ${filtered.length}`, 14, includeProfit ? 43 : 37);

    const head = ["PNR", "Customer", "Supplier", "Travel date", "Purchase amount", "Sale amount"];
    if (includeProfit) head.push("Profit");
    head.push("Status");

    const body = filtered.map((b) => {
      const row = [
        b.pnr_no,
        b.customer_name,
        supplierMap[b.supplier_id] || "—",
        b.date_of_travel || "—",
        formatMoney(b.cost_price),
        formatMoney(b.sale_amount),
      ];
      if (includeProfit) row.push(formatMoney(b.profit));
      row.push(b.status);
      return row;
    });

    autoTable(doc, {
      startY: includeProfit ? 50 : 44,
      head: [head],
      body,
      styles: { fontSize: 8 },
    });

    doc.save(`sales-report-${start}-to-${end}.pdf`);
  }

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Reports</h2>
        <button onClick={exportPdf} className={styles.exportButton}>Export PDF</button>
      </div>

      <div className={styles.filters}>
        <button
          onClick={() => setRangeType("week")}
          className={rangeType === "week" ? styles.filterActive : styles.filter}
        >
          This week
        </button>
        <button
          onClick={() => setRangeType("month")}
          className={rangeType === "month" ? styles.filterActive : styles.filter}
        >
          This month
        </button>
        <button
          onClick={() => setRangeType("custom")}
          className={rangeType === "custom" ? styles.filterActive : styles.filter}
        >
          Custom
        </button>
        {rangeType === "custom" && (
          <>
            <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
            <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
          </>
        )}
        <label className={styles.toggle}>
          <input type="checkbox" checked={includeProfit} onChange={(e) => setIncludeProfit(e.target.checked)} />
          Show profit column
        </label>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total sales</span>
          <span className={styles.metricValue}>{formatMoney(totalSales)}</span>
        </div>
        {includeProfit && (
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Total profit</span>
            <span className={`${styles.metricValue} ${totalProfit < 0 ? styles.negative : styles.positive}`}>
              {formatMoney(totalProfit)}
            </span>
          </div>
        )}
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bookings</span>
          <span className={styles.metricValue}>{filtered.length}</span>
        </div>
      </div>

      <h3 className={styles.sectionLabel}>Sales trend</h3>
      <div className={styles.chartCard}>
        {chartData.length === 0 ? (
          <p className={styles.empty}>No bookings in this range.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Bar dataKey="sales" fill="#12203A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <h3 className={styles.sectionLabel}>Bookings in range</h3>
      {filtered.length === 0 ? (
        <p className={styles.empty}>No bookings in this range.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>PNR</th>
              <th>Customer</th>
              <th>Supplier</th>
              <th>Travel date</th>
              <th className={styles.numCol}>Purchase amount</th>
              <th className={styles.numCol}>Sale amount</th>
              {includeProfit && <th className={styles.numCol}>Profit</th>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>{b.pnr_no}</td>
                <td>{b.customer_name}</td>
                <td>{supplierMap[b.supplier_id] || "—"}</td>
                <td>{b.date_of_travel || "—"}</td>
                <td className={styles.numCol}>{formatMoney(b.cost_price)}</td>
                <td className={styles.numCol}>{formatMoney(b.sale_amount)}</td>
                {includeProfit && (
                  <td className={`${styles.numCol} ${parseFloat(b.profit) < 0 ? styles.negative : ""}`}>
                    {formatMoney(b.profit)}
                  </td>
                )}
                <td>
                  <span className={b.status === "cancelled" ? styles.statusCancelled : styles.statusActive}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Reports;