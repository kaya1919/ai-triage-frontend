// src/pages/BookingPageRoute.tsx
import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import { useParams } from "react-router-dom";import SeatGrid from "../components/User/SeatGrid";
import type { Seat } from "../components/User/SeatGrid";
import ConfirmModal from "../components/common/ConfirmModal";
import { fetchSlots, bookSlot, fetchBooking } from "../api/api";
import { AuthContext } from "../context/AuthContext";

type SlotRaw = { id: string; doctor_id?: string; start_time?: string; is_booked?: boolean };

export default function BookingPageRoute() {
  const { id } = useParams<{ id?: string }>();
  const auth = useContext(AuthContext);
  const userName = auth?.userName ?? "guest";

  const [seats, setSeats] = useState<Seat[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  const loadSlots = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const raw: SlotRaw[] = await fetchSlots(id);
      const s: Seat[] = raw.map((slot, i) => ({
        id: slot.id,
        num: i + 1,
        isBooked: !!slot.is_booked,
      }));
      setSeats(s);
    } catch (e: any) {
      setError(e?.message || "Failed to load slots");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // 🔥 POLLING EVERY 10 SECONDS TO REFRESH SEAT AVAILABILITY
  useEffect(() => {
    const poll = setInterval(() => {
      loadSlots();
    }, 10000);

    return () => clearInterval(poll);
  }, [loadSlots]);

  function onSelectionChange(sel: string[]) {
    setSelectedSeatIds(sel);
    setStatusMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (!sel.includes(k)) delete next[k];
      });
      return next;
    });
  }

  const selectedSeatsInfo = useMemo(() => {
    if (!seats) return [];
    return selectedSeatIds.map((sid) => seats.find((s) => s.id === sid)!).filter(Boolean);
  }, [selectedSeatIds, seats]);

  async function pollBookingUntilFinal(bookingId: string, slotId: string, interval = 1500, timeout = 20000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const bk = await fetchBooking(bookingId);
        const st = bk?.status;
        if (st && st !== "PENDING") {
          return st;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, interval));
    }
    return "PENDING";
  }

  async function confirmBooking() {
    if (!id) return;
    if (selectedSeatIds.length === 0) {
      setError("Select at least one seat first.");
      return;
    }

    setModalOpen(false);
    setBookingInProgress(true);
    setError(null);

    setStatusMap((prev) => {
      const next = { ...prev };
      selectedSeatIds.forEach((sid) => (next[sid] = "PENDING"));
      return next;
    });

    const bookingPromises = selectedSeatIds.map(async (slotId) => {
      try {
        const resp = await bookSlot({ user_name: userName, doctor_id: id, slot_id: slotId });

        const status = resp?.status;
        const bookingId = resp?.booking_id || resp?.id || null;

        if (status === "CONFIRMED" || status === "FAILED") {
          setStatusMap((prev) => ({ ...prev, [slotId]: status }));
          return { slotId, status };
        }

        if (status === "PENDING" && bookingId) {
          const final = await pollBookingUntilFinal(bookingId, slotId);
          setStatusMap((prev) => ({ ...prev, [slotId]: final }));
          return { slotId, status: final };
        }

        setStatusMap((prev) => ({ ...prev, [slotId]: status || "CONFIRMED" }));
        return { slotId, status: status || "CONFIRMED" };
      } catch {
        setStatusMap((prev) => ({ ...prev, [slotId]: "FAILED" }));
        return { slotId, status: "FAILED" };
      }
    });

    const results = await Promise.all(bookingPromises);

    setSeats((prev) => {
      if (!prev) return prev;
      return prev.map((s) => {
        const r = results.find((x) => x.slotId === s.id);
        if (r?.status === "CONFIRMED") return { ...s, isBooked: true };
        return s;
      });
    });

    const anyFailed = results.some((r) => r.status === "FAILED");
    if (anyFailed) {
      setError("Some seats failed to book.");
      await loadSlots();
    }

    setBookingInProgress(false);

    setSelectedSeatIds((prev) => {
  const next = prev.filter(
    (sid) => !results.some((r) => r.slotId === sid && r.status === "CONFIRMED")
  );

  // Remove visual highlight for seats that became booked
  const container = document.querySelector(".seat-grid");
  if (container) {
    results.forEach((r) => {
      if (r.status === "CONFIRMED") {
        const el = container.querySelector(`.seat[data-seat-id="${r.slotId}"]`);
        if (el) el.classList.remove("seat--selected");
      }
    });
  }

  return next;
});

  }

  if (!id) return <div>No show id provided</div>;
  if (loading) return <div>Loading seats...</div>;
  if (!seats) return <div>No seats available.</div>;

  return (
    <div className="page-container">
      <h2>Booking — {id}</h2>

      <SeatGrid seats={seats} onSelectionChange={onSelectionChange} />

      <div style={{ marginTop: 16 }}>
        <div>Selected: {selectedSeatIds.length}</div>

        <button
          style={{ marginTop: 10 }}
          disabled={selectedSeatIds.length === 0 || bookingInProgress}
          onClick={() => setModalOpen(true)}
        >
          {bookingInProgress ? "Booking..." : "Confirm Booking"}
        </button>

        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </div>

      <ConfirmModal
        open={modalOpen}
        message={`Confirm booking for ${selectedSeatIds.length} seat(s)?`}
        onCancel={() => setModalOpen(false)}
        onConfirm={confirmBooking}
      />
    </div>
  );
}
