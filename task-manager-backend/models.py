from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

# Define your models here

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False) 
    password = db.Column(db.String(200), nullable=False)
    profile_img = db.Column(db.String(300), nullable=True, default="task-manager-backend/static/images/default_profile.png")
    tasks = db.relationship('Task', backref='user', lazy=True)

    def set_password(self, password):
        """Hash le mot de passe avant de le sauvegarder"""
        self.password= bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Vérifie si le mot de passe est correct"""
        return bcrypt.check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "status": self.status
        }
    
class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default="À faire")
    priority = db.Column(db.String(20), default="Moyenne")
    # due_date = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    
    def __repr__(self):
        return f"<Task {self.title}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "due_date": self.due_date.strftime('%Y-%m-%d') if self.due_date else None,
            "user_id": self.user_id
        }

 
# Table de relation pour l'assignation des tâches
class TaskAssignment(db.Model):
    __tablename__ = 'task_assignments'
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    task = db.relationship('Task', backref=db.backref('assignments', lazy=True))
    user = db.relationship('User', backref=db.backref('assignments', lazy=True))

    def __repr__(self):
        return f"<TaskAssignment Task {self.task_id} User {self.user_id}>"