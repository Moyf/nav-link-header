import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read manifest from dist/ to get plugin ID
const manifestPath = join(__dirname, '..', 'dist', 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const pluginId = manifest.id;

// Local plugin path
const localPluginPath = join('H:', 'Docs', 'Obsinote', '.obsidian', 'plugins', pluginId);

// Ensure target directory exists
if (!existsSync(localPluginPath)) {
    mkdirSync(localPluginPath, { recursive: true });
}

// Copy necessary files from dist/
const filesToCopy = ['main.js', 'manifest.json', 'styles.css'];

for (const file of filesToCopy) {
    const src = join(__dirname, '..', 'dist', file);
    const dest = join(localPluginPath, file);

    if (existsSync(src)) {
        copyFileSync(src, dest);
        console.log(`✓ Copied ${file} to local plugins`);
    } else if (file !== 'styles.css') {
        console.warn(`⚠ Warning: ${file} not found in dist/`);
    }
}

// Create .hotreload file if not exists
const hotreloadPath = join(localPluginPath, '.hotreload');
if (!existsSync(hotreloadPath)) {
    writeFileSync(hotreloadPath, '');
    console.log(`✓ Created .hotreload file`);
}

console.log(`\n✅ Build and copy completed for plugin: ${pluginId}`);
console.log(`📁 Target: ${localPluginPath}`);
