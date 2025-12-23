// ===== Configuration Template =====
// Copy this file to firebase-config.js and fill in your Firebase credentials

/**
 * Firebase Configuration Template
 * 
 * To get your credentials:
 * 1. Go to Firebase Console: https://console.firebase.google.com
 * 2. Create a new project or select existing one
 * 3. Click on "Add App" and select Web
 * 4. Copy the configuration object
 * 5. Replace the placeholder values below
 */

const FIREBASE_CONFIG_TEMPLATE = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef1234567890abcdef"
};

/**
 * Example for MyProject:
 * 
 * const firebaseConfig = {
 *     apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
 *     authDomain: "myproject-12345.firebaseapp.com",
 *     projectId: "myproject-12345",
 *     storageBucket: "myproject-12345.appspot.com",
 *     messagingSenderId: "1234567890",
 *     appId: "1:1234567890:web:abcdef1234567890abcdef"
 * };
 */

// ===== Firestore Collection Setup =====
/**
 * Create these collections in Firebase Firestore:
 * 
 * 1. users
 *    - For storing user profiles
 *    - Fields: uid, email, name, role, status, createdAt
 * 
 * 2. teachers
 *    - For teacher profiles and information
 *    - Fields: id, name, email, department, subject, bio, approvalStatus, createdAt
 * 
 * 3. students
 *    - For student profiles
 *    - Fields: id, name, email, status, enrollmentDate, createdAt
 * 
 * 4. appointments
 *    - For appointment records
 *    - Fields: id, studentId, teacherId, date, time, reason, status, createdAt, updatedAt
 * 
 * 5. scheduleSlots
 *    - For teacher availability slots
 *    - Fields: id, teacherId, date, time, duration, available, createdAt
 * 
 * 6. messages
 *    - For communication between users
 *    - Fields: id, senderId, receiverId, message, timestamp, read
 */

// ===== Firebase Security Rules Template =====
/**
 * Apply these security rules in Firestore:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Users can only read/write their own profile
 *     match /users/{userId} {
 *       allow read, write: if request.auth.uid == userId;
 *     }
 *     
 *     // Teachers data - readable by all, writable by owner or admin
 *     match /teachers/{document=**} {
 *       allow read: if request.auth != null;
 *       allow write: if request.auth.uid == resource.data.uid;
 *     }
 *     
 *     // Appointments - readable by involved parties
 *     match /appointments/{document=**} {
 *       allow read, write: if request.auth != null;
 *     }
 *     
 *     // Schedule slots - readable by all authenticated users
 *     match /scheduleSlots/{document=**} {
 *       allow read: if request.auth != null;
 *       allow write: if request.auth.uid == resource.data.teacherId;
 *     }
 *     
 *     // Messages - readable by sender and receiver
 *     match /messages/{document=**} {
 *       allow read: if request.auth.uid in [resource.data.senderId, resource.data.receiverId];
 *       allow write: if request.auth.uid == request.resource.data.senderId;
 *     }
 *   }
 * }
 */

// ===== Environment Variables =====
/**
 * Consider using environment variables for sensitive data:
 * 
 * Development (.env.local):
 * REACT_APP_FIREBASE_API_KEY=your_api_key
 * REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
 * REACT_APP_FIREBASE_PROJECT_ID=your_project_id
 * 
 * Never commit API keys to version control!
 */

// ===== Firebase Authentication Setup =====
/**
 * Enable these authentication methods in Firebase Console:
 * 
 * 1. Email/Password Authentication
 *    - Settings → Authentication → Sign-in method
 *    - Enable "Email/Password"
 * 
 * 2. User Creation
 *    - Allow users to sign up (or only admins)
 *    - Set password requirements (minimum length, complexity)
 * 
 * 3. Session Management
 *    - Configure session duration
 *    - Set cookie settings for production
 */

// ===== API Integration Points =====
/**
 * The application uses these Firebase services:
 * 
 * 1. Authentication (Firebase Auth)
 *    - createUserWithEmailAndPassword(email, password)
 *    - signInWithEmailAndPassword(email, password)
 *    - signOut()
 *    - onAuthStateChanged(callback)
 * 
 * 2. Database (Firestore)
 *    - addDoc(collection, data)
 *    - getDocs(query)
 *    - updateDoc(docRef, updates)
 *    - deleteDoc(docRef)
 *    - query(collection, where(), orderBy())
 * 
 * 3. Real-time Listeners
 *    - onSnapshot(query, callback)
 */

// ===== Testing Credentials =====
/**
 * For testing purposes, use these demo accounts:
 * 
 * Admin:
 * Email: admin@test.com
 * Password: AdminTest123
 * Role: admin
 * 
 * Teacher:
 * Email: teacher@test.com
 * Password: TeacherTest123
 * Role: teacher
 * 
 * Student:
 * Email: student@test.com
 * Password: StudentTest123
 * Role: student
 * 
 * Note: These are examples. Create actual test users in Firebase.
 */

// ===== Deployment Checklist =====
/**
 * Before deploying to production:
 * 
 * [ ] Replace all placeholder values in firebase-config.js
 * [ ] Review and apply appropriate Firestore security rules
 * [ ] Enable Production Mode in Firestore
 * [ ] Set up backup policy
 * [ ] Configure Firestore indexes (if needed)
 * [ ] Test all authentication flows
 * [ ] Review CORS settings
 * [ ] Set environment variables
 * [ ] Enable encryption
 * [ ] Set up monitoring and alerts
 * [ ] Create backup procedures
 * [ ] Document API keys and credentials
 * [ ] Plan for scale and load testing
 * [ ] Set up error logging
 * [ ] Configure email verification
 * [ ] Set password reset flow
 */

// ===== Common Issues & Solutions =====
/**
 * 
 * Issue: "Firebase is not defined"
 * Solution: Ensure firebase-config.js is loaded before other scripts
 * 
 * Issue: "Permission denied" errors
 * Solution: Check and update Firestore security rules
 * 
 * Issue: "CORS errors"
 * Solution: Configure allowed origins in Firebase Console
 * 
 * Issue: "Quota exceeded"
 * Solution: Upgrade Firebase plan or optimize queries
 * 
 * Issue: "Email already exists"
 * Solution: Use different email or reset user from Firebase Console
 * 
 * Issue: "Authentication state not persisting"
 * Solution: Check browser cookies/localStorage settings
 * 
 */

// ===== Useful Firebase CLI Commands =====
/**
 * 
 * Install Firebase CLI:
 * npm install -g firebase-tools
 * 
 * Initialize project:
 * firebase init
 * 
 * Deploy to Firebase Hosting:
 * firebase deploy
 * 
 * View logs:
 * firebase functions:log
 * 
 * Emulate locally:
 * firebase emulators:start
 * 
 * Backup data:
 * gcloud firestore export gs://bucket-name/backup
 * 
 */

console.log('Firebase configuration template loaded. Update with your credentials.');
