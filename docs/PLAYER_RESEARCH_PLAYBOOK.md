# SkyBook player research playbook

## Editorial benchmark

Shusaku Nishikawa's card is the minimum completed-player standard. The lesson is not that every player must have the same number of honours as Nishikawa; it is that every available layer of a player's story must be researched deliberately and sourced from the source type best suited to that layer.

An official current-club profile is an identity record. It is not a commentary biography.

## Reverse-engineering the Nishikawa card

| Card layer | What the Nishikawa card contains | Source role used in the model | Standard method for every player |
| --- | --- | --- | --- |
| Current identity | Name, number, position, date/place of birth, height/weight, preferred foot, portrait | Current club and J.League club/player roster; Transfermarkt or 24live for preferred foot | Use the current club or J.League roster for identity, vitals, registration and headshot; use a named player page for preferred foot; record access dates. |
| Complete route | Every documented school/youth team and each professional season, including status and league appearances/goals | Wikipedia career map, J.League profile, league/competition records, former-club records, Transfermarkt competition filters | Combine consecutive stat-free years at the same youth/school team into a dated range, preserving dated milestones. Date every professional season separately and cross-check loans and mid-season moves. |
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

Baidu Baike is also an approved outside source for career history. Record the exact player URL and check current or disputed facts against other sources when available. Use the J.League Data Site for dated current-season league appearances and goals. If credible non-league statistics cannot be located, leave them null or omit unsupported cup figures; that alone is not a card failure. Clearly distinguish an explicit zero from a dash and label any inference from cumulative league totals.

Soccerway player pages are approved for historical season statistics. Capture the access/update date and competition scope and annotate differences from other databases; a user-selected statistical source remains the card's working convention. Injury reports must retain their announcement and injury dates and may explain only the relevant period, not a later season without new evidence.

Gekisaka (ゲキサカ) is an approved specialist Japanese football outlet for transfer reporting, interviews, youth coverage and match context. Link the exact story, date and relevant club notice when checking a move.

## Preferred news and interview outlets (2026-10-07)

For match dossiers and player commentary research, prioritise these user-approved Japanese football news sources alongside existing official, local and specialist sources:

| Outlet | Use | Access and attribution |
| --- | --- | --- |
| Yahoo Sports / SportsNavi (`sports.yahoo.co.jp`, `soccer.yahoo.co.jp`, and Yahoo News sports articles) | Club news discovery, interviews, match reports, columns and dated team statistics | Prefer accessible full articles. Record the original publisher/author and Yahoo hosting URL; a syndicated copy is not an independent second report. Team-profile prose is background, not a current training report. |
| Soccer Digest Web (`soccerdigestweb.com`) | Player/coach interviews, tactical features, transfers, match reports and club background | Prioritise free full-text articles. Attribute journalist opinions and distinguish fan-reaction roundups from reporting or confirmed facts. |
| Football Zone (`football-zone.net`) | Named-author player/coach interviews, career features, J.League beat columns and expert tactical commentary | Prioritise original interviews and attributed reporting. Label pundit analysis as opinion; social-media reaction stories do not establish performance, injury or selection facts. |
| Soccer King domestic news (`soccer-king.jp/news/japan`) | J.League news, coach/player comments, tactical match reporting and transfer coverage | Read the actual article, date and author. Cross-check registration, transfers and injuries with primary notices; a headline or syndicated copy alone is not enough. |
| Gekisaka (`web.gekisaka.jp`) | Match reports, player interviews, transfers, injury news, school/university football and youth development | Already an approved source; also prioritise it for news sweeps and youth research. Use exact dated article URLs; compare current-season match and roster facts with league/club records. The working news domain is `web.gekisaka.jp`. |
| El Golazo / ELGOLAZO+ (`elgolazo.jp`) | Club beat reporting, detailed previews, match assessments and tactical analysis | Use free public extracts or accessible SportsNavi syndication first. Paid editions are optional: the user will consider purchase later if free coverage becomes insufficient. Do not purchase or subscribe automatically, or infer contents from issue listings. |

Preserve original publication dates and exact article URLs. Old interviews remain dated background; only interviews within the match dossier's actual window belong on its quotes page. Prefer free coverage first and report inaccessible or insufficient evidence. These are research preferences, not new mandatory per-card sources or acceptance requirements; previously validated cards do not require remediation solely for lacking these outlets.

## Source notes for commentary

Use reliable official records or transparent statistical databases for vital statistics, analytics, appearances, goals, match details, transfers, loans, and season-by-season career progression. Anecdotes, news and possible explanations may come from attributable independent reporting or informed fan analysis. Append a short note to the same line of commentary giving the publication date, author or outlet, and actual hosting site; keep the exact URL and access date in the structured `sources` field. For example: `第11輪後未再入選；作者推測或與狀態未達最佳有關。（2026年7月，JEF球迷賽季回顧，ゆっくりいこう／Hatena Blog）` Do not relabel a fan blog as Yahoo merely because a Yahoo statistics page is cited elsewhere. Describe a suspected injury cause or coach's decision as speculation unless a direct source confirms it.

## Research sequence

1. Lock the identity record from the current club: current registration, number, position, vitals and portrait.
2. Consult the relevant Wikipedia language editions in the order in the source policy to map the full career route and follow their citations. Include every documented school/youth club; use one source-linked row with null `season`, `appearances` and `goals` when its years/stats are incomplete. For consecutive documented years at the same purely youth/school team with no season statistics, write one range row (e.g. `2014-2016`) and retain `2015：奪冠` in its notes. Keep separate affiliations separate, even when years overlap. Build one dated row per professional season from league/competition databases and former-club records. Never combine professional years, including loans, mid-season moves and seasons with concurrent youth/professional registration. Never use an undated professional or `加入前` summary.
   Start with the earliest documented football school/club, including primary school where a source establishes it. Check every dated professional year and list each concurrent club or mid-season transfer separately. Record `career_audit` with `reviewed_at`, `scope`, early-route links and `earliest_known_year` (null when early years cannot be established). Do not manufacture school dates or match figures from age alone.
3. Search Japanese-language career features and interviews for turning points, technical identity and personal stories; Wikipedia is a career map, not an interview substitute.
4. Search JFA and international competition records for representative history.
5. Search award and milestone claims individually. Record the year, competition and why the recognition mattered.
6. Add at least three player-specific tactical observations supported by any credible internet source, such as interviews, analysis or match reporting. Record the source URL for each distinct point.
7. Add human-interest material with a reliability label and direct URL.
8. Translate and localise into Traditional Chinese using Hong Kong football terms. Paraphrase unless a direct quotation and original wording are stored.
9. Run the strict audit. A card with unresolved conflicting claims remains `research_incomplete`; it is never padded with generated prose or marked `verified`.

## Completion checklist

- Record each profile source's exact URL and valid `accessed_at` date; the current club and all its subdomains do not count toward the two outside domains, and all Wikipedia language editions together count as one. The gate checks source metadata, not whether a citation actually supports its claim: editors must inspect that link.
- Identity/vitals/current registration checked against the current club.
- At least two distinct non-current-club source domains; Wikipedia can contribute one domain, regardless of how many language editions are consulted.
- All documented school/youth teams listed; consecutive stat-free years for the same team combined into one range with dated accomplishments and combined exact source links. Undated, stat-free school/youth rows remain valid when dates are unavailable. Every professional season remains individually dated, including a mixed youth/professional season.
- Earliest-known football school/club researched and recorded; unknown youth years need no fabricated dates or completion blocker. Check professional-year continuity and avoid conflated clubs.
- Current and former clubs cross-checked against the preferred Wikipedia edition, Baidu Baike where useful, and primary records; loans and special registration identified.
- National-team levels, caps/goals and tournaments checked.
- Concrete honours, milestones and record context checked.
- At least three player-specific tactical observations.
- A useful human-interest angle or an explicit note that none was found after research.
- No duplicated position-level prose or generic template sentences.
- Exact Wikipedia edition, source URLs, access dates and verification date recorded.
- Status tags separately reviewed and sourced.

For each professional year use a separate season row per club and competition scope, including loans, special registration and mid-season transfers. Give league appearances and goals when reliably documented; use null and explain a genuine gap or conflicting totals in the row notes/career audit. An explicit zero requires evidence. For youth and school affiliations, preserve every documented team, dates when supported, and null values where records do not exist. Do not promote a card merely because its file exists or its prose is long. Where no interview or human story can be found, record the search and absence rather than inventing one.

When the control room changes this checklist, rerun the batch gate on every previously completed batch and the strict club gate on previously completed clubs. Name failed players and the missing evidence in the relevant club's `review_queue` or batch notes, set the affected batch to `needs_review`, and do not edit a club progress file owned by an active research chat. Preserve verified facts and source links. Publish updated shared rules before new research chats start another batch.

## Status-tag model

Status tags are a separate factual layer, not biography prose. Use three fields:

- `registration_status`: the player's core current registration state.
- `registration_tags`: a controlled list of visible tags.
- `status_tags_reviewed_at` and `status_tag_sources`: evidence that the tag layer was checked, even when the correct tag list is empty.

The controlled vocabulary will be normalised in the scheduled status-tag remediation stage. Durable examples include `Home Grown`, `U-21`, `U-23`, `U-18`, `二種登錄`, `特別指定`, `隊長`, `副隊長`, `領導小組`, `外借加盟` and a dated future-joining status. Injury, suspension and expected selection belong in `match_week`, not permanent registration tags.
