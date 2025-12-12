// src/api/api.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
export const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } });

// helper to normalize different response shapes
function normalizeResponse(resp: any) {
  // If Axios response object passed, use resp.data
  const body = resp?.data ?? resp;
  // prefer payload if present, otherwise body
  return body?.payload ?? body;
}

export async function fetchShows() {
  const r = await api.get("/doctors");
  return normalizeResponse(r);
}

export async function fetchSlots(doctorId: string) {
  const r = await api.get(`/slots/${doctorId}`);
  return normalizeResponse(r);
}

export async function bookSlot(body: { user_name: string; doctor_id?: string; slot_id?: string }) {
  const r = await api.post("/book", body);
  return normalizeResponse(r);
}

export async function fetchBooking(id: string) {
  const r = await api.get(`/booking/${id}`);
  return normalizeResponse(r);
}
export async function createDoctor(body: { name: string; specialty: string }) {
  const r = await api.post("/admin/doctor", body);
  return normalizeResponse(r);
}
