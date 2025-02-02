# Social Network AI

## Overview
This project is a **Node.js + Express** backend that integrates **Neo4j** for social network data storage and **GPT/LLM** for social relationship inference. The API allows users to add relationships, fetch social networks, and predict hidden connections using AI.

## Features
- Add users and their social connections.
- Retrieve a user’s **direct** and **indirect** (2nd-degree) connections.
- Use **GPT-4** to analyze social relationships and suggest **potential hidden connections**.
- Fetch real-time relationship data from **Twitter** and **LinkedIn** APIs.
- Automatically update **Neo4j** every 10 minutes.

## Technologies Used
- **Node.js + Express** – Backend server.
- **Neo4j** – Graph database to store relationships.
- **OpenAI GPT-4** – AI-based social connection inference.
- **Twitter API & LinkedIn API** – Fetch live social data.
- **pnpm** – Package management.

---

## Installation
### Prerequisites
- **Node.js (v16+)** installed.
- **Neo4j** running locally or remotely.
- **OpenAI API key**.
- **Twitter & LinkedIn API credentials**.

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/social-network-ai.git
   cd social-network-ai
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. **Set up environment variables**:
   Create a `.env` file in the project root and add the following:
   ```ini
   # Neo4j Credentials
   NEO4J_USER=your-neo4j-username
   NEO4J_PASSWORD=your-neo4j-password
   
   # OpenAI API Key
   OPENAI_API_KEY=your-openai-api-key
   
   # Twitter API Token
   TWITTER_BEARER_TOKEN=your-twitter-api-token
   
   # LinkedIn API Token
   LINKEDIN_ACCESS_TOKEN=your-linkedin-api-token
   ```
4. Ensure `.env` is loaded in your project by adding this to your code if not present:
   ```javascript
   require('dotenv').config();
   ```

---

## Running the Server
Start the server using **npx**:
```sh
npx node social_network_ai.js
```
Or using **nodemon** (for automatic restarts on changes):
```sh
pnpm install -g nodemon
nodemon social_network_ai.js
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

### 4. **Manually Update Neo4j with API Data**
- **Endpoint:** `POST /updateNeo4j`
- **Example:**
  ```sh
  curl -X POST http://localhost:3001/updateNeo4j
  ```
- **Response:**
  ```json
  { "message": "Neo4j update triggered" }
  ```

---

## Future Improvements
- Enhance AI model for **better relationship inference**.
- Add **real-time** recommendations.
- Build a **frontend** to visualize the social network.

---

## License
MIT License
