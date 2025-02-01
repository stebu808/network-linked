// Node.js + Express backend API with GPT / LLM for social relationship inference
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Neo4j database
const driver = neo4j.driver(
  'neo4j://localhost',
  neo4j.auth.basic('neo4j', 'password')
);
const session = driver.session();

// Initialize OpenAI
const openai = new OpenAI({ apiKey: 'your-openai-api-key' });

// API: Add user and their social relationships
app.post('/addUser', async (req, res) => {
  const { name, friends } = req.body;
  try {
    await session.writeTransaction(tx =>
      tx.run(
        `MERGE (u:User {name: $name})
         WITH u
         UNWIND $friends AS friend
         MERGE (f:User {name: friend})
         MERGE (u)-[:FRIENDS_WITH]->(f)`,
        { name, friends }
      )
    );
    res.send({ message: 'User and relationships added' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// API: Get user’s social network
app.get('/getNetwork/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const result = await session.readTransaction(tx =>
      tx.run(
        `MATCH (u:User {name: $name})-[:FRIENDS_WITH*1..2]-(friend)
         RETURN DISTINCT friend.name AS friend`,
        { name }
      )
    );
    res.send(result.records.map(record => record.get('friend')));
  } catch (error) {
    res.status(500).send(error);
  }
});

// API: Predict social relationships using GPT
app.get('/predictRelationships/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const result = await session.readTransaction(tx =>
      tx.run(
        `MATCH (u:User {name: $name})-[:FRIENDS_WITH]-(f)
         RETURN f.name AS friend`,
        { name }
      )
    );
    
    const friends = result.records.map(record => record.get('friend'));
    
    const prompt = `User ${name} has the following friends: ${friends.join(", ")}. Analyze potential hidden social relationships among them, such as common interests, mutual friends, professional connections, or geographic links. Provide as detailed insights as possible and suggest potential new connections.`;
    
    const aiResponse = await openai.completions.create({
      model: 'gpt-4',
      prompt: prompt,
      max_tokens: 200
    });
    
    res.send({ predictions: aiResponse.choices[0].text.trim() });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
