---
name: finish-work
description: Automatically dump database to backend/db, commit all changes with auto_{date}, and push to GitHub when the user finishes work.
---

# Finish Work Skill

When this skill is triggered (e.g., the user says "오늘 마무리다", "오늘 끝이야", "오늘 작업은 끝났다"), you must perform the following actions:

1. **Dump Database (Docker)**:
   - Check that Docker is running.
   - Create the `backend/db/` directory if it does not already exist.
   - Use the `run_command` tool to run: `cmd /c "docker exec one4_mysql mysqldump -uroot newone4 > backend\db\backup.sql"`
   - Wait for the dump command to complete successfully.

2. **Stage Changes**:
   - Run `git add .` in the project root to stage all modified files, including the newly created database dump file.

3. **Commit Changes**:
   - Determine today's date in `YYYY-MM-DD` or `YYYYMMDD` format (based on the system date).
   - Run `git commit -m "auto_{today_date}"` (e.g., `git commit -m "auto_20260630"`).

4. **Push to Remote**:
   - Run `git push` to push the commit to the remote GitHub repository.

5. **Stop Development Servers (Docker)**:
   - Use the `run_command` tool.
   - `CommandLine`: `docker-compose stop`
   - `Cwd`: `c:\Users\정기민\Documents\one4`
   - `WaitMsBeforeAsync`: 5000

6. **Notion Rollover (Uncompleted Tasks)**:
   - Use `notion-mcp-server` tools (`API-post-search`, `API-get-block-children`) to find today's "업무 내역" page and check the `to_do` blocks.
   - If there are unchecked tasks (`checked: false`), list them to the user.
   - Ask the user for permission to move these tasks to tomorrow. If approved, use `API-post-page` to create tomorrow's "업무 내역" page with these uncompleted tasks.

7. **Notify User**:
   - Once all steps are completed successfully, notify the user that the database was backed up, files were successfully committed/pushed, the development servers were safely shut down, and the Notion rollover was handled. Wish them a good day/night!
