# SkyBook research remediation roadmap

## Active stage — restore Nishikawa-level player cards

Work club by club in small batches. Rebuild every player profile using `PLAYER_RESEARCH_PLAYBOOK.md`. Shimizu is the first remediation club because its present cards are generated summaries rather than completed commentary profiles. Nagoya player production pauses until the corrected research method is in place.

Each batch must be committed only after source review and strict validation. Long careers count as two players for batch sizing.

## Scheduled future stage — player status-tag audit

Scope: all 20 clubs and all current players.

1. Add `status_tags_reviewed_at` and `status_tag_sources` to every player.
2. Verify captaincy/leadership, Home Grown, age-band, two-way/youth registration, special-designated, loan and future-joining status from dated official registration or squad announcements.
3. Normalise the existing mixed vocabulary (`HG` versus `Home Grown`, `U21` versus `U-21`, `2種` versus `二種登錄`, English versus Chinese captain labels).
4. Keep transient injury, suspension and predicted-selection information in `match_week` instead of permanent tags.
5. Update the portal badge labels and add validation for unsupported or stale tags.

Current audit baseline (2026-09-21): 697 players; 505 have an empty `registration_tags` array. The remaining tags are not yet reliable as a set because several concepts use multiple spellings.

## Final stages

1. Cross-club editorial audit against the Nishikawa benchmark.
2. Status-tag audit and vocabulary migration.
3. Portrait and missing-figure coverage pass.
4. Fixture-specific freshness pass for the two selected clubs.

