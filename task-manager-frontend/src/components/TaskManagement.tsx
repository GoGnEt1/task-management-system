
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AddTaskForm from "./AddTaskForm";
import Sidebar from "./Sidebar";
import StatsPanel from "./StatsPanel";
import EditTaskForm from "./EditTaskForm";
import TaskList from "./TaskList";
import { Task } from "../api";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";

const TaskManagement = () => {
    // const [tasks, setTasks] = useState<Task[]>([
    //   { id: 1, title: "Task 1", description: "Description 1", status: "pending", priority: "low", due_date: "2023-12-01" },
    //   { id: 2, title: "Task 2", description: "Description 2", status: "in-progress", priority: "medium", due_date: "2023-12-05" },
    //   { id: 3, title: "Task 3", description: "Description 3", status: "completed", priority: "high", due_date: "2023-12-10" },
    // ]);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5002/api/tasks", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          // Mettez à jour l'état avec les tâches récupérées
          setTasks(response.data);
        } catch (error) {
          console.error("Erreur lors du chargement des tâches :", error);
        }
      };
      fetchTasks();
    }, []);
  
    const navigate = useNavigate();
    
    // ✅ Ajouter une tâche dynamiquement
    const addTask = (newTask: Task) => {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: prevTasks.length + 1, title: newTask.title, description: newTask.description, status: newTask.status, priority: newTask.priority, due_date: new Date().toISOString() },
      ]);
      navigate("/tasks"); // Rediriger vers la liste des tâches après l'ajout
    };

    const deleteTask = async (id: number) => {
      try {
        // Appel au endpoint DELETE du backend
        await axios.delete(`http://127.0.0.1:5002/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Si la suppression dans la base de données a réussi, on met à jour le state
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error);
        alert("Une erreur est survenue lors de la suppression de la tâche.");
      }
    };
    
    // const deleteTask = (id: number) => {
    //   setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    // };
  
    const updateTask = (updatedTask: Task) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...updatedTask, updated_at: new Date().toISOString() } : task
        )
      );
      navigate("/tasks"); // Rediriger vers la liste des tâches après la mise à jour
    };
    return (
        <div className="container-application">
            <button type="button" className="btn-add-task" onClick={() => navigate("/tasks/add-task")}>Add Task</button>
            
            <div className="dashboard">
                <div className="sidebar-container">
                    <Sidebar />
                </div>
                <div className="tasklist-container">
                    <Routes>
                    <Route path="/" element={<TaskList tasks={tasks} onDelete={deleteTask}/>} />
                    <Route path="/add-task" element={<AddTaskForm addTask={addTask} />} />
                    <Route path="/edit/:id" element={<EditTaskForm tasks={tasks} updateTask={updateTask} />} />
                    <Route path="/in-progress" element={<TaskList tasks={tasks.filter((task) => task.status === "in-progress")} onDelete={deleteTask} />} />
                    <Route path="/completed" element={<TaskList tasks={tasks.filter((task) => task.status === "completed")} onDelete={deleteTask} />} />
                    <Route path="/pending" element={<TaskList tasks={tasks.filter((task) => task.status === "pending")} onDelete={deleteTask} />} />
                    </Routes>
                </div>
                <div className="stats-panel-container">
                    <StatsPanel totalTasks={tasks.length} inProgress={tasks.filter((t) => t.status === "in-progress").length} completed={tasks.filter((t) => t.status === "completed").length} openTasks={tasks.filter((t) => t.status === "pending").length} />
                </div>
            </div>
      </div>
  );};
  
export default TaskManagement;