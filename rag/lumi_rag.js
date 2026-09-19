/**
 * RAG STEP 1 & 2: Knowledge Requirements & Data Loading
 * In a real app, this would read from PDFs or scrape UFCU's website.
 * For our local hackathon prototype, we load a hardcoded array of UFCU facts.
 */
import fs from 'fs';
import path from 'path';

function loadDocumentsFromDirectory(dirPath) {
    let loadedText = [];
    try {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            // Only process .txt or .md files for this demo to avoid needing external PDF libraries
            if (filePath.endsWith('.txt') || filePath.endsWith('.md')) {
                const content = fs.readFileSync(filePath, 'utf-8');
                // Split by newlines so distinct paragraphs stay somewhat separate before chunking
                const paragraphs = content.split('\n').filter(p => p.trim().length > 0);
                loadedText.push(...paragraphs);
                console.log(`[Data Loader] Loaded: ${file}`);
            }
        });
    } catch (error) {
        console.warn(`[Data Loader] Could not find folder '${dirPath}'. Falling back to default data.`);
        // Fallback to our hardcoded data if the folder doesn't exist yet
        loadedText = [
            "UFCU stands for University Federal Credit Union. We proudly serve the Austin and UT community.",
            "Federal law (KYC) requires us to collect your Social Security Number (SSN) to verify your identity and prevent fraud. It will not affect your credit score.",
            "Our Free Checking account has no monthly maintenance fees and includes a contactless debit card.",
            "You can build your credit history safely using the UFCU Starter Credit Card, designed specifically for students.",
            "If an ID scan fails, members can bring their physical ID into any local UFCU branch or try taking the photo again in better lighting."
        ];
    }
    return loadedText;
}

// Look for a folder named 'knowledge_docs' in the same directory as this script
const rawKnowledgeBase = loadDocumentsFromDirectory('./knowledge_docs');

/**
 * RAG STEP 3: Text Splitting & Chunking
 * LLMs have context limits. We must break large documents into smaller chunks.
 * Here, we are simply splitting by sentences, but in production, you'd use a rolling window.
 */
function chunkText(textArray) {
    const chunks = [];
    textArray.forEach(doc => {
        // Split by period to simulate chunking a large PDF into sentences
        const sentences = doc.split('. ').filter(s => s.length > 10);
        sentences.forEach(sentence => {
            chunks.push(sentence.trim());
        });
    });
    return chunks;
}

const knowledgeChunks = chunkText(rawKnowledgeBase);
console.log(`[System] Loaded and split data into ${knowledgeChunks.length} chunks.`);

/**
 * RAG STEP 4: Intro to Embeddings (The Math)
 * REAL WORLD: You would send text to OpenAI or node-llama-cpp to get a vector (array of floats).
 * THIS DEMO: We build a simple TF (Term Frequency) Vectorizer from scratch to understand the math.
 * It turns a sentence into an array of numbers based on word occurrences.
 */
let vocabulary = [];

function buildVocabulary(chunks) {
    const uniqueWords = new Set();
    chunks.forEach(chunk => {
        const words = chunk.toLowerCase().match(/\w+/g) || [];
        words.forEach(w => uniqueWords.add(w));
    });
    vocabulary = Array.from(uniqueWords);
}

function generateMockEmbedding(text) {
    const words = text.toLowerCase().match(/\w+/g) || [];
    // Create an array of 0s the size of our vocabulary
    const vector = new Array(vocabulary.length).fill(0);
    
    // Count word occurrences (Simple Term Frequency)
    words.forEach(word => {
        const index = vocabulary.indexOf(word);
        if (index !== -1) {
            vector[index] += 1;
        }
    });
    return vector;
}

/**
 * RAG STEP 5: Text Similarity Basics
 * How does a computer know two vectors are similar? Cosine Similarity!
 * It measures the angle between two multi-dimensional lines. 1 = identical, 0 = unrelated.
 */
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * RAG STEP 6: Building the Vector Store
 * Instead of a heavy database like Pinecone, we store our vectors in local memory (an array).
 */
class VectorStore {
    constructor() {
        this.store = []; // Will hold objects: { id, text, embedding }
    }

    addChunks(chunks) {
        chunks.forEach((chunk, index) => {
            const embedding = generateMockEmbedding(chunk);
            this.store.push({ id: index, text: chunk, vector: embedding });
        });
        console.log(`[Vector Store] Successfully indexed ${this.store.length} embeddings.`);
    }

    // RAG STEP 7: Nearest Neighbor Search (Retrieval)
    search(queryEmbedding, topK = 2) {
        const results = this.store.map(item => {
            const score = cosineSimilarity(queryEmbedding, item.vector);
            return { text: item.text, score: score };
        });

        // Sort by highest similarity score
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, topK);
    }
}

/**
 * RAG STEP 8 & 9: Query Preprocessing, Augmentation, and Generation
 * This connects the user's input, finds the context, and generates the final answer.
 */
const lumiVectorDatabase = new VectorStore();

// Initialize our mock system
buildVocabulary(knowledgeChunks);
lumiVectorDatabase.addChunks(knowledgeChunks);

async function askLumi(userQuery) {
    console.log(`\nUser: "${userQuery}"`);
    
    // 1. Embed the user's question
    const queryVector = generateMockEmbedding(userQuery);
    
    // 2. Retrieve relevant context from our local Vector DB
    const searchResults = lumiVectorDatabase.search(queryVector, 2);
    
    // 3. Augment (Combine context into a prompt string)
    let contextString = searchResults
        .filter(res => res.score > 0.05) // Post-retrieval filtering (remove terrible matches)
        .map(res => res.text)
        .join(" ");
        
    if (!contextString) {
        contextString = "No specific UFCU information found.";
    }

    // 4. Generate (Mock LLM response)
    // In reality, you'd pass the prompt below to `node-llama-cpp` or OpenAI.
    const prompt = `System Prompt: You are Lumi, a UFCU banker. Use this context to answer the user: [${contextString}]`;
    
    console.log(`[Internal RAG Prompt] ${prompt}`);
    
    // Simulating LLM generation delay and response
    return new Promise(resolve => {
        setTimeout(() => {
            let finalAnswer = "";
            if (contextString.includes("SSN")) {
                finalAnswer = "Lumi: I understand asking for an SSN is a lot! Federal KYC law requires us to collect it to prevent fraud, but it will not affect your credit score.";
            } else if (contextString.includes("Starter Credit Card")) {
                finalAnswer = "Lumi: Building credit is smart. We have a Starter Credit Card specifically designed for students to help you build history safely.";
            } else {
                finalAnswer = "Lumi: I'm here to help with your UFCU onboarding. Could you clarify what you need help with?";
            }
            resolve(finalAnswer);
        }, 800); // 800ms fake generation delay
    });
}

/**
 * EXECUTION: Running the end-to-end local RAG pipeline.
 * To run this yourself, just execute `node lumi_rag.js` in your terminal.
 */
async function runDemo() {
    console.log("\n--- STARTING LUMI RAG PIPELINE DEMO ---\n");
    
    const answer1 = await askLumi("Why do you guys need my SSN? Is it safe?");
    console.log(answer1);
    
    const answer2 = await askLumi("I am a UT student looking to build my credit.");
    console.log(answer2);
}

// Start the demo
runDemo();