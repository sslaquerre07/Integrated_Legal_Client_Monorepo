# GitHub Actions Overview

| Action Name | When it runs | Action Description |
| --- | --- | --- |
| NodeJS Project Build | Runs on pull requests targeting the default branch, as well as pushes to `main`. This is the repo-wide validation step for general code changes. | Installs dependencies and runs the monorepo build to confirm the project still compiles successfully. |
| Frontend Tests on API Change | Runs on pull requests to `main` when there are changes under `services/web/**`, or when root config files that affect the workspace are updated. | Executes the frontend Jest suite after changes in that space. |
|  |  |  |
|  |  |  |
