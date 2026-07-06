import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served at https://frankyface.github.io/Polydock-Inventory-Designer/ in
// production, so the build needs that base path — but applying the same
// base to the dev server breaks Vite's own /@vite/client route resolution
// in some environments, so it's build-only. See
// staging/stage-5-deploy-polish/feature-github-actions-deploy.md.
//
// Deliberately no explicit `root` override here: it must resolve from
// wherever this config is actually run from (a contributor's machine, CI),
// not a hardcoded path — see CLAUDE.md's "Local preview" note for the local
// sandbox workaround instead.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Polydock-Inventory-Designer/' : '/',
}))
