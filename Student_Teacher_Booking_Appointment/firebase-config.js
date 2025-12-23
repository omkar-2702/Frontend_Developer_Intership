// ===== Firebase Configuration =====
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firestore collections
export const initializeFirestoreCollections = async () => {
    try {
        logger.info("Firebase services initialized successfully");
    } catch (error) {
        logger.error("Error initializing Firebase services:", error);
    }
};

// Firebase collection names
export const COLLECTIONS = {
    USERS: 'users',
    TEACHERS: 'teachers',
    STUDENTS: 'students',
    APPOINTMENTS: 'appointments',
    SCHEDULE_SLOTS: 'scheduleSlots',
    MESSAGES: 'messages'
};

// User roles enum
export const USER_ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
};

// Appointment status enum
export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
};

// Student approval status enum
export const STUDENT_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

logger.info("Firebase configuration loaded");
