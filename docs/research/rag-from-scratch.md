# RAG from Scratch

**Demystify Retrieval-Augmented Generation (RAG) by building it yourself - step by step.**  
No black boxes. No cloud APIs. Just clear explanations, simple examples, and local code you fully understand.

This project follows the same philosophy as [AI Agents from Scratch](https://github.com/pguso/ai-agents-from-scratch):  
make advanced AI concepts approachable for developers through minimal, well-explained, real code.

---

## What You'll Learn

- **What RAG really is**, and why it’s so powerful for knowledge retrieval.  
- **How embeddings work**, turn text into numbers your model can understand.  
- **How to build a local vector database**, store and query documents efficiently.  
- **How to connect everything**, retrieve context and feed it into an LLM for grounded answers.  
- **How to re-rank and normalize**, improving retrieval precision and reducing noise.  
- **Step-by-step code walkthroughs**, every function explained, nothing hidden.

---

## Concept Overview

Retrieval-Augmented Generation (RAG) enhances language models by giving them access to **external knowledge**.  
Instead of asking the model to “remember” everything, you let it **retrieve relevant context** before generating a response.

**Pipeline:**
1. **Knowledge Requirements** — define questions and data needs.
2. **Data Loading** — import and structure your documents.  
3. **Text Splitting & Chunking** — divide data into manageable pieces.  
4. **Embedding** — turn chunks into numerical vectors.  
5. **Vector Store** — save and index embeddings for fast retrieval.  
6. **Retrieval** — fetch the most relevant context for a given query.  
7. **Post-Retrieval Re-Ranking** — re-order results to prioritize the best context.  
8. **Query Preprocessing & Embedding Normalization** — clean and standardize input vectors for consistency.  
9. **Augmentation** — merge retrieved context into the model’s prompt.  
10. **Generation** — produce grounded answers using a local LLM.  

---

## Project Structure

```
rag-from-scratch/
├── 00_how_rag_works/
│ └── example.js
│ // Minimal RAG simulation with naive keyword search.
│
├── 01_knowledge_requirements/
│ └── example.js
│ // Define what knowledge is needed and where it comes from.
│
├── 03_data_loading/
│ └── example.js
│ // Load and preprocess raw text data.
│
├── 04_text_splitting_and_chunking/
│ └── example.js
│ // Split long text into chunks for embedding.
│
├── 05_intro_to_embeddings/
│ ├── 00_query_preprocessing.js
│ ├── 01_text_similarity_basics.js
│ └── 02_generate_embeddings.js
│
├── 06_building_vector_store/
│ ├── 01_in_memory_store.js
│ ├── 02_nearest_neighbor_search.js
│ └── example.js
│
├── 07_retrieval_pipeline/
│ ├── 01_query_rewriting.js
│ ├── 02_rank_results.js
│ ├── 03_no_results_check.js
│ ├── 04_post_retrieval_reranking.js
│ │ // Re-rank results after retrieval to improve context relevance.
│ └── example.js
│
├── 08_rag_in_action/
│ └── example.js
│ // Combine retrieval + LLM for end-to-end RAG.
│
├── 09_evaluating_rag_quality/
│ └── example.js
│ // Measure retrieval precision, recall, and output accuracy.
│
├── 10_observability_and_caching/
│ └── example.js
│ // Cache repeated queries and log performance.
│
├── 11_graph_db_integration/
│ └── example.js
│ // Simple embedded graph database using kuzu npm package.
│ // Demonstrates connecting vector search results with entity relationships.
│
└── README.md
```

---

### How it works
| Goal                                | What You Add                                           | Why It Helps                                                                |
| ----------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| **Concept clarity**                 | `00_how_rag_works`                                    | See retrieval + generation in <20 lines before touching vectors.           |
| **Mathematical intuition**          | `05_intro_to_embeddings/01_text_similarity_basics.js`  | Learn cosine similarity without black-box APIs.                            |
| **Hands-on understanding**          | `06_building_vector_store/01_in_memory_store.js`       | Understand how embeddings are stored and compared.                         |
| **Pipeline thinking**               | `07_retrieval_pipeline`                                | Each stage is modular, testable, and easy to reason about.                 |
| **Better results**                  | `07_retrieval_pipeline/04_post_retrieval_reranking.js` | Reduce noise and redundancy in retrieved context.                          |
| **Query quality**                   | `07_retrieval_pipeline/05_query_preprocessing.js`      | Ensure embeddings represent consistent meaning.                            |
| **Knowledge connectivity**          | `11_graph_db_integration/example.js`                   | Explore how a graph database can improve retrieval and reasoning.          |

Each folder contains:
- A **minimal example** (`example.js`)
- A **detailed explanation** of every step  
- Comments in the code to teach the concept clearly

---

## Requirements

- Node.js 18+  
- Local LLM (e.g., `node-llama-cpp`)  
- npm packages for embeddings, vector math, and optional `kuzu`  

Install dependencies:

```bash
npm install
node 07_retrieval_pipeline/example.js
```

## Philosophy

This repository is not about fancy frameworks or huge models.  
It’s about understanding, **line by line**, how RAG works under the hood.

If you can explain it, you can build it.  
If you can build it, you can improve it.

---

## Contribute

Contributions are welcome!  
If you have a clear, educational RAG example, open a PR.

---

## See Also

- [AI Agents from Scratch](https://github.com/pguso/ai-agents-from-scratch)  
- [LangChain RAG Concepts](https://docs.langchain.com/oss/python/langchain/rag)  
- [Best AI tools for RAG](https://codingscape.com/blog/best-ai-tools-for-retrieval-augmented-generation-rag)

