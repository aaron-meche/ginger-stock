//
// research_models.js
//
// by Aaron Meche
//
// Layer 2: Spawns parallel AI researcher models — one per market sector — each
// independently scoring the current investment attractiveness of its sector
// on a scale of -1 (extremely bearish) to +1 (extremely bullish).
//

import "dotenv/config"
import { RueterModel } from "rueter-ai"
import { SECTORS } from "./data_models.js"

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_SIMUL_MODELS = 16

// Score boundaries — values outside this range will be clamped
const SCORE_MIN = -1
const SCORE_MAX = 1

const RESEARCHER_SYSTEM_PROMPT = `You are a professional investment research analyst specializing in sector-level market analysis. You will receive a structured economic breakdown of current market conditions. Evaluate the specified sector's investment attractiveness based solely on the data provided. Return ONLY a valid JSON object with no additional text, prose, or markdown:
{ "sector": "<sector name>", "score": <number -1.0 to 1.0>, "rationale": "<2-3 sentence justification citing specific signals>" }
Score guide: -1.0 = extremely bearish (avoid entirely), 0.0 = neutral (mixed signals), 1.0 = extremely bullish (strong opportunity). Be precise and data-driven.`

// Shared config applied to every researcher model instance
const RESEARCHER_MODEL_CONFIG = {
    temperature: 0.15,
    maxTokens: 256,
    systemPrompt: RESEARCHER_SYSTEM_PROMPT,
}

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Constructs the user-facing prompt for a sector researcher model.
 * Injects the full economic breakdown as context and specifies the target sector.
 * @param {string} sector
 * @param {Record<string, string>} breakdown economic breakdown from data_models
 * @returns {string} formatted prompt string
 */
function buildResearchPrompt(sector, breakdown) {
    // TODO: serialize the full breakdown object into a readable context block
    // TODO: clearly label each sector's snapshot so the model can reference others for comparison
    // TODO: append a direct instruction specifying which sector to score
    // TODO: reinforce the JSON-only output requirement
}

/**
 * Clamps a numeric score to the valid [-1, 1] range.
 * @param {number} score
 * @returns {number}
 */
function clampScore(score) {
    // TODO: return Math.max(SCORE_MIN, Math.min(SCORE_MAX, score))
}

/**
 * Spawns a single researcher model for one sector and returns its score object.
 * Retries once on JSON parse failure before returning a neutral fallback.
 * @param {string} sector
 * @param {Record<string, string>} breakdown
 * @returns {Promise<{ sector: string, score: number, rationale: string }>}
 */
async function scoreSector(sector, breakdown) {
    // TODO: instantiate a new RueterModel("grok", process.env.GROK_API, 1, RESEARCHER_MODEL_CONFIG)
    // TODO: call buildResearchPrompt(sector, breakdown)
    // TODO: call model.prompt(prompt) and attempt JSON.parse on the response
    // TODO: call clampScore on the parsed score value
    // TODO: on JSON parse error, retry once with an explicit "return only JSON" reminder
    // TODO: if retry also fails, return a neutral fallback { sector, score: 0, rationale: "parse error" }
    // TODO: track and log the model cost via rueter-ai cost reporting
}

/**
 * Runs all sector researchers in parallel, respecting MAX_SIMUL_MODELS concurrency cap.
 * Returns an array of sector score objects, one per sector.
 * @param {Record<string, string>} breakdown economic breakdown from data_models
 * @returns {Promise<Array<{ sector: string, score: number, rationale: string }>>}
 */
async function scoreAllSectors(breakdown) {
    // TODO: map SECTORS to scoreSector(sector, breakdown) calls
    // TODO: if SECTORS.length <= MAX_SIMUL_MODELS, run all via Promise.all directly
    // TODO: otherwise, chunk into batches of MAX_SIMUL_MODELS and run batches sequentially
    // TODO: return the flat array of all sector score results
    // TODO: log total cost for this stage from rueter-ai cost tracking
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export { scoreAllSectors, MAX_SIMUL_MODELS, SCORE_MIN, SCORE_MAX }
