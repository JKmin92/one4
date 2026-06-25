---
name: auto-sync
description: Check for updates on GitHub and automatically pull them to keep the project up to date.
---

# Auto Sync Skill

When this skill is triggered, you must perform the following actions to ensure the local repository is synced with the remote repository:

1. Run `git fetch` to retrieve the latest remote tracking branches.
2. Check the status using `git status` to see if the local branch is behind the remote tracking branch.
3. If the local branch is behind, run `git pull` to download and merge the latest changes.
4. If there are any merge conflicts during the pull, immediately stop and inform the user so they can manually resolve them.
5. If the project is already up to date, briefly notify the user that no updates were needed.
