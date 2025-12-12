// src/pages/SlotSelectionPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSlotsForDoctor } from "../api/shows";
import { bookSlot } from "../api/booking";

export default function SlotSelectionPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();

  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // booking state
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Anonymous");

  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    getSlotsForDoctor(doctorId)
      .then((data) => {
        setSlots(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        setError(e?.message || "Failed to load slots");
      })
      .finally(() => setLoading(false));
  }, [doctorId]);

  async function handleBook(slotId: string) {
    if (!userName || !userName.trim()) {
      alert("Please enter your name before booking.");
      return;
    }

    setBookingLoading(slotId);
    try {
      const resp = await bookSlot(userName.trim(), doctorId!, slotId);
      // expected { status: "CONFIRMED", booking_id }
      if (resp && resp.booking_id) {
        navigate(`/booking-status/${resp.booking_id}`);
      } else {
        // server might return an error message
        throw new Error(resp?.message || "Booking failed");
      }
    } catch (err: any) {
      alert(err?.message || "Booking failed. Try again.");
      // Optionally refresh slots to reflect latest booked state
      try {
        const refreshed = await getSlotsForDoctor(doctorId!);
        setSlots(Array.isArray(refreshed) ? refreshed : []);
      } catch {}
    } finally {
      setBookingLoading(null);
    }
  }

  return (
    <div className="container" style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Link to="/doctors" style={{ textDecoration: "none" }}>
          <button className="btn-outline">← Back to doctors</button>
        </Link>
        <h2 style={{ margin: 0 }}>Available Slots</h2>
        <div style={{ marginLeft: "auto", color: "var(--muted)" }}>
          <label style={{ fontSize: 13, marginRight: 8 }}>Your name:</label>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #e6eef0",
              minWidth: 180
            }}
          />
        </div>
      </div>

      {loading && <div className="muted">Loading slots...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        {!loading && slots.length === 0 && (
          <div className="muted">No slots available for this doctor.</div>
        )}

        {slots.map((slot) => {
          const isBooked = !!slot.is_booked;
          const bookingNow = bookingLoading === slot.id;
          const startLocal = slot.start_time ? new Date(slot.start_time).toLocaleString() : "N/A";
          return (
            <div
              key={slot.id}
              className="show-card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: 700 }}>{startLocal}</div>
                <div className="muted">Duration: {slot.duration_minutes} mins</div>
                <div className="muted">Created: {new Date(slot.created_at).toLocaleString()}</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn-sm"
                  disabled={isBooked || !!bookingLoading}
                  onClick={() => {
                    if (isBooked) return;
                    // small confirm step
                    const ok = window.confirm(
                      `Book slot on ${startLocal} as "${userName || "Anonymous"}"?`
                    );
                    if (ok) handleBook(slot.id);
                  }}
                >
                  {bookingNow ? "Booking..." : isBooked ? "Booked" : "Book"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
