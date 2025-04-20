# test_delete_task.py
import pytest
from tests.authen import register_and_login

def test_delete_task_success(client):
    access_token = register_and_login(client)

    task_response = client.post('/api/tasks', headers={"Authorization": f"Bearer {access_token}"}, json={
        "title": "Task to Delete",
        "description": "Delete me",
    })
    task_id = task_response.get_json()["id"]

    response = client.delete(f'/api/tasks/{task_id}', headers={"Authorization": f"Bearer {access_token}"})
    
    assert response.status_code == 200
    print("\n✅ Test delete task success passed")

def test_delete_task_unauthorized(client):
    response = client.delete('/api/tasks/1')
    assert response.status_code == 401
    print("\n❌ Test delete task unauthorized passed")

def test_delete_task_not_found(client):
    access_token = register_and_login(client)

    response = client.delete('/api/tasks/999', headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 404
    print("\n❌ Test delete task not found passed")
