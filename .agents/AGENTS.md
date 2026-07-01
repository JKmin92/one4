# General Project Rules

## Auto-Sync on New Conversation
Whenever a new conversation is started, you must automatically execute the `auto-sync` skill before proceeding with the user's initial request.
This ensures that the user's workspace is always up to date with any changes that might have been pushed from another computer.

## Future Scaling Reminders
When the project experiences high traffic or performance issues (or when the user asks about scaling/refactoring), remind the user to refactor `applyAutomaticOrderTransitions()` in `orderModel.js`. Currently, it runs global UPDATE queries (Lazy Evaluation) on every order list/detail view. It should be moved to a dedicated background Cron Job (e.g., running every midnight) to reduce database load.
