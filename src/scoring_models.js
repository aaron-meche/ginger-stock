//
// scoring_models.js
//
// by Aaron Meche
//
// Layer 3: Pure computation layer — no AI calls. Aggregates sector scores from
// research_models, applies confidence weighting, ranks sectors, detects the
// broad market regime, and filters down to actionable investment targets.
//

// ─── Constants ───────────────────────────────────────────────────────────────

// Minimum score a sector must have to be considered actionable for investment
const BULLISH_THRESHOLD = 0.3

// Below this, a sector is actively unfavorable
const BEARISH_THRESHOLD = -0.3

// Classified states of the overall market based on sector score distribution
const MARKET_REGIMES = {
    BULL:       "BULL",       // majority of sectors scoring positive — risk-on
    BEAR:       "BEAR",       // majority of sectors scoring negative — risk-off
    MIXED:      "MIXED",      // split signals, no clear directional bias
    DEFENSIVE:  "DEFENSIVE",  // low average scores, safe-haven positioning favored
}

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Sorts sector scores from highest (most bullish) to lowest (most bearish).
 * Returns a new sorted array — does not mutate the input.
 * @param {Array<{ sector: string, score: number, rationale: string }>} scores
 * @returns {Array<{ sector: string, score: number, rationale: string }>}
 */
function rankSectors(scores) {
    // TODO: return [...scores].sort((a, b) => b.score - a.score)
}

/**
 * Analyzes the score distribution to classify the current broad market regime.
 * Uses the count of bullish vs bearish sectors and the average score.
 * @param {Array<{ sector: string, score: number }>} scores
 * @returns {string} one of MARKET_REGIMES
 */
function detectMarketRegime(scores) {
    // TODO: compute average score across all sectors
    // TODO: count sectors above BULLISH_THRESHOLD (bullish count)
    // TODO: count sectors below BEARISH_THRESHOLD (bearish count)
    // TODO: if average > 0.4 and bullishCount > bearishCount → BULL
    // TODO: if average < -0.4 and bearishCount > bullishCount → BEAR
    // TODO: if average is between -0.15 and 0.15 and |bullish - bearish| <= 2 → DEFENSIVE
    // TODO: otherwise → MIXED
}

/**
 * Optionally adjusts scores based on heuristic confidence signals.
 * Initially a pass-through; extend with rationale-length or source-count weighting.
 * @param {Array<{ sector: string, score: number, rationale: string }>} scores
 * @returns {Array<{ sector: string, score: number, rationale: string }>}
 */
function applyConfidenceWeighting(scores) {
    // TODO: implement rationale-length heuristic — longer rationale = higher confidence
    // TODO: optionally scale score slightly toward 0 for very short rationales (low confidence)
    // TODO: for now, return scores unchanged (pass-through) until weighting logic is validated
}

/**
 * Filters the ranked sector list to only those meeting the bullish threshold.
 * These are the sectors passed to stock_models for pick identification.
 * @param {Array<{ sector: string, score: number, rationale: string }>} rankedScores
 * @param {number} [threshold=BULLISH_THRESHOLD]
 * @returns {Array<{ sector: string, score: number, rationale: string }>}
 */
function filterActionableSectors(rankedScores, threshold = BULLISH_THRESHOLD) {
    // TODO: return rankedScores.filter(s => s.score >= threshold)
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
    rankSectors,
    detectMarketRegime,
    applyConfidenceWeighting,
    filterActionableSectors,
    MARKET_REGIMES,
    BULLISH_THRESHOLD,
    BEARISH_THRESHOLD,
}
