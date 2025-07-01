import zipfile
import os

def create_website_zip():
    with zipfile.ZipFile('rmt-solutions-website.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add main files
        files_to_add = [
            'index.html',
            'styles.css', 
            'script.js',
            'server.py',
            'run-website.sh',
            'replit.md'
        ]
        
        for file in files_to_add:
            if os.path.exists(file):
                zipf.write(file)
                print(f"Added: {file}")
        
        # Add all photos from attached_assets
        for root, dirs, files in os.walk('attached_assets'):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path)
                print(f"Added: {file_path}")
        
        # Add instructions
        instructions = """RMT SOLUTIONS WEBSITE BACKUP
============================

To run this website:
1. Install Python 3 on your computer
2. Open terminal/command prompt in this folder  
3. Run: python3 server.py
4. Open browser to: http://localhost:8000

To upload to web hosting:
- Upload ALL these files to your hosting service
- Tell them to run: python3 server.py
- Website will be live at your domain

Files included:
- index.html (main website)
- styles.css (design)  
- script.js (functionality)
- server.py (email forms)
- attached_assets/ (all photos and logo)

Contact/review forms will log emails to console.
"""
        zipf.writestr('README.txt', instructions)
        print("Added: README.txt")
    
    print(f"\nZIP file created: rmt-solutions-website.zip")
    print(f"Size: {os.path.getsize('rmt-solutions-website.zip')} bytes")

if __name__ == "__main__":
    create_website_zip()
