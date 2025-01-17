import fs from 'node:fs';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

// Fetch data from URL
const scrapeUrl = 'https://memegen-link-examples-upleveled.netlify.app/';

const imageParser = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Disable sandboxing
  });
  const page = await browser.newPage();
  await page.goto(scrapeUrl);

  // Parse HTML and extract img tags
  try {
    const allImages = await page.evaluate(() => {
      const images = Array.from(document.getElementsByTagName('img'));
      return images.slice(0, 10).map((imageFile) => imageFile.src);
    });
    await browser.close();
    return allImages;
  } catch (err) {
    console.error(err);
  }
};
// Run the image parser
await imageParser();

// Download images and save them to memes directory
const memesDirectory = './memes';
try {
  if (!fs.existsSync(memesDirectory)) {
    fs.mkdirSync(memesDirectory);
  }
} catch (err) {
  console.error(err);
}
const downloadImages = async () => {
  try {
    const imageUrls = await imageParser();
    // Loop through the image URL array
    for (const [index, url] of imageUrls.entries()) {
      try {
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        const imgFilePath = `${memesDirectory}/${(index + 1).toString().padStart(2, '0')}.jpg`;
        await fs.promises.writeFile(imgFilePath, buffer);
        console.log('file was saved successfully');
      } catch (err) {
        console.error(`Failed to save image: ${url}.${err.message}`);
      }
    }
  } catch (err) {
    console.error(
      `an error occurred when processing the images:${err.message}`,
    );
  }
};
await downloadImages();
