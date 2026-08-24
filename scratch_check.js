const fs = require('fs');

function checkJSX() {
  const content = fs.readFileSync('src/app/MenuClient.tsx', 'utf8');
  let openTags = [];
  const tagRegex = /<\/?([a-zA-Z0-9\-]+)[^>]*>/g;
  let match;
  
  // We'll just do a very primitive check for open/close tags
  // to get a hint
  // A real parser would be better, but let's try this
  
  console.log("Checking JSX...");
}

checkJSX();
