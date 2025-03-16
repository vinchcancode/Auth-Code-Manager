import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig"; // Ensure you import `auth` and `db` correctly
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"; // Firestore functions

const Dashboard = () => {
  const [newCodes, setNewCodes] = useState(""); // Input for all codes
  const [codes, setCodes] = useState([]); // State to store cleaned and fetched codes

  // Handle adding codes from the input field
  const handleAddCodes = async () => {
    if (!newCodes.trim()) return alert("Please paste codes first.");

    // Clean the codes by removing the digits and the dot (e.g., 1.3VF6VF8 becomes 3VF6VF8)
    const cleanedCodes = newCodes
      .split(/\s+/) // Split the input by spaces (or new lines)
      .map(code => code.replace(/\d+\./g, "")) // Remove digits and dot before each code
      .filter(code => code.length === 7); // Ensure that only 7-character codes are added

    // Save the cleaned codes to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        const userCodesRef = collection(db, "users", user.uid, "codes");
        // Add each cleaned code to Firestore
        await Promise.all(
          cleanedCodes.map((code) =>
            addDoc(userCodesRef, { code: code })
          )
        );
        setCodes((prevCodes) => [
          ...prevCodes,
          ...cleanedCodes.map((code) => ({ id: Date.now().toString(), code })),
        ]); // Add the cleaned codes to state
        setNewCodes(""); // Clear the input field
      } catch (error) {
        console.error("Error adding codes:", error);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    auth.signOut();
  };

  // Handle copy code to clipboard
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code copied: ${code}`); // Alert to notify user the code was copied
  };

  // Handle deleting code
  const handleDeleteCode = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "codes", id));
        setCodes((prevCodes) => prevCodes.filter((code) => code.id !== id)); // Remove deleted code from state
      } catch (error) {
        console.error("Error deleting code:", error);
      }
    }
  };

  // Fetch codes from Firestore when component mounts
  useEffect(() => {
    const fetchCodes = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const codesSnapshot = await getDocs(
          collection(db, "users", user.uid, "codes")
        );
        const fetchedCodes = codesSnapshot.docs.map((doc) => ({
          id: doc.id,
          code: doc.data().code,
        }));
        setCodes(fetchedCodes);
      } catch (error) {
        console.error("Error fetching codes:", error);
      }
    };

    fetchCodes();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <textarea
          value={newCodes}
          onChange={(e) => setNewCodes(e.target.value)}
          placeholder="Paste your codes here (multiple codes allowed)"
          rows="6"
          cols="50"
        />
        <button onClick={handleAddCodes}>Add Codes</button>
      </div>
      <h3>Your Codes:</h3>
      <div>
        {codes.length > 0 ? (
          codes.map((codeObj) => (
            <div key={codeObj.id} style={{ marginBottom: "10px", padding: "5px", border: "1px solid #ccc" }}>
              <span>{codeObj.code}</span>
              <button onClick={() => handleCopyCode(codeObj.code)} style={{ marginLeft: "10px" }}>
                Copy
              </button>
              <button onClick={() => handleDeleteCode(codeObj.id)} style={{ marginLeft: "10px" }}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No codes found!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
