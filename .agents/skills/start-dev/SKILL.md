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

2. **Notion Briefing & Expiration Check**:
   - Use the `notion-mcp-server` tools (`API-post-search`, `API-get-block-children`) to query the user's "업무일지" database (ID: `64b4ae9c-efb1-4f94-9551-04f335afbeda`).
   - Check if today's "업무 내역" page already exists (e.g., from yesterday's uncompleted tasks). If it does, summarize the tasks.
   - Query the database for any pages with the `만료일` tag or titles like "호스팅 만료일", "SSL 만료일" where the date is today or tomorrow.

3. **Notify User**:
   - Tell the user that the Docker containers (Frontend, Backend, MySQL) have been started in the background.
   - Provide the local URLs: Frontend (`http://localhost:80`), Backend (`http://localhost:5000`).
   - Give the user their daily Notion briefing (today's tasks and any expiring items).
