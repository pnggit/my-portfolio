# Project Rules and Best Practices

Single source of truth for how we design, build, secure, optimize, test, deploy, and operate the web application.

Mandatory tools and frameworks
- Languages: TypeScript for application code; JavaScript allowed for tooling. CSS/SCSS for styles.
- Linters/formatters: ESLint (typescript-eslint), Prettier, Stylelint, EditorConfig.
- Git and workflow: Conventional Commits + Commitlint, Husky + lint-staged.
- Testing: Jest or Vitest, Testing Library (frontend), Playwright or Cypress for E2E, NYC/Istanbul for coverage.
- Security: Helmet (HTTP headers), Zod/Yup/Joi (validation), npm audit/Snyk in CI.
- Docs: TSDoc/JSDoc, OpenAPI/Swagger for APIs.
- CI/CD: GitHub Actions/GitLab CI (project default: GitHub Actions).

## 1. Code Style & Standards
- Formatting
  - Prettier enforced: 2-space indent, semicolons on, single quotes, trailing commas when valid, max line length 100.
  - Stylelint for CSS/SCSS: enforce ordering, disallow !important, prefer variables/custom properties.
- Naming conventions
  - Variables/functions: camelCase (e.g., isEnabled, fetchUser).
  - Classes/types/interfaces: PascalCase (e.g., UserService, UserDTO).
  - React components: PascalCase (e.g., UserCard.tsx).
  - Constants: UPPER_SNAKE_CASE (e.g., API_BASE_URL).
  - Files/directories: kebab-case (e.g., user-profile.service.ts, user-card.tsx).
  - CSS class names: BEM or utility-first convention. BEM example: button, button--primary, button__icon.
- Code organization and file structure
  - Organize by feature/domain; colocate component, hooks, styles, tests.
  - Example feature structure:
    - features/
      - users/
        - components/UserCard.tsx
        - hooks/useUser.ts
        - api/users.api.ts
        - styles/user-card.module.scss
        - __tests__/UserCard.test.tsx
  - Avoid deep nesting (>4 levels). Use index.ts barrel files judiciously; avoid circular imports.
  - Absolute imports via tsconfig paths; prefer named exports over default for shared modules.

## 2. Development Practices
- Version control workflow
  - Trunk-based development: main is protected; feature branches off main.
  - Branch names: feature/<short-desc>, fix/<short-desc>, chore/<short-desc>, docs/<short-desc>, test/<short-desc>.
  - Keep PRs small (<500 LOC changed), descriptive, with screenshots for UI changes.
- Commit message format (Conventional Commits)
  - Example: feat(users): add profile card
  - Types: feat, fix, chore, docs, test, refactor, perf, build, ci, revert.
  - Imperative mood, present tense; include scope when helpful.
- Testing requirements
  - Unit tests: cover pure functions/components; mock external IO.
  - Integration tests: validate module boundaries and DB/API interactions.
  - E2E: Playwright/Cypress with stable selectors (data-testid). Record screenshots/videos on failure.
  - Coverage thresholds: 80% statements, 80% branches per package; CI enforces.
- Documentation standards
  - Code comments: TSDoc/JSDoc for public functions/classes; explain non-obvious logic.
  - API docs: maintain OpenAPI; include examples, error codes, versioning.
  - Keep README per package with usage, setup, scripts.

## 3. Security Guidelines
- Authentication/authorization
  - Prefer OAuth 2.1/OIDC or secure session cookies. Server-side enforcement of RBAC/ABAC.
  - Never rely on client-only checks for protected resources.
- Data validation and sanitization
  - Validate all inputs server-side using schemas (Zod/Yup/Joi). Reject oversized payloads.
  - Escape output to prevent XSS; parameterized queries/ORM to prevent SQL injection.
  - Do not log sensitive PII; use structured logging with redaction.
- Secure communication protocols
  - HTTPS/TLS 1.2+ everywhere; HSTS enabled; secure cookie flags (HttpOnly, Secure, SameSite=Lax/Strict).
  - CORS restricted to known origins; CSRF protection for state-changing requests.
  - Rate limiting and abuse detection on APIs.

## 4. Performance Optimization
- Asset loading strategies
  - Code splitting and lazy loading for routes/components.
  - Optimize images (responsive, WebP/AVIF, lazy-loading). Inline small SVGs; preload critical assets.
  - Use a CDN for static assets.
- Caching policies
  - Set appropriate Cache-Control, ETag/Last-Modified headers. Prefer immutable assets with long max-age and content hashing.
  - Apply application-level caching (e.g., stale-while-revalidate) for expensive requests.
- Database query optimization
  - Use indexes, avoid N+1 queries, paginate large results, use projections to minimize payloads.
  - Monitor query performance; use connection pooling.

## 5. Accessibility Compliance
- WCAG standards
  - Target WCAG 2.1 AA. Semantic HTML first; use ARIA only when necessary.
  - Ensure color contrast ratios meet AA; provide alt text for images.
- Keyboard navigation
  - All interactive elements must be reachable via Tab; visible focus states; logical tab order.
  - Manage focus on route changes/modals; avoid keyboard traps.
- Screen reader compatibility
  - Use landmarks (header, nav, main, footer). Provide aria-labels and roles thoughtfully.
  - Announce dynamic updates; use live regions when appropriate.
- Tooling
  - Enable eslint-plugin-jsx-a11y; run axe checks locally and in CI for critical pages.

## 6. Deployment & Maintenance
- Environment configurations
  - Environments: development, staging, production. No secrets in repo; use .env only locally, secrets manager in non-local.
  - Configuration via environment variables; document required variables.
- CI/CD pipeline requirements
  - Stages: install, lint, type-check, test (unit/integration/E2E), build, security scan, package (Docker/artifacts), deploy.
  - All checks must pass before merge/deploy; protected branches enforce status checks.
- Monitoring and logging standards
  - Structured JSON logging; include correlation IDs.
  - Use metrics (Prometheus/OpenTelemetry), tracing (OpenTelemetry), error tracking (Sentry/DataDog/New Relic).
  - Alerts on SLIs/SLOs; define runbooks for incidents.
- Rollback
  - Maintain previous artifacts; automatic rollback on failing health checks. Backup and restore procedures documented.

## Examples
- Branch: feature/user-profile-card
- Commit: feat(users): display profile card with avatar and status
- CSS BEM: .card, .card__header, .card__title, .card--compact
- Cache-Control header: Cache-Control: public, max-age=31536000, immutable
- Cookie flags: Set-Cookie: sessionId=...; HttpOnly; Secure; SameSite=Lax

## Compliance
- CI enforces linting, formatting, tests, coverage, build, and security checks.
- Deviations require an Architecture Decision Record and reviewer approval.