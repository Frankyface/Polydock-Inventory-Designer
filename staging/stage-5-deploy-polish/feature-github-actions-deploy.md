# Feature — GitHub Actions Deploy

A GitHub Actions workflow that builds the Vite app and publishes it to GitHub Pages on every push to `main`.

## Open Questions

- Repo's GitHub Pages source needs to be set to "GitHub Actions" (not "Deploy from a branch") — a one-time manual step, tracked in `help.md`.
- Custom domain, or the default `frankyface.github.io/Polydock-Inventory-Designer` path? Affects the Vite `base` config — not decided yet, defaulting to the repo-path option unless told otherwise.
