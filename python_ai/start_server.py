#!/usr/bin/env python3
"""
Startup script for Healthcare Search AI Server
"""

import os
import sys
import subprocess
import time
import signal
import threading
from ai_server import run_server, healthcare_ai

def start_python_ai_server():
    """Start the Python AI server"""
    try:
        print("🏥 Starting Healthcare Search AI Server...")
        print("📍 Server will run on http://0.0.0.0:5001")
        print("🔍 Real-time healthcare search capabilities enabled!")
        
        # Test the AI functionality before starting server
        print("\n🧪 Testing Healthcare AI functionality...")
        test_result = healthcare_ai.process_healthcare_query("What are the symptoms of common cold?")
        
        if test_result.get('is_healthcare_related', False):
            print("✅ Healthcare AI test passed!")
        else:
            print("⚠️ Healthcare AI test failed, but server will still start")
        
        # Start the Flask server
        run_server(host='0.0.0.0', port=5001, debug=False)
        
    except KeyboardInterrupt:
        print("\n🛑 Healthcare AI Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start Healthcare AI Server: {e}")
        sys.exit(1)

def background_server():
    """Run server in background"""
    try:
        from ai_server import app
        app.run(host='0.0.0.0', port=5001, debug=False, threaded=True)
    except Exception as e:
        print(f"Background server error: {e}")

def start_background_server():
    """Start server in background thread"""
    server_thread = threading.Thread(target=background_server, daemon=True)
    server_thread.start()
    print("🏥 Healthcare AI Server started in background on http://0.0.0.0:5001")
    return server_thread

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--background":
        # Start in background mode
        thread = start_background_server()
        try:
            # Keep main thread alive
            while thread.is_alive():
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Healthcare AI Server stopped")
    else:
        # Start in foreground mode
        start_python_ai_server()