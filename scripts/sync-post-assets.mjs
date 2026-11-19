import fs from 'node:fs/promises';
import path from 'node:path';

const sourceDir = path.join(process.cwd(), 'blog', 'posts');
const destinationDir = path.join(process.cwd(), 'public', 'posts');

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  // Dotfiles such as .DS_Store aren't post assets.
  const assets = entries.filter((entry) => !entry.name.startsWith('.'));

  await Promise.all(
    assets.map(async (entry) => {
      const sourcePath = path.join(source, entry.name);
      const destinationPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(sourcePath, destinationPath);
        return;
      }

      await fs.copyFile(sourcePath, destinationPath);
    })
  );
}

await copyDirectory(sourceDir, destinationDir);
console.log('Synced blog post assets to public/posts');
