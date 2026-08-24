import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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
  const cats = await getDocs(collection(db, 'restaurants/cafe-950/categories'));
  console.log('Categories:', cats.size);
  cats.forEach(d => console.log('Cat ID:', d.id));
  
  const items = await getDocs(collection(db, 'restaurants/cafe-950/items'));
  console.log('Items:', items.size);
  let sampleCount = 0;
  items.forEach(d => {
    if (sampleCount < 5) {
      console.log('Item:', d.id, 'categoryId:', d.data().categoryId);
      sampleCount++;
    }
  });
  process.exit(0);
}
run();
