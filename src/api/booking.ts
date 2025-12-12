// src/api/booking.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export type BookingResp = {
  status?: string;
  booking_id?: string;
  message?: string;
  [k: string]: any;
};

export async function bookSlot(user_name: string, doctor_id: string, slot_id: string): Promise<BookingResp> {
  const res = await fetch(`${API_BASE}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, doctor_id, slot_id }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Booking failed: ${res.status}`);
  }
  return res.json();
}

export async function getBooking(bookingId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/booking/${bookingId}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Get booking failed: ${res.status}`);
  }
  return res.json();
}
