from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task, User, TaskAssignment
from datetime import datetime, timezone

tasks_bp = Blueprint('tasks', __name__)

# Route pour créer une tâche
@tasks_bp.route('/tasks', methods=['POST'])
# @app.route("/tasks", methods=["POST"])
@jwt_required()  # Protection de la route avec JWT
# Créer une nouvelle tâche
def create_task():
    try:
        # Vérifiez si les données JSON existent et sont bien formatées
        if not request.is_json:
            return jsonify({'message': 'Payload must be JSON'}), 400

        data = request.get_json()
        if not data:
            return jsonify({'message': 'Payload is empty'}), 400
        
        title = data.get('title')
        description = data.get('description', '')
        priority = data.get('priority', 'Moyenne')
        due_date = data.get('due_date')
        status=data.get('status', 'À faire') # Ajout de la valeur par défaut pour le statut
        user_id = get_jwt_identity()
        # user_id = data.get('user_id')

        if not title:
            return jsonify({"error": "Le titre de la tâche est obligatoire"}), 400

        if due_date:
            due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
        else:
            due_date = datetime.now(timezone.utc)  # Si pas de date, on met la date actuelle

        task = Task(title=title, description=description, status=status, priority=priority, due_date=due_date, user_id=user_id)

        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201
        # return jsonify({"message": "Tâche créée avec succès", "task_id": task.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@tasks_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()  # ID de l'utilisateur connecté
    status_filter = request.args.get("status")
    
    query = Task.query.filter_by(user_id=user_id)
    
    if status_filter:
        query = query.filter_by(status=status_filter)

    tasks = query.all()

    return jsonify([task.to_dict() for task in tasks])


# Récupérer une tâche spécifique
@tasks_bp.route('/tasks/<int:task_id>', methods=['GET'])
@jwt_required()  # Protection de la route avec JWT
def get_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"message": "Tâche non trouvée"}), 404
    return jsonify({
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "due_date": task.due_date.strftime('%Y-%m-%d') if task.due_date else None,
        "user_id": task.user_id
    })


# Modifier une tâche
@tasks_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()  # Protection de la route avec JWT
def update_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"message": "Tâche non trouvée"}), 404

    data = request.json
    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.status = data.get("status", task.status)
    task.priority = data.get("priority", task.priority)
    # task.due_date = data.get("due_date", task.due_date)
    new_due_date = data.get("due_date")
    if new_due_date:
        task.due_date = datetime.fromisoformat(new_due_date.replace('Z', '+00:00'))


    db.session.commit()
    return jsonify({"message": "Tâche mise à jour avec succès!"}), 200

# Supprimer une tâche
@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()  # Protection de la route avec JWT
def delete_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"message": "Tâche non trouvée"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Tâche supprimée avec succès!"}), 200
 
@tasks_bp.route('/assign_task', methods=['POST'])
@jwt_required()
def assign_task():
    data = request.get_json()
    task_id = data.get('task_id')
    email = data.get('email')

    task = Task.query.get(task_id)
    # user = User.query.get(user_id, email=email)
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    if not task:
        return jsonify({"message": "Tâche non trouvée"}), 404

    # Vérifier qu'il n'y a pas déjà une assignation pour cette tâche avec ce user
    existing_assignment = TaskAssignment.query.filter_by(task_id=task_id, user_id=user.id).first()
    if existing_assignment:
        return jsonify({"message": "La tâche est déjà assignée à cet utilisateur"}), 400

    existing_assignments = TaskAssignment.query.filter_by(task_id=task_id).count()

    if existing_assignments >= 4:
        return jsonify({"error": "Nombre maximal d'assignations atteint pour cette tâche"}), 400

    assignment = TaskAssignment(task_id=task_id, user_id=user.id)
    db.session.add(assignment)
    db.session.commit()

    return jsonify({"message": "Tâche assignée avec succès",
        "assignment": {
            "id": assignment.id,
            "task_id": assignment.task_id,
            "user_id": assignment.user_id,
            "assigned_at": assignment.assigned_at.strftime("%Y-%m-%d %H:%M:%S")
        }}), 201