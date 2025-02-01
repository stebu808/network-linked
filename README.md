# Social Network AI

## Overview
This project is a **Node.js + Express** backend that integrates **Neo4j** for social network data storage and **GPT/LLM** for social relationship inference. The API allows users to add relationships, fetch social networks, and predict hidden connections using AI.

## Features
- Add users and their social connections.
- Retrieve a user’s **direct** and **indirect** (2nd-degree) connections.
- Use **GPT-4** to analyze social relationships and suggest **potential hidden connections**.

## Technologies Used
- **Node.js + Express** – Backend server.
- **Neo4j** – Graph database to store relationships.
- **OpenAI GPT-4** – AI-based social connection inference.
- **pnpm** – Package management.

---

## Installation
### Prerequisites
- **Node.js (v16+)** installed.
- **Neo4j** running locally or remotely.
- **OpenAI API key**.

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/stebu808/network-linked.git
   cd network-linked
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Set up **Neo4j credentials** in `social_network_ai.js`:
   ```javascript
   const driver = neo4j.driver(
     'neo4j://localhost',
     neo4j.auth.basic('your-neo4j-username', 'your-neo4j-password')
   );
   ```
4. Add your **OpenAI API key**:
   ```javascript
   const openai = new OpenAI({ apiKey: 'your-openai-api-key' });
   ```

---

## Running the Server
Start the server:
```sh
pnpm run server:dev
```

The server will run at:
```
http://localhost:3000
```

---

## API Endpoints
### 1. **Add User & Relationships**
- **Endpoint:** `POST /addUser`
- **Payload:**
  ```json
  {
    "name": "Alice",
    "friends": ["Bob", "Charlie"]
  }
  ```
- **Response:**
  ```json
  { "message": "User and relationships added" }
  ```

### 2. **Get User's Social Network**
- **Endpoint:** `GET /getNetwork/:name`
- **Example:**
  ```sh
  curl http://localhost:3000/getNetwork/Alice
  ```
- **Response:**
  ```json
  ["Bob", "Charlie"]
  ```

### 3. **Predict Hidden Relationships using GPT**
- **Endpoint:** `GET /predictRelationships/:name`
- **Example:**
  ```sh
  curl http://localhost:3000/predictRelationships/Alice
  ```
- **Response:**
  ```json
  { "predictions": "Alice and Charlie might know each other through shared professional interests." }
  ```

---

## Future Improvements
- Enhance AI model for **better relationship inference**.
- Add **real-time** recommendations.
- Build a **frontend** to visualize the social network.

---

## License
MIT License