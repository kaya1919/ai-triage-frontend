// src/components/User/SeatGrid.tsx
import { useEffect, useRef, useState } from "react";

export type Seat = {
  num: number;
  id: string;
  isBooked: boolean;
};

export default function SeatGrid({
  seats,
  onSelectionChange,
}: {
  seats: Seat[];
  onSelectionChange: (selectedSeatIds: string[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Click handler using DOM delegation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const seatDiv = target.closest(".seat") as HTMLElement | null;
      if (!seatDiv) return;

      const seatId = seatDiv.dataset.seatId;
      if (!seatId) return;

      // Ignore seats already booked
      if (seatDiv.classList.contains("booked")) return;

      setSelected(prev => {
        const next = new Set(prev);
        if (seatDiv.classList.contains("seat--selected")) {
          seatDiv.classList.remove("seat--selected");
          next.delete(seatId);
        } else {
          seatDiv.classList.add("seat--selected");
          next.add(seatId);
        }
        return next;
      });
    }

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, []);

  // When `seats` changes, remove any selections that are now booked
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove highlight for seats that became booked
    seats.forEach((s) => {
      if (s.isBooked) {
        const el = container.querySelector(`.seat[data-seat-id="${s.id}"]`);
        if (el) el.classList.remove("seat--selected");
      }
    });

    // Filter out selected ids that are now booked
    setSelected(prev => {
      const next = new Set(
        [...prev].filter(id => seats.some(s => s.id === id && !s.isBooked))
      );
      return next;
    });
  }, [seats]);

  // Notify parent only when `selected` changes (avoids calling parent during render)
  useEffect(() => {
    onSelectionChange([...selected]);
  }, [selected, onSelectionChange]);

  return (
    <>
      <div
        ref={containerRef}
        className="seat-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 10,
          marginTop: 20,
        }}
      >
        {seats.map((s) => (
          <div
            key={s.id}
            className={`seat ${s.isBooked ? "booked" : ""}`}
            data-seat-id={s.id}
            style={{
              padding: 12,
              borderRadius: 8,
              border: "1px solid #ddd",
              textAlign: "center",
              cursor: s.isBooked ? "not-allowed" : "pointer",
              background: s.isBooked ? "#eee" : "#fff",
              userSelect: "none",
            }}
          >
            {s.num}
          </div>
        ))}
      </div>

      <style>{`
        .seat--selected {
          background: #2563eb !important;
          color: white;
          border-color: #1e40af !important;
          box-shadow: 0 0 6px rgba(37,99,235,0.4);
        }
        .seat.booked {
          color: #555;
          opacity: 0.7;
        }
      `}</style>
    </>
  );
}
