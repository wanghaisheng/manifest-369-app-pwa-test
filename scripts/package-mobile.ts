/**
 * Script to package the Next.js app into iOS and Android apps using Capacitor */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const APP_NAME = '369 Manifestation';
const APP_ID = 'com.heytcm.manifestation369';
const NEXT_BUILD_DIR = 'out'; // Next.js static export directory
const CAPACITOR_CONFIG_PATH = 'capacitor.config.ts';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Execute a command and log the output
 */
function execute(command, errorMessage) {
  try {
    console.log(`${colors.blue}Executing: ${command}${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`${colors.red}${errorMessage}${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

/**
 * Create Capacitor config file if it doesn't exist
 */
function createCapacitorConfig() {
  if (!fs.existsSync(CAPACITOR_CONFIG_PATH)) {
    console.log(`${colors.yellow}Creating Capacitor config file...${colors.reset}`);
    
    const configContent = `
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '${APP_ID}',
  appName: '${APP_NAME}',
  webDir: '${NEXT_BUILD_DIR}',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: 'manifestation369',
      androidIsEncryption: false,
    }
  }
};

export default config;
`;
    
    fs.writeFileSync(CAPACITOR_CONFIG_PATH, configContent);
    console.log(`${colors.green}Capacitor config created successfully${colors.reset}`);
  }
}

/**
 * Install required dependencies
 */
function installDependencies() {
  console.log(`${colors.yellow}Installing Capacitor dependencies...${colors.reset}`);
  
  const dependencies = [
    '@capacitor/core',
    '@capacitor/cli',
    '@capacitor/android',
    '@capacitor/ios',
    '@capacitor/splash-screen',
    '@capacitor-community/sqlite'
  ];
  
  execute(`npm install ${dependencies.join(' ')}`, 'Failed to install dependencies');
  console.log(`${colors.green}Dependencies installed successfully${colors.reset}`);
}

/**
 * Build the Next.js app for static export
 */
function buildNextApp() {
  console.log(`${colors.yellow}Building Next.js app for static export...${colors.reset}`);
  execute('npm run build', 'Failed to build Next.js app');
  console.log(`${colors.green}Next.js build completed successfully${colors.reset}`);
}

/**
 * Initialize Capacitor if not already initialized
 */
function initializeCapacitor() {
  if (!fs.existsSync('android') && !fs.existsSync('ios')) {
    console.log(`${colors.yellow}Initializing Capacitor...${colors.reset}`);
    execute('npx cap init', 'Failed to initialize Capacitor');
    console.log(`${colors.green}Capacitor initialized successfully${colors.reset}`);
  }
}

/**
 * Add platforms (Android and iOS)
 */
function addPlatforms() {
  console.log(`${colors.yellow}Adding Android platform...${colors.reset}`);
  if (!fs.existsSync('android')) {
    execute('npx cap add android', 'Failed to add Android platform');
  } else {
    console.log(`${colors.green}Android platform already exists${colors.reset}`);
  }
  
  console.log(`${colors.yellow}Adding iOS platform...${colors.reset}`);
  if (!fs.existsSync('ios')) {
    execute('npx cap add ios', 'Failed to add iOS platform');
  } else {
    console.log(`${colors.green}iOS platform already exists${colors.reset}`);
  }
}

/**
 * Copy web assets to native platforms
 */
function copyWebAssets() {
  console.log(`${colors.yellow}Copying web assets to native platforms...${colors.reset}`);
  execute('npx cap copy', 'Failed to copy web assets');
  console.log(`${colors.green}Web assets copied successfully${colors.reset}`);
}

/**
 * Open native IDEs
 */
function openNativeIDE(platform) {
  console.log(`${colors.yellow}Opening ${platform} IDE...${colors.reset}`);
  execute(`npx cap open ${platform}`, `Failed to open ${platform} IDE`);
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.green}Starting packaging process for 369 Manifestation App${colors.reset}`);
  
  // 添加 GitHub Actions 提示
  console.log(`${colors.cyan}提示: 你也可以通过 GitHub Actions 自动构建和发布应用。${colors.reset}`);
  console.log(`${colors.cyan}访问 GitHub 仓库的 Actions 标签页，选择 "构建并发布应用" 工作流，然后点击 "Run workflow" 按钮。${colors.reset}`);
  console.log();
  
  // Check if we're packaging for a specific platform
  const args = process.argv.slice(2);
  const targetPlatform = args[0];
  
  // Install dependencies
  installDependencies();
  
  // Create Capacitor config
  createCapacitorConfig();
  
  // Build Next.js app
  buildNextApp();
  
  // Initialize Capacitor
  initializeCapacitor();
  
  // Add platforms
  addPlatforms();
  
  // Copy web assets
  copyWebAssets();
  
  // Open native IDE based on target platform
  if (targetPlatform === 'android') {
    openNativeIDE('android');
  } else if (targetPlatform === 'ios') {
    openNativeIDE('ios');
  } else {
    console.log(`${colors.yellow}No specific platform specified. To open native IDEs, run:${colors.reset}`);
    console.log(`${colors.blue}npm run package:android${colors.reset} - To open Android Studio`);
    console.log(`${colors.blue}npm run package:ios${colors.reset} - To open Xcode`);
  }
  
  console.log(`${colors.green}Packaging process completed successfully!${colors.reset}`);
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Error during packaging:${colors.reset}`, error);
  process.exit(1);
});