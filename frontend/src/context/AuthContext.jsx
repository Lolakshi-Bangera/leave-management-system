import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("leave_user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("leave_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/users/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("leave_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("leave_token");
        localStorage.removeItem("leave_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("leave_token", data.token);
    localStorage.setItem("leave_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const refreshUser = async () => {
    const { data } = await api.get("/users/me");
    setUser(data.user);
    localStorage.setItem("leave_user", JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("leave_token");
    localStorage.removeItem("leave_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
