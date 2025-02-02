import { useState } from "react";
import axios from "axios";

const Card = ({ children }) => (
  <div className="border p-4 rounded-lg shadow">{children}</div>
);

const CardContent = ({ children }) => <div className="mt-2">{children}</div>;

const Button = ({ onClick, children }) => (
  <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
    {children}
  </button>
);


export default function SocialNetworkApp() {
  const [username, setUsername] = useState("");
  const [network, setNetwork] = useState([]);
  const [predictions, setPredictions] = useState("");

  const fetchNetwork = async () => {
    if (!username) return;
    try {
      const response = await axios.get(`http://localhost:3000/getNetwork/${username}`);
      setNetwork(response.data);
    } catch (error) {
      console.error("Error fetching network:", error);
    }
  };

  const fetchPredictions = async () => {
    if (!username) return;
    try {
      const response = await axios.get(`http://localhost:3000/predictRelationships/${username}`);
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Social Network AI</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex space-x-4">
        <Button onClick={fetchNetwork}>Get Network</Button>
        <Button onClick={fetchPredictions}>Predict Relationships</Button>
      </div>

      {network.length > 0 && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">User Network</h2>
            <ul>
              {network.map((friend, index) => (
                <li key={index} className="p-2 border-b">{friend}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {predictions && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">Predicted Relationships</h2>
            <p>{predictions}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
