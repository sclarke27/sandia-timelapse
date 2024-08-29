import fetch from 'node-fetch'; // Import the fetch function from node-fetch
import { promises as fs } from 'fs'; // Use promises API for modern async file handling
import path from 'path'; // Import path module for file path operations
import crypto from 'crypto'; // Import crypto module to create hashes

// URLs of the images to fetch
const imageUrls = [
    { url: 'https://webcams.sandiapeak.com/images/cams/tram-cam.jpg', dir: 'tram-cam' }, // Replace with the actual URL and directory
    { url: 'https://webcams.sandiapeak.com/images/cams/ski-cam.jpg', dir: 'ski-cam' }, // Replace with the actual URL and directory
];

// Store the last image hashes for each URL
const lastImageHashes = new Map(); // Use a Map for better key-value handling

// Ensure directories exist
await Promise.all(
    imageUrls.map(async ({ dir }) => {
        try {
            await fs.mkdir(dir, { recursive: true }); // Creates the directory if it doesn't exist
        } catch (err) {
            console.error(`Failed to create directory ${dir}:`, err);
        }
    })
);

// Function to generate a hash from the image buffer
const generateHash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

// Function to fetch and save an image
const fetchAndSaveImage = async (url, dir) => {
    try {
        const response = await fetch(url); // Fetch the image from the URL

        if (!response.ok) {
            throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
        }

        const buffer = await response.buffer(); // Get the image buffer from the response
        const currentImageHash = generateHash(buffer); // Generate a hash of the fetched image

        // Check for duplicates using Map
        if (lastImageHashes.get(url) === currentImageHash) {
            console.log(`Duplicate image detected for ${url}; not saving.`);
            return;
        }

        lastImageHashes.set(url, currentImageHash); // Update the hash map for the current URL

        // Generate a unique filename based on the current timestamp
        const filename = `image_${Date.now()}.jpg`;
        const filepath = path.join(dir, filename);

        // Write the image buffer to disk
        await fs.writeFile(filepath, buffer);
        console.log(`Image saved as ${filename} in directory ${dir}`);
    } catch (error) {
        console.error(`Error fetching the image from ${url}: ${error.message}`);
    }
};

// Function to fetch images from all URLs
const fetchImages = async () => {
    await Promise.all(
        imageUrls.map(({ url, dir }) => fetchAndSaveImage(url, dir))
    ).catch((error) => console.error(`Error in fetching images: ${error.message}`));
};

// Fetch and save the images every 15 seconds
setInterval(fetchImages, 20000);

// Initial call to start the process immediately
await fetchImages();
