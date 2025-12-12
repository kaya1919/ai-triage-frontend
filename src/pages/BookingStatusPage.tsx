// src/pages/BookingStatusPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBooking } from "../api/booking";
import { getSlotsForDoctor } from "../api/shows";

export default function BookingStatusPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<any | null>(null);
  const [slotInfo, setSlotInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    setError(null);

    getBooking(bookingId)
      .then((b) => {
        setBooking(b);
      })
      .catch((e) => {
        setError(e?.message || "Failed to fetch booking");
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  // If we have doctor_id + slot_id, try to fetch slot details for nicer display
  useEffect(() => {
    async function fetchSlot() {
      if (!booking?.doctor_id || !booking?.slot_id) return;
      setSlotLoading(true);
      try {
        const slots = await getSlotsForDoctor(booking.doctor_id);
        const found = Array.isArray(slots)
          ? slots.find((s: any) => s.id === booking.slot_id)
          : null;
        setSlotInfo(found || null);
      } catch (e) {
        // don't treat as fatal — just skip slot detail
        console.warn("Failed to fetch slot details", e);
      } finally {
        setSlotLoading(false);
      }
    }
    fetchSlot();
  }, [booking]);

  if (loading) {
    return <div className="container" style={{ padding: 18 }}>Loading booking...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: 18 }}>
        <div style={{ color: "red" }}>{error}</div>
        <div style={{ marginTop: 12 }}>
          <Link to="/triage"><button className="btn-outline">Go to triage</button></Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container" style={{ padding: 18 }}>
        <div className="muted">No booking found.</div>
        <div style={{ marginTop: 12 }}>
          <Link to="/triage"><button className="btn-outline">Start triage</button></Link>
        </div>
      </div>
    );
  }

  const startLocal = slotInfo?.start_time
    ? new Date(slotInfo.start_time).toLocaleString()
    : booking?.slot_start_time
    ? new Date(booking.slot_start_time).toLocaleString()
    : "N/A";

  return (
    <div className="container" style={{ padding: 18 }}>
      <div className="card" style={{
        padding: 16,
        borderRadius: 12,
        background: "white",
        boxShadow: "0 8px 24px rgba(15,118,110,0.06)",
        maxWidth: 820,
        margin: "0 auto"
      }}>
        <h3 style={{ marginTop: 0 }}>Booking Details</h3>

        <div style={{ display: "grid", gap: 8 }}>
          <div><strong>Booking ID:</strong> {booking.id}</div>
          <div><strong>User:</strong> {booking.user_name ?? "Unknown"}</div>
          <div><strong>Status:</strong> <span style={{ color: booking.status === "CONFIRMED" ? "green" : "#444" }}>{booking.status}</span></div>
          <div><strong>Doctor ID:</strong> {booking.doctor_id ?? "N/A"}</div>
          <div><strong>Slot ID:</strong> {booking.slot_id ?? "N/A"}</div>

          <div>
            <strong>Slot Time:</strong>{" "}
            {slotLoading ? <span className="muted">Loading slot time...</span> : <span>{startLocal}</span>}
          </div>

          <div><strong>Created at:</strong> {booking.created_at ? new Date(booking.created_at).toLocaleString() : "N/A"}</div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Link to="/triage"><button className="btn-outline">New triage</button></Link>
          <Link to="/doctors?specialty="><button className="btn-sm">Browse doctors</button></Link>
        </div>
      </div>
    </div>
  );
}
