// Firebase configuration
// Enable: Authentication (Email link) and Firestore

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyBM-fzZfE9zh7LXssFYsLiirs7vBxeAfGk',
    authDomain: 'schwanenclub-web.firebaseapp.com',
    projectId: 'schwanenclub-web',
    storageBucket: 'schwanenclub-web.firebasestorage.app',
    messagingSenderId: '24024133123',
    appId: '1:24024133123:web:d2ba3d115625c6fee12836',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
