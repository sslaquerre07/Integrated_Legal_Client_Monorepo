# Testing in the web app

- `fixtures/`: fixed test data
- `mocks/`: shared fake modules
- `utils/`: helpers that tests call

## What to test

- What a user would notice: what shows, and what's sent to the API.
- Failures and edge cases before decoration.
- Keep the count low: checks of one behaviour share one test.
- Read app text from `messages`. Type text that a test makes up.
- Check that a new test can fail: break what it tests, then undo.
- Reuse a fixture before adding a near-copy. Delete unused ones.