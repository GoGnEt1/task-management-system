import '../App.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

const Register: React.FC = () => {
  /*const [username, setusername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');*/
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate(); // Pour la redirection

  useEffect(() => {
    setVisible(true); // Rendre le formulaire visible
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });


  interface ChangeEvent {
    target: {
      name: string;
      value: string;
    };
  }

  const handleChange = (e: ChangeEvent) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  interface ResponseData {
    error?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // ✅ Vérifier si les mots de passe correspondent
    if (formData.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data: ResponseData = await response.json();
      if (response.ok) {
        // alert('Inscription réussie ! Connecte-toi maintenant.');
        navigate("/login?openLogin=true"); // Rediriger vers la page de connexion
      } else {
        alert(data.error || 'Erreur lors de l’inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError("Erreur de serveur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="register-container">
      <div  className={`backdrop_filter ${visible ? "show" : ""}`} onClick={() => navigate("/register")}></div> 
      <i className="close-btn fa fa-times" onClick={() => navigate("/") }></i>
      <form onSubmit={handleSubmit} method="post" autoComplete="off"  className={`register-form ${visible ? "show" : ""}`}>
        <h1>Inscription</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="input_box">
          <input
            type="text"
            // value={formData.username}
            name='username'
            // onChange={(e) => setusername(e.target.value)}
            required
            placeholder="Nom complet"
            onChange={handleChange}
          />
          <i className="fa-solid fa-user"></i>
        </div>

        <div className="input_box">
          <input
            type="email"
            name='email'
            // value={formData.email}
            //onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            onChange={handleChange}
          />
          <i className="fa-solid fa-envelope"></i>
        </div>

        <div className="input_box">
          <input
            type="password"
            name='password'
            // value={formData.password}
            // onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mot de passe"
            onChange={handleChange}
          />
          <i className="fa-solid fa-lock"></i>
        </div>

        <div className="input_box">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirmer le mot de passe"
            // onChange={handleChange}
          />
          <i className="fa-solid fa-lock"></i>
        </div>

        <div className="connecting">
          <label><input type="checkbox" required/> J'accepte les conditions d'utilisation </label>
        </div>

        <button type="submit" className="btn p-2 bg-blue-500 text-white rounded">S'inscrire</button>

        <div className="end">
          <p>Déjà un compte ?</p>
          <p><Link to="/login?openLogin=true">Se connecter</Link></p>
          {/* <p>Déjà un compte ? <Link to="/login?openLogin=true">Se connecter</Link></p> */}
        </div>
      </form>
    </div>
  );
};

export default Register;
