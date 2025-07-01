#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
from urllib.parse import urlparse
from datetime import datetime

PORT = int(os.environ.get('PORT', 8000))

def log_email(email_data):
    print('=' * 50)
    print('NEW EMAIL TO: RMSolutionsCF62@gmail.com')
    print('FROM:', email_data.get('from', 'RMT Solutions Website'))
    print('SUBJECT:', email_data.get('subject', 'Form Submission'))
    print('TIME:', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    print('-' * 30)
    print('CONTENT:')
    print(email_data.get('content', ''))
    print('=' * 50)

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/contact':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                email_content = f"""
NEW CONTACT FORM SUBMISSION - {data.get('service', 'General')} Service

Name: {data.get('name', '')}
Email: {data.get('email', '')}
Phone: {data.get('phone', '')}
Service: {data.get('service', '')}
Location: {data.get('location', '')}

Message:
{data.get('message', '')}

Submitted from RMT Solutions website at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                """
                
                log_email({
                    'from': 'RMT Solutions Website',
                    'subject': f"New Contact Form Submission - {data.get('service', 'General')} Service",
                    'content': email_content
                })
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps({'success': True, 'message': 'Contact form submitted successfully!'})
                self.wfile.write(response.encode())
                
            except Exception as e:
                print(f"Contact form error: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps({'success': False, 'message': 'Failed to send contact form.'})
                self.wfile.write(response.encode())
                
        elif self.path == '/api/review':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                rating = int(data.get('rating', 5))
                stars = '★' * rating + '☆' * (5 - rating)
                
                email_content = f"""
NEW CUSTOMER REVIEW - {rating}/5 Stars

Customer: {data.get('reviewerName', '')}
Email: {data.get('reviewerEmail', '')}
Service: {data.get('serviceType', '')}
Rating: {rating}/5 {stars}

Review:
"{data.get('reviewText', '')}"

Submitted from RMT Solutions website review form at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                """
                
                log_email({
                    'from': 'RMT Solutions Website',
                    'subject': f"New Customer Review - {rating}/5 Stars",
                    'content': email_content
                })
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps({'success': True, 'message': 'Review submitted successfully!'})
                self.wfile.write(response.encode())
                
            except Exception as e:
                print(f"Review form error: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps({'success': False, 'message': 'Failed to send review.'})
                self.wfile.write(response.encode())
        else:
            self.send_response(404)
            self.end_headers()
    
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