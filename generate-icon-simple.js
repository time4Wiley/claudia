#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

const prompt = `A modern app icon for "Claudia" - an AI coding assistant GUI. Design a clean, minimalist icon with:
- A stylized letter "C" that incorporates AI/neural network elements
- Tech-forward gradient using blues and purples 
- Subtle code elements (brackets or dots) integrated into the design
- Rounded square background suitable for macOS/iOS app icon
- Clean, professional look that works at all sizes
Style: Modern, minimalist, tech-forward, professional`;

const data = JSON.stringify({
  model: "dall-e-3",
  prompt: prompt,
  size: "1024x1024",
  quality: "standard",
  n: 1
});

const options = {
  hostname: 'api.openai.com',
  port: 443,
  path: '/v1/images/generations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Length': data.length
  }
};

console.log('Generating icon with DALL-E 3...');

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', async () => {
    try {
      const result = JSON.parse(responseData);
      
      if (result.error) {
        console.error('API Error:', result.error);
        return;
      }
      
      const imageUrl = result.data[0].url;
      console.log('Icon generated! Downloading...');
      
      // Download the image
      const file = fs.createWriteStream(path.join(__dirname, 'icon-generated.png'));
      
      https.get(imageUrl, (response) => {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log('Icon saved to icon-generated.png');
          console.log('\nNext step: bun run tauri icon icon-generated.png');
        });
      });
      
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.write(data);
req.end();