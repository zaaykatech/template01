import { initializeApp } from 'firebase/app';
import { getFirestore, query, collection, getDocs, where } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const db = getFirestore(initializeApp(firebaseConfig));
async function run() {
  const q = query(collection(db, 'restaurants'), where('slug', '==', 'cafe950'));
  const docs = await getDocs(q);
  console.log('Docs found:', docs.size);
  docs.forEach(d => console.log(d.id, d.data()));
  process.exit(0);
}
run();
