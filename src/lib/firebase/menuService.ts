import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  setDoc,
  getDocs,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price?: number;
  prices?: { ny: number; neap: number };
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
  isMostOrdered?: boolean;
  isSignature?: boolean;
  isMonsoon?: boolean;
  customTag?: string | null;
  imageUrl?: string | null;
}

import { ThemeConfig, DeepPartial } from '../themes/themeTypes';

export interface RestaurantSettings {
  activeThemeId?: string;
  customTheme?: DeepPartial<ThemeConfig>;
  // Legacy fields below:
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  instagramUrl?: string;
  reviewUrl?: string;
  heroVideoUrl?: string;
  mobileNumber?: string;
  address?: string;
  logoUrl?: string;
}

export const getRestaurantIdBySlug = async (slug: string): Promise<string | null> => {
  const q = query(collection(db, 'restaurants'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].id;
};

export const updateSettings = async (restaurantId: string, settings: Partial<RestaurantSettings>) => {
  const ref = doc(db, 'restaurants', restaurantId, 'settings', 'theme');
  await setDoc(ref, settings, { merge: true });
};

export const updateTheme = updateSettings; // alias for backwards compatibility

// Subscriptions
export const subscribeToCategories = (restaurantId: string, callback: (categories: Category[]) => void) => {
  const q = query(
    collection(db, `restaurants/${restaurantId}/categories`), 
    orderBy('sortOrder')
  );
  
  return onSnapshot(q, (snapshot: any) => {
    const categories: Category[] = [];
    snapshot.forEach((doc: any) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });
    callback(categories);
  }, (error) => {
    console.error("Categories fetch error:", error);
  });
};

export const subscribeToMenuItems = (restaurantId: string, callback: (items: MenuItem[]) => void) => {
  const q = query(
    collection(db, `restaurants/${restaurantId}/items`),
    orderBy('sortOrder')
  );
  
  return onSnapshot(q, (snapshot: any) => {
    const items: MenuItem[] = [];
    snapshot.forEach((doc: any) => {
      items.push({ id: doc.id, ...doc.data() } as MenuItem);
    });
    callback(items);
  }, (error) => {
    console.error("Items fetch error:", error);
  });
};

export const subscribeToTheme = (restaurantId: string, callback: (settings: RestaurantSettings) => void) => {
  const ref = doc(db, `restaurants/${restaurantId}/settings/theme`);
  return onSnapshot(ref, (docSnap: any) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as RestaurantSettings);
    }
  });
};

// Mutations for Categories
export const addCategory = async (restaurantId: string, data: Omit<Category, 'id'>) => {
  const ref = doc(collection(db, `restaurants/${restaurantId}/categories`));
  await setDoc(ref, data);
  return ref.id;
};

export const updateCategory = async (restaurantId: string, id: string, data: Partial<Category>) => {
  const ref = doc(db, `restaurants/${restaurantId}/categories`, id);
  await updateDoc(ref, data);
};

export const deleteCategory = async (restaurantId: string, id: string) => {
  // Check if items exist before deleting
  const itemsQ = query(collection(db, `restaurants/${restaurantId}/items`));
  const snapshot = await getDocs(itemsQ);
  const itemsInCategory = snapshot.docs.filter((doc: any) => doc.data().categoryId === id);
  
  if (itemsInCategory.length > 0) {
    throw new Error('Cannot delete category with assigned items.');
  }

  const ref = doc(db, `restaurants/${restaurantId}/categories`, id);
  await deleteDoc(ref);
};

// Mutations for Menu Items
export const addMenuItem = async (restaurantId: string, data: Omit<MenuItem, 'id'>) => {
  const ref = doc(collection(db, `restaurants/${restaurantId}/items`));
  await setDoc(ref, data);
  return ref.id;
};

export const updateMenuItem = async (restaurantId: string, id: string, data: Partial<MenuItem>) => {
  const ref = doc(db, `restaurants/${restaurantId}/items`, id);
  await updateDoc(ref, data);
};

export const deleteMenuItem = async (restaurantId: string, id: string) => {
  const ref = doc(db, `restaurants/${restaurantId}/items`, id);
  await deleteDoc(ref);
};

/**
 * Saves all local category/item state to Firestore in batched writes.
 * Handles upserts for all categories and items, then deletes removed ones.
 */
export const batchUpdateMenu = async (
  restaurantId: string,
  categories: any[],
  items: any[],
  deletedCategoryIds: string[],
  deletedItemIds: string[]
) => {
  const batch = writeBatch(db);

  // Upsert all categories — use the sortOrder already set by drag handlers, not flat index
  categories.forEach((cat) => {
    const { id, ...data } = cat;
    const isTemp = id.startsWith('temp_');
    const ref = isTemp
      ? doc(collection(db, `restaurants/${restaurantId}/categories`))
      : doc(db, `restaurants/${restaurantId}/categories`, id);
    batch.set(ref, data, { merge: true });
  });

  // Upsert all items — use the per-category sortOrder already set by drag handlers, not flat index
  items.forEach((item) => {
    const { id, ...data } = item;
    const isTemp = id.startsWith('temp_');
    const ref = isTemp
      ? doc(collection(db, `restaurants/${restaurantId}/items`))
      : doc(db, `restaurants/${restaurantId}/items`, id);
    batch.set(ref, data, { merge: true });
  });

  // Delete removed categories
  deletedCategoryIds.forEach(catId => {
    if (!catId.startsWith('temp_')) {
      batch.delete(doc(db, `restaurants/${restaurantId}/categories`, catId));
    }
  });

  // Delete removed items
  deletedItemIds.forEach(itemId => {
    if (!itemId.startsWith('temp_')) {
      batch.delete(doc(db, `restaurants/${restaurantId}/items`, itemId));
    }
  });

  await batch.commit();
};
