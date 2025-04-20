import { useAuth } from "../context/useAuth";
import { useNavigate, useLocation } from "react-router-dom";


const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Permet de rediriger
  const location = useLocation(); // Permet de connaître la route actuelle
  return (
    <nav >
      {/* Vérifiez si la route n'est pas "/login" */}
      {location.pathname !== "/login" && location.pathname !== "/register" && ( !isAuthenticated &&  (
        <div className="navbar-container">
          <div className="navbar">
          <h1 className="text-xl font-bold">Gestion des Tâches</h1> 
          <>
            <button type="button" onClick={() => navigate("/login?openLogin=true")} className="login-btn">
              Connexion / Inscription
            </button>
          </>
          
        </div>
        <p className="page-description">
          Bienvenue sur l'application de gestion des tâches. Vous pouvez vous connecter ou vous inscrire pour commencer à gérer vos tâches.
        </p>
        </div>
      ))}
    </nav>
  );
};

export default Navbar; 
