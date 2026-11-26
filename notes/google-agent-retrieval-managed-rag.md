---
title: Google just made RAG ingestion a one-API-call problem. Almost.
type: quick
status: published
date: 2026-11-25
summary: Google's managed ingestion hides the RAG pipeline behind one API call, but the pipeline didn't disappear, it got hidden.
tags: ai, llms, cloud
linkedin_url: https://www.linkedin.com/feed/update/urn:li:share:7531260935663955970/
x_url: https://x.com/buildwith_vibs/status/2125492982585635010
ai_assisted: false
---

Until now, before an AI agent could answer questions about your PDFs, you had to build the pipeline yourself:
parse files → chunk them → create embeddings → store them in a vector DB → learn how to query it.

This week Google released managed ingestion + SearchDocuments in Agent Retrieval (preview):

- 📂 Point it at a Cloud Storage bucket (PDFs, Office files, even videos)
- ⚙️ It parses, chunks (100–500 tokens or per page) and embeds everything for you
- 🔎 One search call returns answers with source citations
- 🎥 Video search can even match what was said, not just what was shown

🔹 **The pipeline didn't disappear, it got hidden.** Chunk size, segmentation and parsing are now Google's defaults, and even the embedding model is fixed (gemini-embedding-2, 768 dimensions, no choice). Great for getting started fast. But when retrieval quality drops, you'll want to know what's happening under the hood.

🔹 **The more abstract a service gets, the more tightly you're tied to its pricing.** Ingestion is free in preview, but the GA price isn't announced yet, and by then your data and pipeline live inside their system.
