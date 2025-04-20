# tests/test_create_task.py

import json

from tests.authen import register_and_login

def test_create_task_success(client):
    # Arrange
    token = register_and_login(client)

    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    task_data = {
        'title': 'Task 1',
        'description': 'Description of Task 1',
        'priority': 'High',
        'due_date': '2025-05-01'
    }

    # Act
    response = client.post('/api/tasks', headers=headers, json=task_data)

    # Assert
    assert response.status_code == 201  # 201 Created
    data = response.get_json()
    assert data['title'] == 'Task 1'
    assert 'id' in data
    print(f"\n✅ Test Création de tâche '{data['title']}' réussi.")

def test_create_task_unauthorized(client):
    # Arrange
    task_data = {
        'title': 'Unauthorized Task',
        'description': 'No auth token provided',
    }

    # Act
    response = client.post('/api/tasks', json=task_data)  # No headers with token

    # Assert
    assert response.status_code == 401  # Unauthorized
    
    print("\n❌ Test Création de tâche sans autorisation échoué.")

def test_create_task_with_invalid_token(client):
    """Test création de tâche avec token invalide"""
    invalid_token = "invalid.token.here"
    response = client.post('/api/tasks', 
        json={
            "title": "Tâche token invalide",
            "description": "Devrait échouer"
        },
        headers={"Authorization": f"Bearer {invalid_token}"}
    )

    assert response.status_code == 422  # Unprocessable Entity
    print("\n❌ Test Création de tâche avec token invalide échoué.")

def test_create_task_missing_title(client):
    """Test création de tâche avec données manquantes (sans titre)"""
    token = register_and_login(client)

    response = client.post('/api/tasks', 
        json={
            "description": "Pas de titre ici",
            "priority": "Basse"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 400  # Bad Request
    print("\n❌ Test Création de tâche sans titre échoué.")