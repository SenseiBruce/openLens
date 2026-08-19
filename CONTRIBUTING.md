# Contributing to OpenLens

1. Fork the repository and create a feature branch: `git checkout -b feat/your-feature`
2. Copy `voicecut/.env.example` (also mirrored at the repo root as `.env.example`) to `voicecut/.env`.
3. Install with `bash voicecut/setup.sh` or `pip install -r voicecut/requirements.lock` plus `npm ci` in `voicecut/web`.
4. Land **one behavior change per commit**, with tests in the same commit.
5. Run before opening a PR:

```bash
pytest voicecut/tests/ --maxfail=1
cd voicecut/web && npm run typecheck && npm test && npx eslint src
```

6. Open a pull request. CI runs pytest, ruff, eslint, typecheck, docker-smoke, and dependency audits on every PR.
