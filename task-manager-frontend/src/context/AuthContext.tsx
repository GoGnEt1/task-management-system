import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  profileImg: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>; // Ajout de setIsAuthenticated
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem("user") || "null"));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Erreur lors du parsing de l'utilisateur :", error);
      return null;
    }
  });
  
  const navigate = useNavigate();

  // Vérifie l'authentification au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("user",  JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setIsAuthenticated(true);
    navigate("/tasks"); // Redirection après connexion
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login"); // Redirection après déconnexion
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;