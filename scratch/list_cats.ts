import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp();
const db = getFirestore();

async function list() {
  const cats = await db.collection('restaurants').doc('cafe-950').collection('categories').get();
  cats.forEach(c => console.log(c.id, c.data().name));
}
list();
