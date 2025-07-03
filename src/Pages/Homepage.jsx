import { useAuth } from "../Providers/AuthProvider";
import { useState } from "react";
import axios from "axios";
import "./Homepage.css";

const Homepage = () => {
  const auth = useAuth();
  const [userInput, setUserInput] = useState(""); // Initialize userInput state
  const [result, setResult] = useState(""); // State to hold the result from the server

  const handleClick = async () => {
    console.log("Something")
    /**
     * This function sends the userInput to the server and gets the result
     * The result is then set to the result state
     */
    try {
      // Send userInput to the server at PORT 5000 and get the result
      const response = await axios.post("http://localhost:5000/run-python", {
        userInput, // Send the userInput state
      });
      setResult(response.data.result); // Set the result state
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
      {/* Added button text */}
      <h1>Homepage</h1>
      {result && <div className="result">{result}</div>}{" "}
      {/* Display result if available */}
    </div>
  );
};

export default Homepage;
