import * as admin from 'firebase-admin';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { menuSections } from '../src/lib/menu';

// Load .env.local if present
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// To run this script, you need a service account key from the Firebase Console.
// Save it as serviceAccountKey.json in the project root.
const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
let serviceAccount;

try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error("Error: Please download your Firebase service account key and save it as 'serviceAccountKey.json' in the project root.");
  console.error("You can get it from Project Settings > Service Accounts in the Firebase Console.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const RESTAURANT_ID = 'cafe-950';

async function migrateData() {
  console.log(`Starting migration for restaurant: ${RESTAURANT_ID}`);
  
  const categoriesRef = db.collection(`restaurants/${RESTAURANT_ID}/categories`);
  const itemsRef = db.collection(`restaurants/${RESTAURANT_ID}/items`);

  let categorySortOrder = 0;

  for (const section of menuSections) {
    console.log(`Migrating category: ${section.title}`);
    
    // Create category document
    const categoryDoc = {
      name: section.title,
      description: section.subtitle || null,
      sortOrder: categorySortOrder,
      isActive: true, // by default active
    };

    // We can use the section id as the document id
    const categoryId = section.id;
    await categoriesRef.doc(categoryId).set(categoryDoc);
    
    let itemSortOrder = 0;

    for (const item of section.items) {
      console.log(`  Migrating item: ${item.name}`);
      
      const itemDoc = {
        name: item.name,
        description: item.description || null,
        price: typeof item.price === 'number' ? item.price : parseFloat(item.price.toString().split('/')[0]) || 0,
        categoryId: categoryId,
        sortOrder: itemSortOrder,
        isActive: true,
        // Optional tags
        isMostOrdered: item.isMostOrdered || false,
        isSignature: item.isSignature || false,
        isMonsoon: item.isMonsoon || false,
        customTag: item.customTag || null,
        imageUrl: null, // to be updated via admin panel if needed
      };

      // Generate a unique ID for the item
      const itemSlug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const itemId = `${categoryId}-${itemSlug}`;

      await itemsRef.doc(itemId).set(itemDoc);
      itemSortOrder++;
    }

    categorySortOrder++;
  }

  console.log("Migration completed successfully!");
}

migrateData().catch(console.error).finally(() => process.exit(0));
