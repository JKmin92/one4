---
name: start-dev
description: Starts both the frontend (Vite) and backend (Nodemon) development servers concurrently.
---

# Start Dev Servers Skill

When the user asks to start the development environment or run the servers (e.g., "서버 켜줘", "개발 시작하자", "start-dev"), trigger this skill.

Follow these instructions to start both servers in the background so you can continue assisting the user:

1. **Start Docker Environment**:
   - Use the `run_command` tool.
   - `CommandLine`: `docker-compose up -d`
   - `Cwd`: `c:\Users\정기민\Documents\one4`
   - `WaitMsBeforeAsync`: 1000

2. **Notify User**:
   - Tell the user that the Docker containers (Frontend, Backend, MySQL) have been started in the background.
   - Provide the local URLs: Frontend (`http://localhost:80`), Backend (`http://localhost:5000`).
