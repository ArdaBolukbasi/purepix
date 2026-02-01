# Full-stack PurePix - Frontend + Backend
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Python backend
FROM python:3.10-slim

RUN useradd -m -u 1000 user
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*

USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Copy backend requirements and install
COPY --chown=user backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy backend code
COPY --chown=user backend ./backend

# Copy frontend build from builder stage
COPY --from=frontend-builder --chown=user /app/frontend/out ./static

EXPOSE 7860

# Start backend (serves static files too)
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "4"]
