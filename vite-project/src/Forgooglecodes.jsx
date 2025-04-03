import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import styles from "./Forgooglecodes.module.css";

const Forgooglecodes = () => {
  const [newCodes, setNewCodes] = useState("");
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddCodes = async () => {
    if (!newCodes.trim()) return;

    const codesArray = newCodes.split(/\s+/);
    if (codesArray.length === 0) return;

    const user = auth.currentUser;
    if (user) {
      setLoading(true);

      try {
        const userCodesRef = collection(db, "users", user.uid, "googleCodes");

        await Promise.all(
          codesArray.map((code) => addDoc(userCodesRef, { code }))
        );

        const newCodesWithIds = codesArray.map((code) => ({
          id: Date.now().toString(),
          code,
        }));
        setCodes([...codes, ...newCodesWithIds]);
        setNewCodes("");
      } catch (error) {
        console.error("Error adding codes:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => auth.signOut();

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  const handleDeleteCode = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "googleCodes", id));
        setCodes(codes.filter((code) => code.id !== id));
      } catch (error) {
        console.error("Error deleting code:", error);
      }
    }
  };

  useEffect(() => {
    const fetchCodes = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const codesSnapshot = await getDocs(
          collection(db, "users", user.uid, "googleCodes")
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
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h2>Google Auth Codes</h2>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className={styles.txtAreaContainer}>
        <textarea
          className={styles.textArea}
          value={newCodes}
          onChange={(e) => setNewCodes(e.target.value)}
          placeholder="Paste your Google Auth codes here"
          rows="6"
          cols="50"
        />
        <button
          className={styles.btn}
          onClick={handleAddCodes}
          disabled={loading}
        >
          Add Codes
        </button>
        {loading && <p>Loading...</p>}
      </div>
      <h3>Your Google Auth Codes:</h3>
      <div className={styles.codeList}>
        {codes.length > 0 ? (
          codes.map((codeObj) => (
            <div key={codeObj.id} className={styles.codeItem}>
              <span>{codeObj.code}</span>
              <button
                className={styles.copyBtn}
                onClick={() => handleCopyCode(codeObj.code)}
              >
                Copy
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDeleteCode(codeObj.id)}
              >
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

export default Forgooglecodes;
