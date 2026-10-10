# Yokohama research handoff — 2026-10-10

Paused at the user's request to prioritise newly assigned Fukuoka broadcasts.

- Batches yokohama-fm-01, -02 and -03 completed: 12 of 35 players. All three batch validators passed; npm test passed 16/16. Cards and queue published to main; final data commit 6eae819052076d31df546672d3800233ede14495. GitHub Pages deployment succeeded and live club JSON matched the local file exactly.
- Six batches / 23 players remain. No Yokohama batch is active.
- Resume with yokohama-fm-04: #21 飯倉大樹, #22 角田涼太朗, #23 宮市亮, #24 近藤友喜. Read current main, AGENTS.md, playbook and club queue before starting; run `npm run research:start -- --batch=yokohama-fm-04`.
- Status-tag stage remains separately scheduled. Run full-club strict validation only after all nine player batches are complete.
- Historical statistical conflicts and missing figures are recorded on the cards, with null values. Do not infer zeros from dashes or absent Data Site rows. Current totals use the 2026-10-09 J.League Data Site snapshot; refresh when resuming.
- The separate whole-project strict workflow currently fails at Urawa, while npm test and Pages deployment pass. This is not a pending Yokohama publication.
- Source-backed research is in data/clubs/yokohama-fm.json; authoritative progress is data/research-progress/yokohama-fm.json. Temporary caches are not needed to recover completed work.
