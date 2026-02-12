---
title: "Building Med-RAG: A Grounded Medical Q&A System"
date: "2026-02-12"
tags: ["RAG", "NLP", "Healthcare", "LLMs"]
excerpt: "Implementing a retrieval-augmented generation system for evidence-based medical question answering using PubMed abstracts, biomedical embeddings, and LLMs."
published: true
---

Check out this project [here!](https://github.com/adityajariwala/med-rag)

## Abstract

Large language models (LLMs) demonstrate impressive capabilities but frequently hallucinate when answering domain-specific questions,
particularly in high-stakes domains like medicine. This project implements a Retrieval-Augmented Generation (RAG) system that grounds
medical question answering in peer-reviewed literature from PubMed. The system retrieves relevant biomedical abstracts, uses domain-specific
embeddings (PubMedBERT) for semantic search, and constrains LLM responses to retrieved evidence while evaluating faithfulness.

## Motivation

Medical information retrieval presents unique challenges:

- **Hallucination risk**: Ungrounded LLMs invent facts with high confidence
- **Domain terminology**: General-purpose models struggle with medical jargon
- **Evidence requirements**: Clinical decisions require cited, verifiable sources
- **Recency**: Medical knowledge evolves rapidly; models trained on static data become outdated

RAG addresses these issues by separating retrieval (factual, updatable knowledge base) from generation (reasoning and synthesis).

## System Architecture

### Pipeline Overview

```
User Query → Embedding → FAISS Search → Context Retrieval → LLM Generation → Evaluation
                ↓
        PubMed Abstracts (cached)
```

### Components

**1. Data Ingestion** (`src/ingestion.py`)

- Fetches abstracts via NCBI Entrez API
- Caches results locally (prevents redundant API calls)
- Handles rate limiting (3 req/sec without API key, 10 req/sec with)
- Stores metadata: PMID, abstract text

**2. Text Chunking** (`src/chunking.py`)

- Splits abstracts into semantically coherent segments
- Preserves context while enabling fine-grained retrieval
- Trade-off: smaller chunks = better precision, larger chunks = better coherence

**3. Embedding** (`src/embeddings.py`)

- Model: `pritamdeka/S-PubMedBert-MS-MARCO`
- Why biomedical embeddings? General models underperform on domain vocabulary
- PubMedBERT: pretrained on 4.5M PubMed abstracts
- Output: 768-dimensional dense vectors

**4. Vector Store** (`src/vector_store.py`)

- Backend: FAISS (Facebook AI Similarity Search)
- Index type: `IndexFlatL2` (exact L2 distance)
- Why FAISS? Local, fast, production-ready (no external DB required)
- Search: top-k retrieval with optional score thresholding

**5. LLM Generation** (`src/llm.py`)

- Interface: OpenRouter (model-agnostic API)
- Prompt engineering: explicit grounding instructions
- Structured output: Pydantic schemas for JSON validation
- Confidence scoring: model self-assessment

**6. Evaluation** (`src/evaluation.py`)

- **Retrieval Recall**: percentage of ground-truth PMIDs retrieved
- **Faithfulness**: LLM-as-judge check for hallucination
- Logging: structured metrics for analysis

## Technical Decisions

### Why OpenRouter?

- Model flexibility: swap between Claude, Llama, Mistral without code changes
- Cost efficiency: access to free tier models for prototyping
- No vendor lock-in

### Why PubMedBERT?

General embeddings (e.g., `all-MiniLM-L6-v2`) struggle with terms like "GLP-1 agonist" or "cardiovascular outcomes". Domain-specific models capture semantic relationships better.

Benchmark comparison (informal):

- General embeddings: retrieve ~40% relevant abstracts
- PubMedBERT: retrieve ~75% relevant abstracts

### Why FAISS over Vector DBs?

- **Simplicity**: No external service dependencies
- **Speed**: In-memory search < 50ms for 1000 chunks
- **Reproducibility**: Self-contained deployment
- Trade-off: No persistence layer (rebuilds on restart)

## Implementation Challenges & Solutions

### Challenge 1: Model Selection Impact

**Observation**: Free models (e.g., `qwen-4b:free`) showed ~45% faithfulness.

**Hypothesis**: Small models (<7B params) lack capacity to follow complex grounding instructions.

**Experiment**: Tested models on same queries with ground truth:

| Model              | Parameters | Faithfulness | Cost                |
| ------------------ | ---------- | ------------ | ------------------- |
| qwen-4b:free       | 4B         | 45%          | Free                |
| llama-3.1-8b       | 8B         | 68%          | Free                |
| llama-3.3-70b:free | 70B        | 82%          | Free (rate limited) |
| claude-3-haiku     | ~40B       | 94%          | $0.25/1M tokens     |

**Finding**: Model size directly correlates with instruction-following ability.

**Production choice**: Claude Haiku (optimal quality/cost trade-off).

---

### Challenge 2: Weak Prompt Engineering

**Initial prompt**:

```
You are a medical assistant. Use the context below to answer.

Context: [...]
Question: [...]
```

**Problem**: Too vague. Model invented citations and extrapolated beyond context.

**Improved prompt**:

```
**CRITICAL RULES:**
1. Use ONLY the provided context
2. Every claim must be directly supported by context
3. Do not infer or extrapolate
4. If context is insufficient, state limitation clearly
5. Quote specific excerpts as evidence

Context: [...]
Question: [...]
```

**Result**: Faithfulness improved from 45% → 72% (same model).

**Lesson**: Explicit, emphatic instructions matter for grounding.

## Evaluation Methodology

### Retrieval Recall

For queries with known relevant PMIDs:

```python
recall = len(retrieved_pmids ∩ ground_truth_pmids) / len(ground_truth_pmids)
```

**Limitation**: Requires manual ground truth annotation.

### Faithfulness (LLM-as-Judge)

Second LLM call evaluates grounding:

```python
prompt = f"""
Does this answer make claims not supported by context?
Answer: {generated_answer}
Context: {retrieved_context}
Respond: YES or NO
"""
faithful = (llm_judge(prompt) == "NO")
```

**Advantages**:

- Automated evaluation
- Scalable to large datasets

**Limitations**:

- Judge model may have own biases
- Binary metric (no partial credit)

**Validation**: Manually checked 50 random samples, 92% agreement with automated judge.

## Performance Characteristics

### Latency Breakdown (typical query)

```
Embedding query:           80ms
FAISS search (k=5):        12ms
PubMed cache read:         5ms
LLM generation:            2,100ms
Faithfulness check:        1,800ms
──────────────────────────────
Total:                     ~4s
```

**Bottleneck**: LLM API calls (85% of latency).

**Optimization opportunities**:

1. Local LLM inference (trade accuracy for speed)
2. Skip faithfulness check for low-stakes queries
3. Batch processing for multiple questions

### Retrieval Quality

Testing on 20 hand-crafted queries with ground truth:

```
Average retrieval recall (k=5):  68%
Average retrieval recall (k=10): 84%
Precision@5:                     73%
```

**Insight**: Increasing `k` improves recall but adds noise.

## Lessons Learned

### 1. Prompt Engineering >> Model Size (up to a point)

A well-prompted Llama-70B outperforms poorly-prompted Claude-Haiku. But below ~7B parameters, prompt engineering can't compensate for lack of capacity.

### 2. Domain-Specific Tools Matter

Using PubMedBERT instead of general embeddings was a 35% improvement in retrieval quality—bigger than any other single change.

### 3. Evaluation is Hard

Faithfulness checking via LLM-as-judge is convenient but imperfect. Found edge cases where judge disagreed with human evaluation:

- Overly conservative (rejected valid inferences)
- Missed subtle hallucinations (invented statistics with plausible ranges)

### 4. Free Models Are Not Production-Ready

Free tier models work for prototyping but lack reliability for grounded generation. The cost difference ($0.25/1M tokens for Haiku) is negligible compared to engineering time debugging hallucinations.

### 5. Caching Everything

PubMed API rate limits (3 req/sec) make caching essential. First run takes 5 minutes, subsequent runs < 10 seconds.

## Future Work

### Short-term Improvements

1. **Cross-encoder reranking**: Two-stage retrieval (fast + precise)
2. **Query expansion**: Synonym replacement (e.g., "diabetes" → "diabetes mellitus")
3. **Chunk overlap**: Prevent context fragmentation

### Long-term Extensions

1. **Full-text parsing**: Access beyond abstracts (requires institutional credentials)
2. **Multi-modal RAG**: Include figures, tables from papers
3. **Temporal awareness**: Weight recent papers higher
4. **User feedback loop**: Learn from corrections

### Research Questions

- How does chunk size affect retrieval vs. generation quality?
- Can we predict faithfulness without a second LLM call?
- What's the optimal retrieval count for medical Q&A? (k=5? k=10? k=20?)

## Code & Deployment

**Repository structure**:

```
med-rag/
├── src/
│   ├── api.py          # FastAPI backend
│   ├── app.py          # Streamlit frontend
│   ├── ingestion.py    # PubMed retrieval
│   ├── embeddings.py   # PubMedBERT wrapper
│   ├── vector_store.py # FAISS interface
│   └── llm.py          # LLM client + prompts
├── scripts/
│   └── start_dev.sh    # Launch script
├── requirements.txt
└── .env.example
```

**Quick start**:

```bash
# Install dependencies
pip install -r requirements.txt

# Configure API keys
cp .env.example .env
# Edit .env with OpenRouter + NCBI keys

# Start system
./scripts/start_dev.sh

# Access UI at http://localhost:8501
```

**Dependencies**:

- `sentence-transformers`: Embedding models
- `faiss-cpu`: Vector similarity search
- `fastapi + uvicorn`: API framework
- `streamlit`: Interactive UI
- `biopython`: PubMed API wrapper
- `openai`: LLM client (OpenRouter-compatible)

## Conclusion

Building a production-quality RAG system involves more than chaining retrieval + generation. Key insights:

1. **Retrieval quality dominates**: Bad retrieval cannot be fixed by good generation
2. **Prompt engineering is critical**: Grounding requires explicit, emphatic instructions
3. **Evaluation is essential**: Without metrics, improvements are guesswork
4. **Domain expertise helps**: Biomedical embeddings, medical terminology, PubMed-specific optimizations

Med-RAG demonstrates that grounded generation is achievable with open-source tools and public APIs. The system provides transparent, citation-backed answers while evaluating its own reliability—a step toward trustworthy AI in high-stakes domains.

**Limitations**: This is a research prototype. Not clinically validated. Not a substitute for professional medical advice.

**Takeaway**: RAG systems are only as good as their retrieval quality, prompt engineering, and evaluation rigor. All three must be production-grade for real-world deployment.

---

## Acknowledgments

- **PubMedBERT**: Microsoft Research (via HuggingFace)
- **NCBI Entrez**: Free access to PubMed database
- **OpenRouter**: Model-agnostic LLM API
- **FAISS**: Meta AI Research

---

_Project completed: February 2026_
_Tech stack: Python, FastAPI, Streamlit, FAISS, PubMedBERT, OpenRouter_
