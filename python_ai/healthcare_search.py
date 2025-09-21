#!/usr/bin/env python3
"""
Real-time Healthcare Search AI
Uses DuckDuckGo search and web scraping to find current medical information
"""

import asyncio
import json
import re
from typing import List, Dict, Any
import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
import time

class HealthcareSearchAI:
    def __init__(self):
        self.trusted_medical_sources = [
            'mayoclinic.org',
            'webmd.com', 
            'healthline.com',
            'medicalnewstoday.com',
            'nih.gov',
            'cdc.gov',
            'who.int',
            'pubmed.ncbi.nlm.nih.gov',
            'medscape.com',
            'health.harvard.edu',
            'clevelandclinic.org',
            'hopkinsmedicine.org'
        ]
        
        self.ddgs = DDGS()
        
    def is_healthcare_query(self, query: str) -> bool:
        """Check if the query is related to healthcare"""
        healthcare_keywords = [
            'health', 'medical', 'disease', 'symptom', 'treatment', 'medicine',
            'doctor', 'hospital', 'diagnosis', 'therapy', 'medication', 'drug',
            'pain', 'fever', 'infection', 'cancer', 'diabetes', 'heart',
            'blood', 'surgery', 'vaccine', 'virus', 'bacteria', 'wellness',
            'nutrition', 'diet', 'exercise', 'mental health', 'depression',
            'anxiety', 'stress', 'injury', 'emergency', 'first aid'
        ]
        
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in healthcare_keywords)
    
    def search_web(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Search the web using DuckDuckGo"""
        try:
            # Add healthcare context to the query
            enhanced_query = f"{query} medical health information"
            
            results = []
            search_results = list(self.ddgs.text(enhanced_query, max_results=max_results))
            
            for result in search_results:
                # Prioritize trusted medical sources
                domain = self.extract_domain(result.get('href', ''))
                is_trusted = any(trusted in domain for trusted in self.trusted_medical_sources)
                
                results.append({
                    'title': result.get('title', ''),
                    'url': result.get('href', ''),
                    'snippet': result.get('body', ''),
                    'domain': domain,
                    'is_trusted_source': is_trusted,
                    'relevance_score': 1.0 if is_trusted else 0.5
                })
            
            # Sort by relevance (trusted sources first)
            results.sort(key=lambda x: x['relevance_score'], reverse=True)
            return results
            
        except Exception as e:
            print(f"Search error: {e}")
            return []
    
    def extract_domain(self, url: str) -> str:
        """Extract domain from URL"""
        try:
            from urllib.parse import urlparse
            return urlparse(url).netloc.lower()
        except:
            return ""
    
    def scrape_content(self, url: str) -> str:
        """Scrape content from a medical webpage"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove scripts, styles, and other non-content elements
            for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
                element.decompose()
            
            # Extract main content
            content_selectors = [
                'article', 'main', '.content', '.article-content', 
                '.post-content', '.entry-content', 'p'
            ]
            
            content = ""
            for selector in content_selectors:
                elements = soup.select(selector)
                if elements:
                    content = ' '.join([elem.get_text().strip() for elem in elements])
                    break
            
            if not content:
                content = soup.get_text()
            
            # Clean and truncate content
            content = re.sub(r'\s+', ' ', content).strip()
            return content[:2000]  # Limit content length
            
        except Exception as e:
            print(f"Scraping error for {url}: {e}")
            return ""
    
    def process_healthcare_query(self, query: str) -> Dict[str, Any]:
        """Process a healthcare query and return comprehensive information"""
        
        if not self.is_healthcare_query(query):
            return {
                "is_healthcare_related": False,
                "message": "This query doesn't appear to be healthcare-related. Please ask about medical topics, symptoms, treatments, or health information."
            }
        
        # Search for information
        search_results = self.search_web(query, max_results=8)
        
        if not search_results:
            return {
                "is_healthcare_related": True,
                "message": "I couldn't find current information about your query. Please try rephrasing your question.",
                "sources": []
            }
        
        # Get detailed content from top trusted sources
        detailed_info = []
        for result in search_results[:3]:  # Only scrape top 3 results
            if result['is_trusted_source']:
                content = self.scrape_content(result['url'])
                if content:
                    detailed_info.append({
                        'source': result['domain'],
                        'title': result['title'],
                        'url': result['url'],
                        'content': content[:500]  # First 500 chars
                    })
        
        # Generate AI response
        response = self.generate_healthcare_response(query, search_results, detailed_info)
        
        return {
            "is_healthcare_related": True,
            "query": query,
            "response": response,
            "sources": search_results[:5],  # Return top 5 sources
            "detailed_info": detailed_info,
            "disclaimer": "This information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for medical concerns."
        }
    
    def generate_healthcare_response(self, query: str, search_results: List[Dict], detailed_info: List[Dict]) -> str:
        """Generate a comprehensive healthcare response based on search results"""
        
        if not search_results:
            return "I couldn't find current information about your query. Please consult with a healthcare professional."
        
        # Start building response
        response_parts = []
        
        # Add main information from trusted sources
        if detailed_info:
            response_parts.append("Based on current medical information:")
            
            for info in detailed_info[:2]:  # Use top 2 sources
                # Extract key sentences from content
                sentences = info['content'].split('.')[:3]  # First 3 sentences
                key_info = '. '.join(sentences).strip()
                if key_info:
                    response_parts.append(f"\nFrom {info['source']}: {key_info}")
        
        # Add summary from search snippets
        if search_results:
            response_parts.append(f"\n\nKey points about '{query}':")
            for i, result in enumerate(search_results[:3]):
                if result['snippet']:
                    snippet = result['snippet'][:150]  # Limit length
                    response_parts.append(f"\n• {snippet}")
        
        # Add trusted sources list
        trusted_sources = [r for r in search_results if r['is_trusted_source']]
        if trusted_sources:
            response_parts.append(f"\n\nTrusted medical sources:")
            for source in trusted_sources[:3]:
                response_parts.append(f"\n• {source['title']} - {source['domain']}")
        
        return ''.join(response_parts)

    async def async_search(self, query: str) -> Dict[str, Any]:
        """Async version of healthcare search"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.process_healthcare_query, query)

# Test function
def test_healthcare_ai():
    ai = HealthcareSearchAI()
    
    test_queries = [
        "What are the symptoms of diabetes?",
        "How to treat a headache naturally?",
        "Covid-19 prevention methods",
        "Side effects of aspirin"
    ]
    
    for query in test_queries:
        print(f"\n{'='*50}")
        print(f"Query: {query}")
        print('='*50)
        
        result = ai.process_healthcare_query(query)
        print(json.dumps(result, indent=2))
        
        time.sleep(2)  # Rate limiting

if __name__ == "__main__":
    test_healthcare_ai()