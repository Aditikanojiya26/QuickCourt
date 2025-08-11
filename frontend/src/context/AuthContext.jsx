// src/context/AuthContext.jsx
import { createContext, useContext } from "react";
import { useAuthQuery } from "../services/auth/useAuthQuery";
import { queryClient } from "../utils/queryClient";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: user, isLoading, isError } = useAuthQuery();

  return (
    <AuthContext.Provider value={{ user, isLoading, isError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
