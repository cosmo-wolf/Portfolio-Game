# Local Setup Guide

## Prerequisites

Install one of the following:

- Python 3.8+ (for `python -m http.server`)
- Node.js 18+ (for `npx serve`)

## 1. Clone or open project

```powershell
cd e:\Codes\Portfolio
```

## 2. Start a local static server

### Option A: Python

```powershell
python -m http.server 5500
```

### Option B: Node

```powershell
npx serve .
```

## 3. Open in browser

- Python option: `http://localhost:5500`
- Node option: use the URL printed by `serve`

## 4. Verify core features

1. Move with `W A S D`
2. Interact near structures with `F`
3. Portal gate swaps biome (`JUNGLE` <-> `CITY`)
4. `T` toggles `DAY` / `NIGHT`
5. Terminal gate triggers digital dive
6. Run terminal command `help`

## Troubleshooting

- Blank page:
  - Confirm you are running from project root.
  - Check browser console for JS errors.
- Controls not responding:
  - Click the page once to ensure focus.
- Terminal not visible:
  - Move avatar to `TERMINAL_GATE` and press `F`.
