# Contributing to OpenLens

Thank you for helping improve OpenLens. This guide follows the same open-source
practices used by mature projects such as [Flask](https://github.com/pallets/flask).

## Ways to contribute

- Report bugs with steps to reproduce
- Propose features with clear use cases
- Fix issues or improve docs via pull request
- Improve tests and CI reliability

## Development setup

```bash
git clone --recurse-submodules https://github.com/SenseiBruce/openLens.git
cd openLens/voicecut
./setup.sh
source .venv/bin/activate
uvicorn voicecut.backend.api.main:app --reload
```

Frontend (separate terminal):

```bash
cd voicecut/web
npm install
npm run dev
```

## Running tests

```bash
cd voicecut
source .venv/bin/activate
pip install -r requirements-dev.txt
pytest tests/backend -q
cd web && npm ci && npm run build && npm run lint
```

## Pull requests

1. Branch from `main`
2. Keep changes focused
3. Ensure CI is green
4. Update `CHANGELOG.md` for user-visible changes

## Code style

- Python: PEP 8, type hints where practical
- TypeScript/React: follow existing ESLint config in `voicecut/web`
- Use `.editorconfig` for consistent formatting

## Security

Do not commit API keys, tokens, or customer media. Report security issues privately
to the repository owner.
