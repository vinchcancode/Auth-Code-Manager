import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { observeAuthState } from "./AuthService"; // Import the observer
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        navigate("/dashboard"); // ✅ Automatically navigate to Dashboard when logged in
      } else {
        navigate("/"); // ✅ Redirect to login if logged out
      }
    });

    return () => unsubscribe(); // Cleanup observer
  }, [navigate]);

  return <div>{!isAuthenticated ? <Login /> : <Dashboard />}</div>;
}

export default App;
