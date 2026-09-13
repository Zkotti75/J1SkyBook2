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
