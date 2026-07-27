#!/usr/bin/env python3
"""
VoiceTutor AI - Local Server with Auto Port Detection & Cloudflare API Simulator
Checks if port 8085 (or alternative ports) is in use before launching.
"""

import os
import sys
import socket
import webbrowser
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Reconfigure stdout for UTF-8 on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Local memory storage for offline API sync simulation
LOCAL_SYNC_STORE = {}

class SmartVoiceTutorHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        # Simulate /api/sync endpoint locally
        if self.path.startswith('/api/sync'):
            from urllib.parse import urlparse, parse_qs
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            token = params.get('token', [None])[0]

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            if token and token in LOCAL_SYNC_STORE:
                response_data = {
                    "success": True,
                    "token": token,
                    "data": LOCAL_SYNC_STORE[token],
                    "updatedAt": "local"
                }
            else:
                response_data = { "success": True, "token": token, "data": None }

            self.wfile.write(json.dumps(response_data).encode('utf-8'))
            return

        return super().do_GET()

    def do_POST(self):
        # Simulate /api/sync endpoint locally
        if self.path.startswith('/api/sync'):
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                body = json.loads(post_data.decode('utf-8'))
                token = body.get('token')
                data = body.get('data')
                if token and data:
                    LOCAL_SYNC_STORE[token] = data

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": "Local sync store updated",
                    "token": token
                }).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        return super().do_POST()

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(('127.0.0.1', port)) == 0

def find_available_port(start_port=8085, max_attempts=20):
    for port in range(start_port, start_port + max_attempts):
        if not is_port_in_use(port):
            return port
    return None

def main():
    preferred_port = 8085
    target_port = preferred_port

    if is_port_in_use(preferred_port):
        print(f"[Notice] Port {preferred_port} is currently in use. Auto detecting next available port...")
        target_port = find_available_port(preferred_port + 1)
        if not target_port:
            print("[Error] Could not find an available open port.")
            sys.exit(1)
    
    server_address = ('127.0.0.1', target_port)
    httpd = HTTPServer(server_address, SmartVoiceTutorHandler)
    url = f"http://127.0.0.1:{target_port}"

    print("=" * 60)
    print(f"[VoiceTutor AI] Local Server Started Successfully")
    print(f"URL: {url}")
    print(f"Port Detection: Port {target_port} checked & bound successfully")
    print(f"Directory: {os.getcwd()}")
    print("=" * 60)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.server_close()

if __name__ == '__main__':
    main()
