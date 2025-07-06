#!/usr/bin/env node

/**
 * Production Start Script
 * This script ensures the application runs in production mode
 */

const { spawn } = require('child_process');
const path = require('path');

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

// Remove all console.log statements in production
if (process.env.NODE_ENV === 'production') {
  console.log = function() {};
  console.debug = function() {};
  console.warn = function() {};
}

console.info('🚀 Starting Half Attire Multi-vendor Platform in Production Mode...');

// Start the Next.js application
const nextStart = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

nextStart.on('close', (code) => {
  console.info(`Next.js application exited with code ${code}`);
});

nextStart.on('error', (error) => {
  console.error('Error starting Next.js application:', error);
});
