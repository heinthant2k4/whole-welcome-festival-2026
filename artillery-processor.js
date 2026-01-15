"use strict";

const { randomUUID } = require("crypto");

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Called automatically by Artillery before the vote request.
 * We parse the /api/crews response (from the same VU) if present,
 * pick a real crew ID, and set required fields.
 */
function injectVotePayload(requestParams, context, ee, next) {
  // Artillery stores the last response body in context.vars sometimes,
  // but safest: use context.vars from the GET /api/crews step if you capture it.
  // Since we didn't add explicit capture in YAML, we use a fallback approach:
  // Artillery exposes prior responses in context.vars only if we store it ourselves.

  // If we already cached crew IDs for this VU, reuse them.
  let crewIds = context.vars.__crewIds;

  // If not cached, try to read from the most recent crews response body (Artillery sets it on context.vars sometimes)
  if (!crewIds && context.vars && context.vars.crewsResponse) {
    try {
      const crews = JSON.parse(context.vars.crewsResponse);
      crewIds = crews.map((c) => c.id).filter((x) => Number.isInteger(x));
      context.vars.__crewIds = crewIds;
    } catch {
      // ignore
    }
  }

  // If still missing (common), just use a safe fallback crewId that will FAIL FAST visibly.
  // But we can do better: inject a known-good crewId via env for worst-case.
  const fallbackCrewId = process.env.ARTILLERY_FALLBACK_CREW_ID
    ? Number(process.env.ARTILLERY_FALLBACK_CREW_ID)
    : null;

  let crewId = null;

  if (Array.isArray(crewIds) && crewIds.length > 0) {
    crewId = pickRandom(crewIds);
  } else if (Number.isInteger(fallbackCrewId)) {
    crewId = fallbackCrewId;
  } else {
    crewId = 1; // last resort (may fail if not in DB)
  }

  // Required fields
  context.vars.crewId = crewId;
  context.vars.fingerprint = randomUUID();

  // If your server verifyArtilleryToken is placeholder-true, any string works.
  // If you later implement token verification, update this generator.
  context.vars.artilleryToken = "artillery-test-token";

  return next();
}

module.exports = {
  injectVotePayload,
};
