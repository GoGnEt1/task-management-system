# tests/test_get_tasks.py

from tests.authen import register_and_login

def test_get_tasks_success(client):
    token = register_and_login(client)
    headers = {
        'Authorization': f'Bearer {token}'
    }

    # ✅ Création d'une tâche d'abord
    task_data = {
        'title': 'tâche 1',
        'description': 'Description 1',
        'priority': 'High',
        'due_date': '2025-05-01'
    }

    task_data2 = {
        'title': 'tâche 2',
        'description': 'Description 2',
        'priority': 'Low',
    }
    create_response = client.post('/api/tasks', headers=headers, json=task_data)
    create_response = client.post('/api/tasks', headers=headers, json=task_data2)

    assert create_response.status_code == 201
    # ✅ Ensuite récupération des tâches
    response = client.get("/api/tasks", headers=headers)

    assert response.status_code == 200

    tasks = response.get_json()

    if tasks:
        print("\nTâches récupérées :")
        for idx, task in enumerate(tasks, 1):
            print(f"({idx})")
            print(f'    "title": "{task["title"]}",')
            print(f'    "description": "{task["description"]}",')
            print(f'    "due_date": "{task["due_date"]}",')
            print(f'    "priority": "{task["priority"]}"\n')
    else:
        print("\nAucune tâche trouvée.")

def test_get_all_tasks_unauthorized(client):
    # Act: Essayer sans token
    response = client.get('/api/tasks')

    # Assert
    assert response.status_code == 401  # Unauthorized
    print('\n Authentification requise pour accéder à cette ressource.')