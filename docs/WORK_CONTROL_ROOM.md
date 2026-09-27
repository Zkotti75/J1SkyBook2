# SkyBook ChatGPT Work control room

## Normal operation

The published `origin/main` revision is the shared editorial baseline after fetching. Inspect other worktrees, open branches and uncommitted changes before editing rules or integrating club work. The Nishikawa benchmark is the `西川周作` entry in `data/clubs/urawa.json`; the written specification and acceptance checklist live in `docs/PLAYER_RESEARCH_PLAYBOOK.md`, with the executable gate in `scripts/research-quality.mjs`.

1. Open the SkyBook project and repository.
2. Ask: `Use $skybook-player-research and start the next SkyBook batch.`
3. The Work chat reads the queue, starts one batch, researches only those players, validates, commits, and stops.
4. Review the completion report. Then start another batch in the same chat or a new project chat.

## Useful commands

```bash
npm run research:summary
npm run research:next
npm run research:next -- --club=shimizu
npm run research:start -- --batch=shimizu-01
npm run research:validate -- --batch=shimizu-01
npm run research:complete -- --batch=shimizu-01
npm run research:fail -- --batch=shimizu-01 --note="Missing independent tactical sources"
npm run research:handoff -- --batch=shimizu-01
```

## Parallel Work chats

Run at most two or three research chats at once. Give each a different club and a separate Git worktree/branch. Do not run two batches for the same club simultaneously.

The progress index is normally read-only. Each club has its own mutable progress file, so independent club batches do not edit the same queue file.

## Definitions

- A roster file existing does not mean a club is complete.
- A batch is complete only when every named player passes `research:validate`.
- A club is complete only when all of its player batches are completed and full-club strict validation passes.
- Player status tags, portraits and residual coverage gaps are later scheduled stages.
- On changing the standard, run completed-batch validation again, log named remediation for failures, and retain the separate status-tag stage. A passing structural gate still needs editorial source review.
