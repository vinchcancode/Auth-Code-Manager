import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div>
      <button onClick={handleLogout} style={{ float: "right", margin: "10px" }}>
        Logout
      </button>
      <h2>Dashboard</h2>
      <textarea
        placeholder="Paste your code here..."
        rows="6"
        cols="50"
      ></textarea>
    </div>
  );
};

export default Dashboard;
