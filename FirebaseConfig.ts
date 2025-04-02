import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: "AIzaSyA9few8NfkxDo3z3N6g_UFm6Dq2K29oeKg",
	authDomain: "daily-driver-721b6.firebaseapp.com",
	projectId: "daily-driver-721b6",
	storageBucket: "daily-driver-721b6.firebasestorage.app",
	messagingSenderId: "377531555221",
	appId: "1:377531555221:web:7fad8ef86372e8badb6a9c",
	measurementId: "G-S8VP5HQ4N3"
};


// Initialize Firebase only if no apps are already initialized
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export the initialized Firebase app and auth
export const FIREBASE = app;
export const FIREBASE_AUTH = auth;
