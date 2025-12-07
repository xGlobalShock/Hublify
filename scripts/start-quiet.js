#!/usr/bin/env node

// Suppress specific deprecation warnings
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, type, code) => {
  // Suppress fs.F_OK deprecation
  if (code === 'DEP0176') return;
  // Suppress util._extend deprecation
  if (code === 'DEP0060') return;
  // Suppress webpack-dev-server deprecations
  if (code === 'DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE') return;
  if (code === 'DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE') return;
  
  return originalEmitWarning.call(process, warning, type, code);
};

// Suppress console logs from react-scripts
const originalLog = console.log;
let browserOpened = false;
console.log = (...args) => {
  const message = args.join(' ');
  
  // Filter out unwanted react-scripts messages
  if (message.includes('webpack compiled')) return;
  if (message.includes('You can now view')) return;
  if (message.includes('Local:')) return;
  if (message.includes('http://localhost')) return;
  if (message.includes('On Your Network:')) return;
  if (message.includes('Note that the development build')) return;
  if (message.includes('To create a production build')) return;
  if (message.includes('Compiled with warnings')) return;
  if (message.includes('Compiled successfully')) return;
  if (message.includes('[eslint]')) return;
  if (message.includes('Search for the keywords')) return;
  if (message.match(/Search for the keywords to learn more about each warning\./)) return;
  if (message.includes('To ignore, add')) return;
  if (message.match(/Line \d+:\d+:/)) return;
  if (message.includes('no-unused-vars')) return;
  if (message.includes('react-hooks/exhaustive-deps')) return;
  if (message.match(/src\\/)) return;
  
  return originalLog.apply(console, args);
};

// Start react-app-rewired
require('react-app-rewired/scripts/start');
