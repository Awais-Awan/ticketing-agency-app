import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import styles from "./BookingDetail.module.css";

function formatMoney(value) {
  return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [cancelling, setCancelling] = useState(false);
  const [ourFee, setOurFee] = useState("0");
  const [supplierFee, setSupplierFee] = useState("0");

  useEffect(() => {
    loadBooking();
  }, [id]);

  async function loadBooking() {
    setLoading(true);
    const response = await apiClient.get(`/bookings/${id}`);
    setBooking(response.data);
    setLoading(false);
  }

  async function handleAddPayment(e) {
    e.preventDefault();
    setError("");
    try {
      const response = await apiClient.post(`/bookings/${id}/payments`, {
        amount: parseFloat(paymentAmount),
        payment_date: paymentDate,
      });
      setBooking(response.data);
      setPaymentAmount("");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not add payment");
    }
  }

  function startEditing() {
    setEditForm({
      customer_name: booking.customer_name,
      phone_number: booking.phone_number,
      pnr_no: booking.pnr_no,
      date_of_travel: booking.date_of_travel || "",
      sector: booking.sector || "",
      reference: booking.reference || "",
      sale_amount: booking.sale_amount,
      cost_price: booking.cost_price,
    });
    setEditing(true);
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setError("");
    try {
      const response = await apiClient.patch(`/bookings/${id}`, {
        ...editForm,
        sale_amount: parseFloat(editForm.sale_amount),
        cost_price: parseFloat(editForm.cost_price),
      });
      setBooking(response.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not save changes");
    }
  }

  async function handleCancelBooking(e) {
    e.preventDefault();
    setError("");
    try {
      const response = await apiClient.post(`/bookings/${id}/cancel`, {
        our_cancellation_fee: parseFloat(ourFee) || 0,
        supplier_cancellation_fee: parseFloat(supplierFee) || 0,
      });
      setBooking(response.data);
      setCancelling(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not cancel booking");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!booking) return <p>Booking not found</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className={styles.backLink}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to bookings</span>
      </button>

      <div className={styles.header}>
        <h2 className={styles.pageTitle}>
          PNR {booking.pnr_no}
          <span className={booking.status === "cancelled" ? styles.statusCancelled : styles.statusActive}>
            {booking.status}
          </span>
        </h2>
        {booking.status !== "cancelled" && (
          <div className={styles.headerActions}>
            <button onClick={startEditing} className={styles.secondaryButton}>Edit</button>
            <button onClick={() => setCancelling(true)} className={styles.dangerButton}>Cancel booking</button>
          </div>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {editing ? (
        <form onSubmit={handleSaveEdit} className={styles.card}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Customer name</label>
              <input name="customer_name" value={editForm.customer_name} onChange={handleEditChange} />
            </div>
            <div className={styles.field}>
              <label>Phone number</label>
              <input name="phone_number" value={editForm.phone_number} onChange={handleEditChange} />
            </div>
            <div className={styles.field}>
              <label>PNR no.</label>
              <input name="pnr_no" value={editForm.pnr_no} onChange={handleEditChange} />
            </div>
            <div className={styles.field}>
              <label>Date of travel</label>
              <input type="date" name="date_of_travel" value={editForm.date_of_travel} onChange={handleEditChange} />
            </div>
            <div className={styles.field}>
              <label>Sector</label>
              <input name="sector" value={editForm.sector} onChange={handleEditChange} />
            </div>
            <div className={styles.field}>
              <label>Reference</label>
              <input name="reference" value={editForm.reference} onChange={handleEditChange} />
            </div>
            <div className={styles.field}>
              <label>Sale amount</label>
              <input type="number" name="sale_amount" value={editForm.sale_amount} onChange={handleEditChange} />
            </div>
            <div className={styles.field}>
              <label>Cost price</label>
              <input type="number" name="cost_price" value={editForm.cost_price} onChange={handleEditChange} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton}>Save changes</button>
            <button type="button" onClick={() => setEditing(false)} className={styles.secondaryButton}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className={styles.card}>
          <div className={styles.detailGrid}>
            <div><span className={styles.detailLabel}>Customer</span><span>{booking.customer_name}</span></div>
            <div><span className={styles.detailLabel}>Phone</span><span>{booking.phone_number}</span></div>
            <div><span className={styles.detailLabel}>Sector</span><span>{booking.sector || "—"}</span></div>
            <div><span className={styles.detailLabel}>Date of travel</span><span>{booking.date_of_travel || "—"}</span></div>
            <div><span className={styles.detailLabel}>Reference</span><span>{booking.reference || "—"}</span></div>
            <div><span className={styles.detailLabel}>Sale amount</span><span>{formatMoney(booking.sale_amount)}</span></div>
            <div><span className={styles.detailLabel}>Cost price</span><span>{formatMoney(booking.cost_price)}</span></div>
            <div><span className={styles.detailLabel}>Profit</span><span className={booking.profit < 0 ? styles.negative : styles.positive}>{formatMoney(booking.profit)}</span></div>
            <div><span className={styles.detailLabel}>Received</span><span>{formatMoney(booking.received_payment)}</span></div>
            <div><span className={styles.detailLabel}>Pending</span><span>{formatMoney(booking.pending_amount)}</span></div>
          </div>
        </div>
      )}

      {cancelling && (
        <form onSubmit={handleCancelBooking} className={styles.card}>
          <h3 className={styles.sectionLabel}>Cancel this booking</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Our cancellation fee (kept)</label>
              <input type="number" value={ourFee} onChange={(e) => setOurFee(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Supplier cancellation fee</label>
              <input type="number" value={supplierFee} onChange={(e) => setSupplierFee(e.target.value)} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.dangerButton}>Confirm cancellation</button>
            <button type="button" onClick={() => setCancelling(false)} className={styles.secondaryButton}>Back</button>
          </div>
        </form>
      )}

      <h3 className={styles.sectionLabel}>Payment history</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th className={styles.numCol}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {booking.payments.length === 0 ? (
            <tr><td colSpan={2} className={styles.empty}>No payments yet</td></tr>
          ) : (
            booking.payments.map((p) => (
              <tr key={p.id}>
                <td>{p.payment_date}</td>
                <td className={styles.numCol}>{formatMoney(p.amount)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {booking.status !== "cancelled" && (
        <form onSubmit={handleAddPayment} className={styles.paymentForm}>
          <input
            type="number"
            placeholder="Amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
          />
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
          <button type="submit" className={styles.primaryButton}>Add payment</button>
        </form>
      )}
    </div>
  );
}

export default BookingDetail;