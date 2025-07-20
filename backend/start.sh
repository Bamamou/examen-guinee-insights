#!/usr/bin/env bash
# Start script for Render.com

# Ensure data directory exists
mkdir -p ./data

# Start the server
node dist/server.js
