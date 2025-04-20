# tests/authen.py

def register_and_login(client):
    # Register
    client.post('/auth/register', json={
        "username": "abel",
        "email": "abel@gmail.com",
        "password": "1234"
    })
    

    # Login
    response = client.post('/auth/login', json={
        "email": "abel@gmail.com",
        "password": "1234"
    })

    token = response.json["access_token"]
    assert token, "Login failed, no token received"
    
    return token
