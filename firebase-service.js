// ============================================================
//  🔥 FIREBASE SERVICE - Appointment Booking & Admin Access
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    collection, addDoc,
    getDocs, query,
    orderBy, serverTimestamp,
    doc, updateDoc
}
    from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import firebaseConfig from "./firebase-config.js";

// ── Initialize Firebase ──────────────────────────────────────
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let analytics = null;

try { analytics = getAnalytics(app); } catch (_) { /* analytics optional */ }

// ── Collection reference ─────────────────────────────────────
const APPOINTMENTS = "appointments";

// ── Save Appointment ─────────────────────────────────────────
export async function saveAppointment(data) {
    try {
        const docRef = await addDoc(collection(db, APPOINTMENTS), {
            ...data,
            status: "pending",
            createdAt: serverTimestamp()
        });
        console.log("✅ Appointment saved with ID:", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("❌ Error saving appointment:", error);
        return { success: false, error: error.message };
    }
}

// ── Fetch All Appointments (for admin page) ───────────────────
export async function fetchAppointments() {
    try {
        const q = query(collection(db, APPOINTMENTS), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = [];
        snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        return list;
    } catch (error) {
        console.error("❌ Error fetching appointments:", error);
        return [];
    }
}

// ── Update Appointment Status ─────────────────────────────────
export async function updateAppointmentStatus(id, status) {
    try {
        await updateDoc(doc(db, APPOINTMENTS, id), { status });
        return { success: true };
    } catch (error) {
        console.error("❌ Error updating status:", error);
        return { success: false, error: error.message };
    }
}

export { db };
