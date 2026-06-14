# VoiceCut Rollback Procedures

Because VoiceCut is distributed as a localized workspace application rather than deployed on cloud infrastructure, "rolling back" relies entirely on source control (Git) and environment recreation.

## 1. Rolling Back Application Code
If a new pull request or commit introduces a critical bug:

1. Stop the application by hitting `Ctrl+C` in the terminal running `launch_local.sh`.
2. Revert the repository to the last known stable state:
   ```bash
   git log --oneline  # Find the safe commit hash
   git checkout <SAFE_COMMIT_HASH>
   ```
3. Restart the application:
   ```bash
   ./voicecut/infrastructure/launch_local.sh
   ```

## 2. Rolling Back the Database (State)
If the SQLite schema becomes corrupted or a bad migration is applied:

1. The database is stored locally in `voicecut/projects.db`.
2. Stop the application.
3. Because we use SQLite, rolling back simply means renaming or deleting the corrupted file and allowing the backend to generate a fresh database on the next startup:
   ```bash
   mv voicecut/projects.db voicecut/projects.db.bak
   ./voicecut/infrastructure/launch_local.sh
   ```
*Note: This will erase historical project data, but ensures a stable start state.*

## 3. Rolling Back Dependencies
If an updated package version (e.g. PyTorch or a React package) breaks the app:

**Python Backend:**
```bash
cd voicecut
rm -rf .venv
./setup.sh
```

**Node Frontend:**
```bash
cd voicecut/web
rm -rf node_modules
npm ci
```
