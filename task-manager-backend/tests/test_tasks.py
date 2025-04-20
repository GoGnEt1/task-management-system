# backend/tests/test_tasks.py

import pytest
from app import create_app, db
from models import User

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def register_and_login(client):
    # 1. Register
    client.post('/auth/register', json={
        "username": "abel",
        "email": "abel@gmail.com",
        "password": "1234"
    })

    # 2. Login
    response = client.post('/auth/login', json={
        "email": "abel@gmail.com",
        "password": "1234"
    })

    # Récupérer le token
    token = response.json["access_token"]
    return token

def test_create_task(client):
    # Enregistrer et se connecter pour obtenir le token
    token = register_and_login(client)

    # 3. Créer une tâche avec le token
    response = client.post('/api/tasks', json={
        "title": "Nouvelle tâche",
        "description": "Description de la tâche"
    }, headers={
        "Authorization": f"Bearer {token}"
    })

    assert response.status_code == 201
    assert response.json["title"] == "Nouvelle tâche"
    assert response.json["description"] == "Description de la tâche"

'''
def test_create_task(client):
    # 1. Login pour récupérer un token
    response = client.post('/auth/login', json={
        "email": "abel@gmail.com",
        "password": "1234"
    })
    token = response.json["access_token"]

    # 2. Créer une tâche
    response = client.post('/api/tasks', 
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Nouvelle tâche",
            "description": "Faire le devoir",
            "date_echeant": "2025-04-15 23:59:00"
        }
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["title"] == "Nouvelle tâche"
    assert data["description"] == "Faire le devoir"

    '''
