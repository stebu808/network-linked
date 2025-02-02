// Node.js + Express backend API with GPT / LLM for social relationship inference
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Neo4j database
// Neo4j connection setup
const driver = neo4j.driver(
  'neo4j://localhost',
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

// Initialize OpenAI
const openai = new OpenAI({ apiKey: 'your-openai-api-key' });

// API sources for user connections (Twitter and LinkedIn APIs)
const API_SOURCES = [
  { name: 'Twitter', url: 'https://api.twitter.com/2/users/:id/following', headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } },
  { name: 'LinkedIn', url: 'https://api.linkedin.com/v2/connections?q=viewer&oauth2_access_token=' + process.env.LINKEDIN_ACCESS_TOKEN }
];

// Function to fetch data from multiple APIs
async function fetchSocialData() {
  try {
    const responses = await Promise.all(
      API_SOURCES.map(source => axios.get(source.url, { headers: source.headers || {} }))
    );
    return responses.flatMap(response => response.data);
  } catch (error) {
    console.error('Error fetching social data:', error);
    return [];
  }
}

// Function to update Neo4j with new relationships
async function updateNeo4j() {
  const socialData = await fetchSocialData();
  
  if (socialData.length === 0) {
    console.log('No new data to update.');
    return;
  }

  for (const { user, friends } of socialData) {
    try {
      await session.writeTransaction(tx =>
        tx.run(
          `MERGE (u:User {name: $user})
           WITH u
           UNWIND $friends AS friend
           MERGE (f:User {name: friend})
           MERGE (u)-[:FRIENDS_WITH]->(f)`,
          { user, friends }
        )
      );
      console.log(`Updated relationships for ${user}`);
    } catch (error) {
      console.error(`Error updating user ${user}:`, error);
    }
  }
}

// Manual trigger endpoint
app.post('/updateNeo4j', async (req, res) => {
  await updateNeo4j();
  res.send({ message: 'Neo4j update triggered' });
});

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

// Schedule updates every 10 minutes
setInterval(updateNeo4j, 10 * 60 * 1000);

app.listen(3000, () => console.log('Server running on port 3000'));
