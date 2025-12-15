from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json, os

app = Flask(__name__)
CORS(app)

DATA_FILE = "storage.json"

def load_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

@app.route("/api/feedback", methods=["POST"])
def submit_feedback():
    payload = request.json

    entry = {
        "timestamp": datetime.now().isoformat(),
        "rating": payload.get("rating", 0),
        "review": payload.get("review", ""),
        "ai_summary": "ok",
        "action": "ok"
    }

    data = load_data()
    data.append(entry)
    save_data(data)

    return jsonify({"message": "ok"})

@app.route("/api/admin/summary")
def admin_summary():
    data = load_data()
    ratings = [float(d["rating"]) for d in data if "rating" in d]

    return jsonify({
        "total_reviews": len(ratings),
        "avg_rating": round(sum(ratings)/len(ratings), 2) if ratings else 0
    })

@app.route("/api/admin/reviews")
def admin_reviews():
    return jsonify(load_data())

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

