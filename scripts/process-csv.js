const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const menuPath = path.join(__dirname, '../content/menu.json');

// Read menu.json
let menuData;
try {
  const raw = fs.readFileSync(menuPath, 'utf8');
  menuData = JSON.parse(raw);
} catch (e) {
  console.error('Failed to read menu.json', e);
  process.exit(1);
}

if (!menuData.bulk_upload_csv) {
  console.log('No bulk upload CSV found in menu.json. Exiting gracefully.');
  process.exit(0);
}

// The path in decap CMS is typically something like /uploads/menu.csv
// But it maps to public/uploads/menu.csv in the repo.
const csvRelPath = menuData.bulk_upload_csv.startsWith('/') 
  ? menuData.bulk_upload_csv.substring(1) 
  : menuData.bulk_upload_csv;
  
const csvAbsPath = path.join(__dirname, '..', 'public', csvRelPath);

if (!fs.existsSync(csvAbsPath)) {
  console.error(`CSV file not found at ${csvAbsPath}`);
  process.exit(1);
}

const csvRaw = fs.readFileSync(csvAbsPath, 'utf8');

const parsed = Papa.parse(csvRaw, {
  header: true,
  skipEmptyLines: true,
  transformHeader: function(h) {
    // Normalize header: trim, lowercase, remove spaces and special characters
    return h.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  }
});

if (parsed.errors.length) {
  console.error('CSV Parsing errors:', parsed.errors);
}

// Map of category title -> category object
const categoriesMap = new Map();

parsed.data.forEach((row, index) => {
  // Try to find the required columns gracefully
  const categoryTitle = row['category'] || row['categoryname'] || row['section'] || `Category ${index + 1}`;
  const itemName = row['item'] || row['itemname'] || row['name'] || row['title'] || `Item ${index + 1}`;
  const description = row['description'] || row['desc'] || row['details'] || '';
  const price = String(row['price'] || row['cost'] || row['amount'] || '');
  
  // Booleans
  const availableStr = String(row['available'] || row['instock'] || 'true').toLowerCase();
  const available = availableStr === 'true' || availableStr === 'yes' || availableStr === '1';
  
  const chefsChoiceStr = String(row['chefschoice'] || row['signature'] || row['ispopular'] || 'false').toLowerCase();
  const isSignature = chefsChoiceStr === 'true' || chefsChoiceStr === 'yes' || chefsChoiceStr === '1';

  if (!categoriesMap.has(categoryTitle)) {
    categoriesMap.set(categoryTitle, {
      id: categoryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: categoryTitle,
      visible: true,
      items: []
    });
  }

  const category = categoriesMap.get(categoryTitle);
  category.items.push({
    name: itemName,
    description,
    price,
    available,
    isSignature
  });
});

const newCategories = Array.from(categoriesMap.values());

// Update menu data
menuData.categories = newCategories;
menuData.bulk_upload_csv = ""; // clear it so it doesn't run again

// Write back to menu.json
fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2), 'utf8');

console.log('Successfully processed CSV and updated menu.json');
