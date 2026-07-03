---
name: finish-work
description: Automatically dump database to backend/db, commit all changes with auto_{date}, and push to GitHub when the user finishes work.
---

# Finish Work Skill

When this skill is triggered (e.g., the user says "오늘 마무리다", "오늘 끝이야", "오늘 작업은 끝났다"), you must perform the following actions:

1. **Dump Database**:
   - Check the database configuration (e.g., `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `backend/config/.env` or root `.env`).
   - Create the `backend/db/` directory if it does not already exist.
   - Run `mysqldump -u <DB_USER> -p<DB_PASSWORD> <DB_NAME> > backend/db/backup.sql` (or similar command depending on the OS and mysql installation) to export the database tables and data.
   - Wait for the dump command to complete successfully.

2. **Stage Changes**:
   - Run `git add .` in the project root to stage all modified files, including the newly created database dump file.

3. **Commit Changes**:
   - Determine today's date in `YYYY-MM-DD` or `YYYYMMDD` format (based on the system date).
   - Run `git commit -m "auto_{today_date}"` (e.g., `git commit -m "auto_20260630"`).

4. **Push to Remote**:
   - Run `git push` to push the commit to the remote GitHub repository.

5. **Stop Development Servers**:
   - Use the `manage_task` tool with `Action='list'` to find any running background tasks.
   - If there are any background tasks running the frontend or backend servers (e.g. `Start frontend`, `Start backend`, `npm run dev`, `nodemon`), use the `manage_task` tool with `Action='kill'` to terminate them.

6. **Notify User**:
   - Once all steps are completed successfully, notify the user that the database was backed up, files were successfully committed/pushed, and the development servers were safely shut down. Wish them a good day/night!
