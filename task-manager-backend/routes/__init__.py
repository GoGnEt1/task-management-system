from flask import Flask
# from routes.extensions import db
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object('config.Config')  # adapte selon ta config
    db.init_app(app)

    # Import des routes ici si besoin
    return app