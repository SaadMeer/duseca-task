import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Create a context for authentication
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Track the logged-in user
  const navigate = useNavigate();

  const login = (email, password) => {
    // In a real app, you'd validate this with an API.
    // For now, mock login for the example
    const mockUser = {
      email,
      role: email.includes("admin") ? "admin" : email.includes("manager") ? "manager" : "user",
    };
    setUser(mockUser); // Set the user based on login details
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
