from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

FILE_PATH = 'qa_data.json'

def load_qa_data():
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, 'r') as file:
            return json.load(file)
    return {}

def save_qa_data(data):
    with open(FILE_PATH, 'w') as file:
        json.dump(data, file, indent=4)

qa_data = load_qa_data()

@app.route('/answer', methods=['GET'])
def get_answer():
    question = request.args.get('question')
    if not question:
        return jsonify({"error": "Question parameter is required"}), 400
    answer = qa_data.get(question, "I don't know the answer to that question. Can you provide the answer?")
    return jsonify({"question": question, "answer": answer})

@app.route('/answer', methods=['POST'])
def add_answer():
    data = request.json
    question = data.get('question')
    answer = data.get('answer')
    if not question or not answer:
        return jsonify({"error": "Both question and answer parameters are required"}), 400
    qa_data[question] = answer
    save_qa_data(qa_data)
    return jsonify({"message": "Answer added successfully."})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
