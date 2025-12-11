// src/api/api.ts
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } });

export async function fetchShows() { const r = await api.get('/doctors'); return r.data; }

// Fetch slots for a doctor/show
export async function fetchSlots(doctorId: string) {
  const r = await api.get(`/slots/${doctorId}`);
  return r.data; // expect array of slots: { id, doctor_id, start_time, is_booked, ... }
}

// Book a single slot (slot_id)
export async function bookSlot(body: { user_name: string; doctor_id?: string; slot_id?: string }) {
  const r = await api.post('/book', body);
  return r.data;
}

export async function fetchBooking(id: string) {
  const r = await api.get(`/booking/${id}`);
  return r.data;
}
export async function createShow(payload: any) {
  const r = await api.post("/admin/doctor", payload);
  return r.data;
}
