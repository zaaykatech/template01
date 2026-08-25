const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const XLSX = require('xlsx');

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
  console.log('No bulk upload file found in menu.json. Exiting gracefully.');
  process.exit(0);
}

const fileRelPath = menuData.bulk_upload_csv.startsWith('/') 
  ? menuData.bulk_upload_csv.substring(1) 
  : menuData.bulk_upload_csv;
  
const fileAbsPath = path.join(__dirname, '..', 'public', fileRelPath);

if (!fs.existsSync(fileAbsPath)) {
  console.error(`File not found at ${fileAbsPath}`);
  process.exit(1);
}

let parsedData = [];

// Determine file type based on extension
if (fileAbsPath.toLowerCase().endsWith('.xlsx') || fileAbsPath.toLowerCase().endsWith('.xls')) {
  console.log('Processing as Excel file...');
  const workbook = XLSX.readFile(fileAbsPath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  // Parse to JSON (array of objects)
  const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  
  // Normalize headers (keys)
  parsedData = rawData.map(row => {
    const normalizedRow = {};
    for (const [key, value] of Object.entries(row)) {
      const normalKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      normalizedRow[normalKey] = value;
    }
    return normalizedRow;
  });
} else {
  console.log('Processing as CSV file...');
  const csvRaw = fs.readFileSync(fileAbsPath, 'utf8');
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
  parsedData = parsed.data;
}

// Map of category title -> category object
const categoriesMap = new Map();

parsedData.forEach((row, index) => {
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

console.log('Successfully processed uploaded file and updated menu.json');
