const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { unpack } = require('./lib/asar_unpack');
const { pack } = require('./lib/asar_pack');

// Configuration
const APP_NAME = 'QClaw';
const PATCH_VERSION = '99.9.9'; // Prevent auto-update

console.log(`\x1b[36m
==================================================
   ${APP_NAME} Patcher (Unlock Full Features)
   Bypass Invite Code & Disable Auto-Update
==================================================
\x1b[0m`);

// 1. Detect OS and Paths
const platform = os.platform();
let appPath, resourcesPath;

if (platform === 'darwin') {
  appPath = `/Applications/${APP_NAME}.app`;
  resourcesPath = path.join(appPath, 'Contents/Resources');
} else if (platform === 'win32') {
  // Try common installation paths
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  appPath = path.join(localAppData, 'Programs', APP_NAME);
  resourcesPath = path.join(appPath, 'resources');
  
  // Allow overriding path via argument
  if (process.argv[2]) {
    resourcesPath = process.argv[2];
    if (resourcesPath.endsWith('app.asar')) {
      resourcesPath = path.dirname(resourcesPath);
    }
  }
} else {
  console.error('\x1b[31mUnsupported platform.\x1b[0m');
  process.exit(1);
}

const asarPath = path.join(resourcesPath, 'app.asar');
const backupPath = path.join(resourcesPath, 'app.asar.bak');
const tempDir = path.join(os.tmpdir(), 'qclaw_patch_temp');

console.log(`[*] Target Resource Path: ${resourcesPath}`);

if (!fs.existsSync(asarPath)) {
  console.error(`\x1b[31m[!] app.asar not found at ${asarPath}\x1b[0m`);
  console.error('    Please install QClaw first or provide the path as an argument.');
  process.exit(1);
}

// 2. Backup
if (!fs.existsSync(backupPath)) {
  console.log('[*] Creating backup...');
  try {
    fs.copyFileSync(asarPath, backupPath);
  } catch (e) {
    console.error(`\x1b[31m[!] Permission denied. Please run this script with sudo (Mac) or Administrator (Win).\x1b[0m`);
    process.exit(1);
  }
} else {
  console.log('[*] Backup already exists, skipping.');
}

// 3. Unpack
console.log('[*] Unpacking app.asar...');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
try {
  unpack(asarPath, tempDir);
} catch (e) {
  console.error('\x1b[31m[!] Unpack failed:\x1b[0m', e.message);
  process.exit(1);
}

// 4. Apply Patches
console.log('[*] Applying patches...');

// Patch 1: Invite Code Modal
let patchCount = 0;
function findFile(dir, pattern) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const res = findFile(fullPath, pattern);
      if (res) return res;
    } else if (pattern.test(file)) {
      return fullPath;
    }
  }
  return null;
}

const modalFile = findFile(tempDir, /InviteCodeModal-.*\.js$/);
if (modalFile) {
  let content = fs.readFileSync(modalFile, 'utf8');
  
  // Method 1: Logic Bypass
  if (content.includes('m.success&&H===0?r("verified")')) {
    content = content.replace('m.success&&H===0?r("verified")', 'true?r("verified")');
    patchCount++;
  }
  
  // Method 2: Auto-Trigger (Double Insurance)
  if (content.includes('setup(e,{emit:n}){')) {
    content = content.replace('setup(e,{emit:n}){', 'setup(e,{emit:n}){setInterval(()=>n("verified"),500);');
    patchCount++;
  }
  
  fs.writeFileSync(modalFile, content);
  console.log(`    [+] Patched InviteCodeModal (${patchCount} modifications)`);
} else {
  console.warn('    [!] Warning: InviteCodeModal file not found.');
}

// Patch 2: Disable Updates
const pkgPath = path.join(tempDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = PATCH_VERSION;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(`    [+] Patched version to ${PATCH_VERSION}`);
}

// 5. Repack
console.log('[*] Repacking app.asar...');
pack(tempDir, asarPath);

// 6. Cleanup
fs.rmSync(tempDir, { recursive: true, force: true });

// 7. Re-sign (macOS only)
if (platform === 'darwin') {
  console.log('[*] Removing quarantine and re-signing (macOS)...');
  try {
    execSync(`xattr -cr "${appPath}"`);
    execSync(`codesign --force --deep --sign - "${appPath}"`);
    console.log('    [+] Signature fixed.');
  } catch (e) {
    console.warn('    [!] Warning: Failed to re-sign. You might need to run "xattr -cr" manually.');
  }
}

console.log(`\x1b[32m
[SUCCESS] Patch complete!
Please restart QClaw.
\x1b[0m`);
