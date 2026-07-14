import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('Building monorepo workspaces...');
  execSync('npm run build --workspaces --if-present', { stdio: 'inherit' });

  // Detect targetApp based on BUILD_TARGET, RENDER_SERVICE_NAME, or default to syncmavens
  let targetApp = process.env.BUILD_TARGET;
  
  if (!targetApp && process.env.RENDER_SERVICE_NAME) {
    const serviceName = process.env.RENDER_SERVICE_NAME.toLowerCase();
    if (serviceName.includes('syncmavens')) {
      targetApp = 'syncmavens';
    } else if (serviceName.includes('tunestream')) {
      targetApp = 'tunestream';
    } else if (serviceName.includes('portal') || serviceName.includes('tunemavens')) {
      targetApp = 'portal';
    }
  }
  
  if (!targetApp) {
    targetApp = 'syncmavens'; // Fallback
  }

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
