import { FiHome, FiClipboard, FiBell, FiUser } from "react-icons/fi"; 
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-icon active" onClick={() => navigate("/")}>
        <FiHome />
      </div>
      <div className="sidebar-icon" onClick={() => navigate("/tasks")}>
        <FiClipboard />
      </div>
      <div className="sidebar-icon" onClick={() => navigate("/notifications")}>
        <FiBell />
      </div>
      <div className="sidebar-icon settings" onClick={() => navigate("/profile")}>
        <FiUser />
      </div>
    </div>
  );
};

export default Sidebar;
