import { getLlama, LlamaChatSession } from "node-llama-cpp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let llama;
let model;
let context;

export async function initLLM() {
    console.log("Initializing Llama.cpp with Metal support for M-series Mac...");
    const modelPath = path.join(__dirname, "..", "models", "Llama-3.2-1B-Instruct-Q4_K_M.gguf");
    
    if (!fs.existsSync(modelPath)) {
        console.warn(`[LLM] Model not found at ${modelPath}.`);
        console.warn("[LLM] Please wait for the download to finish, or run the curl command to fetch it.");
        return false;
    }
    
    try {
        llama = await getLlama();
        model = await llama.loadModel({ modelPath });
        context = await model.createContext();
        console.log("✅ LLM successfully loaded via Metal! Real language model is active.");
        return true;
    } catch (err) {
        console.error("Failed to load LLM:", err);
        return false;
    }
}

export async function generateAnswerLLM(question, contextChunks, screen, field) {
    if (!model || !context) {
        console.warn("LLM not initialized. Falling back to simple template.");
        return null; // Will fallback to the mock generator
    }
    
    // Build a strict, persona-driven system prompt
    let sysPrompt = "You are Lumi, a helpful, warm, and concise AI assistant for University Federal Credit Union (UFCU). " +
                    "Your job is to answer the user's question using ONLY the provided context. " +
                    "Keep your answers short (1-2 sentences), conversational, and friendly. " +
                    "If the context does not contain the answer, say you don't have the exact details but a UFCU advocate can help. " +
                    "Provide the support hours (Mon-Fri 8am-5:30pm, Sat 10am-2pm) and phone numbers ((512) 467-8080, (800) 252-8311).";
    
    if (screen && screen !== 'null') {
        sysPrompt += `\nThe user is currently on the '${screen}' step of their onboarding.`;
    }
    if (field && field !== 'null') {
        sysPrompt += `\nThey are currently focused on the '${field}' input field. Acknowledge this context naturally.`;
    }
    
    let sequence;
    try {
        sequence = context.getSequence();
        const session = new LlamaChatSession({
            contextSequence: sequence,
            systemPrompt: sysPrompt
        });
        
        const userPrompt = `Context:\n${contextChunks.join("\n\n")}\n\nQuestion: ${question}`;
        
        console.log(`[LLM] Generating answer for: "${question}"...`);
        const answer = await session.prompt(userPrompt);
        return answer.trim();
    } catch (err) {
        console.error("LLM Generation error:", err);
        return null;
    } finally {
        if (sequence) {
            sequence.dispose();
        }
    }
}
