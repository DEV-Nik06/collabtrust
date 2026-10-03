# Contributing to CollabTrust

Thank you for contributing to CollabTrust.

CollabTrust is an AI-powered influencer marketplace connecting emerging creators with brands.

## Development Workflow

1. Create an issue describing the work.
2. Create a feature or fix branch from `main`.
3. Implement the change.
4. Add or update tests where applicable.
5. Update documentation when required.
6. Open a Pull Request.
7. Review the changes.
8. Merge into `main` after approval.

## Branch Naming

Use the following naming convention:

* `feature/<feature-name>`
* `fix/<issue-name>`
* `refactor/<change-name>`
* `docs/<documentation-name>`
* `test/<test-name>`
* `chore/<task-name>`

Examples:

```text
feature/campaign-creation
feature/creator-matching
fix/authentication-error
docs/update-prd
test/campaign-api
chore/setup-ci
```

## Commit Convention

Use Conventional Commits.

Examples:

```text
feat: add campaign creation
fix: resolve creator profile validation
docs: update product requirements
test: add campaign API tests
refactor: simplify matching service
chore: configure CI pipeline
```

## Pull Requests

Every Pull Request should include:

* What changed?
* Why was the change required?
* How was it tested?
* Does documentation need to be updated?
* Are there known limitations?

## Documentation Rule

Important product and technical decisions must be documented.

If implementation changes a documented requirement, architecture decision, API contract, database design, or AI-agent behavior, update the relevant documentation.

## Security

Never commit:

* API keys
* Passwords
* Database credentials
* Authentication secrets
* Private tokens
* `.env` files

Use `.env.example` to document required environment variables.

## Code Quality

Before opening a Pull Request:

* Ensure the application builds successfully.
* Run relevant tests.
* Remove debugging code.
* Avoid unnecessary dependencies.
* Keep functions and modules focused.
* Update documentation when required.

## AI Development

AI-generated code must be reviewed by a developer before being merged.

AI agents must not independently make production-impacting decisions without the appropriate validation and authorization.
