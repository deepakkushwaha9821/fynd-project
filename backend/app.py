
# from flask import Flask, request, jsonify, send_from_directory

# from flask_cors import CORS
# from datetime import datetime
# import json
# from ai import generate_ai_outputs
# import os

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# FRONTEND_DIST = os.path.join(BASE_DIR, "../my-react-app/dist")

# app = Flask(
#     __name__,
#     static_folder=FRONTEND_DIST,
#     static_url_path=""
# )







# CORS(app)

# DATA_FILE = "storage.json"

# print("FRONTEND_DIST =", FRONTEND_DIST)
# print("FILES =", os.listdir(FRONTEND_DIST))

# # ---------- Storage Helpers ----------
# def load_data():
#     try:
#         with open(DATA_FILE, "r") as f:
#             content = f.read().strip()
#             return json.loads(content) if content else []
#     except (FileNotFoundError, json.JSONDecodeError):
#         return []


# def save_data(data):
#     with open(DATA_FILE, "w") as f:
#         json.dump(data, f, indent=2)


# # ---------- USER FEEDBACK API ----------



# @app.route("/api/feedback", methods=["POST"])
# def submit_feedback():
#     payload = request.json

#     rating = float(payload.get("rating", 0))
#     review = payload.get("review", "")

#     if rating <= 0:
#         return jsonify({"error": "Rating is required"}), 400

#     ai = generate_ai_outputs(review, rating)

#     entry = {
#         "timestamp": datetime.now().isoformat(timespec="seconds"),
#         "rating": rating,
#         "review": review,
#         "ai_summary": ai["summary"],
#         "action": ai["action"]
#     }

#     data = load_data()
#     data.append(entry)
#     save_data(data)

#     return jsonify({
#         "message": "Feedback submitted successfully",
#         "ai_response": ai["user_response"]
#     })


# # ---------- ADMIN SUMMARY API ----------
# @app.route("/api/admin/summary")
# def admin_summary():
#     data = load_data()

#     ratings = []
#     for d in data:
#         try:
#             ratings.append(float(d["rating"]))
#         except:
#             pass

#     total = len(ratings)
#     avg_rating = round(sum(ratings) / total, 2) if total else 0

#     # ✅ Buckets from 0.5 to 5.0
#     rating_distribution = {
#         round(x * 0.5, 1): 0 for x in range(1, 11)
#     }
#     # Generates: 0.5, 1.0, 1.5, ..., 5.0

#     for r in ratings:
#         r = round(r, 1)
#         if r in rating_distribution:
#             rating_distribution[r] += 1

#     return jsonify({
#         "total_reviews": total,
#         "avg_rating": avg_rating,
#         "rating_distribution": rating_distribution
#     })




# # ---------- ADMIN REVIEWS API ----------
# @app.route("/api/admin/reviews")
# def admin_reviews():
#     return jsonify(load_data())


# # ---------- HEALTH CHECK ----------
# @app.route("/api/health")
# def health():
#     return jsonify({"status": "ok"})



# # ---------- REACT SPA FALLBACK ----------
# # ---------- REACT SPA ROUTING (VERY IMPORTANT) ----------

# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>")
# def serve_react(path):
#     # API routes should NOT go to React
#     if path.startswith("api"):
#         return jsonify({"error": "Not Found"}), 404

#     # Serve static files if they exist
#     file_path = os.path.join(app.static_folder, path)
#     if path != "" and os.path.exists(file_path):
#         return send_from_directory(app.static_folder, path)

#     # Otherwise always return React index.html
#     return send_from_directory(app.static_folder, "index.html")



    
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)



# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import os

# # ---------- PATH SETUP ----------
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# FRONTEND_DIST = os.path.join(BASE_DIR, "../my-react-app/dist")

# app = Flask(
#     __name__,
#     static_folder=FRONTEND_DIST,
#     static_url_path=""
# )
# CORS(app)

# # ---------- API ROUTES ----------
# @app.route("/api/test")
# def test_api():
#     return jsonify({"status": "API working"})

# # ---------- REACT ROUTES ----------
# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>")
# def serve_react(path):
#     # If file exists (JS, CSS, assets)
#     file_path = os.path.join(app.static_folder, path)
#     if path != "" and os.path.exists(file_path):
#         return send_from_directory(app.static_folder, path)

#     # Otherwise serve React index.html
#     return send_from_directory(app.static_folder, "index.html")


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)
# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# from datetime import datetime
# import json
# import os
# from ai import generate_ai_outputs

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# FRONTEND_DIST = os.path.join(BASE_DIR, "../my-react-app/dist")

# app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path="")
# CORS(app)

# DATA_FILE = "storage.json"

# # ---------- STORAGE ----------
# def load_data():
#     try:
#         with open(DATA_FILE, "r") as f:
#             return json.load(f)
#     except:
#         return []

# def save_data(data):
#     with open(DATA_FILE, "w") as f:
#         json.dump(data, f, indent=2)

# # ---------- APIs ----------
# @app.route("/api/feedback", methods=["POST"])
# def submit_feedback():
#     payload = request.json
#     rating = float(payload.get("rating", 0))
#     review = payload.get("review", "")

#     ai = generate_ai_outputs(review, rating)

#     entry = {
#         "timestamp": datetime.now().isoformat(timespec="seconds"),
#         "rating": rating,
#         "review": review,
#         "ai_summary": ai["summary"],
#         "action": ai["action"]
#     }

#     data = load_data()
#     data.append(entry)
#     save_data(data)

#     return jsonify({"message": "ok"})

# @app.route("/api/admin/summary")
# def admin_summary():
#     data = load_data()
#     ratings = [float(d["rating"]) for d in data if "rating" in d]
#     return jsonify({
#         "total_reviews": len(ratings),
#         "avg_rating": round(sum(ratings)/len(ratings), 2) if ratings else 0
#     })

# @app.route("/api/admin/reviews")
# def admin_reviews():
#     return jsonify(load_data())

# @app.route("/api/health")
# def health():
#     return jsonify({"status": "ok"})

# # ---------- REACT (ALWAYS LAST) ----------
# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>")
# def serve_react(path):
#     file_path = os.path.join(app.static_folder, path)
#     if path and os.path.exists(file_path):
#         return send_from_directory(app.static_folder, path)
#     return send_from_directory(app.static_folder, "index.html")

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)


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
