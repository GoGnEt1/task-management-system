# backend/tests/conftest.py
import sys
import os

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname('D:/task_management/task_manager_backend/'), '..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
from app import create_app  # Assure-toi que tu as une factory create_app()
from models import db # Import de la base de données


@pytest.fixture
def app():
    app = create_app('testing')  # Passe un config pour tests si tu en as
    with app.app_context():
        db.create_all()  # Crée la base de données pour les tests
        yield app
        db.drop_all()  # Supprime tout après tests


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()