//
// output_models.js
//
// by Aaron Meche
//
// Layer 6: Receives the fully assembled pipeline output and uses a high-quality
// AI model to synthesize it into a clean, human-readable investment brief in
// markdown. This is the final AI pass before delivery to the user.
//

import "dotenv/config"
import { RueterModel } from "rueter-ai"
import { MARKET_REGIMES } from "./scoring_models.js"

// ─── Constants ───────────────────────────────────────────────────────────────

// Human-readable label map for sector scores used in the formatted table
const SCORE_LABELS = {
    STRONGLY_BULLISH:   { min: 0.75,  max: 1.0,   label: "Strongly Bullish",  symbol: "▲▲" },
    BULLISH:            { min: 0.40,  max: 0.74,  label: "Bullish",           symbol: "▲"  },
    NEUTRAL:            { min: -0.39, max: 0.39,  label: "Neutral",           symbol: "─"  },
    BEARISH:            { min: -0.74, max: -0.40, label: "Bearish",           symbol: "▼"  },
    STRONGLY_BEARISH:   { min: -1.0,  max: -0.75, label: "Strongly Bearish",  symbol: "▼▼" },
}

const REGIME_DESCRIPTIONS = {
    [MARKET_REGIMES.BULL]:       "Broad market conditions are favorable. Risk-on positioning is supported.",
    [MARKET_REGIMES.BEAR]:       "Broad market conditions are unfavorable. Defensive posture is advised.",
    [MARKET_REGIMES.MIXED]:      "Mixed signals across sectors. Selective exposure with tight risk management.",
    [MARKET_REGIMES.DEFENSIVE]:  "Low-conviction environment. Safe-haven assets and quality names preferred.",
}

const ANALYST_PERSONA = `You are a senior investment strategist writing a market brief for a private investor. Write in a professional, direct tone. Use clean markdown. Be concise — this is a decision-support document, not a research paper.`

const REPORT_SYSTEM_PROMPT = `${ANALYST_PERSONA}
You will receive structured data from a multi-model market analysis pipeline including: a market regime classification, a ranked list of sector scores with rationales, and a curated list of investment picks. Synthesize this into a polished investment brief with exactly these sections:
1. ## Executive Summary (3-4 sentences)
2. ## Market Regime
3. ## Sector Rankings (use the pre-formatted table provided)
4. ## Top Investment Picks (use the pre-formatted picks list provided)
5. ## Market Outlook (2-3 sentences forward-looking assessment)
Do not add sections. Do not modify the pre-formatted tables or lists — insert them verbatim.`

// ─── Models ──────────────────────────────────────────────────────────────────

// Highest-quality model for final report — this is the human-facing output
const reportModel = new RueterModel("anthropic", process.env.ANTHROPIC_API, 1, {
    temperature: 0.3,
    maxTokens: 1500,
    systemPrompt: REPORT_SYSTEM_PROMPT,
})

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Maps a numeric score to its human-readable label and symbol.
 * @param {number} score
 * @returns {{ label: string, symbol: string }}
 */
function scoreToLabel(score) {
    // TODO: iterate SCORE_LABELS entries and return the matching label/symbol pair
    // TODO: default to NEUTRAL if no range matches
}

/**
 * Renders a markdown table of all sectors ranked by score.
 * @param {Array<{ sector: string, score: number, rationale: string }>} rankedSectors
 * @returns {string} markdown table string
 */
function formatSectorTable(rankedSectors) {
    // TODO: build header: | Rank | Sector | Score | Signal |
    // TODO: for each sector, call scoreToLabel(sector.score) for the signal column
    // TODO: right-align the score column to 2 decimal places
    // TODO: return the complete markdown table string
}

/**
 * Renders a markdown list of investment picks grouped by sector.
 * @param {Array<{ ticker, name, type, sector, thesis, riskTier, timeHorizon }>} picks
 * @returns {string} formatted markdown picks section
 */
function formatTopPicks(picks) {
    // TODO: group picks by sector using a Map
    // TODO: for each sector group, render a subheading and a bullet per pick
    // TODO: each bullet: **TICKER** — Name (Type | Risk: tier | Horizon: horizon) — thesis
}

/**
 * Assembles the full prompt for the report synthesis model.
 * Injects pre-formatted tables and the structured pipeline data as context.
 * @param {{ regime: string, rankedSectors: object[], actionableSectors: object[], picks: object[], timestamp: string }} pipelineOutput
 * @returns {string} complete prompt string
 */
function buildReportPrompt(pipelineOutput) {
    // TODO: call formatSectorTable(pipelineOutput.rankedSectors)
    // TODO: call formatTopPicks(pipelineOutput.picks)
    // TODO: include regime description from REGIME_DESCRIPTIONS[pipelineOutput.regime]
    // TODO: include the timestamp so the brief is clearly dated
    // TODO: assemble all pieces into a single structured prompt string
    // TODO: include a note of how many sectors were analyzed and how many were actionable
}

/**
 * Calls the report model to produce the final human-readable investment brief.
 * @param {{ regime: string, rankedSectors: object[], actionableSectors: object[], picks: object[], timestamp: string }} pipelineOutput
 * @returns {Promise<string>} complete markdown investment brief
 */
async function synthesizeReport(pipelineOutput) {
    // TODO: call buildReportPrompt(pipelineOutput)
    // TODO: call reportModel.prompt(prompt)
    // TODO: return the markdown string from the model response
    // TODO: log model cost via rueter-ai cost tracking
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export { synthesizeReport, formatSectorTable, formatTopPicks, SCORE_LABELS, REGIME_DESCRIPTIONS }
