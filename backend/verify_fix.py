import requests
import urllib.parse
import time

def test_endpoint():
    video_url = "https://youtu.be/TgH9KXEQ0YU?si=Igq5NEmta80yJI74"
    encoded_url = urllib.parse.quote(video_url)
    api_url = f"http://127.0.0.1:8000/captions?url={encoded_url}"
    
    print(f"Calling {api_url}...")
    try:
        response = requests.get(api_url, timeout=60)
        print(f"Status: {response.status_code}")
        data = response.json()
        if "paragraphs" in data:
            print(f"Received {len(data['paragraphs'])} paragraphs.")
            if data['paragraphs']:
                 print(f"First paragraph preview: {data['paragraphs'][0][:50]}...")
        else:
            print("Response JSON missing 'paragraphs':", data.keys())
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    # Wait a bit for server to start if we run this immediately after starting server
    time.sleep(2)
    test_endpoint()
