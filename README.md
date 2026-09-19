# J1 SkyBook 2

J1 SkyBook 2 is a Traditional Chinese, Hong Kong–market reference portal for live football commentary. It is rebuilt around the “Nishikawa Template” data standard while preserving the fast two-team and shirt-number navigation of the original SkyBook.

## Data principles

- J.League Data Site or an official club profile is authoritative for current registration, shirt number, position and player vitals.
- Hong Kong Chinese screen names follow the supplied TVB spreadsheet.
- Career rows are stored one season per row. League appearances and goals are not inferred.
- Overseas club names use English; Japanese clubs and schools use established Traditional Chinese or Japanese names.
- Category 2, special-designated, loan and new-season status must be dated and sourced.
- A blank value means that the information has not been reliably verified.

## Structure

- `data/teams.json`: the 20-club manifest and display configuration.
- `data/clubs/*.json`: one independently loaded club database per team.
- `scripts/migrate-legacy.mjs`: one-time compatibility migration from the original database.
- `scripts/validate-data.mjs`: structural and coverage checks.

Run `npm test` before publishing. The existing J1SkyBook repository remains the live fallback until this rebuild is fully audited.

## Pre-match update workflow

When a fixture is known, run `npm run match:prep -- --home=fc-tokyo --away=machida --date=2026-09-26` (or `--format=json` for a machine-readable report). Names or slugs can identify the two clubs. This reads the existing two club files and identifies stale roster dates, player profiles, current-season statistics and strict career gaps. It does not fetch live data or change records without source review.

Research official J.League and club pages and dated transfer, injury and suspension announcements as of the fixture date. Edit only the affected `data/clubs/<slug>.json` files: add/remove players or staff after verifying registration, record changes in team notes, update team.current_season and player season_stats, and preserve each claim's source URL and as-of/verified date. Keep TVB Hong Kong Chinese display names, established Traditional Chinese Japanese club and school names, and English overseas clubs and competitions. Use null for unavailable figures; do not invent them.

Player cards support four source-led additions. `analytics` holds competition-scoped metrics, positional percentiles, sample minutes, insights, an `as_of` date and linked sources. `trivia` is a list of human-interest facts labelled `confirmed`, `reported` or `anecdotal`; confirmed and reported facts require a URL. `recent_interviews` stores publication/interview dates, outlet, context, original Japanese wording, Traditional Chinese translation, commentary paraphrase and URL. `match_week` holds fixture-specific form, selection, matchup and milestone notes and must be regenerated for the named opponent. Empty sections stay hidden in the portal.

For every fixture, search the seven calendar days ending on the match date. A direct translated quotation must retain the original-language wording and source link; otherwise store it as a paraphrase without quotation marks. Non-official analytics and trivia are allowed, but the provider, competition, cutoff date and sample size must remain visible. Do not silently combine providers whose definitions differ.

Run `npm run validate:strict -- --club=fc-tokyo` and similarly for the other club, then `npm run validate:strict` before publishing. The validator prints a club-by-club blocker and coverage count. Strict blockers include undated career rows and verified rows without a URL. Missing images and appearance/goal figures are separately counted as coverage gaps, because they may genuinely be unavailable; check and source these where possible. A successful structural validation never substitutes for checking the source's actual claim, current registration and live match facts.
