from tests.authen import register_and_login

def test_assign_task_success(client, existing_task, existing_user):
    access_token = register_and_login(client)
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = client.post('/assign_task', headers=headers, json={
        'task_id': existing_task.id,
        'email': existing_user.email
    })

    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == "Tâche assignée avec succès"
    assert data['assignment']['task_id'] == existing_task.id
    assert data['assignment']['user_id'] == existing_user.id

    def test_assign_task_user_not_found(client, access_token, existing_task):
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        response = client.post('/assign_task', headers=headers, json={
            'task_id': existing_task.id,
            'email': 'inexistant@example.com'
        })
    
        assert response.status_code == 404
        assert response.get_json()['error'] == "Utilisateur introuvable"

        def test_assign_task_task_not_found(client, access_token, existing_user):
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
            # ID de tâche inexistant
            response = client.post('/assign_task', headers=headers, json={
                'task_id': 99999,
                'email': existing_user.email
            })
        
            assert response.status_code == 404
            assert response.get_json()['message'] == "Tâche non trouvée"

            def test_assign_task_max_assignments_reached(client, access_token, existing_task, create_users):
                headers = {
                    'Authorization': f'Bearer {access_token}'
                }
                
                # Simuler déjà 4 utilisateurs assignés
                for user in create_users[:4]:  # create_users = liste de 4 users déjà existants
                    assignment = TaskAssignment(task_id=existing_task.id, user_id=user.id)
                    db.session.add(assignment)
                db.session.commit()
                
                # Maintenant essayer d'assigner un 5ème utilisateur
                fifth_user = create_users[4]
                response = client.post('/assign_task', headers=headers, json={
                    'task_id': existing_task.id,
                    'email': fifth_user.email
                })
            
                assert response.status_code == 400
                assert response.get_json()['error'] == "Nombre maximal d'assignations atteint pour cette tâche"
            