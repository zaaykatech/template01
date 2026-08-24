const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:9002/menu/cafe950');
  await new Promise(r => setTimeout(r, 3000));
  
  // Wait for elements to be revealed
  await page.evaluate(() => {
    window.scrollBy(0, 1000);
  });
  await new Promise(r => setTimeout(r, 1000));

  const itemsCount = await page.$$eval('.reveal.active', nodes => nodes.length);
  console.log('Active reveal elements:', itemsCount);

  await browser.close();
})();
