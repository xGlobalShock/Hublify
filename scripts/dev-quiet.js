#!/usr/bin/env node

// Suppress all deprecation warnings globally
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, type, code) => {
  if (type === 'DeprecationWarning') return;
  return originalEmitWarning.call(process, warning, type, code);
};

// Run concurrently
const { result } = require('concurrently')(
  [
    { command: 'npm run start:backend', name: 'backend', prefixColor: 'blue' },
    { command: 'npm start', name: 'frontend', prefixColor: 'green' }
  ],
  {
    raw: true,
    killOthers: ['failure', 'success']
  }
);

result.then(
  () => process.exit(0),
  () => process.exit(1)
);
