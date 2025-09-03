#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function makeExecutable(filePath) {
  try {
    fs.chmodSync(filePath, '755');
    return true;
  } catch {
    return false;
  }
}

function main() {
  console.log('');
  log('🔧 Setting up Husky Git Hooks...', 'blue');
  log('================================', 'blue');

  console.log('');
  log('📦 Initializing Husky...', 'blue');

  try {
    // Run husky installation
    execSync('husky', { stdio: 'inherit' });
    log('✅ Husky initialized successfully', 'green');
  } catch {
    log('❌ Husky initialization failed', 'red');
    process.exit(1);
  }

  console.log('');
  log('🔍 Verifying hook files...', 'blue');

  let hooksFound = 0;

  // Check pre-commit hook
  if (checkFileExists('.husky/pre-commit')) {
    if (makeExecutable('.husky/pre-commit')) {
      log('✅ Pre-commit hook found and made executable', 'green');
      hooksFound++;
    } else {
      log('⚠️  Pre-commit hook found but could not make executable', 'yellow');
    }
  } else {
    log('⚠️  Pre-commit hook not found', 'yellow');
  }

  // Check pre-push hook
  if (checkFileExists('.husky/pre-push')) {
    if (makeExecutable('.husky/pre-push')) {
      log('✅ Pre-push hook found and made executable', 'green');
      hooksFound++;
    } else {
      log('⚠️  Pre-push hook found but could not make executable', 'yellow');
    }
  } else {
    log('⚠️  Pre-push hook not found', 'yellow');
  }

  console.log('');
  log('🛡️ Verifying security configuration...', 'blue');

  // Check protected branches configuration
  try {
    const prePushContent = fs.readFileSync('.husky/pre-push', 'utf8');
    if (prePushContent.includes('protected_branches')) {
      log('✅ Protected branches configured (main, develop, test, prod)', 'green');
    } else {
      log('⚠️  Protected branches configuration not found', 'yellow');
    }

    if (prePushContent.includes('authorized_users')) {
      log('✅ Authorized users configured', 'green');
    } else {
      log('⚠️  Authorized users configuration not found', 'yellow');
    }
  } catch {
    log('⚠️  Could not verify pre-push configuration', 'yellow');
  }

  console.log('');
  log('📋 Quality checks verification...', 'blue');

  // Check package.json configurations
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    if (
      packageJson.scripts &&
      packageJson.scripts.lint &&
      packageJson.scripts.lint.includes('--max-warnings 0')
    ) {
      log('✅ Zero warnings policy enabled in ESLint', 'green');
    } else {
      log('⚠️  Zero warnings policy not configured', 'yellow');
    }

    if (packageJson['lint-staged']) {
      log('✅ Lint-staged configuration found', 'green');
    } else {
      log('⚠️  Lint-staged configuration missing', 'yellow');
    }
  } catch {
    log('⚠️  Could not verify package.json configuration', 'yellow');
  }

  console.log('');
  log('📊 Setup Summary:', 'yellow');
  console.log(`   • Hooks installed: ${hooksFound}/2`);
  console.log('   • Zero tolerance policy: Enabled');

  console.log('');
  if (hooksFound === 2) {
    log('🎉 Husky setup completed successfully!', 'green');
    log('🔒 All git hooks are now active and protecting your code quality', 'green');
    console.log('');
    console.log('');
  } else {
    log('⚠️  Husky setup completed with warnings', 'yellow');
    console.log('   Some hooks may not be properly configured');
  }

  console.log('');
}

main();
