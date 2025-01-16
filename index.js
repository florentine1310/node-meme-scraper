import fs from 'fs';
import puppeteer from 'puppeteer';

// ---- Fetch data from URL ----
const url = 'https://memegen-link-examples-upleveled.netlify.app/';

const imageParser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // ---- Parse HTML and extract img tags ----
  const allImages = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    console.log('Found images:', images.length); // Checking if images are found
    return Array.from(images)
      .slice(0, 10) // Get only first 10 images
      .map((imageFile) => {
        return imageFile.src;
      });
  });
  console.log(allImages);
  await browser.close();
};

imageParser();

// Push scraped img data into an array

// ---- Write files to memes directory ----

// Create file path
/*
const memesDirectory = './memes';
const imgFilePath = `${memesDirectory}/01.txt`;

fs.writeFile(imgFilePath, 'this is text', (err) => {
  if (err) {
    console.log('an error occurred when saving the file');
  } else {
    console.log('file was saved successfully');
  }
});
*/
