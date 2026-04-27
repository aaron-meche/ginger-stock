# Ginger Stock — Build Roadmap

A sequential checklist for building the full Ginger Stock pipeline from the ground up. Complete each phase in order — each layer depends on the output contract established by the layer before it.

---

## Phase 1 — `data_models.js`: News Ingestion & Economic Breakdown

> Goal: Produce a clean, structured economic breakdown object that downstream AI models can consume as context.

- [ ] Research and select a financial news API (NewsAPI, Marketaux, or Alpha Vantage News) and obtain an API key
- [ ] Implement `fetchHeadlines(sectors)` — pulls the N most recent articles per sector from the news API
- [ ] Normalize raw API responses into a consistent internal article shape `{ headline, summary, source, publishedAt, sector }`
- [ ] Implement `summarizeArticle(article)` — passes each article through a low-token rueter-ai model to extract the core economic signal in 1–2 sentences
- [ ] Implement `buildSectorSnapshot(articles, sector)` — aggregates summarized signals for a single sector into a compact paragraph that describes current news sentiment, notable events, and macro trends
- [ ] Implement `buildEconomicBreakdown(sectors)` — runs `buildSectorSnapshot` across all sectors and assembles them into a single structured breakdown object keyed by sector name
- [ ] Add rate-limit handling and retry logic for the news API
- [ ] Validate output shape: breakdown must be a plain object with one key per sector, each containing a string of 100–300 words
- [ ] Test with live API calls; confirm output is coherent and sector-specific

---

## Phase 2 — `research_models.js`: Parallel Sector Research & Scoring

> Goal: Produce a score from -1 to 1 for each sector representing current investment attractiveness.

- [ ] Define the sector list constant (`SECTORS`) covering all 10 major market sectors
- [ ] Define the output schema each research model must return: `{ sector: string, score: number, rationale: string }`
- [ ] Implement `buildResearchPrompt(sector, breakdown)` — constructs a system + user prompt that gives the model the economic breakdown and instructs it to score the given sector
- [ ] Implement `scoreSector(sector, breakdown)` — instantiates a `RueterModel`, calls `.prompt()` with the research prompt, and parses the structured JSON response
- [ ] Implement `scoreAllSectors(breakdown)` — uses `Promise.all` to run all sector researchers in parallel, capped at `MAX_SIMUL_MODELS`
- [ ] Add response validation to enforce the -1 to 1 numeric range and clamp out-of-bound values
- [ ] Add JSON parse error handling with a fallback retry on malformed model output
- [ ] Tune model temperature (low, ~0.1–0.2) and max tokens to ensure deterministic, concise output
- [ ] Test in isolation using a mock breakdown object; verify scores are directionally sensible
- [ ] Log per-model API cost using rueter-ai's built-in cost tracking

---

## Phase 3 — `scoring_models.js`: Score Aggregation & Sector Ranking

> Goal: Produce a ranked, normalized sector list and identify the current broad market regime.

- [ ] Implement `rankSectors(scores)` — sorts the array of sector score objects from highest to lowest score
- [ ] Implement `detectMarketRegime(scores)` — analyzes the distribution of scores to classify the overall market as one of: `BULL`, `BEAR`, `MIXED`, or `DEFENSIVE`
- [ ] Implement `applyConfidenceWeighting(scores)` — optionally weight scores by rationale quality or source article count (can be a simple heuristic pass initially)
- [ ] Implement `filterActionableSectors(rankedScores, threshold)` — returns only sectors above a configurable bullish threshold (e.g., score ≥ 0.3) as "actionable"
- [ ] Assemble the final scoring output object: `{ regime, rankedSectors, actionableSectors, timestamp }`
- [ ] Write unit tests against known score arrays to validate sorting and regime detection logic
- [ ] Confirm output is fully serializable and passes cleanly to Phase 4

---

## Phase 4 — `stock_models.js`: Stock & Fund Identification

> Goal: For each actionable sector, identify the most promising specific stocks, ETFs, and index funds to invest in.

- [ ] Define the output schema for stock picks: `{ ticker, name, type: 'stock'|'etf'|'index', sector, thesis, riskTier: 'low'|'medium'|'high', timeHorizon: 'short'|'medium'|'long' }`
- [ ] Implement `buildStockResearchPrompt(sector, score, rationale)` — constructs a prompt instructing the model to suggest 2–4 specific tickers for that sector with a brief thesis for each
- [ ] Implement `identifyPicksForSector(sector, sectorScore)` — calls a rueter-ai model with the stock research prompt and parses the structured response
- [ ] Implement `identifyAllPicks(actionableSectors)` — runs `identifyPicksForSector` in parallel for all actionable sectors
- [ ] Add ticker validation step to filter out hallucinated or clearly invalid ticker symbols (basic format check: 1–5 uppercase letters)
- [ ] Add deduplication logic in case the same ticker appears across multiple sectors
- [ ] Tune model selection for stock identification — consider a more capable model (Claude or GPT-4o) for higher-quality, factual picks
- [ ] Test output structure; confirm each pick has all required fields before passing to Phase 6

---

## Phase 5 — `orchestrator.js`: Master Pipeline Coordinator

> Goal: Wire all layers into a single end-to-end execution pipeline with proper error handling and logging.

- [ ] Import and call `buildEconomicBreakdown` from `data_models.js`
- [ ] Pipe the breakdown into `scoreAllSectors` from `research_models.js`
- [ ] Pipe sector scores into `rankSectors` / `detectMarketRegime` from `scoring_models.js`
- [ ] Pipe actionable sectors into `identifyAllPicks` from `stock_models.js`
- [ ] Pipe all results into `synthesizeReport` from `output_models.js`
- [ ] Wrap each stage in try/catch with descriptive error messages that identify which layer failed
- [ ] Add console timing logs for each stage to track performance (e.g., `[data_models] completed in 3.2s`)
- [ ] Enforce `MAX_SIMUL_MODELS` cap globally — ensure parallel phases together do not exceed this ceiling
- [ ] Export a single `runPipeline()` async function that returns the final report object
- [ ] Test the full pipeline end-to-end with live API keys; confirm data flows correctly through all stages

---

## Phase 6 — `output_models.js`: Report Synthesis & Formatting

> Goal: Produce a polished, human-readable investment brief from the raw pipeline output.

- [ ] Define the report schema: `{ executiveSummary, marketRegime, sectorTable, topPicks, outlook, generatedAt }`
- [ ] Implement `buildReportPrompt(pipeline output)` — constructs a prompt that gives the model all pipeline data and instructs it to write a professional investment brief
- [ ] Implement `synthesizeReport(pipelineOutput)` — calls a high-quality model (Claude Sonnet or GPT-4o) with the report prompt and returns the formatted brief
- [ ] Implement `formatSectorTable(rankedSectors)` — renders a clean ASCII or markdown table of sectors, scores, and regime indicators
- [ ] Implement `formatTopPicks(picks)` — renders a clean list of stock/fund picks grouped by sector with thesis and risk tier
- [ ] Ensure the final report is both machine-parseable (JSON envelope) and human-readable (markdown body)
- [ ] Test report quality manually — the brief should read like it was written by a professional analyst

---

## Phase 7 — `index.js`: Entry Point & Delivery

> Goal: Make the full pipeline runnable with a single command, with optional scheduling and output delivery.

- [ ] Import and call `runPipeline()` from `orchestrator.js`
- [ ] Print the final report brief to stdout in a readable format
- [ ] Add `--output <file>` CLI flag to optionally write the report to a `.md` or `.json` file
- [ ] Add `--sectors <list>` CLI flag to optionally restrict analysis to a subset of sectors
- [ ] Add graceful shutdown handling (`SIGINT` / `SIGTERM`)
- [ ] Add a total cost summary line at the end of each run (sourced from rueter-ai cost tracking)
- [ ] Document the run command in README: `node index.js`
- [ ] Test a complete run from scratch: `node index.js` should produce a full, readable brief with no manual intervention

---

## Phase 8 — Testing & Validation

> Goal: Ensure each layer is reliable and the full pipeline produces directionally accurate signals.

- [ ] Write isolated unit tests for `buildEconomicBreakdown` using mocked API responses
- [ ] Write isolated unit tests for `scoreAllSectors` using a mock breakdown object
- [ ] Write isolated unit tests for `rankSectors` and `detectMarketRegime` with known score arrays
- [ ] Write isolated unit tests for `identifyAllPicks` using mock sector scores
- [ ] Run a full end-to-end pipeline test and manually evaluate report quality against current known market conditions
- [ ] Backtest sector scores against a known historical market period (e.g., a documented bull or bear market) to validate directional accuracy
- [ ] Confirm pipeline completes successfully even when one sector's model call fails (graceful degradation)

---

## Phase 9 — Cost Optimization & Prompt Hardening

> Goal: Minimize cost per run while maintaining signal quality; ensure model outputs are consistent and well-structured.

- [ ] Profile cost per pipeline run using rueter-ai's built-in cost reporting
- [ ] Identify the most expensive stages and evaluate cheaper model alternatives for lower-stakes tasks
- [ ] Compress the economic breakdown context to reduce input token count without losing signal fidelity
- [ ] Cache news summaries with a short TTL (e.g., 15–30 minutes) to avoid redundant API calls between runs
- [ ] Add strict JSON schema instructions to all prompts that return structured data to prevent parse failures
- [ ] Evaluate switching lower-stakes models (e.g., article summarization) to `haiku` or `grok` tier for cost savings
- [ ] Document the average cost per full pipeline run in README
- [ ] Set a hard budget cap that aborts the run and alerts if estimated cost exceeds a configurable limit

---

## Completion Criteria

The project is considered complete when:

- `node index.js` runs end-to-end without errors and produces a coherent investment brief
- All 10 sectors return valid scores in the -1 to 1 range
- The final report includes at least 2 stock/fund picks per top sector with thesis and risk tier
- Total cost per run is profiled and documented
- The brief is readable and actionable by a human investor with no additional context
