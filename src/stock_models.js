//
// stock_models.js
//
// by Aaron Meche
//
// Layer 4: For each actionable sector identified by scoring_models, spawns
// a targeted AI model to identify specific stocks, ETFs, and index funds
// that are the most promising investment vehicles given current conditions.
//

import "dotenv/config"
import { RueterModel } from "rueter-ai"

// ─── Constants ───────────────────────────────────────────────────────────────

const PICKS_PER_SECTOR = 3

const RISK_TIERS = {
    LOW:    "low",    // blue-chip, dividend, stable
    MEDIUM: "medium", // growth with moderate volatility
    HIGH:   "high",   // speculative, high beta, emerging
}

const TIME_HORIZONS = {
    SHORT:  "short",  // days to a few weeks
    MEDIUM: "medium", // weeks to a few months
    LONG:   "long",   // months to years
}

// Ticker validation: 1-5 uppercase letters (basic NYSE/NASDAQ format)
const TICKER_REGEX = /^[A-Z]{1,5}$/

const STOCK_PICKER_SYSTEM_PROMPT = `You are a professional equity research analyst with deep knowledge of current market conditions. Given a market sector and its investment score with rationale, identify the ${PICKS_PER_SECTOR} most promising investment vehicles in that sector right now. Return ONLY a valid JSON array — no prose, no markdown — where each element matches this exact shape:
{ "ticker": "<TICKER>", "name": "<full company or fund name>", "type": "stock" | "etf" | "index", "sector": "<sector name>", "thesis": "<1-2 sentence investment case tied to the current conditions>", "riskTier": "low" | "medium" | "high", "timeHorizon": "short" | "medium" | "long" }
Mix individual stocks and ETFs. Use real, currently-trading tickers only.`

// ─── Models ──────────────────────────────────────────────────────────────────

// Use a higher-capability model here — stock picks require factual accuracy
// and hallucinated tickers are a hard failure mode
const STOCK_PICKER_MODEL_CONFIG = {
    temperature: 0.2,
    maxTokens: 768,
    systemPrompt: STOCK_PICKER_SYSTEM_PROMPT,
}

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Validates a single pick object has all required fields and a valid ticker format.
 * @param {object} pick
 * @returns {boolean}
 */
function isValidPick(pick) {
    // TODO: check pick has ticker, name, type, sector, thesis, riskTier, timeHorizon
    // TODO: validate ticker matches TICKER_REGEX
    // TODO: validate type is one of "stock" | "etf" | "index"
    // TODO: validate riskTier is one of RISK_TIERS values
    // TODO: validate timeHorizon is one of TIME_HORIZONS values
    // TODO: return true only if all checks pass
}

/**
 * Constructs the prompt for a stock picker model given a scored sector.
 * @param {string} sector
 * @param {{ score: number, rationale: string }} sectorScore
 * @returns {string} formatted prompt string
 */
function buildStockResearchPrompt(sector, sectorScore) {
    // TODO: format the sector name, numeric score, and rationale into a clear prompt block
    // TODO: instruct the model to return exactly PICKS_PER_SECTOR picks as a JSON array
    // TODO: remind the model to use only real, currently-trading tickers
}

/**
 * Identifies the top stock and fund picks for a single sector.
 * Retries once on JSON parse failure before returning an empty array.
 * @param {{ sector: string, score: number, rationale: string }} sectorScore
 * @returns {Promise<Array<{ ticker, name, type, sector, thesis, riskTier, timeHorizon }>>}
 */
async function identifyPicksForSector(sectorScore) {
    // TODO: instantiate a new RueterModel("anthropic", process.env.ANTHROPIC_API, 1, STOCK_PICKER_MODEL_CONFIG)
    // TODO: call buildStockResearchPrompt(sectorScore.sector, sectorScore)
    // TODO: call model.prompt(prompt) and attempt JSON.parse on the response
    // TODO: filter parsed array through isValidPick — drop any malformed picks
    // TODO: on parse error, retry once before returning []
    // TODO: log model cost via rueter-ai cost tracking
}

/**
 * Deduplicates a flat array of picks by ticker symbol, keeping the first occurrence.
 * Prevents the same ticker from appearing under multiple sectors.
 * @param {Array<{ ticker: string }>} picks
 * @returns {Array<{ ticker: string }>}
 */
function deduplicatePicks(picks) {
    // TODO: use a Set to track seen tickers
    // TODO: return only the first occurrence of each ticker
}

/**
 * Identifies picks for all actionable sectors in parallel and returns a flat deduplicated list.
 * @param {Array<{ sector: string, score: number, rationale: string }>} actionableSectors
 * @returns {Promise<Array<{ ticker, name, type, sector, thesis, riskTier, timeHorizon }>>}
 */
async function identifyAllPicks(actionableSectors) {
    // TODO: map actionableSectors to identifyPicksForSector calls
    // TODO: run via Promise.all to parallelize across sectors
    // TODO: flatten nested arrays into one combined picks array
    // TODO: call deduplicatePicks on the combined array before returning
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export { identifyAllPicks, PICKS_PER_SECTOR, RISK_TIERS, TIME_HORIZONS, TICKER_REGEX }
