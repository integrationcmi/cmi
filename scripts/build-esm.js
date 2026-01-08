// // scripts/build-esm.js
// import { readdir, readFile, writeFile } from 'fs/promises';
// import { join } from 'path';

// async function convertToESM() {
//   const distDir = join(process.cwd(), 'dist');
//   const files = await readdir(distDir);
  
//   for (const file of files) {
//     if (file.endsWith('.js')) {
//       const filePath = join(distDir, file);
//       let content = await readFile(filePath, 'utf-8');
      
//       // Add .js extensions to imports
//       content = content.replace(
//         /from ['"](\.[^'"]+)['"]/g,
//         (match, path) => {
//           if (path.endsWith('.js')) return match;
//           return `from '${path}.js'`;
//         }
//       );
      
//       // Rename to .mjs
//       const mjsPath = filePath.replace('.js', '.mjs');
//       await writeFile(mjsPath, content);
      
//       console.log(`✓ Created ${file.replace('.js', '.mjs')}`);
//     }
//   }
// }

// convertToESM().catch(console.error);


















// import { readdir, readFile, writeFile } from 'fs/promises';
// import { join } from 'path';

// async function convertToESM() {
//   const distDir = join(process.cwd(), 'dist');
//   const files = await readdir(distDir);
  
//   for (const file of files) {
//     if (file.endsWith('.js')) {
//       const filePath = join(distDir, file);
//       let content = await readFile(filePath, 'utf-8');
      
//       // Change .js extensions to .mjs in imports
//       content = content.replace(
//         /from ['"](\.[^'"]+)\.js['"]/g,
//         (match, path) => `from '${path}.mjs'`
//       );
      
//       // Add .mjs to imports without extensions
//       content = content.replace(
//         /from ['"](\.[^'"]+)(?<!\.mjs)['"]/g,
//         (match, path) => {
//           if (path.includes('.')) return match;
//           return `from '${path}.mjs'`;
//         }
//       );
      
//       // Rename to .mjs
//       const mjsPath = filePath.replace('.js', '.mjs');
//       await writeFile(mjsPath, content);
      
//       console.log(`✓ Created ${file.replace('.js', '.mjs')}`);
//     }
//   }
// }

// convertToESM().catch(console.error);




















import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, dirname } from 'path';

async function getAllJsFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllJsFiles(fullPath));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function convertToESM() {
  const distDir = join(process.cwd(), 'dist');
  const files = await getAllJsFiles(distDir);
  
  for (const filePath of files) {
    let content = await readFile(filePath, 'utf-8');
    
    // Fix imports: add .mjs to relative imports
    content = content.replace(
      /from ['"](\.[^'"]+)['"]/g,
      (match, path) => {
        // If already has .mjs or .js extension, replace with .mjs
        if (path.endsWith('.js')) {
          return `from '${path.replace('.js', '.mjs')}'`;
        }
        if (path.endsWith('.mjs')) {
          return match;
        }
        // If no extension, add .mjs (handles directory imports)
        return `from '${path}.mjs'`;
      }
    );
    
    // Also handle export from statements
    content = content.replace(
      /export \{([^}]+)\} from ['"](\.[^'"]+)['"]/g,
      (match, exports, path) => {
        if (path.endsWith('.js')) {
          return `export {${exports}} from '${path.replace('.js', '.mjs')}'`;
        }
        if (path.endsWith('.mjs')) {
          return match;
        }
        return `export {${exports}} from '${path}.mjs'`;
      }
    );
    
    content = content.replace(
      /export \* from ['"](\.[^'"]+)['"]/g,
      (match, path) => {
        if (path.endsWith('.js')) {
          return `export * from '${path.replace('.js', '.mjs')}'`;
        }
        if (path.endsWith('.mjs')) {
          return match;
        }
        return `export * from '${path}.mjs'`;
      }
    );
    
    // Rename to .mjs
    const mjsPath = filePath.replace('.js', '.mjs');
    await writeFile(mjsPath, content);
    
    console.log(`✓ Created ${filePath.replace(distDir, '').replace('.js', '.mjs')}`);
  }
}

convertToESM().catch(console.error);
