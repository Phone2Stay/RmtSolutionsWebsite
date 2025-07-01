#!/bin/bash
pkill -f "email-server.js" 2>/dev/null || true
pkill -f "server.py" 2>/dev/null || true
sleep 1
node email-server.js > server.log 2>&1 &
echo $! > server.pid
echo "Server started on port 8000"