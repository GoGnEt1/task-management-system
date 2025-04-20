// src/pages/Profile.tsx
import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import axios from "axios";

const Profile = () => {
  const { user, login } = useAuth();
  const [preview, setPreview] = useState(user?.profileImg || "");
  const [username, setName] = useState(user?.username || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < 2 * 1024 * 1024) { // Limite : 2 Mo
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgUrl = reader.result as string;
        setPreview(imgUrl);
        login({ username, profileImg: imgUrl }, localStorage.getItem("token") || "");
      };
      reader.readAsDataURL(file);
    } else {
      alert("L'image doit être inférieure à 2 Mo.");
    }
  };

  // const handleNameChange = () => {
  //   login({ username, profileImg: preview }, localStorage.getItem("token") || "");
  //   // alert("Profil mis à jour !");
  //   if (username.trim() !== "") {
      
  //     localStorage.setItem("username", username);
  //   }
  //   // setName(username);
  //   //reinitialiser le champ de texte après la mise à jour
  //   // setName("");
  // };
  
const handleNameChange = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token manquant. Veuillez vous reconnecter.");
      return;
    }
    if (username.trim() === "") {
      alert("Veuillez entrer un nom d'utilisateur valide.");
      return;
    }
    else {
      localStorage.setItem("username", username);
    }
    // Mettre à jour le nom d'utilisateur et l'image de profil sur le serveur
    await axios.put('http://127.0.0.1:5002/auth/update_profile', {
      username,
      profile_img: preview
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    // Mettre à jour localement aussi
    login({ username, profileImg: preview }, token || "");

    // alert("Profil mis à jour avec succès !");
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    alert("Erreur lors de la mise à jour du profil.");
  }
};

  const navigate = useNavigate();
  return (
    <div className="profile-container">
      <h2>Mon Profil</h2>
      <img src={preview} alt="avatar" className="profile-img" />
      <label htmlFor="profileImage">Choisir une image de profil</label>
      <input
        id="profileImage"
        type="file"
        accept="image/*"
        title="Sélectionnez une image de profil"
        onChange={handleImageChange}
      />
      <input
        type="text"
        placeholder="Votre nom"
        value={username}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="btn_profile">
        <button onClick={handleNameChange}>Mettre à jour</button>
        <button type="button" onClick={() => navigate("/tasks")}>Retour</button>
      </div>
    </div>
  );
};

export default Profile;
