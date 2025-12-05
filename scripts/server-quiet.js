#!/usr/bin/env node

// Suppress specific deprecation warnings
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, type, code) => {
  // Suppress fs.F_OK deprecation
  if (code === 'DEP0176') return;
  // Suppress util._extend deprecation
  if (code === 'DEP0060') return;
  // Suppress webpack-dev-server deprecations (backup filter)
  if (code === 'DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE') return;
  if (code === 'DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE') return;
  
  return originalEmitWarning.call(process, warning, type, code);
};

// Start the actual server
require('../server.js');
