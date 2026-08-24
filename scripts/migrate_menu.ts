import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch, collection } from 'firebase/firestore';
import { rawMenuSections } from '../src/lib/menu';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Setup using standard client config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateData() {
  console.log('Starting migration to multi-tenant structure...');
  const RESTAURANT_ID = 'cafe-950';
  
  // 1. Create the restaurant document
  const restaurantRef = doc(db, 'restaurants', RESTAURANT_ID);
  await setDoc(restaurantRef, {
    name: 'Cafe 9:50',
    slug: 'cafe950',
    isActive: true,
    createdAt: new Date().toISOString()
  });
  console.log(`Created restaurant document: ${RESTAURANT_ID}`);

  // 2. Setup theme settings
  const themeRef = doc(db, `restaurants/${RESTAURANT_ID}/settings`, 'theme');
  await setDoc(themeRef, {
    primaryColor: '#f2e6d9',
    accentColor: '#8B4A27',
    fontFamily: 'sans'
  });
  console.log(`Created theme settings`);

  // 3. Upload Categories and Items
  let sortOrder = 0;
  for (const category of rawMenuSections) {
    // Generate a safe category ID
    const categoryId = category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Create category document
    const categoryRef = doc(db, `restaurants/${RESTAURANT_ID}/categories`, categoryId);
    await setDoc(categoryRef, {
      name: category.title,
      description: '',
      sortOrder: sortOrder++,
      isActive: true
    });
    
    console.log(`Created category: ${category.title}`);

    // Create items for this category
    const batch = writeBatch(db);
    let itemSortOrder = 0;
    
    for (const item of category.items) {
      const itemId = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const itemRef = doc(db, `restaurants/${RESTAURANT_ID}/items`, itemId);
      
      const itemData: any = {
        categoryId: categoryId,
        name: item.name,
        description: item.description || '',
        imageUrl: (item as any).imageUrl || '',
        isVeg: (item as any).isVeg !== undefined ? (item as any).isVeg : true,
        isSpicy: (item as any).isSpicy || false,
        isGlutenFree: (item as any).isGlutenFree || false,
        customTag: item.customTag || '',
        sortOrder: itemSortOrder++,
        isAvailable: true
      };

      if (item.price !== undefined) {
        itemData.price = item.price;
      }
      if (item.prices !== undefined) {
        itemData.prices = item.prices;
      }

      batch.set(itemRef, itemData);
    }
    
    await batch.commit();
    console.log(`  -> Uploaded ${category.items.length} items for ${category.title}`);
  }

  console.log('Migration completed successfully!');
  process.exit(0);
}

migrateData().catch(console.error);
