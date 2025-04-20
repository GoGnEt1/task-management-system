import '../App.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/useAuth";
import axios from "axios";

interface LoginProps {
  setAuth: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const location = useLocation(); // Permet de détecter l'URL actuelle
  const [showLogin, setShowLogin] = useState<boolean>(false);

  const navigate = useNavigate(); // Pour la redirection

  // const { login } = useAuth();

  // ✅ Vérifier si on doit afficher le formulaire au chargement
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setShowLogin(queryParams.has("openLogin")); // Affiche si ?openLogin est présent
  }, [location]);

  // const handleLogin = () => {
  //   const token = 'fake-token'; // Obtenez le token réel ici
  //   login('user', token); // Appelle la fonction login du contexte
  // };

  // const closeLogin = () => {
  //   if (location.search.includes("openLogin")) {
  //     navigate("/login", { replace: true });
  //   } else {
  //     navigate("/", { replace: true });
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    console.log("Tentative de connexion avec :", email, password); // 🔍 Debugging

    try {
      // Envoyer les données au backend pour validation
      const response = await axios.post('http://127.0.0.1:5002/auth/login', {
        email,
        password,
      });

      console.log("Réponse du backend :", response.data); // 🔍 Ajout du log

      if (response.data.access_token) {
        // alert('Connexion réussie');
        setAuth(true);
        const username = response.data.user.username; // Récupérer le nom d'utilisateur
        localStorage.setItem('username', username);
        localStorage.setItem('token', response.data.access_token); // Sauvegarder le jeton d'authentification
        console.log("Utilisateur authentifié, redirection en cours...");
        navigate("/tasks"); // Rediriger vers la gestion des tâches
      } else {
        alert('Nom d’utilisateur ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  
  return (
    <div className={showLogin ? "show-login" : ""}>
      {/* <button type='button' className="login-btn" onClick={toggleLogin}>
        Log in
      </button> */}
      <div className="backdrop_filter" onClick={() => navigate("/login")}></div> 
      <i className="close-btn fa fa-times" onClick={() => navigate("/") }></i>
      {showLogin && (
        <form onSubmit={handleSubmit} method='post' autoComplete='off' className="flex flex-col gap-2 mt-4 login-form" >
          <h1>Connexion</h1>
          <div className="input_box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="p-2 border rounded"
            />
            <i className="fa-solid fa-envelope"></i>
          </div>
        
          <div className="input_box">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mot de passe"
            />
            <i className="fa-solid fa-lock"></i>
          </div>

          <div className="connecting">
            <label><input type="checkbox" required/> Se souvenir</label>
            <Link to="/password">Mot de passe oublié ?</Link>
          </div>
          <button type="submit" className="btn p-2 bg-blue-500 text-white rounded">Se connecter</button>

          <div className="end">
            <p>Pas encore de compte ?</p>
            <p><Link to="/register">S'inscrire</Link></p>
            {/* <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p> */}
          </div>
        </form>          
      )}
    </div>
  );
};

export default Login;
