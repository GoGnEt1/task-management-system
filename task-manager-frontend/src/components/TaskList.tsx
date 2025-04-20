/* import { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  // const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>('http://127.0.0.1:5002/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);


// Supprimer une tâche
const deleteTask = async (id: number) => {
  const token = localStorage.getItem("token");
  if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

  try {
    await axios.delete(`http://127.0.0.1:5002/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task.id !== id)); // Mettre à jour la liste sans la tâche supprimée
    alert('Tâche supprimée avec succès !');
  } catch (error) {
    console.error('Erreur de suppression de tâche:', error);
    alert("Erreur lors de la suppression de la tâche.");
  }
};

// Mettre à jour une tâche
const updateTask = async (id: number, updatedTask: Partial<Task>) => {
  if (!confirm("Voulez-vous vraiment modifier cette tâche ?")) return;

  try {
    const response = await axios.put(`http://127.0.0.1:5002/tasks/${id}`, updatedTask, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setTasks(tasks.map((task) => (task.id === id ? response.data : task))); // Mettre à jour la tâche modifiée
    alert("Tâche mise à jour avec succès !");
  } catch (error) {
    console.error('Erreur de mise à jour de tâche:', error);
    alert("Erreur lors de la mise à jour de la tâche.");
  }
};


  return (
    <div>
      <h2>Liste des Tâches</h2>
      {loading ? <p>Chargement...</p> : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Priorité:</strong> {task.priority}</p>
              <p><strong>Statut:</strong> {task.status}</p>
              <p><strong>Deadline:</strong> {task.due_date}</p>
              <button type='button' onClick={() => deleteTask(task.id)}> ❌ Supprimer</button>
              <button onClick={() => updateTask(task.id, { title: 'Titre modifié', status: 'in_progress' })}>Mettre à jour</button>          </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
 

import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTaskStatus } from "../api.ts";
import { Task } from "../api.ts"; // Importer le type Task défini dans api.ts

import AddTaskForm from "./AddTaskForm";


const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [filter, setFilter] = useState(""); // État du filtre

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const reponse = await getTasks();
      
      setTasks(reponse);
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches', error);
    }
  };

  const handleDelete = async (taskId: number): Promise<void> => {
    await deleteTask(taskId);
    fetchTasks(); // Rafraîchir la liste après suppression
  };

  const handleUpdateStatus = async (taskId: number, newStatus:string) => {
    await updateTaskStatus(taskId, newStatus);
    fetchTasks();
  };


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">All Tasks</h2>
      {/* Filtres }*//*
      <div className="flex gap-3 my-4">
        <button className="bg-gray-300 p-2 rounded" onClick={() => setFilter("")}>
          All
        </button>
        <button className="bg-yellow-300 p-2 rounded" onClick={() => setFilter("pending")}>
          Pending
        </button>
        <button className="bg-blue-300 p-2 rounded" onClick={() => setFilter("in-progress")}>
          In Progress
        </button>
        <button className="bg-green-300 p-2 rounded" onClick={() => setFilter("completed")}>
          Completed
        </button>
      </div>

      // {/* Ajouter le formulaire d'ajout de tâche }/*
      <AddTaskForm onTaskAdded={fetchTasks} />

      <div className="grid grid-cols-3 gap-4 mt-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-400">{task.priority} priority</p>
            <p className="text-sm text-gray-400">{task.status}</p>
            <p className="text-sm text-gray-400">{task.due_date}</p>
            
            
            Boutons pour changer le statut
            <div className="flex gap-2 mt-2">
              {task.status !== "in-progress" && (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => task.id !== undefined && handleUpdateStatus(task.id, "in-progress")}
                >
                  In Progress
                </button>
              )}
              {task.status !== "completed" && (
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => task.id !== undefined && handleUpdateStatus(task.id, "in-progress")}
                >
                  Complete
                </button>
              )}
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => task.id !== undefined && handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

import { NavLink, useLocation } from "react-router-dom";
import TaskCard from "./TaskCard";
import "../styles/TaskList.css";

const tasks = [
  { title: "Plan Weekend Trip", description: "Plan a trip itinerary", priority: "low" },
  { title: "Team Meeting", description: "Meeting at 10 AM via Zoom", priority: "high" },
  { title: "Water Plants", description: "Water indoor plants", priority: "medium" },
  { title: "Finish Presentation", description: "Complete PowerPoint slides", priority: "low" },
  { title: "Backup Files", description: "Save files to cloud storage", priority: "medium" },
  { title: "Update Resume", description: "Revise and update work experience", priority: "medium" },
  
];
const Navbars = () => {
  const location = useLocation();
  const pageTitle = location.pathname === "/" ? "All Tasks" : location.pathname.replace("/", "").replace("-", " ");

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="containers mx-auto flex justify-between">
        <h1 className="text-lg font-bold">{pageTitle}</h1>
        <div className="NavLinks">
          <NavLink to="/" className={({ isActive }) => (isActive ? "mx-2 font-bold" : "mx-2")}>
            All Tasks
          </NavLink>
          <NavLink to="/in-progress" className={({ isActive }) => (isActive ? "mx-2 font-bold" : "mx-2")}>
            In Progress
          </NavLink>
          <NavLink to="/completed" className={({ isActive }) => (isActive ? "mx-2 font-bold" : "mx-2")}>
            Completed
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const TaskList = () => {
  return (
    <div className="task-list-container">
      <Navbars />
      <div className="task-list">
        {tasks.map((task, index) => ( <TaskCard key={index} task={task} />
          
        ))}
      </div> 
    </div>
    
  );
};

export default TaskList;
*/
/*
import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import TaskCard from "./TaskCard";
import "../styles/TaskList.css";

// import { FC } from "react";
import { Task } from "../api.ts"; // Assuming Task type is defined in api.ts

const Navbars = () => {
  const location = useLocation();
  const pageTitle = location.pathname === "/" ? "All Tasks" : location.pathname.replace("/", "").replace("-", " ");

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="containers mx-auto flex justify-between">
        <h1 className="text-lg font-bold">{pageTitle}</h1>
        <div className="NavLinks">
          <NavLink to="/" className={({ isActive }) => (isActive ? "mx-2 font-bold" : "mx-2")}>
            All Tasks
          </NavLink>
          <NavLink to="/in-progress" className={({ isActive }) => (isActive ? "mx-2 font-bold" : "mx-2")}>
            In Progress
          </NavLink>
          <NavLink to="/completed" className={({ isActive }) => (isActive ? "mx-2 font-bold" : "mx-2")}>
            Completed
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/in-progress") {
      setFilteredTasks(tasks.filter((task) => task.status === "in-progress"));
    } else if (location.pathname === "/completed") {
      setFilteredTasks(tasks.filter((task) => task.status === "completed"));
    } else {
      setFilteredTasks(tasks);
    }
  }, [location.pathname, tasks]);

  return (
    <div className="task-list-container">
      <Navbars />
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          filteredTasks.map((task, index) => <TaskCard key={index} task={task}  onDelete={onDelete}/>)
        )}
      </div>
    </div>
  );
};

export default TaskList;
*/

import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import TaskCard from "./TaskCard";
import "../styles/TaskList.css";
import { Task } from "../api.ts"; // Assuming Task type is defined in api.ts

const Navbars = () => {
  const location = useLocation();
  const pageTitle =
    location.pathname === "/tasks"
      ? "All Tasks"
      : location.pathname.replace("/tasks/", "").replace("-", " ");

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="containers mx-auto flex justify-between">
        <h1 className="text-lg font-bold">{pageTitle}</h1>
        <div className="NavLinks">
          <NavLink
            to="/tasks"
            className={({ isActive }) => (isActive ? "mx-2 font-bold" : "mx-2")}
          >
            All Tasks
          </NavLink>
          <NavLink
            to="/tasks/in-progress"
            className={({ isActive }) =>
              isActive ? "mx-2 font-bold" : "mx-2"
            }
          >
            In Progress
          </NavLink>
          <NavLink
            to="/tasks/completed"
            className={({ isActive }) =>
              isActive ? "mx-2 font-bold" : "mx-2"
            }
          >
            Completed
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete }) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;
  const location = useLocation();

  // Filtrage des tâches en fonction du statut
  useEffect(() => {
    let filtered = tasks;
    if (location.pathname === "/tasks/in-progress") {
      filtered = tasks.filter((task) => (task.status?.toLowerCase() ?? "") === "in-progress");
    } else if (location.pathname === "/tasks/completed") {
      filtered = tasks.filter((task) => (task.status?.toLowerCase() ?? "") === "completed");
    }
    setFilteredTasks(filtered);
    setCurrentPage(1); // Réinitialiser la pagination après un filtre
  }, [location.pathname, tasks]);

  // Calculer les tâches de la page actuelle
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const currentTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  // Changer de page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="task-list-container">
      <Navbars />
      <div className="task-list">
        {currentTasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          currentTasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            {"<"}
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}

          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
