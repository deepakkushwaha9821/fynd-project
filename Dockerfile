# =========================
# FRONTEND BUILD STAGE
# =========================
FROM node:20-bullseye AS frontend

WORKDIR /frontend

# Copy package files first
COPY my-react-app/package*.json ./

# Clean install
RUN rm -rf node_modules package-lock.json && npm install

# Copy rest of frontend
COPY my-react-app/ .

# 🔥 CRITICAL FIX: remove bad dist file/folder
RUN rm -rf dist

# Build frontend
RUN npm run build


# =========================
# BACKEND STAGE
# =========================
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Copy built frontend
COPY --from=frontend /frontend/dist ./static

EXPOSE 5000

CMD ["python", "app.py"]
