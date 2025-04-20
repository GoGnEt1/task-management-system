from models import db
from app import app  # Assure-toi que 'app' est bien importé depuis ton fichier Flask principal

# Supprimer la base de données existante
with app.app_context():
    db.drop_all()
    print("Base de données supprimée.")

    # Recréer la base de données et les tables
    db.create_all()
    print("Base de données recréée avec succès.")
