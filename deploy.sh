#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run serve

# Copy frontend build to backend
echo "📂 Copying frontend build to backend..."
cp -r dist/* ../backend/public/

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../backend
npm install --production

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads
mkdir -p data

# Start the server
echo "🚀 Starting the server..."
if [ "$1" == "production" ]; then
    NODE_ENV=production npm start
else
    npm run dev
fi 