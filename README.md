# PMM Presentation — The PMM's Hippocratic Oath

A minimalist, management-consulting-grade presentation built with **Vite + React + Tailwind CSS v4**.

## Author
[Siddhartha Chaturvedi](https://sidc.ai)

## Setup
```bash
cd app
npm install
```

## Run
```bash
cd app
npm run dev
```
Open `http://localhost:5173`. Navigate with **Left/Right arrow keys** or **Spacebar**.

## Slide Types
The presentation engine supports multiple consulting-standard layouts, driven by the `type` field in `slides.json`:

| Type | Component | Description |
|---|---|---|
| *(default)* | `StarkTextSlide` | Two-column title + bullets |
| `matrix` | `StarkMatrixSlide` | 2×2 strategic framework grid |
| `pillar` | `StarkPillarSlide` | N-column pillar strategy layout with roof/foundation |
| `grid` | `StarkGridSlide` | Harvey Ball maturity/capability assessment table |
| `data` | `StarkDataSlide` | Minimalist animated bar chart (CSS-only, no libraries) |

## Slide Data
All content is driven from a single JSON file:
```
pipelines/common/slides.json
```
Each slide object supports: `title`, `lead`, `subtitle`, `bullets`, `type`, `phase`, `link`, `source`, `footnotes`, and type-specific fields (`matrix`, `pillars`, `roof`, `foundation`, `gridData`, `chartData`).

## Architecture
```
app/
  src/
    components/    ← All slide type components + Layout
    index.css      ← Design system (Tailwind v4 theme tokens)
    App.tsx        ← Router + keyboard navigation
    main.tsx       ← Entry point
pipelines/
  common/          ← slides.json (single source of truth)
```
