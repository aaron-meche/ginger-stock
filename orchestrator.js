//
// orchestrator.js
//
// by Aaron Meche
//
// Layer 5: The master pipeline coordinator. Wires all layers together in the
// correct sequential-and-parallel order, manages data flow between stages,
// enforces the MAX_SIMUL_MODELS concurrency ceiling, and handles errors.
//

import "dotenv/config"

import { buildEconomicBreakdown, SECTORS } from "./src/data_models.js"
import { scoreAllSectors, MAX_SIMUL_MODELS } from "./src/research_models.js"
import {
    rankSectors,
    detectMarketRegime,
    applyConfidenceWeighting,
    filterActionableSectors,
    BULLISH_THRESHOLD,
} from "./src/scoring_models.js"
import { identifyAllPicks } from "./src/stock_models.js"
import { synthesizeReport } from "./src/output_models.js"

// ─── Constants ───────────────────────────────────────────────────────────────

// Minimum sector score to qualify for stock pick research (passed to filterActionableSectors)
const ACTIONABLE_THRESHOLD = BULLISH_THRESHOLD

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the current timestamp in ISO 8601 format.
 * @returns {string}
 */
function now() {
    return new Date().toISOString()
}

/**
 * Logs a stage completion message with elapsed time in seconds.
 * @param {string} stage
 * @param {number} startMs
 */
function logStage(stage, startMs) {
    const elapsed = ((Date.now() - startMs) / 1000).toFixed(1)
    console.log(`[orchestrator] ${stage} completed in ${elapsed}s`)
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

/**
 * Executes the full Ginger Stock analysis pipeline end-to-end.
 * Runs stages sequentially where data dependencies exist, parallel within stages.
 *
 * Pipeline order:
 *   1. data_models     → economic breakdown
 *   2. research_models → sector scores (parallel, MAX_SIMUL_MODELS cap)
 *   3. scoring_models  → ranked sectors + market regime (pure computation)
 *   4. stock_models    → investment picks for actionable sectors (parallel)
 *   5. output_models   → synthesized investment brief
 *
 * @returns {Promise<{ report: string, regime: string, rankedSectors: object[], actionableSectors: object[], picks: object[], generatedAt: string }>}
 */
async function runPipeline() {
    console.log(`[orchestrator] pipeline started at ${now()}`)
    console.log(`[orchestrator] analyzing ${SECTORS.length} sectors | MAX_SIMUL_MODELS=${MAX_SIMUL_MODELS}`)

    let t

    // ── Stage 1: Fetch news and build economic breakdown ──────────────────────
    t = Date.now()
    // TODO: const breakdown = await buildEconomicBreakdown(SECTORS)
    // TODO: logStage("data_models (breakdown)", t)

    // ── Stage 2: Score all sectors in parallel ────────────────────────────────
    t = Date.now()
    // TODO: const rawScores = await scoreAllSectors(breakdown)
    // TODO: logStage("research_models (sector scoring)", t)

    // ── Stage 3: Aggregate, rank, and filter sectors ──────────────────────────
    t = Date.now()
    // TODO: const weightedScores = applyConfidenceWeighting(rawScores)
    // TODO: const rankedSectors = rankSectors(weightedScores)
    // TODO: const regime = detectMarketRegime(rankedSectors)
    // TODO: const actionableSectors = filterActionableSectors(rankedSectors, ACTIONABLE_THRESHOLD)
    // TODO: logStage("scoring_models (ranking + regime)", t)
    // TODO: console.log(`[orchestrator] regime=${regime} | actionable=${actionableSectors.length}/${SECTORS.length} sectors`)

    // ── Stage 4: Identify picks for actionable sectors ────────────────────────
    t = Date.now()
    // TODO: const picks = await identifyAllPicks(actionableSectors)
    // TODO: logStage("stock_models (pick identification)", t)
    // TODO: console.log(`[orchestrator] identified ${picks.length} picks across ${actionableSectors.length} sectors`)

    // ── Stage 5: Synthesize final investment brief ────────────────────────────
    t = Date.now()
    // TODO: const generatedAt = now()
    // TODO: const pipelineOutput = { regime, rankedSectors, actionableSectors, picks, timestamp: generatedAt }
    // TODO: const report = await synthesizeReport(pipelineOutput)
    // TODO: logStage("output_models (report synthesis)", t)

    // TODO: return { report, regime, rankedSectors, actionableSectors, picks, generatedAt }
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export { runPipeline }
