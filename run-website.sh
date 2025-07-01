#!/bin/bash

# Kill any existing server
pkill -f "server.py" 2>/dev/null || true

# Start the RMT Solutions website with email functionality
echo "Starting RMT Solutions website with email functionality..."
echo "Email submissions will be logged to console output"
echo "Website available at: http://0.0.0.0:8000"
echo "Contact form endpoint: /api/contact"
echo "Review form endpoint: /api/review"
echo ""

python3 server.py