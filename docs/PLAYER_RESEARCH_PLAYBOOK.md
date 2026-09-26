# SkyBook player research playbook

## Editorial benchmark

Shusaku Nishikawa's card is the minimum completed-player standard. The lesson is not that every player must have the same number of honours as Nishikawa; it is that every available layer of a player's story must be researched deliberately and sourced from the source type best suited to that layer.

An official current-club profile is an identity record. It is not a commentary biography.

## Reverse-engineering the Nishikawa card

| Card layer | What the Nishikawa card contains | Source role used in the model | Standard method for every player |
| --- | --- | --- | --- |
| Current identity | Name, number, position, date/place of birth, height/weight, preferred foot, portrait | Current club and J.League club/player roster; Transfermarkt or 24live for preferred foot | Use the current club or J.League roster for identity, vitals, registration and headshot; use a named player page for preferred foot; record access dates. |
| Complete route | Every school/youth and professional season, including status and league appearances/goals | Wikipedia career map, J.League profile, league/competition records, former-club records, Transfermarkt competition filters | Consult the preferred Wikipedia edition first, then build one row per season and cross-check conflicts with league, club and competition-filtered statistical records. |
| Career turning points | Debut, transfers, injury interruptions, title seasons, role changes | Long-form league feature and independent career reporting | Search the player's full Japanese name with `経歴`, `転機`, `インタビュー`, `加入`, `負傷`, `復帰` and each former club. |
| Awards and records | Titles, Best XI selections, clean-sheet and appearance records, with years and context | J.League/JFA/AFC/FIFA award or competition pages; reputable reporting | Do not list an award without explaining the season or achievement that made it commentary-relevant. |
| Representative history | Youth levels, senior caps, tournaments and selection context | JFA and tournament records; cross-checked career sources | Separate youth, Olympic and senior representation. Give caps/goals and named tournaments when verifiable. |
| Tactical identity | Distribution, shot-stopping, transition role, technical changes | Player/coach interviews, specialist analysis and match reporting | Find player-specific evidence. Never paste a generic description for everyone in the same position. |
| Human story | How he became a goalkeeper, schooling and dormitory story | J.League long-form interview and reputable features | Search interviews, hometown media, school/university features and former-club features. Label reported anecdotes honestly. |
| Current form | Current-season appearances and relevant recent performance | J.League/competition data and dated match reporting | Store the competition and as-of date. Refresh for match week rather than treating it as permanent biography. |
| Source trail | Current-club source plus several outside sources | Distinct domains serving different purposes | A `verified` commentary card requires at least two distinct non-current-club source domains, with the club page excluded from the minimum; multiple Wikipedia editions count as one domain. |

## Wikipedia lookup order

Use Wikipedia as the first career-route lookup. For Japanese players: Japanese, English, then Traditional Chinese. For other nationalities: the player's home-country language edition first (Brazil: Portuguese), then Japanese, English, and Traditional Chinese. Skip an edition when it has no useful article. Record the exact URL, edition, access date, and any conflicting values. Consult linked citations and compare season totals, loans and transfer dates with league, federation and former-club records; do not silently pick a number when sources disagree. Current identity and vitals still come from the current club. Multiple editions of Wikipedia count as one outside domain.

Transfermarkt's competition-filtered season tables are useful for cross-checking appearances and goals, especially for overseas spells. Record the exact competition filter and season, and distinguish league games from cup, promotion play-off and all-competition totals. Where sources disagree, retain the alternative counts and review status beside the selected working figure.

The current J.League club roster is an approved source for player headshots, including the small roster image, and for listed vitals. A larger image from the player's page is optional. Transfermarkt player profiles and 24live player pages are approved preferred-foot sources for any player when the exact identity and foot value are visible. Cite the page and date; do not infer a foot from playing position.

## Research sequence

1. Lock the identity record from the current club: current registration, number, position, vitals and portrait.
2. Consult the relevant Wikipedia language editions in the order in the source policy to map the full career route and follow their citations. Build the season-by-season career table from those leads, league/competition databases and former-club records. Resolve every year; never use an undated `加入前` row.
   Start with the earliest documented football school/club, including primary school where a source establishes it. Check every intervening year and list each concurrent school/club or mid-season transfer on its own row. Record `career_audit` with `earliest_known_year`, `reviewed_at`, `scope`, and links to the early-route evidence. A mechanically continuous table can still omit a previously unknown school: the evidence review is mandatory. Do not manufacture primary-school years or match figures from a player's age alone.
3. Search Japanese-language career features and interviews for turning points, technical identity and personal stories; Wikipedia is a career map, not an interview substitute.
4. Search JFA and international competition records for representative history.
5. Search award and milestone claims individually. Record the year, competition and why the recognition mattered.
6. Add at least three player-specific tactical observations supported by interviews, analysis or repeated match evidence.
7. Add human-interest material with a reliability label and direct URL.
8. Translate and localise into Traditional Chinese using Hong Kong football terms. Paraphrase unless a direct quotation and original wording are stored.
9. Run the strict audit. A card with unresolved conflicting claims remains `research_incomplete`; it is never padded with generated prose or marked `verified`.

## Completion checklist

- Identity/vitals/current registration checked against the current club.
- At least two distinct non-current-club source domains; Wikipedia can contribute one domain, regardless of how many language editions are consulted.
- Full school/youth-to-current season table, one season per row.
- Earliest-known football school/club independently checked and recorded; no unexamined years, conflated schools/clubs, or premature `verified` status.
- Current and former clubs cross-checked against the preferred Wikipedia edition and primary records; loans and special registration identified.
- National-team levels, caps/goals and tournaments checked.
- Concrete honours, milestones and record context checked.
- At least three player-specific tactical observations.
- A useful human-interest angle or an explicit note that none was found after research.
- No duplicated position-level prose or generic template sentences.
- Exact Wikipedia edition, source URLs, access dates and verification date recorded.
- Status tags separately reviewed and sourced.

## Status-tag model

Status tags are a separate factual layer, not biography prose. Use three fields:

- `registration_status`: the player's core current registration state.
- `registration_tags`: a controlled list of visible tags.
- `status_tags_reviewed_at` and `status_tag_sources`: evidence that the tag layer was checked, even when the correct tag list is empty.

The controlled vocabulary will be normalised in the scheduled status-tag remediation stage. Durable examples include `Home Grown`, `U-21`, `U-23`, `U-18`, `二種登錄`, `特別指定`, `隊長`, `副隊長`, `領導小組`, `外借加盟` and a dated future-joining status. Injury, suspension and expected selection belong in `match_week`, not permanent registration tags.
