# test_auth.py

def test_register_success(client):
    response = client.post('/auth/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    
    assert response.status_code == 201
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Utilisateur créé avec succès"
    print("\n✅ Test register success passed")

def test_register_existing_email(client):
    # Inscription initiale
    client.post('/auth/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    # Nouvelle tentative avec le même email
    response = client.post('/auth/register', json={
        "username": "anotheruser",
        "email": "test@example.com",
        "password": "password456"
    })
    
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    print("\n❌ Test register existing email passed")

#le test de l'email invalide 
def test_register_invalid_email(client):
    response = client.post('/auth/register', json={
        "username": "testuser",
        "email": "invalid-email",
        "password": "password123"
    })
    
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    print("\n❌ Test register invalid email passed")

#le test de l'email ou nom ou password manquant
def test_register_missing_fields(client):
    response = client.post('/auth/register', json={
        "username": "testuser",
        "password": "password123"
    })
    
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    print("\n❌ Test register missing fields passed")

def test_login_success(client):
    # S'assurer que l'utilisateur existe
    client.post('/auth/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    
    response = client.post('/auth/login', json={
        "email": "test@example.com",
        "password": "password123"
    })
    
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    print("\n✅ Test login success passed")

def test_login_invalid_credentials(client):
    # S'assurer que l'utilisateur existe
    client.post('/auth/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    
    response = client.post('/auth/login', json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    
    assert response.status_code == 401
    data = response.get_json()
    # assert "message" in data
    assert data["error"] == "Email ou mot de passe incorrect"
    print("\n❌ Test login invalid credentials passed")

