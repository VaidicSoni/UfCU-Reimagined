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
const port = 3001;

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
    const { question, screen, focusedField } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Question is required." });
    }

    // Embed just the question
    const queryEmbedding = embed(question);
    
    const results = store.search(queryEmbedding, 3);
    const filteredResults = results.filter(r => r.score > 0.05);
    const contextTexts = filteredResults.map(r => r.text);

    // Try to generate an answer with the real LLM first
    let answer = await generateAnswerLLM(question, contextTexts, screen, focusedField);
    
    if (!answer) {
        // Fallback to the deterministic template if LLM isn't ready
        answer = generateAnswer(question, contextTexts, screen, focusedField);
    }

    res.json({
        answer,
        sources: contextTexts
    });
});

app.listen(port, () => {
    console.log(`Lumi RAG server listening at http://localhost:${port}`);
    console.log(`Server is ready! Knowledge base has ${store.store.length} embedded chunks.`);
});
