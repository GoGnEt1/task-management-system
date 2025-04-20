import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    JWT_SECRET_KEY = "ma_super_clé_secrète_123!"
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'task_management.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SECRET_KEY = os.getenv('SECRET_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NDA2OTkxOSwianRpIjoiZmY1Y2U1OTYtMzhiZS00MWQzLWI0NDMtMTcwNjQ3NDQyMzI2IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzQ0MDY5OTE5LCJjc3JmIjoiN2IyNTUxY2MtNjZjNy00ZTQ2LTljODUtMTBkODQzMDAyZDAzIiwiZXhwIjoxNzQ0MDcwODE5fQ.DCxzbXuWG3ZPuiGmMloOqV5Ot6lLsdOfxCIrWZ4L5t0')

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"  # Base en mémoire
    SECRET_KEY = 'test_secret_key'
    JWT_SECRET_KEY = 'jwt_test_secret_key'  # <<< ajoute ça
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False  # Désactiver CSRF pour les tests