# test_update_task.py
import pytest
from tests.authen import register_and_login

def test_update_task_success(client):
    access_token = register_and_login(client)

    task_response = client.post('/api/tasks', headers={"Authorization": f"Bearer {access_token}"}, json={
        "title": "Task to Update",
        "description": "Old description",
    })
    task_id = task_response.get_json()["id"]

    # Modifier la tâche
    response = client.put(f'/api/tasks/{task_id}', headers={"Authorization": f"Bearer {access_token}"}, json={
        "title": "Updated Task",
        "description": "New description",
    })
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == "Tâche mise à jour avec succès!"
    print("\n✅ Test update task success passed")

def test_update_task_unauthorized(client):
    response = client.put('/api/tasks/1', json={"title": "Test"})
    assert response.status_code == 401
    print("\n❌ Test update task unauthorized passed")

def test_update_task_not_found(client):
    access_token = register_and_login(client)

    response = client.put('/api/tasks/999', headers={"Authorization": f"Bearer {access_token}"}, json={
        "title": "Does not exist",
    })
    assert response.status_code == 404
    print("\n❌ Test update task not found passed")
