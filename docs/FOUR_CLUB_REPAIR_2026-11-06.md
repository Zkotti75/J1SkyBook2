# Four-club outstanding-card checkpoint — 2026-11-06

Baseline: fetched GitHub main `02037de`; repairs performed on `repair/four-clubs-20261106`. No other local worktree or uncommitted work was present when started. User explicitly requested these four clubs together, overriding the routine one-batch stop.

| Club | Existing-card result | Work performed |
| --- | --- | --- |
| Kashiwa | 42/42 player gate; full-club strict passes | #63 金子遙真: youth route, official portrait and foot, dated county/youth milestones, player-specific match analysis and attributable coach story. |
| Kashima | 39/39 player gate; full-club strict passes | #32 松本遥翔: full youth route; 2023/2024 Type-2 seasons; 2025, 2026 special, Toyama loan and Kashima return separately; 31 October J1 debut and injury recovery reporting. |
| Machida | 29/29 player gate; full-club strict passes | #60 真也加 大夢: official portrait, 2025/special zeros, SHIBUYA nine appearances/598 minutes/zero goals, documented current-season gap. #79 三國基士文: school/youth transfer separate from senior registration, official portrait, match observations and attributable family support. |
| Hiroshima | 27/27 stored cards pass player gate and full-club strict | Add dated registration evidence for all 27, explicit Homegrown tags only where league marks them, captain/leadership evidence, retained Type-2 status for #46 despite professional contract, and individually dated manager career. |

`npm test`: 46/46 tests pass. The matchday regression now evaluates #60 against the actual player-card gate and retains the null current J1 figure, instead of requiring the returnee to remain incomplete forever. Structural validation does not close genuine coverage gaps.

## Remaining coverage and roster reconciliation

- Youth statistics and unknown early joining years remain null where sources do not establish them. Kaneko's 2026/27 official snapshot dates to 23 October; Matsumoto's current J1 total is cross-checked against his dated debut rather than a stale season-table dash.
- Mayaka's post-return 2026/27 J1 total remains null: the attempted current page did not expose an explicit readable figure. Do not infer zero from absence. Mikuni's preferred foot remains unknown.
- Hiroshima's 2 November league registration list has **31** players, but this repository contains **27** cards. The additional Type-2 players are #47 原 湊士, #48 太田 大翔, #49 森井 莉人 and #50 髙橋 成海. These are new-card research tasks, not previously verified cards. `data/research-progress/hiroshima.json` records each missing card and the authoritative roster URL/access date, and keeps overall player research in progress. Obtain the user's Chinese display names before publishing new cards; do not invent transliterations.
- Hiroshima's tag-stage completion refers to the existing 27 cards. Injury, suspension and match selection require a separate date-specific `match_week` pass; this update does not certify current availability.
- Kashiwa, Kashima and Machida's residual tag/coverage stages remain as recorded in their progress files; passing the card gate does not silently complete those stages.

Exact evidence URLs and access dates are stored on cards and relevant rows. The shared editorial standard remains `docs/PLAYER_RESEARCH_PLAYBOOK.md`; no standard was weakened to pass these repairs.
