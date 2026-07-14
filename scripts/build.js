import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('Building monorepo workspaces...');
  execSync('npm run build --workspaces --if-present', { stdio: 'inherit' });

  // Default build target is syncmavens, but can be overridden via BUILD_TARGET env var
  const targetApp = process.env.BUILD_TARGET || 'syncmavens';
  const srcDir = path.resolve('apps', targetApp, 'dist');
  const destDir = path.resolve('dist');

  console.log(`Copying built files from ${srcDir} to root ${destDir} folder...`);
  
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log('✔ Copied output successfully to root dist/ folder.');
  } else {
    console.error(`❌ Source directory ${srcDir} not found!`);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Build script execution failed:', error.message);
  process.exit(1);
}
