# ML Stock Predictor

A modern stock analysis dashboard built with **Next.js**, **React**, and **Tailwind CSS**. This app combines live market data, technical insights, personalized portfolio management, watchlists, alerts, and predictive forecasting powered by an external ML service.

## Key Features

- User authentication with secure password hashing and session cookies
- Real-time market overview with major indices and movers
- Stock prediction workflow with historical data, multiple forecasting methods, and chart visualization
- Portfolio tracker with live valuation and P&L metrics
- Personalized watchlist management with live quote cards
- Price alerts with active trigger detection and user control
- AI-driven insights using Google Gemini when configured, with deterministic fallback summaries
- Paper trading order records for simulated buy/sell activity

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Chart.js + react-chartjs-2
- MongoDB via Mongoose
- Yahoo Finance data via `yahoo-finance2`
- Axios for HTTP requests

## Repository Structure

- `src/app/` — UI routes, pages, and client components
- `src/app/api/` — serverless route handlers for auth, stock data, prediction, portfolio, watchlist, alerts, insights, and simulator orders
- `src/components/` — shared layout components
- `src/lib/` — helper utilities for auth, database connectivity, market data, and chart setup
- `src/models/` — Mongoose models for data entities

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root and configure required values:

```env
MONGODB_URI=your-mongodb-connection-string
ML_SERVICE_URL=http://localhost:5000
AUTH_SECRET=your-session-secret
GEMINI_API_KEY=your-google-gemini-api-key
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm run start
```

## Environment Variables

- `MONGODB_URI` — MongoDB connection URI (required)
- `ML_SERVICE_URL` — external ML prediction service endpoint (required)
- `AUTH_SECRET` / `NEXTAUTH_SECRET` — session signing secret (recommended)
- `GEMINI_API_KEY` — optional API key for Google Gemini insights

## Usage Overview

- `Home` — landing page with links to prediction, demo, and repository
- `Predict` — choose a company or custom symbol, select a date range, and generate a forecast
- `Market` — view global indices and top movers from Yahoo Finance
- `Portfolio` — add holdings and track current portfolio performance
- `Watchlist` — save and monitor symbols with real-time quotes
- `Alerts` — create price alerts and see triggered conditions
- `Insights` — request technical summaries with optional Gemini AI support

## Notes

- The prediction endpoint expects an external ML service to be available at `ML_SERVICE_URL`.
- If `GEMINI_API_KEY` is not provided, the insights route returns a deterministic technical summary instead of an AI-generated response.
- The app uses MongoDB for user data, portfolios, watchlists, alerts, and paper orders.

## Scripts

- `npm run dev` — run the Next.js development server
- `npm run build` — build the app for production
- `npm run start` — launch the production server
- `npm run lint` — run ESLint

## License

    MIT
