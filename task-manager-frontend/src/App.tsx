import { useEffect} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import TaskManagement from './components/TaskManagement';
import UpdateProfile from "./pages/UpdateProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/useAuth";
import Navbar from './components/Navbar';
import "./App.css";


const App: React.FC = () => {
  
  const { setIsAuthenticated, isAuthenticated, login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem("user");

    if (token && userData && !isAuthenticated) {
      const user = JSON.parse(userData); // on parse l'objet user
      login(user, token);
    }
  }, [isAuthenticated, login]);
  
  return (
  <div>
    {/* <Navbar /> */}
    <Routes>
      <Route path="/" element={ <Navbar />} />
      <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/tasks" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/tasks" replace />} />
      <Route path="/tasks/*" element={isAuthenticated ? <TaskManagement /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isAuthenticated ? <UpdateProfile /> : <Navigate to="/login" replace />} />
    </Routes>
  </div>
);
}

export default App; 

/*
import { Task } from "./api";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import Sidebar from "./components/Sidebar";
import StatsPanel from "./components/StatsPanel";
import EditTaskForm from "./components/EditTaskForm";

import "./App.css";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Task 1", description: "Description 1", status: "pending", priority: "low", due_date: "2023-12-01" },
    { id: 2, title: "Task 2", description: "Description 2", status: "in-progress", priority: "medium", due_date: "2023-12-05" },
    { id: 3, title: "Task 3", description: "Description 3", status: "completed", priority: "high", due_date: "2023-12-10" },
  ]);

  const navigate = useNavigate();
  
  // ✅ Ajouter une tâche dynamiquement
  const addTask = (newTask: Task) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: prevTasks.length + 1, title: newTask.title, description: newTask.description, status: newTask.status, priority: newTask.priority, due_date: new Date().toISOString() },
    ]);
    // setTasks((prevTasks) => [...prevTasks, newTask]); // Utilisation de prevTasks
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? { ...updatedTask, updated_at: new Date().toISOString() } : task
      )
    );
  };


  return (
   
    <div className="container-application">
      <button className="btn-add-task" onClick={() => navigate("/add-task")}>Add Task</button>
      
      <div className="dashboard">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="tasklist-container">
          <TaskList tasks={tasks} onDelete={deleteTask}/>
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
      
  );
}

export default App;

import TaskList from "./components/TaskList";
import StatsPanel from "./components/StatsPanel";
import "./App.css";

const App = () => {
  return (
    <div className="dashboard">
      
      <TaskList />
      <StatsPanel totalTasks={6} inProgress={4} completed={2} />
    </div>
  );
};
<div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/in-progress" element={<h2>In Progress Tasks</h2>} />
          <Route path="/completed" element={<h2>Completed Tasks</h2>} />
        </Routes>
      </div> 
    </div> <div>
export default App;
*/

    
     {/* <Navbar /> */}
    {/* <h1>Application de Gestion des Tâches</h1> */}
    {/* <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/tasks" replace/>} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/tasks" replace/>} />
      <Route
        path="/tasks/*"
        element={
          isAuthenticated ? (
            // console.log("Utilisateur authentifié, affichage de l'application..."),
            <div className="container-application">
              <button className="btn-add-task" onClick={
                () => (navigate("/tasks/add-task"),
                console.log("Ajout d'une tâche"))
              }>Add Task</button>
              
              <div className="dashboard">
                <div className="sidebar-container">
                  <Sidebar />
                </div>
                <div className="tasklist-container">
                  <TaskList tasks={tasks} onDelete={deleteTask}/>
                  <Routes>
                    <Route path="/" element={<TaskList tasks={tasks} onDelete={deleteTask}/>} />
                    <Route path="add-task" element={<AddTaskForm addTask={addTask} />} />
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
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={!isAuthenticated? (<p className="p_acceuil">Veuillez vous connecter pour accéder à l'application.</p>): (<p></p>)} />
    </Routes> */}