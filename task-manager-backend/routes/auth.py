from flask import Blueprint, request, jsonify
from models import db, User, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Tous les champs sont obligatoires"}), 400

    # Vérifier si le username existe déjà
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400
    # Vérifier si l'utilisateur existe déjà
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Cet email est déjà utilisé"}), 400
    
    
    password_h = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password=password_h)
    # user.set_password(password)
    
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Utilisateur créé avec succès"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    # data = request.get_json()
    email = request.json.get('email')
    password = request.json.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": {"id": user.id, "username": user.username}}), 200

@auth_bp.route('/update_profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()  # Récupérer l'ID de l'utilisateur connecté
    data = request.get_json()

    username = data.get('username')
    profile_img = data.get('profile_img')

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    if username:
        user.username = username
    if profile_img:
        user.profile_img = profile_img

    db.session.commit()

    return jsonify({"message": "Profil mis à jour avec succès", "user": {
        "id": user.id,
        "username": user.username,
        "profile_img": user.profile_img
    }}), 200