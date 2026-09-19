import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let vocabularyArray = [];
let vocabularyMap = new Map();

export function loadDocs(dir) {
    let docs = [];
    if (!fs.existsSync(dir)) {
        console.warn(`Directory not found: ${dir}`);
        return docs;
    }
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith('.txt')) {
            const content = fs.readFileSync(path.join(dir, file), 'utf8');
            const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            // Group lines into larger chunks (at least 200 chars) to ensure
            // headings are combined with the paragraphs that follow them.
            let currentChunk = '';
            for (const line of lines) {
                currentChunk += (currentChunk ? ' ' : '') + line;
                if (currentChunk.length > 200) {
                    docs.push(currentChunk);
                    currentChunk = '';
                }
            }
            if (currentChunk.length > 0) {
                docs.push(currentChunk);
            }
        }
    }
    return docs;
}

export function chunkText(docs) {
    let chunks = [];
    for (const doc of docs) {
        const cleanPart = doc.trim();
        // Use the whole paragraph as a chunk to preserve context,
        // but only if it's reasonably long and informative.
        if (cleanPart.length > 30) {
            chunks.push(cleanPart);
        }
    }
    return chunks;
}

export function buildVocabulary(chunks) {
    const vocabSet = new Set();
    for (const chunk of chunks) {
        const words = chunk.toLowerCase().match(/\w+/g) || [];
        for (const word of words) {
            vocabSet.add(word);
        }
    }
    vocabularyArray = Array.from(vocabSet);
    vocabularyMap = new Map();
    vocabularyArray.forEach((word, idx) => vocabularyMap.set(word, idx));
    return vocabularyArray;
}

// Common stop words that add noise to TF-IDF similarity. Removing these forces
// the vector to weight meaningful terms like "ssn", "checking", "savings", etc.
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'is', 'it', 'in', 'on', 'at', 'to', 'for', 'of', 'and',
    'or', 'but', 'not', 'with', 'this', 'that', 'from', 'by', 'be', 'as', 'are',
    'was', 'were', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'i', 'you', 'he',
    'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his',
    'its', 'our', 'their', 'what', 'which', 'who', 'whom', 'when', 'where', 'why',
    'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'too', 'very', 'just', 'about', 'up', 'so', 'than',
    'if', 'then', 'also', 'only', 'am', 'being', 'get', 'got', 'need', 'vs',
    'versus', 'ufcu'
])

// Map common acronyms/terms to their longer forms found in the docs
const SYNONYMS = {
    'ssn': ['ssn', 'social', 'security', 'number'],
    'id': ['id', 'identification', 'license', 'passport'],
    'apr': ['apr', 'rate', 'interest'],
    'apy': ['apy', 'yield', 'dividend'],
    'min': ['min', 'minimum'],
    'max': ['max', 'maximum'],
}

export function embed(text) {
    const vector = new Array(vocabularyArray.length).fill(0);
    const words = text.toLowerCase().match(/\w+/g) || [];
    
    // Expand synonyms
    let expandedWords = [];
    for (const word of words) {
        if (SYNONYMS[word]) {
            expandedWords.push(...SYNONYMS[word]);
        } else {
            expandedWords.push(word);
        }
    }

    for (const word of expandedWords) {
        if (STOP_WORDS.has(word)) continue; // skip stop words
        const idx = vocabularyMap.get(word);
        if (idx !== undefined) {
            vector[idx]++;
        }
    }
    return vector;
}

export function cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class VectorStore {
    constructor() {
        this.store = [];
    }

    addChunks(chunks) {
        for (const chunk of chunks) {
            this.store.push({
                text: chunk,
                embedding: embed(chunk)
            });
        }
    }

    search(queryEmbedding, topK = 3) {
        const results = this.store.map(item => {
            return {
                text: item.text,
                score: cosineSimilarity(queryEmbedding, item.embedding)
            };
        });
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, topK);
    }
}

export function generateAnswer(question, contextChunks, screen, field) {
    // Screen-specific openers make Lumi feel aware of where you are.
    const OPENERS = {
        'identity:ssn': "I totally get it — sharing your SSN can feel uncomfortable. Here's why we ask: ",
        'identity:': "Great question about the identity step! ",
        'about:email': "Good thinking asking about your email. ",
        'about:phone': "Great question about your phone number! ",
        'address:address': "Good question about your address info! ",
        'funding:': "Almost there! About funding your account: ",
        'secure:': "Security is important to us! ",
        'goals:': "Let me help you explore your options! ",
    }

    // Pick the most specific opener
    const key1 = `${screen}:${field}`
    const key2 = `${screen}:`
    const opener = OPENERS[key1] || OPENERS[key2] || "Great question! "

    if (!contextChunks || contextChunks.length === 0) {
        return `${opener}While I don't have specific details about that in my knowledge base, a UFCU member advocate would be happy to help you out. Phone Support Hours: Mon-Fri 8 AM - 5:30 PM, Sat 10 AM - 2 PM. Call (512) 467-8080 or (800) 252-8311.`
    }

    // Clean up context: take the most relevant chunk (first one, highest scored)
    // and trim it to a reasonable conversational length.
    const bestContext = contextChunks[0]
    const trimmed = bestContext.length > 300
        ? bestContext.slice(0, 300).replace(/\.\s[^.]*$/, '.') // trim to last complete sentence
        : bestContext

    // Build a natural response
    let answer = opener + trimmed

    // Add a warm closer if there's room
    if (answer.length < 250) {
        answer += " Let me know if you have any other questions — I'm right here!"
    }

    return answer
}
