// Renders guide.html → Build-10k-Websites-With-Claude-Code.pdf via headless Chrome.
import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath  = path.join(__dirname, 'guide.html');
const pdfPath   = path.join(__dirname, 'Build-10k-Websites-With-Claude-Code.pdf');

const browser = await puppeteer.launch({ headless: 'new' });
const page    = await browser.newPage();

// Load the HTML from disk and wait for web fonts (Inter, JetBrains Mono) to load
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' });
await page.evaluateHandle('document.fonts.ready');

await page.pdf({
  path: pdfPath,
  format: 'Letter',
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});

await browser.close();
console.log(`Wrote ${pdfPath}`);
