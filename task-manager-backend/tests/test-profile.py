#le test pour la mise à jour du profil(seulement du nom d'utilisateur) après la connexion

from tests.authen import register_and_login
def test_update_profile_username_success(client):
    access_token = register_and_login(client)

    response = client.put('/auth/update_profile', headers={"Authorization": f"Bearer {access_token}"}, json={
        "username": "newusername"
    })
    
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Profil mis à jour avec succès"
    print(f"\n✅ Test update profile username success passed for {data['user']['username']}")

#le test de tentative de mise à jour du profil sans connexion
def test_update_profile_unauthorized(client):
    response = client.put('/auth/update_profile', json={
        "username": "newusername"
    })
    
    assert response.status_code == 401
    data = response.get_json()
    # assert "error" in data
    print("\n❌ Test update profile unauthorized passed")

#le test de tentative de MAJ d'un utilisateur qui n'existe pas
def test_update_profile_user_not_found(client):
    access_token = register_and_login(client)

    response = client.put('/auth/update_profile', headers={"Authorization": f"Bearer {access_token}"}, json={
        "username": "nonexistentuser"
    })
    
    assert response.status_code == 404
    data = response.get_json()
    assert "error" in data
    print("\n❌ Test update profile user not found passed")
