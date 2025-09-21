#!/usr/bin/env python3
"""
Flask API Server for Healthcare Search AI
Serves as a fallback when other AI APIs fail
"""

import os
import json
import asyncio
from flask import Flask, request, jsonify
from flask import Response
import time
from healthcare_search import HealthcareSearchAI
import threading
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)

# Initialize the Healthcare AI
healthcare_ai = HealthcareSearchAI()
executor = ThreadPoolExecutor(max_workers=4)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Healthcare Search AI",
        "timestamp": time.time()
    })

@app.route('/search', methods=['POST'])
def search_healthcare():
    """Search for healthcare information"""
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                "error": "Missing 'query' in request body"
            }), 400
        
        query = data['query'].strip()
        
        if not query:
            return jsonify({
                "error": "Query cannot be empty"
            }), 400
        
        # Process the healthcare query
        result = healthcare_ai.process_healthcare_query(query)
        
        return jsonify({
            "success": True,
            "data": result,
            "timestamp": time.time()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": time.time()
        }), 500

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    """Chat endpoint compatible with existing chat system"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract message from different possible formats
        message = ""
        if 'message' in data:
            message = data['message']
        elif 'query' in data:
            message = data['query']
        elif 'content' in data:
            message = data['content']
        else:
            return jsonify({"error": "No message/query found"}), 400
        
        # Check if this is a healthcare-related query
        if not healthcare_ai.is_healthcare_query(message):
            return jsonify({
                "success": False,
                "message": "I can only help with healthcare and medical questions. Please ask about symptoms, treatments, medical conditions, or health information.",
                "is_healthcare_related": False
            })
        
        # Process the healthcare query
        result = healthcare_ai.process_healthcare_query(message)
        
        if result.get('is_healthcare_related', False):
            response_message = result.get('response', 'I could not find information about your query.')
            
            # Add disclaimer
            disclaimer = result.get('disclaimer', '')
            if disclaimer:
                response_message += f"\n\n⚠️ {disclaimer}"
            
            # Add sources
            sources = result.get('sources', [])
            if sources:
                response_message += "\n\n📚 Sources:"
                for i, source in enumerate(sources[:3], 1):
                    response_message += f"\n{i}. {source['title']} ({source['domain']})"
            
            return jsonify({
                "success": True,
                "message": response_message,
                "sources": sources,
                "is_healthcare_related": True,
                "detailed_info": result.get('detailed_info', [])
            })
        else:
            return jsonify({
                "success": False,
                "message": result.get('message', 'Please ask a healthcare-related question.'),
                "is_healthcare_related": False
            })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}",
            "message": "I'm having trouble processing your request right now. Please try again later."
        }), 500

@app.route('/async-search', methods=['POST'])
def async_search():
    """Async search endpoint"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        # Submit task to thread pool
        future = executor.submit(healthcare_ai.process_healthcare_query, query)
        result = future.result(timeout=30)  # 30-second timeout
        
        return jsonify({
            "success": True,
            "data": result,
            "timestamp": time.time()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint to verify AI functionality"""
    test_query = "What are the symptoms of common cold?"
    
    try:
        result = healthcare_ai.process_healthcare_query(test_query)
        return jsonify({
            "test_query": test_query,
            "result": result,
            "status": "AI is working properly"
        })
    except Exception as e:
        return jsonify({
            "test_query": test_query,
            "error": str(e),
            "status": "AI encountered an error"
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "available_endpoints": [
            "/health - GET - Health check",
            "/search - POST - Search healthcare information", 
            "/chat - POST - Chat with healthcare AI",
            "/async-search - POST - Async search",
            "/test - GET - Test AI functionality"
        ]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "message": "Something went wrong on our end"
    }), 500

def run_server(host='127.0.0.1', port=5001, debug=False):
    """Run the Flask server"""
    print(f"🏥 Healthcare Search AI Server starting...")
    print(f"📍 Server running on http://{host}:{port}")
    print(f"🔍 Ready to search medical information!")
    print(f"📋 Available endpoints:")
    print(f"   - POST /chat - Chat with healthcare AI")
    print(f"   - POST /search - Search healthcare info")
    print(f"   - GET /health - Health check")
    print(f"   - GET /test - Test functionality")
    
    app.run(host=host, port=port, debug=debug, threaded=True)

if __name__ == "__main__":
    # Run server on port 5001 to avoid conflict with main app on 5000
    run_server(host='0.0.0.0', port=5001, debug=True)