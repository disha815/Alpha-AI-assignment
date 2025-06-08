# Task 3:  Add a Vector Search Feature 

This project implements a semantic **vector search feature** using:

- `SentenceTransformers` (all-MiniLM-L6-v2) to generate embeddings from task descriptions
- `PostgreSQL` with `pgvector` extension to store and search embeddings
- Python scripts to add and search tasks based on content similarity

---

## Objective

Enhance the backend by enabling **semantic search** on tasks.

For example:
> Searching "buy groceries" returns tasks like "get milk" based on meaning — not just keyword matches.

---

## Features

- Store task descriptions as **vector embeddings**
- Use **pgvector** to store and search using `<->` operator (cosine/L2 similarity)
- Return top **3 most relevant tasks** to a query
- Clean and beginner-level Python implementation

---

## 🛠️ Tech Stack

| Component         | Tool                               |
|------------------|------------------------------------|
| Database         | PostgreSQL + pgvector extension    |
| Embeddings       | Sentence Transformers (MiniLM-L6-v2) |
| Backend Scripting| Python (`psycopg2`, `sentence-transformers`) |

---

## Folder Structure

task3-vector-backend/
├── db_config.py        # DB connection settings
├── add_task.py         # Adds task with vector embedding
├── search_task.py      # Vector search for top 3 similar tasks
├── setup.sql           # SQL to setup PostgreSQL + pgvector
├── requirements.txt    # Python dependencies

---

## 💡 How It Works


1. Descriptions are converted into 384-dim vectors using all-MiniLM-L6-v2

2. Vectors are stored in PostgreSQL `vector` type column

3. Search queries are embedded and compared using `<->` (vector distance)

4. Top 3 results are returned based on similarity

---

## Output

```text
Top 3 results for: 'shopping'

1. [TODO] Buy groceries
   ↳ Buy milk, eggs, and bread from the supermarket

2. [TODO] Call mom
   ↳ Weekly check-in with mom about groceries

3. [TODO] Pay bills
   ↳ Electricity and water bill due this week

