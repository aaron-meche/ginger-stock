# Ginger Stock

> An AI-driven stock analysis engine that continuously monitors market conditions, synthesizes financial news, and produces sector-level investment recommendations in real time.

---

## Project Summary

Ginger Stock is a multi-layered, orchestrated AI pipeline designed to function as an autonomous investment research analyst. It ingests live financial news, extracts macroeconomic signals, and dispatches a fleet of specialized AI models — each focused on a distinct market sector — to independently score the current investment climate of that sector on a normalized scale from **-1 (extremely bearish)** to **+1 (extremely bullish)**.

The system is powered by **[rueter-ai](https://www.npmjs.com/package/rueter-ai)**, a unified multi-provider AI SDK that allows simultaneous calls across Anthropic, OpenAI, Google Gemini, and xAI Grok with a single consistent interface, automatic cost tracking, and zero external dependencies. News ingestion is handled via external financial news APIs (e.g., NewsAPI, Marketaux, or Alpha Vantage News), with raw articles distilled into structured, AI-consumable economic breakdowns before being passed down the pipeline.

The output of the full pipeline is a clean, human-readable investment brief that ranks sectors by opportunity, highlights the most promising individual stocks and index funds within each sector, and explains the reasoning behind each recommendation.

**Key technologies:**
- **Runtime:** Node.js (ESM)
- **AI orchestration:** `rueter-ai` (unified wrapper over Grok, Claude, GPT-4o, Gemini)
- **News ingestion:** Financial news REST APIs (NewsAPI / Marketaux / Alpha Vantage)
- **Environment management:** `dotenv`
- **Parallelism:** Native `Promise.all` with a configurable `MAX_SIMUL_MODELS` ceiling

---

## Objective

The core objective of Ginger Stock is to answer one question on demand:

> **"Given everything happening in the market right now, where should I put my money?"**

More precisely, the system is designed to:

1. **Monitor the current economic landscape** by continuously pulling and summarizing the latest financial news across all major sectors.
2. **Quantify sentiment and opportunity** in each sector using AI models that return a normalized score reflecting the risk/reward balance for new investment.
3. **Rank and filter investment targets** — both individual equities and index funds — based on which sectors are most favorable, surfacing the highest-confidence picks with supporting rationale.
4. **Deliver a concise, actionable brief** that a human investor can read in minutes and use to make informed capital allocation decisions.

Ginger Stock is not a trading bot and does not execute orders. It is a research and signal-generation engine that augments human decision-making with real-time, AI-synthesized market intelligence.

---

## Roadmap

1. **`data_models.js` — News Ingestion & Economic Breakdown Layer**
   Establish the data foundation of the pipeline. Connect to one or more financial news APIs to pull current headlines and articles. Use a rueter-ai model to summarize each article into structured signal data, then aggregate those signals into a sector-level "economic breakdown" — a compact, AI-optimized representation of the current state of each major market sector.

2. **`research_models.js` — Parallel Sector Research & Scoring Layer**
   Spawn up to `MAX_SIMUL_MODELS` simultaneous AI researchers, one per sector (e.g., Technology, Healthcare, Energy, Financials, Consumer Discretionary, Industrials, Real Estate, Utilities, Materials, Communication Services). Each model receives the economic breakdown from step 1 as context and returns a structured JSON object containing a sector score from -1 to 1 and a brief justification.

3. **`scoring_models.js` — Score Aggregation & Sector Ranking Layer**
   Collect and normalize all sector scores. Weight them by confidence, resolve any conflicting signals, and produce a ranked ordered list of sectors from most to least attractive. This layer also identifies whether broad market conditions favor aggressive growth, defensive positioning, or cash preservation.

4. **`stock_models.js` — Stock & Fund Identification Layer**
   For the top-ranked sectors from step 3, spawn targeted AI models to identify specific investment vehicles — individual stocks, ETFs, and index funds — that are most aligned with current conditions. Each pick includes a brief thesis, a risk tier (low / medium / high), and a time horizon (short / medium / long term).

5. **`orchestrator.js` — Master Pipeline Coordinator**
   Wire all layers together into a single sequential-and-parallel execution pipeline. The orchestrator manages the flow of data between layers, enforces the `MAX_SIMUL_MODELS` concurrency limit, handles errors and timeouts gracefully, and triggers each stage in the correct order.

6. **`output_models.js` — Report Synthesis & Formatting Layer**
   Feed the full pipeline output into a final AI pass that synthesizes everything into a structured, human-readable investment brief. The brief includes an executive summary, a ranked sector table, top stock/fund picks with thesis and risk tier, and a closing market outlook statement.

7. **`index.js` — Entry Point & Scheduling**
   Build the top-level entry point that initializes environment variables, invokes the orchestrator, and either runs once on demand or on a configurable schedule (e.g., each morning before market open). Format and print the final brief to stdout, or optionally write it to a file or send it via a notification channel.

8. **Testing & Validation**
   Validate each layer in isolation with mock data before end-to-end integration. Confirm that sector scores are stable and directionally accurate against known historical market conditions. Tune model temperature, token limits, and system prompts to maximize signal quality while minimizing cost per run.

9. **Cost Optimization & Prompt Hardening**
   Profile API costs per pipeline run using rueter-ai's built-in cost tracking. Reduce costs by compressing the economic breakdown context, caching repeated news summaries, and selecting the cheapest capable model per task. Harden system prompts to prevent model drift and ensure consistent structured output.

---

## Architecture Overview

```
[ Financial News APIs ]
         │
         ▼
┌─────────────────────┐
│   data_models.js    │  Fetches headlines, summarizes articles,
│                     │  builds sector-level economic breakdown
└──────────┬──────────┘
           │  economic breakdown (structured context object)
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    research_models.js                       │
│  [ Tech ] [ Health ] [ Energy ] [ Finance ] [ Real Estate ] │
│  [ Consumer ] [ Industrials ] [ Utilities ] [ Materials ]   │
│               (up to MAX_SIMUL_MODELS parallel)             │
│         each returns: { sector, score: -1..1, rationale }   │
└──────────────────────────┬──────────────────────────────────┘
                           │  array of sector scores
                           ▼
              ┌────────────────────────┐
              │   scoring_models.js    │  Ranks sectors,
              │                        │  resolves conflicts,
              │                        │  detects market regime
              └────────────┬───────────┘
                           │  ranked sector list
                           ▼
              ┌────────────────────────┐
              │    stock_models.js     │  Identifies top stocks,
              │                        │  ETFs, and index funds
              │                        │  for each top sector
              └────────────┬───────────┘
                           │  picks with thesis + risk tier
                           ▼
              ┌────────────────────────┐
              │   output_models.js     │  Synthesizes final
              │                        │  human-readable brief
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │       index.js         │  Entry point, scheduling,
              │   (orchestrator.js)    │  output delivery
              └────────────────────────┘
```

---

## Sector Coverage

| Sector | Ticker Proxy | Focus |
|---|---|---|
| Technology | QQQ / XLK | Software, semiconductors, cloud, AI |
| Healthcare | XLV | Pharma, biotech, medical devices |
| Energy | XLE | Oil, gas, renewables |
| Financials | XLF | Banks, insurance, fintech |
| Consumer Discretionary | XLY | Retail, autos, entertainment |
| Industrials | XLI | Aerospace, defense, manufacturing |
| Real Estate | XLRE | REITs, commercial, residential |
| Utilities | XLU | Electric, water, gas |
| Materials | XLB | Mining, chemicals, forestry |
| Communication Services | XLC | Media, telecom, social platforms |

---

## Environment Variables

| Variable | Description |
|---|---|
| `GROK_API` | xAI Grok API key |
| `ANTHROPIC_API` | Anthropic Claude API key |
| `OPENAI_API` | OpenAI API key |
| `GEMINI_API` | Google Gemini API key |
| `NEWS_API_KEY` | Financial news provider API key |

---

## Project Structure

```
ginger-stock/
├── src/
│   ├── data_models.js        # Layer 1: news ingestion + economic breakdown
│   ├── research_models.js    # Layer 2: parallel sector scoring
│   ├── scoring_models.js     # Layer 3: score aggregation + sector ranking
│   ├── stock_models.js       # Layer 4: stock/fund identification
│   └── output_models.js      # Layer 6: report synthesis
├── index.js                  # Layer 7: entry point
├── orchestrator.js           # Layer 5: pipeline coordinator
├── .env                      # API keys (not committed)
├── package.json
├── README.md
└── ROADMAP.md
```

---

## Score Reference

| Score Range | Interpretation |
|---|---|
| `0.75` to `1.0` | Strongly bullish — high-conviction opportunity |
| `0.40` to `0.74` | Moderately bullish — favorable conditions |
| `-0.39` to `0.39` | Neutral — mixed or unclear signals |
| `-0.74` to `-0.40` | Moderately bearish — proceed with caution |
| `-1.0` to `-0.75` | Strongly bearish — avoid or consider inverse exposure |

---

## Author

Aaron Meche
