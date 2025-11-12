#!/bin/bash

echo "🚀 Starting Equipment Tracker Backend..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    brew services start mongodb-community
    sleep 3
else
    echo "✅ MongoDB is already running"
fi

# Start backend server
echo "🔧 Starting Backend Server..."
cd backend
npm run dev
