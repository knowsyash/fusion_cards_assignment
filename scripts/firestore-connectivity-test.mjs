import { initializeApp } from 'firebase/app';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '',
    storageBucket:
        process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId:
        process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '',
};

function missingConfigKeys(config) {
    return Object.entries(config)
        .filter(([, value]) => !value || value.trim().length === 0)
        .map(([key]) => key);
}

async function run() {
    const missing = missingConfigKeys(firebaseConfig);

    if (missing.length > 0) {
        console.error('FIRESTORE CONNECTION TEST: FAILED');
        console.error('Missing env vars for Firebase config:');
        for (const key of missing) {
            console.error(`- ${key}`);
        }
        process.exit(1);
    }

    console.log('FIRESTORE CONNECTION TEST: START');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const probePayload = {
        amount: 0,
        category: '__connection_probe__',
        note: 'temporary probe document',
        date: new Date().toISOString(),
        createdAt: serverTimestamp(),
    };

    const created = await addDoc(collection(db, 'expenses'), probePayload);
    console.log(`WRITE: OK (docId=${created.id})`);

    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'), limit(5));
    const snapshot = await getDocs(q);
    console.log(`READ: OK (${snapshot.size} docs fetched)`);

    await deleteDoc(doc(db, 'expenses', created.id));
    console.log('CLEANUP: OK (probe document removed)');
    console.log('FIRESTORE CONNECTION TEST: PASSED');
}

run().catch((error) => {
    console.error('FIRESTORE CONNECTION TEST: FAILED');
    console.error(error?.message || error);
    process.exit(1);
});
