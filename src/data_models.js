//
// data_models.js
//
// by Aaron Meche
//
// Layer 1: Fetches financial news headlines, summarizes each article into an
// economic signal, and assembles a sector-level breakdown for downstream models.
//

import "dotenv/config"
import { RueterModel } from "rueter-ai"

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_ARTICLES_PER_SECTOR = 5

const SECTORS = [
    "Technology",
    "Healthcare",
    "Energy",
    "Financials",
    "Consumer Discretionary",
    "Industrials",
    "Real Estate",
    "Utilities",
    "Materials",
    "Communication Services",
]

// Keywords mapped to each sector for targeted news queries
const SECTOR_KEYWORDS = {
    "Technology":               "tech stocks semiconductor software cloud AI",
    "Healthcare":               "healthcare pharma biotech medical FDA",
    "Energy":                   "oil gas energy crude renewable",
    "Financials":               "banks interest rates fed finance fintech",
    "Consumer Discretionary":   "retail consumer spending earnings discretionary",
    "Industrials":              "manufacturing industrial aerospace defense supply chain",
    "Real Estate":              "real estate REIT housing mortgage rates",
    "Utilities":                "utilities electric grid power water",
    "Materials":                "materials mining metals chemicals commodities",
    "Communication Services":   "media telecom streaming social platforms advertising",
}

const SUMMARIZER_SYSTEM_PROMPT = `You are a financial news analyst. Extract the core economic signal from a news article in 1-2 concise sentences. Focus on what the news means for investors — not the event itself. Be direct, dense, and neutral. No filler words.`

const BREAKDOWN_SYSTEM_PROMPT = `You are a macroeconomic research analyst writing context for other AI models. Given a collection of economic signals for a specific market sector, produce a compact 150-200 word paragraph describing the current state of that sector. Cover: overall sentiment, key risks, notable tailwinds, and macro trends. Be signal-rich and precise — this will be read by an AI, not a human.`

// ─── Models ──────────────────────────────────────────────────────────────────

// Low-cost, fast model for high-volume article summarization
const summarizerModel = new RueterModel("grok", process.env.GROK_API, 1, {
    temperature: 0.1,
    maxTokens: 128,
    systemPrompt: SUMMARIZER_SYSTEM_PROMPT,
})

// Slightly higher token limit for sector-level aggregation
const breakdownModel = new RueterModel("grok", process.env.GROK_API, 1, {
    temperature: 0.1,
    maxTokens: 512,
    systemPrompt: BREAKDOWN_SYSTEM_PROMPT,
})

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Fetches the most recent news articles for each sector from the news API.
 * Returns a map of sector name → array of raw article objects.
 * @param {string[]} sectors
 * @returns {Promise<Record<string, Array<{ headline: string, summary: string, source: string, publishedAt: string, sector: string }>>>}
 */
async function fetchHeadlines(sectors) {
    // TODO: initialize news API client using process.env.NEWS_API_KEY
    // TODO: for each sector, build a query string from SECTOR_KEYWORDS[sector]
    // TODO: call news API endpoint and retrieve top MAX_ARTICLES_PER_SECTOR articles
    // TODO: normalize each response article to { headline, summary, source, publishedAt, sector }
    // TODO: return a map of sector -> normalized article array
    // TODO: handle rate limits and API errors with retry logic
}

/**
 * Passes a single article through the summarizer model to extract its economic signal.
 * @param {{ headline: string, summary: string, sector: string }} article
 * @returns {Promise<string>} 1-2 sentence economic signal string
 */
async function summarizeArticle(article) {
    // TODO: construct prompt from article.headline and article.summary
    // TODO: call summarizerModel.prompt(prompt) and return the text response
}

/**
 * Aggregates summarized signals for one sector into a single compact snapshot paragraph.
 * @param {string[]} summarizedSignals array of 1-2 sentence signals for this sector
 * @param {string} sector
 * @returns {Promise<string>} 150-200 word sector snapshot
 */
async function buildSectorSnapshot(summarizedSignals, sector) {
    // TODO: build a prompt that lists all signals and asks for a sector summary
    // TODO: include the sector name so the model knows the context
    // TODO: call breakdownModel.prompt(prompt) and return the response string
}

/**
 * Runs the full data pipeline: fetch → summarize → snapshot → structured breakdown.
 * Returns an object keyed by sector name, each value being a snapshot string.
 * This object is the primary input for all downstream research models.
 * @param {string[]} [sectors=SECTORS]
 * @returns {Promise<Record<string, string>>} economic breakdown keyed by sector
 */
async function buildEconomicBreakdown(sectors = SECTORS) {
    // TODO: call fetchHeadlines(sectors) to get raw articles per sector
    // TODO: for each sector, run summarizeArticle on each article (can parallelize within sector)
    // TODO: call buildSectorSnapshot(summarizedSignals, sector) for each sector
    // TODO: assemble and return the final breakdown object: { [sector]: snapshotString }
    // TODO: log progress (e.g., "[data_models] fetched N articles, built breakdown in Xs")
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export { buildEconomicBreakdown, SECTORS, SECTOR_KEYWORDS }
