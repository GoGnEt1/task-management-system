// import { createContext, useState } from "react";

// export const TaskContext = createContext();

// interface task {
//     id: number;
//     title: string;
//     description: string;
//     priority: 'low' | 'medium' | 'high';
//     status: 'open' | 'in-progress' | 'completed';
//   }
// export const TaskProvider = ({ children }) => {
//   const [tasks, setTasks] = useState([
//     { id: 1, title: "Plan Weekend Trip", description: "Plan a trip itinerary", priority: "low", status: "open" },
//     { id: 2, title: "Team Meeting", description: "Meeting at 10 AM via Zoom", priority: "high", status: "in-progress" },
//     { id: 3, title: "Water Plants", description: "Water indoor plants", priority: "medium", status: "completed" }
//   ]);

//   // Fonction pour ajouter une nouvelle tâche
//   const addTask = (task) => {
//     setTasks([task, ...tasks]); // Ajoute la nouvelle tâche en premier
//   };

//   return (
//     <TaskContext.Provider value={{ tasks, addTask }}>
//       {children}
//     </TaskContext.Provider>
//   );
// };
