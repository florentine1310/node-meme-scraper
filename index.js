import fs from 'fs';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

// Fetch data from URL
const url = 'https://memegen-link-examples-upleveled.netlify.app/';

const imageParser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Parse HTML and extract img tags
  const allImages = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    console.log('Found images:', images.length); // Checking if images are found
    return Array.from(images) // Push scraped img data into an array
      .slice(0, 10) // Get only first 10 images
      .map((imageFile) => {
        return imageFile.src;
      });
  });
  await browser.close();
  return allImages; // Return the array of images
};
// Run the image parser
imageParser();

// Download images and save them to memes directory
const memesDirectory = './memes';
const downloadImages = async () => {
  try {
    const imageUrls = await imageParser(); // Wait for imageParser to complete
    // Loop through the image URL array
    for (const [index, url] of imageUrls.entries()) {
      try {
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        // Save each image to file
        const imgFilePath = `${memesDirectory}/${(index + 1).toString().padStart(2, '0')}.jpg`;
        await fs.promises.writeFile(imgFilePath, buffer);
        console.log('file was saved successfully');
      } catch (error) {
        console.error(`Failed to save image ${url}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`an error occurred when processing the images`);
  }
};
// Run the download image function
downloadImages();
