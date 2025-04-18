import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig"; // Firebase setup
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [newCodes, setNewCodes] = useState("");
  const [codes, setCodes] = useState([]);
  const [blogspotLink, setBlogspotLink] = useState(null);

  const apiKey = "AIzaSyBgBO0RmyZ3C8Ze1stUTVv1EO7n-UyCOuk";
  const apiUrl = "https://www.googleapis.com/youtube/v3/search";
  const commentsApiUrl = "https://www.googleapis.com/youtube/v3/commentThreads";
  const channelId = "UCFbYQycybEVQzzCp6O-FzrQ";

  // Fetch Blogspot link from latest YouTube video comment
  useEffect(() => {
    const fetchLatestVideoAndTopComment = async () => {
      try {
        const videoResponse = await fetch(
          `${apiUrl}?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`
        );
        const videoData = await videoResponse.json();

        if (videoData.items && videoData.items.length > 0) {
          const videoId = videoData.items[0].id.videoId;

          const commentResponse = await fetch(
            `${commentsApiUrl}?key=${apiKey}&videoId=${videoId}&part=snippet&order=relevance&maxResults=1`
          );
          const commentData = await commentResponse.json();

          if (commentData.items && commentData.items.length > 0) {
            const commentHtml =
              commentData.items[0].snippet.topLevelComment.snippet.textDisplay;

            const parser = new DOMParser();
            const doc = parser.parseFromString(commentHtml, "text/html");
            const links = Array.from(doc.querySelectorAll("a")).map(
              (a) => a.href
            );
            const foundBlogspotLink = links.find((link) =>
              link.includes("blogspot.com")
            );

            setBlogspotLink(foundBlogspotLink || null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch YouTube comment blogspot link:", error);
      }
    };

    fetchLatestVideoAndTopComment();
  }, []);

  // Function to clean and extract valid 7-character codes
  const cleanCodes = (input) => {
    return input
      .split(/\s+/) // Split by spaces and new lines
      .flatMap((line) => line.split(".")) // Split each line at dots
      .map((code) => code.trim().slice(0, 7)) // Get only the first 7 characters
      .filter((code) => /^[A-Z0-9]{7}$/.test(code)); // Keep only valid 7-character codes
  };

  // Handle adding codes
  const handleAddCodes = async () => {
    if (!newCodes.trim()) return alert("Please paste codes first.");

    const cleanedCodes = cleanCodes(newCodes);
    if (cleanedCodes.length === 0) return alert("No valid codes found.");

    const user = auth.currentUser;
    if (user) {
      try {
        const userCodesRef = collection(db, "users", user.uid, "codes");

        await Promise.all(
          cleanedCodes.map((code) => addDoc(userCodesRef, { code }))
        );

        setCodes([
          ...codes,
          ...cleanedCodes.map((code) => ({ id: Date.now().toString(), code })),
        ]);

        setNewCodes("");
      } catch (error) {
        console.error("Error adding codes:", error);
      }
    }
  };

  // Handle logout
  const handleLogout = () => auth.signOut();

  // Copy code to clipboard
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code copied: ${code}`);
  };

  // Delete code
  const handleDeleteCode = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Reference the specific document inside Firestore
        await deleteDoc(doc(db, "users", user.uid, "codes", id));

        // Remove from state only if deletion from Firestore succeeds
        setCodes(codes.filter((code) => code.id !== id));
      } catch (error) {
        console.error("Error deleting code:", error);
      }
    }
  };

  // Fetch stored codes from Firestore on mount
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
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h2>Dashboard</h2>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div
        style={{
          color: "white",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",

          width: "150px",
        }}
      >
        Useful links
        <ul>
          <li>
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi"
              download
            >
              NodeJS
            </a>
          </li>
          <li>
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="https://code.visualstudio.com/docs/?dv=win64user"
              download
              target="blank"
            >
              VSCode
            </a>
          </li>
          <li>
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="https://central.github.com/deployments/desktop/desktop/latest/win32"
              download
            >
              GitHub
            </a>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/Forgooglecodes"
            >
              Google Auth-Code Page
            </Link>
          </li>
          <li>
            <a
              style={{ textDecoration: "none", color: "Salmon" }}
              href={blogspotLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Skins here
            </a>
          </li>
        </ul>
      </div>
      <div className={styles.txtAreaContainer}>
        <textarea
          className={styles.textArea}
          value={newCodes}
          onChange={(e) => setNewCodes(e.target.value)}
          placeholder="Paste your codes here"
          rows="6"
          cols="50"
        />
        <button className={styles.btn} onClick={handleAddCodes}>
          Add Codes
        </button>
      </div>
      <h3>Your Codes:</h3>
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

export default Dashboard;
