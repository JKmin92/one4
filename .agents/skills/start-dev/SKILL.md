---
name: start-dev
description: Starts both the frontend (Vite) and backend (Nodemon) development servers concurrently.
---

# Start Dev Servers Skill

When the user asks to start the development environment or run the servers (e.g., "서버 켜줘", "개발 시작하자", "start-dev"), trigger this skill.

Follow these instructions to start both servers in the background so you can continue assisting the user:

1. **Start Backend Server**:
   - Use the `run_command` tool.
   - `CommandLine`: `npx nodemon ./server.js`
   - `Cwd`: `c:\Users\정기민\Documents\one4\backend`
   - `WaitMsBeforeAsync`: 1000 (To send it to the background)

2. **Start Frontend Server**:
   - Use the `run_command` tool.
   - `CommandLine`: `npm run dev`
   - `Cwd`: `c:\Users\정기민\Documents\one4\front`
   - `WaitMsBeforeAsync`: 1000 (To send it to the background)

3. **Notify User**:
   - Once both commands are launched, tell the user that both servers are running in the background and provide the typical localhost URLs (e.g., frontend usually http://localhost:5173).
