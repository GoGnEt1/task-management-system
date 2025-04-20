// import { FaTasks } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/StatsPanel.css";
import profileImg from './profile.jpg';
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";

interface StatsPanelProps {
  totalTasks: number;
  inProgress: number;
  openTasks: number;
  completed: number;
}

const StatsPanel = ({ totalTasks, inProgress, openTasks, completed }: StatsPanelProps) => {
  const percentage = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // Empêche l'utilisateur de revenir en arrière avec le bouton "Retour"
    window.location.reload(); // Recharge la page pour s'assurer que le contexte est bien mis à jour
    // navigate("/"); // Rediriger vers la page de connexion ou une autre page après la déconnexion
  };

  return (
    <div className="stats-panel">
      {/* Section Profil */}
      <div className="user-info">
        <img src={user?.profileImg || profileImg} alt="User Avatar" className="avatar" />
        {/* <img src={profileImg} alt="User Avatar" className="avatar" /> */}
        <div>
          <h4>Hello, {localStorage.getItem('username') || "William Slatter"}</h4>
        </div>
      </div>

      {/* Section Statistiques */}
      <div className="stats-summary">
        <div className="stat">
          <p>Total Tasks:</p>
          <h3 className="total">{totalTasks}</h3>
        </div>
        <div className="stat">
          <p>In Progress:</p>
          <h3 className="in-progress">{inProgress}</h3>
        </div>
        <div className="stat">
          <p>Open Tasks:</p>
          <h3 className="open">{openTasks}</h3>
        </div>
        <div className="stat">
          <p>Completed:</p>
          <h3 className="completed">{completed}</h3>
        </div>
      </div>

      {/* Section Jauge de Progression */}
      <div className="task-progress">
        <h4>Completed vs Pending Tasks</h4>
        <div className="progress-circle">
          <CircularProgressbar
            value={percentage}
            text={`${completed} Tasks`}
            styles={buildStyles({
              pathColor: percentage >= 50 ? "#28a745" : "#FF5733",
              textColor: "#333",
              trailColor: "#ddd",
              strokeLinecap: "round",
              textSize: "14px",
            })}
          />
        </div>
        <p className="progress-text">Task completion improved by {Math.round(percentage)}% this month</p>
        <small>Analysis based on tasks completed in the last 30 days.</small>
      </div>

      {/* Bouton Sign Out */}
      <button className="signout-btn" onClick={handleLogout}>
        Sign Out 
      </button>
    </div>
  );
};

export default StatsPanel;
