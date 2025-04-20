import React, { useState, useEffect } from 'react';
// import { createTask } from "../api"; // Import de la fonction depuis api.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/TaskForm.css";


const TaskForm = () => {
  const [task, setTask] = useState({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '' });

  const navigate = useNavigate();

  // Vérifier l'authentification
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login"); // Rediriger vers la connexion si non authentifié
      return;
    }

  }, [navigate]);

  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // const taskData = { title, description, priority, status, due_date };

    try {
      // const response = await axiosInstance.post('tasks', taskData);
      const response = await axios.post('http://127.0.0.1:5002/tasks', task, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // const response = await createTask(taskData);
      console.log('Réponse du serveur:', response.data);
      alert('Tâche créée avec succès!');
      // Réinitialiser les champs après création
      setTask({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '' });
    } catch (error) {
      console.error('Erreur lors de la création de la tâche', error);
      alert("Échec de la création de la tâche.");
    }
  };

  return (
    <div className="task-form">
      <h2 className="text-lg font-semibold mb-3">Add a New Task</h2>
      
      <form onSubmit={handleSubmit}>
        <h1>Créer une tâche</h1>
        <label>
          Titre:
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({...task, title: e.target.value})}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            value={task.description}
            onChange={(e) => setTask({...task, description: e.target.value})}
          />
        </label>
        <br />
        <label>
          Priorité:
          <select
            value={task.priority}
            onChange={(e) => setTask({...task, priority: e.target.value})}
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </label>
        <br />
        <label>
          Statut:
          <select
            value={task.status}
            onChange={(e) => setTask({...task, status: e.target.value})}
          >
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="done">Terminée</option>
          </select>
        </label> 
        <br />
        <label>
          Deadline:
          <input
            type="datetime-local"
            value={task.due_date}
            onChange={(e) => setTask({...task, due_date: e.target.value})}
          />
        </label>
        <br />
        <button type="submit">Créer la tâche</button>
      </form>
    </div>
  );
};

export default TaskForm;
