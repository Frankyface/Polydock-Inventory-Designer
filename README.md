# PolyDock Inventory & Design Tool

A web app for a PolyDock dealer/installer: design dock layouts on a 2D snapping grid canvas using real PolyDock modules, auto-calculate the parts list (connectors matched by seam length, notched connectors at junctions), check it live against real warehouse inventory, and commit a finished design to reserve/deduct those parts from stock.

Built to close the gap between "designed a layout" and "know if we can actually build it."

## Status

Early build — see [`handoff.md`](handoff.md) for current state and [`docs/master_plan.md`](docs/master_plan.md) for the full plan.

## Stack

React + Vite (static SPA) on GitHub Pages. No backend — the parts catalog is bundled with the app and inventory counts live in the browser's `localStorage` (per-device, not shared across staff — see `docs/master_plan.md`).

## Local development

```
npm install
npm run dev
```

No environment variables needed.
