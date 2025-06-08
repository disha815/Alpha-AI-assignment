from flask import Flask, request, jsonify
from db import cursor
from models import generate_embedding

app = Flask(__name__)

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.json
    title = data['title']
    description = data['description']
    status = data.get('status', 'pending')
    embedding = generate_embedding(description)

    cursor.execute(
        "INSERT INTO tasks (title, description, status, embedding) VALUES (%s, %s, %s, %s)",
        (title, description, status, embedding)
    )
    return jsonify({"message": "Task added successfully"}), 201


@app.route('/search', methods=['POST'])
def search_tasks():
    query = request.json['query']
    query_embedding = generate_embedding(query)

    cursor.execute("""
        SELECT id, title, description, status
        FROM tasks
        ORDER BY embedding <-> %s
        LIMIT 3
    """, (query_embedding,))
    
    results = cursor.fetchall()
    return jsonify([
        {"id": r[0], "title": r[1], "description": r[2], "status": r[3]}
        for r in results
    ])

if __name__ == '__main__':
    app.run(debug=True)
