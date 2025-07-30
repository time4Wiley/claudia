#!/usr/bin/env node

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateIcon() {
  try {
    console.log('Generating app icon with DALL-E 3...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Design a modern, professional app icon for "Claudia" - a GUI application and toolkit for Claude Code. The icon should embody the essence of AI assistance and coding within a visual interface, maintaining a balance between simplicity for small sizes (32x32 pixels) and detail for larger ones (512x512 pixels). Incorporate elements that symbolize AI, such as neural network patterns or digital circuits, combined with coding motifs like brackets or code snippets. The overall aesthetic should be clean and futuristic, harnessing a tech-forward color palette with shades of blue, silver, and black to convey sophistication and innovation. Ensure the design is easily recognizable and striking, with smooth gradients and subtle textures to enhance visual appeal across all sizes. The background should be suitable for an app icon with rounded corners.`,
      size: "1024x1024",
      quality: "hd",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    console.log('Icon generated successfully!');
    console.log('URL:', imageUrl);
    
    // Download the image
    console.log('Downloading image...');
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    // Save the original high-res image
    const outputPath = path.join(__dirname, 'src-tauri/icons/icon-original.png');
    await fs.writeFile(outputPath, Buffer.from(buffer));
    console.log(`Icon saved to: ${outputPath}`);
    
    console.log('\nNext steps:');
    console.log('1. Install sharp: bun add -D sharp');
    console.log('2. Create a script to resize the icon to all required sizes');
    console.log('3. Run: bun run tauri icon src-tauri/icons/icon-original.png');
    
  } catch (error) {
    console.error('Error generating icon:', error);
    process.exit(1);
  }
}

generateIcon();