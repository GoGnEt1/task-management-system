import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TaskForm.css";
import axios from "axios";

import { Task } from "../api.ts";

interface AddTaskFormProps {
  addTask: (newTask: Task) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");


const navigate = useNavigate();

  // Vérifier l'authentification
  useEffect(() => {
    const user = localStorage.getItem("token"); // Vérifier si l'utilisateur est authentifié
    if (!user) {
      navigate("/login"); // Rediriger vers la connexion si non authentifié
      return;
    }

  }, [navigate]);

// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     if (!title.trim() || !description.trim()) {
//         alert("Veuillez remplir tous les champs !");
//         return;
//     }

//     try {
//         const newTask: Task = { title, description, priority, status: "todo", due_date: "" };
//         await addTask(newTask);
//         setTitle("");
//         setDescription("");
//         setPriority("medium");
//         // Task added successfully
//     } catch (error) {
//         console.error('Erreur lors de la création de la tâche', error);
//         alert("Échec de la création de la tâche.");
//     }
    
// };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim()) return;

  const newTask: Task = {
    title,
    description,
    priority,
    status,
    due_date: new Date().toISOString(),
  };

  try {

    const response = await axios.post('http://127.0.0.1:5002/api/tasks', newTask, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json" 
      },
    });
    console.log('Réponse du serveur:', response.data);

    if (response.status === 201) {  // 201 = Created
      addTask(response.data); 
      navigate("/tasks");
    } else {
      console.error("Erreur lors de la création de la tâche :", response.statusText);
      alert("Échec de la création de la tâche.");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }

};

  return (
    <div className="task-form">
      <h2 className="text-lg font-semibold mb-3">Add a New Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <label htmlFor="priority" className="block mb-1 font-medium">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >          
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Add Task
        </button>
        <button type="button" onClick={() => navigate("/tasks")}>Cancel</button>

      </form>
    </div>
  );
};

export default AddTaskForm;
