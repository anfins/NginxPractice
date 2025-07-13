import { useAuth } from "../../Providers/AuthProvider";
import { useState, useEffect } from "react";
import axios from "axios";
import { firestore } from "../../Services/Firebase";

import "./Homepage.css";

const Homepage = () => {
  const auth = useAuth(); //contains user info
  const [userInput, setUserInput] = useState(""); // Initialize userInput state
  const [result, setResult] = useState(""); // State to hold the result from the server
  const [userData, setUserData] = useState({});

  const [responseLoading, setResponseLoading] = useState(false);

  useEffect(() => {}, []);

  const handleClick = async () => {
    /**
     * This function sends the userInput to the server and gets the result
     * The result is then set to the result state
     */
    try {
      // Send userInput to the server at PORT 5000 and get the result
      setResponseLoading(true);
      const response = await axios.post("http://localhost:5000/run-python", {
        userInput, // Send the userInput state
      });
      setResult(response.data.result); // Set the result state
      setResponseLoading(false);
    } catch (error) {
      console.error("Error calling Python script:", error);
    }
  };

  return (
    <div className="container">
      <input
        onChange={(e) => setUserInput(e.target.value)} // Update userInput state
        className="search-bar"
        type="text"
        placeholder="Search"
      />
      <button onClick={handleClick}>Run Script</button>{" "}
      {responseLoading === true && <p>Loading Response</p>}
      {/* Added button text */}
      {result && <div className="result">{result}</div>}{" "}
    </div>
  );
};

export default Homepage;
