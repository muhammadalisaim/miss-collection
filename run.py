#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

PORT = 8088
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    for p in range(PORT, PORT + 20):
        try:
            with socketserver.TCPServer(("", p), CustomHandler) as httpd:
                print("=" * 65)
                print("🌸 Miss Collection — Luxury Ladies Undergarments Storefront")
                print("=" * 65)
                print(f"🚀 Customer Storefront : http://localhost:{p}/index.html")
                print(f"⚙️ Admin Portal        : http://localhost:{p}/admin.html")
                print(f"📁 Serving Directory   : {DIRECTORY}")
                print("=" * 65)
                print("Press Ctrl+C to stop the server.")
                httpd.serve_forever()
        except OSError:
            continue

if __name__ == "__main__":
    try:
        run_server()
    except KeyboardInterrupt:
        print("\nServer stopped cleanly.")
        sys.exit(0)
