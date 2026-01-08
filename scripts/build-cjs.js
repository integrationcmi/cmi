// // scripts/build-cjs.js
// import { readdir, readFile, writeFile, unlink } from 'fs/promises';
// import { join } from 'path';

// async function convertToCJS() {
//   const distDir = join(process.cwd(), 'dist');
//   const files = await readdir(distDir);
  
//   for (const file of files) {
//     if (file.endsWith('.js')) {
//       const filePath = join(distDir, file);
//       let content = await readFile(filePath, 'utf-8');
      
//       // Convert import/export to require/module.exports
//       content = content
//         .replace(/export \{([^}]+)\}/g, 'module.exports = {$1}')
//         .replace(/export class (\w+)/g, 'class $1\nmodule.exports.$1 = $1')
//         .replace(/export const (\w+)/g, 'const $1\nmodule.exports.$1 = $1')
//         .replace(/export function (\w+)/g, 'function $1\nmodule.exports.$1 = $1')
//         .replace(/import \{([^}]+)\} from ['"]([^'"]+)['"]/g, 
//           'const {$1} = require("$2")')
//         .replace(/import (\w+) from ['"]([^'"]+)['"]/g, 
//           'const $1 = require("$2")');
      
//       // Rename to .cjs
//       const cjsPath = filePath.replace('.js', '.cjs');
//       await writeFile(cjsPath, content);
      
//       // Remove original .js file
//       await unlink(filePath);
      
//       console.log(`✓ Created ${file.replace('.js', '.cjs')}`);
//     }
//   }
// }

// convertToCJS().catch(console.error);
























// import { readdir, readFile, writeFile, unlink } from 'fs/promises';
// import { join } from 'path';

// async function convertToCJS() {
//   const distDir = join(process.cwd(), 'dist');
//   const files = await readdir(distDir);
  
//   for (const file of files) {
//     if (file.endsWith('.js')) {
//       const filePath = join(distDir, file);
//       let content = await readFile(filePath, 'utf-8');
      
//       // Convert ES modules to CommonJS
//       content = content
//         .replace(/export \{([^}]+)\}/g, 'module.exports = {$1}')
//         .replace(/export class (\w+)/g, 'class $1\nmodule.exports.$1 = $1')
//         .replace(/export const (\w+)/g, 'const $1\nmodule.exports.$1 = $1')
//         .replace(/export function (\w+)/g, 'function $1\nmodule.exports.$1 = $1')
//         // Change .js to .cjs in relative imports
//         .replace(/require\(['"](\.[^'"]+)\.js['"]\)/g, 'require("$1.cjs")')
//         .replace(/import \{([^}]+)\} from ['"]([^'"]+)\.js['"]/g, 
//           'const {$1} = require("$2.cjs")')
//         .replace(/import \{([^}]+)\} from ['"]([^'"]+)['"]/g, 
//           (match, imports, path) => {
//             if (path.startsWith('.')) {
//               return `const {${imports}} = require("${path}.cjs")`;
//             }
//             return `const {${imports}} = require("${path}")`;
//           })
//         .replace(/import (\w+) from ['"]([^'"]+)['"]/g, 
//           (match, name, path) => {
//             if (path.startsWith('.')) {
//               return `const ${name} = require("${path}.cjs")`;
//             }
//             return `const ${name} = require("${path}")`;
//           });
      
//       // Rename to .cjs
//       const cjsPath = filePath.replace('.js', '.cjs');
//       await writeFile(cjsPath, content);
      
//       // Remove original .js file
//       await unlink(filePath);
      
//       console.log(`✓ Created ${file.replace('.js', '.cjs')}`);
//     }
//   }
// }

// convertToCJS().catch(console.error);
























import { readdir, readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';

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

async function convertToCJS() {
  const distDir = join(process.cwd(), 'dist');
  const files = await getAllJsFiles(distDir);
  
  for (const filePath of files) {
    let content = await readFile(filePath, 'utf-8');
    const exports = [];
    
    // Track export class and convert
    content = content.replace(
      /export class (\w+)/g,
      (match, className) => {
        exports.push(className);
        return `class ${className}`;
      }
    );
    
    // Track export const and convert
    content = content.replace(
      /export const (\w+)/g,
      (match, constName) => {
        exports.push(constName);
        return `const ${constName}`;
      }
    );
    
    // Track export function and convert
    content = content.replace(
      /export function (\w+)/g,
      (match, funcName) => {
        exports.push(funcName);
        return `function ${funcName}`;
      }
    );
    
    // Handle export { ... }
    content = content.replace(
      /export \{\s*([^}]+)\s*\};?/g,
      (match, exportList) => {
        const items = exportList.split(',').map(e => e.trim().split(' as ')[0].trim());
        exports.push(...items);
        return ''; // Remove the export statement
      }
    );
    
    // Convert imports
    content = content.replace(
      /import \{([^}]+)\} from ['"]([^'"]+)['"]/g,
      (match, imports, path) => {
        const finalPath = path.startsWith('.') 
          ? path.endsWith('.js') ? path.replace('.js', '.cjs') : `${path}.cjs`
          : path;
        return `const {${imports}} = require("${finalPath}")`;
      }
    );
    
    content = content.replace(
      /import \* as (\w+) from ['"]([^'"]+)['"]/g,
      (match, name, path) => {
        const finalPath = path.startsWith('.') 
          ? path.endsWith('.js') ? path.replace('.js', '.cjs') : `${path}.cjs`
          : path;
        return `const ${name} = require("${finalPath}")`;
      }
    );
    
    // Handle export * from
    content = content.replace(
      /export \* from ['"](\.[^'"]+)['"]/g,
      (match, path) => {
        const finalPath = path.endsWith('.js') ? path.replace('.js', '.cjs') : `${path}.cjs`;
        return `Object.assign(module.exports, require("${finalPath}"));`;
      }
    );
    
    // Handle export { ... } from
    content = content.replace(
      /export \{([^}]+)\} from ['"](\.[^'"]+)['"]/g,
      (match, exportList, path) => {
        const finalPath = path.endsWith('.js') ? path.replace('.js', '.cjs') : `${path}.cjs`;
        const items = exportList.split(',').map(e => {
          const parts = e.trim().split(' as ');
          const name = parts[0].trim();
          const alias = parts[1] ? parts[1].trim() : name;
          return `module.exports.${alias} = require("${finalPath}").${name};`;
        });
        return items.join('\n');
      }
    );
    
    // Add module.exports for tracked exports
    if (exports.length > 0) {
      const exportStatements = exports.map(name => 
        `module.exports.${name} = ${name};`
      ).join('\n');
      content += `\n\n${exportStatements}\n`;
    }
    
    // Rename to .cjs
    const cjsPath = filePath.replace('.js', '.cjs');
    await writeFile(cjsPath, content);
    await unlink(filePath);
    
    console.log(`✓ Created ${filePath.replace(distDir, '').replace('.js', '.cjs')}`);
  }
}

convertToCJS().catch(console.error);

