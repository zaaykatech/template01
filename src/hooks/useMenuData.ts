import { useState, useEffect } from 'react';
import { Category, MenuItem, subscribeToCategories, subscribeToMenuItems } from '@/lib/firebase/menuService';

export function useMenuData(restaurantId: string | undefined) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Categories unblock the UI — show them as soon as they arrive
    const unsubscribeCategories = subscribeToCategories(restaurantId, (newCategories) => {
      setCategories(newCategories);
      setLoading(false); // categories are enough to render the list
    });

    // Items stream in independently — no blocking
    const unsubscribeItems = subscribeToMenuItems(restaurantId, (newItems) => {
      setItems(newItems);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeItems();
    };
  }, [restaurantId]);

  return { categories, items, loading };
}
