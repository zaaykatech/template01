const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, 'src/lib/menu.ts');
let content = fs.readFileSync(menuPath, 'utf8');

// The file exports menuSections. We can extract the array string and parse it, but it has some trailing commas or unquoted keys possibly?
// Let's look at the file. It looks like very clean JSON inside the array except for a few things, but let's just use eval or Function.
// We'll strip the `export const menuSections: MenuSection[] = ` part and `;` at the end.

const prefix = "import type { MenuSection } from '@/types';\n\nexport const menuSections: MenuSection[] = ";
const arrayStr = content.replace(prefix, '').replace(/;\s*$/, '');

let menuSections;
try {
  menuSections = eval('(' + arrayStr + ')');
} catch (e) {
  console.error("Failed to parse", e);
  process.exit(1);
}

// 1. New items
const newItems = [
  { categoryId: 'craft-coffees', item: { name: 'Honey Cinnamon Latte (Hot/Iced)', price: 270 } },
  { categoryId: 'cold-brews', item: { name: 'Cranberry Cold Brew', price: 250 } },
  { categoryId: 'craft-mocktails', item: { name: 'Green Apple Espresso Spritz', price: 260 } },
  { categoryId: 'craft-mocktails', item: { name: 'Breeze', price: 280, description: 'A tropical fusion of cranberry and pineapple with a hint of vanilla and soda, finished with a fresh pineapple slice.' } },
  { categoryId: 'craft-mocktails', item: { name: 'Daydream', price: 300, description: 'A sun-kissed blend of orange, pineapple, and passion fruit with a splash of lemon and sparkling soda, finished with a fresh orange slice.' } },
  { categoryId: 'shakes', item: { name: 'Caramel Hazelnut Shake', price: 320 } },
  { categoryId: 'pasta', item: { name: 'Caramelised Onion and Garlic Spaghetti', price: 370 } },
  { categoryId: 'calzone', item: { name: 'Corn & Jalapeño Calzone', price: 350 } },
  { categoryId: 'bites-for-sides', item: { name: 'Sourdough Four Cheese Toast', price: 340 } }
];

// Add items to specific categories
for (const entry of newItems) {
  const section = menuSections.find(s => s.id === entry.categoryId);
  if (section) {
    section.items.push(entry.item);
  } else {
    console.warn(`Category not found: ${entry.categoryId}`);
  }
}

// Create monsoon section
const monsoonSection = {
  id: 'monsoon-edit',
  title: 'Monsoon Edit',
  subtitle: 'A cozy drop of rain-inspired sips & warm bites — perfect for the monsoon.',
  items: newItems.map(entry => entry.item)
};

// Insert at the beginning or after a specific section
menuSections.unshift(monsoonSection);

// Remove Shirley temple and Pomegranate mint cooler
for (const section of menuSections) {
  section.items = section.items.filter(item => 
    item.name.toLowerCase() !== 'shirley temple' && 
    item.name.toLowerCase() !== 'pomegranate mint cooler'
  );
}

// Sort items in each category by pricing
for (const section of menuSections) {
  section.items.sort((a, b) => {
    const priceA = getMinPrice(a.price || a.prices);
    const priceB = getMinPrice(b.price || b.prices);
    return priceA - priceB;
  });
}

function getMinPrice(p) {
  if (typeof p === 'number') return p;
  if (typeof p === 'string') {
    // e.g. "150/180"
    const parts = p.split('/');
    if (parts.length > 0) return parseInt(parts[0], 10);
  }
  if (typeof p === 'object') {
    // e.g. { ny: 400, neap: 450 }
    return Math.min(...Object.values(p));
  }
  return 0;
}

const newContent = prefix + JSON.stringify(menuSections, null, 2) + ';\n';
fs.writeFileSync(menuPath, newContent);
console.log('Successfully updated menu.ts');
