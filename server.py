#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
from urllib.parse import urlparse

PORT = int(os.environ.get('PORT', 3000))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # Health check endpoint for deployment
        if parsed_path.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            health_data = {
                'status': 'ok',
                'timestamp': self.date_time_string()
            }
            self.wfile.write(json.dumps(health_data).encode())
            return
        
        # Serve index.html for root path
        if parsed_path.path == '/' or parsed_path.path == '':
            self.path = '/index.html'
        
        # Try to serve the requested file, fallback to index.html
        try:
            super().do_GET()
        except:
            # If file not found, serve index.html as fallback
            self.path = '/index.html'
            super().do_GET()

os.chdir('.')
with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
    print(f"RMT Solutions website serving at http://0.0.0.0:{PORT}")
    print(f"Health check available at http://0.0.0.0:{PORT}/health")
    print("Press Ctrl+C to stop the server")
    httpd.serve_forever()