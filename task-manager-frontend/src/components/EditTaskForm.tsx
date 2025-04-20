import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Task } from "../api";
import "../styles/TaskForm.css";
import axios from "axios";

interface EditTaskFormProps {
  tasks: Task[];
  updateTask: (updatedTask: Task) => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ tasks, updateTask }) => {
  const navigate = useNavigate();
//   const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const taskId = parseInt(id || "0", 10);
//   const taskId = parseInt(new URLSearchParams(location.search).get("id") || "0", 10);
  const task = tasks.find((t) => t.id === taskId);

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [status, setStatus] = useState(task?.status || "pending");

  if (!task) {
    return <p>Task not found.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() ) return;
    const updatedTask = { ...task, title, description, priority, status, updated_at: new Date().toISOString() };
    // updateTask(updatedTask);
    try {
      // On envoie la requête PUT via Axios pour mettre à jour la tâche dans la base
      const response = await axios.put(`http://127.0.0.1:5002/api/tasks/${id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Tâche mise à jour: ", response.data);
      // Mettez à jour le state global en utilisant la fonction updateTask
      updateTask({
        ...task!,
        ...updatedTask,
        id: Number(id),
      });
      navigate("/tasks");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      alert("Une erreur est survenue lors de la mise à jour de la tâche.");
    }
    navigate("/tasks"); // Retour à la page précédente
  };

  return (
    <div className="task-form">
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <label htmlFor="priority-select">Priority</label>
        <select id="priority-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label htmlFor="status-select">Status</label>
        <select id="status-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <p>Created: {new Date(task.due_date).toLocaleString()}</p>
        {task.updated_at && <p>Last Modified: {new Date(task.updated_at).toLocaleString()}</p>}
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate("/tasks")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditTaskForm;
