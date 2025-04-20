from flask import Flask, jsonify, request
from routes.extensions import jwt
from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_migrate import Migrate
from models import db, bcrypt # Import de la base de données
from routes.tasks import tasks_bp  # Importation des routes des tâches
from routes.auth import auth_bp  # Importation des routes d'authentification

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app, origins=["http://localhost:5173"])
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(tasks_bp, url_prefix='/api')
    # Initialiser les extensions
    jwt.init_app(app)
    return app

"""app = Flask(__name__)
app.config.from_object(Config)

# Initialiser les extensions
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
CORS(app, origins=["http://localhost:5173"])
# CORS(app)
# Init Migrate
migrate = Migrate(app, db)
# Enregistrer les routes
#app.register_blueprint(tasks_bp)
# Enregistrer le blueprint des tâches
app.register_blueprint(tasks_bp, url_prefix='/api')

# Enregistrer les blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
"""
task_id_counter = 1 # Compteur d'identifiant de tâche

app = create_app()
# jwt = JWTManager(app)
migrate = Migrate(app, db)

@app.route("/")
def home():
    return {"message": "Bienvenue sur l'API Task Management System!"}, 200

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5002)  # Démarrer le serveur en mode debug app.run(host="0.0.0.0", port=5002, debug=True)


