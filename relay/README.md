# Web Chat Relay

Bridges your site chat widget → Telegram bot → AI agent → back to visitor.

## Architecture

```
[Site Chat Widget]
  ↓ POST /webhook
[Relay Server] (Flask)
  ↓ (1) Forwards to Telegram admin chat
  ↓ (2) Queues message for polling
[webchat_poller.py] (Python daemon)
  ↓ Polls /poll_incoming every 10s
  ↓ Calls Codemax AI API with conversation context
  ↓ POST /relay_response → stored
[Widget] polls /messages/<session_id> every 2s
  ↓
[Visitor sees agent reply]
```

## Quick Start

### 1. Install dependencies

```bash
cd relay
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run the relay server

```bash
python relay_server.py
```

### 4. Run the AI poller (in another terminal)

```bash
python webchat_poller.py
```

## Deployment

### Option A — Same server
Run both on a VPS with `supervisor` or `systemd` to keep them alive.

### Option B — Separate services
- Relay server: any hosting (Railway, Render, Fly.io, VPS)
- Poller: any machine with Python + internet access
- Set `RELAY_URL` env var on the poller to the public relay URL

## Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/webhook` | Widget sends visitor message |
| GET | `/messages/<session_id>` | Widget polls for agent replies |
| GET | `/poll_incoming` | Poller fetches unprocessed messages |
| POST | `/relay_response` | Poller sends AI response |
| POST | `/mark_processed` | Poller marks messages as handled |
| GET | `/poll_telegram` | Admin replies via Telegram |
| GET | `/health` | Health check |
