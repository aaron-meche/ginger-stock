//
// index.js
//
// by Aaron Meche
//
// Entry point for the Ginger Stock pipeline. Run with: node index.js
// Invokes the orchestrator, prints the investment brief to stdout,
// and optionally writes the report to a file.
//

import "dotenv/config"
import { runPipeline } from "./orchestrator.js"

// ─── Constants ───────────────────────────────────────────────────────────────

const DIVIDER = "─".repeat(72)

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parses basic CLI flags from process.argv.
 * Supported flags:
 *   --output <filepath>   write the report to a file in addition to stdout
 *   --sectors <list>      comma-separated sector names to restrict analysis
 * @returns {{ outputFile: string|null, sectors: string[]|null }}
 */
function parseArgs() {
    // TODO: iterate process.argv and extract --output and --sectors values
    // TODO: split --sectors value on commas and trim whitespace
    // TODO: return { outputFile: string|null, sectors: string[]|null }
}

/**
 * Writes the report string to the specified file path.
 * @param {string} report
 * @param {string} filePath
 * @returns {Promise<void>}
 */
async function writeReportToFile(report, filePath) {
    // TODO: import { writeFile } from "fs/promises"
    // TODO: write the report string to filePath with utf-8 encoding
    // TODO: log confirmation of the output file path
}

// ─── Main ─────────────────────────────────────────────────────────────────────

/**
 * Main entry point. Runs the full pipeline and delivers the investment brief.
 */
async function main() {
    // TODO: call parseArgs() to get outputFile and sectors options
    // TODO: call runPipeline() (passing sectors override if provided)
    // TODO: print DIVIDER + report + DIVIDER to stdout
    // TODO: if outputFile is set, call writeReportToFile(report, outputFile)
    // TODO: print total pipeline cost summary from rueter-ai cost tracking
    // TODO: print the generatedAt timestamp
}

main().catch((err) => {
    console.error("[ginger-stock] fatal error:", err.message)
    process.exit(1)
})
