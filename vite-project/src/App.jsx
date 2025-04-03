import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { observeAuthState } from "./AuthService";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Forgooglecodes from "./Forgooglecodes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      setIsAuthenticated(!!user);

      // Redirect only when accessing restricted pages
      const currentPath = window.location.pathname;
      if (!user && currentPath !== "/") {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Login />}
      />
      <Route
        path="/Forgooglecodes"
        element={isAuthenticated ? <Forgooglecodes /> : <Login />}
      />
    </Routes>
  );
}

export default App;
