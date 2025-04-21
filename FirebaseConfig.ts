import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

const firebaseConfig = {
	apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY,
	authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
	projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID,
	storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
	appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID,
	measurementId: Constants.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID,
  };

// Initialize Firebase only if no apps are already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Debug the app instance
console.log('Firebase App:', app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export the initialized Firebase app and auth
export const FIREBASE = app;
export const FIREBASE_AUTH = auth;
export const FIRE_STORE = getFirestore(app);