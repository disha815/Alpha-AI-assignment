CREATE DATABASE taskdb;

\c taskdb

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'pending',
    embedding vector(384)
);
