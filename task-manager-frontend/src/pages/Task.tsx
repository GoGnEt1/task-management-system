import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import TaskList from './components/TaskList';
// import TaskForm from './components/TaskForm';
function TaskPage() {
  interface Task {
    id: number;
    title: string;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate();

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Rediriger vers la connexion si non authentifié
      return;
    }

    axios.get("http://127.0.0.1:5002/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setTasks(response.data))
    .catch(error => console.error("Erreur de chargement des tâches:", error));
  }, [navigate]);

  // Ajouter une tâche
  const addTask = () => {
    if (newTask.trim() === "") return;

    const token = localStorage.getItem("token");
    axios.post("http://127.0.0.1:5002/tasks", { title: newTask }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      setTasks([...tasks, response.data]);
      setNewTask("");
    })
    .catch(error => console.error("Erreur d'ajout de tâche:", error));
  };

  // Supprimer une tâche
const deleteTask = (id: number) => {
    const token = localStorage.getItem("token");
    axios.delete(`http://127.0.0.1:5002/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => setTasks(tasks.filter(task => task.id !== id)))
    .catch(error => console.error("Erreur de suppression de tâche:", error));
};

  // Déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Gestion des Tâches</h1>
      <button onClick={logout}>Déconnexion</button>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nouvelle tâche..."
      />
      <button onClick={addTask}>Ajouter</button>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskPage;
