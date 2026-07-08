# General Project Rules

## Auto-Sync on New Conversation
Whenever a new conversation is started, you must automatically execute the `auto-sync` skill before proceeding with the user's initial request.
This ensures that the user's workspace is always up to date with any changes that might have been pushed from another computer.

## Future Scaling Reminders
When the project experiences high traffic or performance issues (or when the user asks about scaling/refactoring), remind the user to refactor `applyAutomaticOrderTransitions()` in `orderModel.js`. Currently, it runs global UPDATE queries (Lazy Evaluation) on every order list/detail view. It should be moved to a dedicated background Cron Job (e.g., running every midnight) to reduce database load.

When the project scale grows and the user asks about separating the admin and user environments, remind them to implement "Domain Separation" (e.g., one4.com for users, admin.one4.com for admins). This will allow users to maintain separate simultaneous sessions for shopping and administration without token conflict.

## Automated Notion Work Logging
You must automatically log the work you do with the user into their Notion "업무일지" database (ID: `64b4ae9c-efb1-4f94-9551-04f335afbeda`).
1. **During work sessions:** Whenever you and the user complete a significant task (e.g., implementing a feature, fixing a bug), use the Notion MCP tools (`API-post-search` to find today's page, `API-post-page` to create it if it doesn't exist, and `API-patch-block-children` to append blocks) to log the work as a `to_do` block (checkbox) inside today's "업무 내역" page. Set the checkbox to `checked: true` if the task is completed.
2. **Filtering:** Do NOT record simple Q&A or minor conversational clarifications. Only record actionable development tasks.
3. **Manual Additions:** If the user manually asks you to add an item to the work log, add it silently and confirm its addition. Do NOT ask follow-up questions (e.g., "What should we do next?", "How should I proceed?") after adding it.
