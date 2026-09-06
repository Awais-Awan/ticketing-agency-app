import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatMoney(value) {
  return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function addHeader(doc, title) {
  doc.setFontSize(14);
  doc.text("AL-MAARIB Travels", 14, 16);
  doc.setFontSize(11);
  doc.text(title, 14, 24);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated on ${new Date().toISOString().slice(0, 10)}`, 14, 30);
  doc.setTextColor(0);
}

export function generateCustomerStatementPdf(customer) {
  const doc = new jsPDF();
  addHeader(doc, `Customer statement - ${customer.name}`);

  doc.setFontSize(10);
  doc.text(`Phone: ${customer.phone}`, 14, 38);

  const totalPending = parseFloat(customer.total_pending);
  const pendingLabel = totalPending > 0 ? "Total pending" : "Payable to customer";
  doc.text(`${pendingLabel}: ${formatMoney(Math.abs(totalPending))}`, 14, 44);

  autoTable(doc, {
    startY: 52,
    head: [["Bookings", "Sale amount", "Received", "Pending"]],
    body: customer.bookings.map((b) => [
      b.pnr_no,
      formatMoney(b.sale_amount),
      formatMoney(b.received_payment),
      formatMoney(b.pending_amount),
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [18, 32, 58] },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Payments received", "Date", "Amount"]],
    body: customer.payments.map((p) => [p.pnr_no, p.payment_date, formatMoney(p.amount)]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [18, 32, 58] },
  });

  doc.save(`statement-${customer.name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

export function generateSupplierStatementPdf(supplier) {
  const doc = new jsPDF();
  addHeader(doc, `Supplier statement - ${supplier.name}`);

  doc.setFontSize(10);
  doc.text(`${supplier.email || "—"} · ${supplier.phone || "—"}`, 14, 38);

  const balance = parseFloat(supplier.balance_owed);
  const balanceLabel = balance > 0 ? "Balance owed" : "Payable by supplier";
  doc.text(`${balanceLabel}: ${formatMoney(Math.abs(balance))}`, 14, 44);

  autoTable(doc, {
    startY: 52,
    head: [["Bookings (tickets bought)", "Cost price"]],
    body: supplier.bookings.map((b) => [b.pnr_no, formatMoney(b.cost_price)]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [18, 32, 58] },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Payments made", "Amount"]],
    body: supplier.payments.map((p) => [p.payment_date, formatMoney(p.amount)]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [18, 32, 58] },
  });

  doc.save(`statement-${supplier.name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}