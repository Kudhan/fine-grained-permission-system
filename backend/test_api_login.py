import requests

def test_login():
    url = "http://localhost:8000/auth/login/"
    data = {
        "email": "admin@saas.com",
        "password": "Admin123!"
    }
    print(f"Sending login request to {url} with {data}")
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_login()
