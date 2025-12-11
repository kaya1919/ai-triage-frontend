export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface DoctorOrShow {
  id: string;
  name: string;
  specialty?: string; // if doctor
  start_time: string; // ISO
  total_seats?: number | null; // for shows
  created_at?: string;
}

export interface Slot {
  id: string;
  doctor_id?: string;
  start_time: string;
  duration_minutes?: number;
  is_booked: boolean;
}

export interface Booking {
  id: string;
  user_name: string;
  doctor_id?: string;
  slot_id?: string;
  status: BookingStatus;
  created_at?: string;
}
