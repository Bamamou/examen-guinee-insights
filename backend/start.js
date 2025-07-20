#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Guinea Exam Insights Backend...');

// Start the development server
const server = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});
