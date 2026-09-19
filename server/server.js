import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
    loadDocs, 
    chunkText, 
    buildVocabulary, 
    embed, 
    VectorStore, 
    generateAnswer 
} from './rag.js';
import { initLLM, generateAnswerLLM } from './llm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

console.log("Starting Lumi RAG Server...");

const docsDir = path.resolve(__dirname, '..', 'lumi-project', 'knowledge_docs');
console.log(`Loading documents from: ${docsDir}`);

const docs = loadDocs(docsDir);
const chunks = chunkText(docs);
buildVocabulary(chunks);

const store = new VectorStore();
store.addChunks(chunks);

console.log(`Initialization complete. Loaded and processed ${chunks.length} chunks.`);

// Initialize the real LLM in the background
initLLM();

app.get('/api/health', (req, res) => {
    res.json({ ok: true, chunks: store.store.length });
});

app.post('/api/ask', async (req, res) => {
    const { question, screen, focusedField, history } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Question is required." });
    }

    // Embed just the question
    const queryEmbedding = embed(question);
    
    const results = store.search(queryEmbedding, 3);
    const filteredResults = results.filter(r => r.score > 0.05);
    const contextTexts = filteredResults.map(r => r.text);

    // Try to generate an answer with the real LLM first
    let answer = await generateAnswerLLM(question, contextTexts, screen, focusedField, history);
    
    if (!answer) {
        // Fallback to the deterministic template if LLM isn't ready
        answer = generateAnswer(question, contextTexts, screen, focusedField);
    }

    res.json({
        answer,
        sources: contextTexts
    });
});

import { users } from './users.js';

app.get('/api/users', (req, res) => {
    // Return a summary of all users (for listing/switching)
    const summary = users.map(u => ({ id: u.id, name: u.name, type: u.type }));
    res.json(summary);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body || {};
    const user = users.find((candidate) =>
        candidate.demoLogin?.email === email && candidate.demoLogin?.password === password
    );

    if (!user) {
        return res.status(401).json({ error: "Invalid demo credentials." });
    }

    const { demoLogin, ...safeUser } = user;
    res.json(safeUser);
});

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});

app.get('/api/users/:id/transactions', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const status = req.query.status;
    const transactions = status
        ? user.recentTransactions.filter((transaction) => transaction.status === status)
        : user.recentTransactions;
    res.json(transactions);
});

app.get('/api/users/:id/transfers', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user.transfers);
});

app.listen(port, () => {
    console.log(`Lumi RAG server listening at http://localhost:${port}`);
    console.log(`Server is ready! Knowledge base has ${store.store.length} embedded chunks.`);
});
