import urllib.request
import os
import time

url = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'
dest = 'cloudflared.exe'

# Remove existing if any
if os.path.exists(dest):
    try:
        os.remove(dest)
        print(f"Removed existing {dest}")
    except OSError as e:
        print(f"Error removing existing file: {e}")

print(f"Downloading {url} to {os.path.abspath(dest)}...")
try:
    urllib.request.urlretrieve(url, dest)
    if os.path.exists(dest):
        print("Download complete.")
        print(f"File size: {os.path.getsize(dest)} bytes")
    else:
        print("Error: File not found after download.")
except Exception as e:
    print(f"Download failed: {e}")
