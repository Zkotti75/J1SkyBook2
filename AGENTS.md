# SkyBook Work instructions

Use `$skybook-player-research` for player-card research, batch execution, audits, queue changes, and handoffs. Use the 2026/27 J.League booklet skill separately for A5 DOCX production and print-layout QA.

## Source of truth

- Read `data/research-progress.json` and the target file in `data/research-progress/` before choosing work.
- Read `docs/PLAYER_RESEARCH_PLAYBOOK.md` before researching and `docs/WORK_CONTROL_ROOM.md` before changing workflow state.
- Treat `data/clubs/<slug>.json` as the portal data source. Conversation history is not a completion record.

## Research rules

- Current official club pages and the current J.League club/player roster are authoritative for identity, current registration, number, position, vitals, prior affiliation and portrait. The J.League roster's small player headshot is acceptable; a larger individual-page image is optional.
- Transfermarkt player profiles and 24live player pages are acceptable sources for preferred foot. Cite the exact player page and check identity before copying the value.
- Commentary biography must be based mainly on outside sources. A verified card requires at least two distinct non-current-club domains.
- Consult the player's Wikipedia article for career-route research: Japanese players use Japanese Wikipedia first, then English, then Traditional Chinese; players of other nationalities use their home-country language edition first (for example, Portuguese for Brazil), then Japanese, English and Traditional Chinese. Record the exact article URL and access date; cross-check disputed statistics and current facts against competition and official records.
- List every sourced school/youth team. When its years or statistics are unavailable, use one named youth/school row with `season`, `appearances` and `goals` set to null; this alone never invalidates a card. Keep professional seasons dated individually, including loans and mid-season moves. Never accept an undated professional row, `加入前` summary, or generic position prose as a completed profile.
- For preferred foot, search the player's name with “preferred foot” and check a named Transfermarkt or other approved player page. Tactical observations may use any credible internet source if the observation is specific to the player and its URL is recorded.
- Write Traditional Chinese with Hong Kong football terminology. Preserve source URLs and dates. Never invent missing facts.
- Treat player display names supplied by the user from the TVB/J1 commentary master spreadsheet as authoritative. If a display name is absent or uncertain, ask the user instead of transliterating it.
- Status-tag remediation is a separate queued stage; transient match status belongs in `match_week`.

## Batch rules

- Work on exactly one assigned batch. Do not continue into the next batch automatically.
- Run `npm run research:next` to see the next unclaimed batch.
- Run `npm run research:start -- --batch=<id>` before editing.
- Run `npm run research:validate -- --batch=<id>` and `npm test` before completion.
- Run `npm run research:complete -- --batch=<id>` only after the batch validator passes.
- Use the batch ID in the commit subject.
- Full-club strict validation is the final club gate after every player-research batch for that club is completed.

## Parallel Work chats

- Parallel chats must use different club files and separate branches/worktrees.
- Do not run two active batches for the same club.
- Mutable progress is stored per club to reduce cross-chat conflicts. The control-room index is read-only during ordinary batch work.
- Preserve unrelated user changes and never overwrite another active batch.
