# tests/test_get_task.py

from tests.authen import register_and_login

def test_get_specific_task_success(client):
    # Arrange: Enregistrer, connecter, créer une tâche
    token = register_and_login(client)
    create_response = client.post('/api/tasks',
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Tâche Spécifique",
            "description": "Description spécifique",
            "due_date": "2025-04-25",
            "priority": "High"
        }
    )
    task_id = create_response.get_json()["id"]

    # Act: Récupérer cette tâche
    response = client.get(f'/api/tasks/{task_id}', headers={"Authorization": f"Bearer {token}"})

    # Assert
    assert response.status_code == 200
    task = response.get_json()
    assert task["title"] == "Tâche Spécifique"

def test_get_specific_task_not_found(client):
    # Arrange: Se connecter
    token = register_and_login(client)

    # Act: Demander une tâche qui n'existe pas (id 999)
    response = client.get('/api/tasks/999', headers={"Authorization": f"Bearer {token}"})

    # Assert
    assert response.status_code == 404  # Not Found
    data = response.get_json()
    assert "Task not found" in data["message"]

def test_get_specific_task_unauthorized(client):
    # Act: Essayer sans authentification
    response = client.get('/api/tasks/1')

    # Assert
    assert response.status_code == 401  # Unauthorized
