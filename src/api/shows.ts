// src/api/shows.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export type Slot = {
  id: string;
  doctor_id: string;
  start_time: string;
  duration_minutes: number;
  is_booked: boolean;
  created_at?: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty?: string;
  description?: string;
  created_at?: string;
};

export async function getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
  const q = encodeURIComponent(specialty || "");
  const res = await fetch(`${API_BASE}/doctors?specialty=${q}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Fetch doctors failed: ${res.status}`);
  }
  return res.json();
}

export async function getSlotsForDoctor(doctorId: string): Promise<Slot[]> {
  const res = await fetch(`${API_BASE}/slots/${doctorId}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Fetch slots failed: ${res.status}`);
  }
  return res.json();
}
