# 神戶–町田：11月10日賽前掃描

Target: `data/matches/2026-11-11-kobe-machida.json`, https://skybook.zkotti.com/#/match/kobe/machida/2026-11-11/cup

## Scope and publication

Only this match dossier and the necessary availability / workload rendering were changed. All ten sections, both 38-round league logs and the 52-result cup section remain. Player profiles, batch queues, the other assignment and schedules were not changed. No predicted squad was entered.

Published baseline before work: `0de0e8bebdfe067be707ed4c73747266397be5b8`. Repository AGENTS.md, match-centre requirements, playbook and SkyBook source policy reviewed. No `.agents/skills` directory or additional local skill was found in the repository / checked parent locations. Player-batch workflow does not apply to this match-only sweep.

## Evidence and changes

- League, Kobe and Machida confirm 11 November 2026, 19:00 JST / 18:00 HKT, Noevir Stadium, League Cup quarter-final first leg. TVB schedule re-read: 17:55 HKT broadcast, 高志超 + 史葛; no later roster revision found. Private addresses and email body excluded from public data.
- Official league table: 8 November 19:24 JST, all 20 clubs on 14 matches; total goals for / against both 413. Kobe 27 points, Machida 29. Four intervening league results and Asian matches were reconciled; Kobe 3W2D and Machida 2W3D in their most recent five official games. Home/away records and five J1 head-to-head games have explicit scope; last year's Emperor's Cup final is separate.
- Nine paraphrased, current-window interview entries from 8 November: Skibbe, Muto, Yamakawa, Kuroda and Shoji. Exact dates, outlets and URLs retained. No new direct quotation invented. Official preview is accessed 10 November; no invented publication timestamp.
- Machida: Soma, Ogawa and Tete Yengi on senior international duty; Tokumura withdrew from U19 duty, reason not supplied. Kobe: Iwamoto U21 and Hamasaki U19 itineraries overlap both cup legs. International duty is separate from medical notes and resting players.
- Sasaki's 72-minute start and Yengi's 31-minute substitute appearance on 8 November supersede older injury-only labels. Okamura / Kikuchi / Matsuo diagnoses and match-specific return dates remain uncertain. Football LAB's Kobe absence list is dated background from its next-league preview, not confirmation for this cup fixture.
- Previous-two-game minutes: Kobe 3/8 November, Machida 5/8 November; each team/game sums to 990 nominal minutes. Half-time substitutions count as 45; stoppage time is excluded. Kobe's two 90+3 substitutes explicitly show a stoppage-time appearance despite zero nominal minutes. No last-game squad is presented as tomorrow's lineup.
- Football LAB updated 9 November, 14-match league sample: basic, xG/xGA, CBP, style, physical and set-piece metrics, retaining ranks, definitions and units. Player number AND Japanese identity checked to exclude departed / duplicate-number entries. Machida provider goals-conceded average 0.64 differs from official 10/14 = 0.71; values retained separately without an invented explanation.
- July 31 effective 2026/27 disciplinary PDF checked directly. First and Prime Rounds are separate competitions; Prime Round has not started, so each player's effective count is zero, two-yellow threshold and distance two. One yellow after QF second leg expires; two lead to SF first-leg suspension. November 9 suspension notice has no Kobe/Machida cup player listed. League three-yellow risk is not applied to the cup.
- Tactical analysis labels inferences: second balls / long throws, close-range box entries, midfield switching, international absences and bench workload. No prediction of selection or final score.

Full source URLs and section-level status are stored in `research_sweep` and individual claims in the JSON. Public source links remain hidden in line with the established commentary layout.

## Remaining gaps

01 partial: six officials, referee tendencies, stadium measurement / grass update and pitch-side weather are not confirmed. Weather is a dated neighbouring-city forecast, not stadium observation.
02 updated: nine dated excerpts; no claim of a complete closed-training briefing.
03 updated: recent five, next five, home/away and scoped head-to-head.
04 partial: latest individual medical availability and Tokumura's withdrawal reason unknown; disciplinary rules and international notices checked.
05 partial: full-season scoring periods, comparable save percentage and all-player assists/xA unavailable. Provider discrepancy retained.
06 updated as pre-lineup workload; actual selection, missing regulars and confirmed resting players await official squad.
07 updated match-specific focus only, no biography batch work.
08 updated sourced analysis, with conditional scenarios.
09 updated full standings and logs, future scores null.
10 preserved full bracket/results, cup dates/rules rechecked.

Access limits: two direct Machida entry downloads returned HTTP403; search retrieval successfully supplied official match report and announcements. Old J.League `/lineup/` and `/review/` paths were unavailable; the current main-page `#lineup` data and club original tables were used. No approval denial occurred.

## Validation

`npm test`: 61 passed, 0 failed; club-data validation has 0 errors with existing coverage warnings. Syntax and diff checks pass. Data publication `a2fb75f3c6fd36e775b2d396938582abaaa7f591` deployed successfully; the live November 10 availability, nine interviews and reconciled workload were inspected. A subsequent display correction clarifies zero nominal minutes and exposes the competition in section 01. The independent full-roster strict workflow has a pre-existing Urawa gate failure; this match sweep does not edit those profiles or loosen that gate.
