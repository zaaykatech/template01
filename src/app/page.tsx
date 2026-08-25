import { getMenu, getTheme } from '@/lib/cmsService';
import MenuClient from './MenuClient';

export default function RootPage() {
  const menuData = getMenu();
  const theme = getTheme();

  // Transform prices to include the currency symbol like the original MenuClient did
  const sections = (menuData.categories || []).filter(cat => cat.visible !== false).map(cat => ({
    ...cat,
    title: cat.title ? cat.title.toLowerCase() : '',
    items: (cat.items || []).filter(item => item.available !== false).map(item => ({
      ...item,
      price: item.price ? `₹${item.price}` : undefined
    }))
  }));

  return (
    <main>
      <MenuClient initialSections={sections as any} initialTheme={theme} />
    </main>
  );
}
