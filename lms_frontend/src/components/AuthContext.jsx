import React, { useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [page, setPage] = useState(token ? "profile" : "login");

  // Login
  const login = async (username, password) => {
    const res = await axios.post("http://localhost:8000/api/token/", { username, password });
    const data = res.data;
    setToken(data.access); // Use 'access' instead of 'token'
    localStorage.setItem("token", data.access); // Use 'access' instead of 'token'
    setPage("profile");
  };

  // Logout
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setPage("login");
  };

  // Register
  const register = async (username, email, password, role) => {
    await axios.post("http://localhost:8000/api/user/auth/", { username, email, password, role });
    setPage("login");
  };

  // Navigation helpers
  const goTo = (pageName) => setPage(pageName);

  return (
    <AuthContext.Provider value={{ token, login, logout, register, page, goTo }}>
      {children}
    </AuthContext.Provider>
  );
} 