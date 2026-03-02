# PMM Presentation — The PMM's Hippocratic Oath

A minimalist, management-consulting-grade presentation built with **Vite + React + Tailwind CSS v4**.

## Author
[Siddhartha Chaturvedi](https://sidc.ai)

## Setup
```bash
npm install
```

## Run
```bash
npm run dev
```
Open `http://localhost:5173`. Navigate with **Left/Right arrow keys** or **Spacebar**.

## Deploy
Connected to Netlify — push to `main` and it auto-deploys. Zero config required.

## Slide Types
| Type | Component | Description |
|---|---|---|
| *(default)* | `StarkTextSlide` | Two-column title + bullets |
| `matrix` | `StarkMatrixSlide` | 2×2 strategic framework grid |
| `pillar` | `StarkPillarSlide` | N-column pillar strategy layout |
| `grid` | `StarkGridSlide` | Harvey Ball capability assessment table |
| `data` | `StarkDataSlide` | Minimalist animated bar chart |

## Slide Data
All content lives in `pipelines/common/slides.json`.

## Architecture
```
src/
  components/    ← Slide type components + Layout
  index.css      ← Design system (Tailwind v4 theme)
  App.tsx        ← Router + keyboard navigation
  main.tsx       ← Entry point
pipelines/
  common/        ← slides.json
```
