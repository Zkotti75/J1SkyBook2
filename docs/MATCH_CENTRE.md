# 比賽資料介面

網站名稱：**TVB 體育組天書系列 / 日職 J1 天書 2026/27**。

首次開啟（沒有既有球員深層連結）進入兩軍比較。中央「比賽資料」返回比賽模式；兩個球隊按鈕保留球員目錄。比賽模式左側按順序顯示：兩軍比較、賽前深度分析、賽前聲音、焦點球員、全季賽程與戰績、聯賽榜、對賽歷史與故事線、戰術對位、即場速覽。

比賽中心只維護下一場評述任務。目前為2026-10-21川崎主場對神戶，第一輪資料核對至2026-10-18。選擇其他球隊會開啟球隊資料，中央按鈕返回固定任務；舊有任意對賽網址也回到固定任務，同時保留所選分頁。日期為唯讀。

本場資料以來源及各自截點標示，正選、傷停與賽後訪問不會自動更新；保留未確認項目。歷史研究檔不套用到新對手。

## 比賽研究檔

`data/matches/index.json` 的 featured 指定唯一當前任務 `{home,away,date}`；fixtures 每項包含 `home`、`away`、`date`（YYYY-MM-DD）、`file`（本目錄內 JSON 檔名）。頁面按主隊、客隊、日期三項完全配對讀取；不得把其他球隊或日期的內容套用於本場。更換評述任務時，研究新的檔案並更新featured。

研究檔的頂層同樣包含 `home`、`away`、`date`、`as_of`，以及：

- `teams`：以 club slug 為 key。各隊可包含 `style`、`form`、`scorers`、`assists`、`transfers`、`suspensions`、`injuries`、`yellow_risk`、`storylines`（claim 陣列），並可有`analytics`及本場已核對`stats`，優先於館藏快覽。
- `formation`：隊伍內的 `{shape, label, as_of, players:[{number,name}], sources}`。players 由前鋒線至後防線，再到門將排列。陣式必須是10名外場球員；label 清楚指明已用、常用或預測陣式。未有來源時保持空白；介面的圖形示意不代表球隊實際陣式。
- `preview`：`cues`（claim 陣列）、`sections:[{title,paragraphs}]`（paragraphs 是 claim 陣列）。
- `quotes:[{topic,home,away}]`：quote 物件含 `speaker,role,published_at,outlet,url,quote_ja,quote_zh,paraphrase_zh`。保留原句才可用引號；否则用摘要。兩隊各自填 `previous_match_date`；介面只顯示該日期之後、比賽日期或之前的發言；同日明確標為`context:post_match`的賽後訪問也可展示。按相同主題對照，沒有配對者留白。
- `players_to_watch`：隊伍內的 `stars`、`foreign`、`youth` 陣列，項目含 `player_id` 或 `number`，以及 `description,stats,analytics`（claim 陣列）。挑选與本場有關且有來源的焦點，沒有材料就留白。
- `game_log`：隊伍內全部本季比賽 `{date,date_display,sort_date,round,competition,venue,opponent,score,source}`。未踢比賽 score 為 null，場地 venue 寫主／客。sort_date用於排序；日期範圍時date可為null，date_display保留來源範圍，不推定實際日。本場日期突出。
- `standings`：`{as_of,sources,rows}`。rows 包含 `rank,slug,name_zh,played,wins,draws,losses,goals_for,goals_against,goal_difference,points`，按官方排名排列；必須同一截點的完整榜。
- `head_to_head`：claim 陣列。
- `tactical_matchups:[{topic,home,away}]`：home/away 是 claim。
- `match_info`：`{kickoff_hkt,stadium,referee,lineups_as_of,sources}`。
- `lineup`：隊伍內 `{starters,bench,cues}`（claim 陣列），只有官方公布才使用「官方正選」。

claim 使用 `{text,kind,as_of,sources:[{label,url,published_at,accessed_at}]}`。kind 為 fact（已核實）、reported（媒體報道）、opinion（作者觀點）或 analysis（天書分析）。每项具體主張附其直接來源，禁止把記者意見、球迷猜測或過往傷患當作本場事實。優先日本體育媒體的具體報道、操練觀察及訪問，官方記錄用於賽果、傷停與紀律。

檢查：`node --check app.js`、`node --check match.js`、`node --test tests/match.test.mjs`、`npm test`。

本場驗證：16個測試檢查固定任務導航、舊連結轉向、9頁渲染、來源與日期、38輪完整性、聯賽賽果與積分／得失球對帳、訪問時間窗及未賽留白。

## 2026-10-12任務輪換

已切換18日町田對福岡；保留千葉對長崎原研究檔及驗證。第9節榜與賽果已更新，Football LAB進階數據保留第8節截點。近期聲音按事件整理，正選、黃牌臨界及最新復出未確認。兩隊皆有周中賽事；38輪聯賽已完整，町田非聯賽逐場記錄尚待補齊。21日川崎對神戶是下一個評述任務，待18日準備後建立獨立研究檔。

10月16日覆核：加入15日町田ACL Two及14日福岡聯賽盃賽果，更新恢復時間與近期訪問。quotes事件可附videos原片連結，沒有逐字稿時不補寫摘要；未標採訪日的本場訪問以date_basis:accessed明示覆核日。10月10日舊訪問保存在quote_archive，近期聲音依上仗日期過濾。町田#5中文名依用戶改為迪沙域。

## 2026-10-18任務輪換

featured切換21日川崎對神戶；町田對福岡研究檔及既有驗證保留。新檔含11節前瞻、12則近期訪問摘要、38輪聯賽及已確定成年隊盃賽、完整第10節榜。2027日期範圍按官方保留；首9輪進階統計明示10月12日截點。未公布的本場正選及球證留空。

本場青年焦點可含match_profile（官方日文姓名、位置、官方URL），只在永久目錄未有該人且description附來源時展示獨立本場研究卡；不產生失效的永久球員連結，亦不宣稱完成另一研究室的球員批次。岩本悠庵使用此機制。

### 24 October 2026 assignment

Featured dossier: `data/matches/2026-10-24-kashima-kashiwa.json` (Kashima–Kashiwa, 15:00 JST / 14:00 HKT). Wednesday's Kawasaki–Kobe dossier remains archived unchanged. Sunday Kawasaki–Okayama is the next confirmed assignment, outside this preparation scope.

The 21 October evening sweep verifies Kyoto 2–2 Kashima and FC Tokyo 0–0 Kashiwa. Both clubs have 11 completed league games. The league table is one SportsNavi snapshot with some clubs still on 10 games; it is explicitly not a completed-round table. Formation/CBP/assist baselines remain Football LAB's 19 October update through ten rounds. Official schedules provide all 38 league rounds plus confirmed cups, with 2027 date windows retained.

`workload` records each player's first-ten-round starts, 17 October nominal minutes, and 21 October nominal minutes. Halftime changes count as 45; stoppage time is excluded. Rotation is six starting changes for Kashima and four for Kashiwa. This is not a medical assessment.

The official 21 October post-match interview slots were empty at the cutoff. `quote_events` remains empty until current-window comments are published; `quote_background` displays older 17/18 October material separately, dated and side by side. Never move background comments into the current interview window. Recheck post-match comments, Friday training and previews, goalkeeper clearance, current suspensions, three-yellow counts, official lineups, six officials, and match-day weather before kickoff. Player-card completion status and club research queues are unchanged.

### 25 Oct 2026 — Kawasaki v Okayama preparation

Featured assignment switched to Kawasaki–Okayama, 16:00 JST / 15:00 HKT at Uvance Todoroki. Both clubs' eleven completed league games reconcile with their official totals; the dossier contains all 38 league fixtures and scheduled cups, two-match workload comparisons (five Kawasaki changes versus two Okayama changes), current squad audits (38/36 numbered players, no missing cards), medical/disciplinary checks and twenty dated interview excerpts. Okayama's free club and J.League post-match comments supplement Kawasaki's official interviews and Brodersen's 23 October preview interview. Statistical analysis and the independent tactical author's opinions are labelled separately.

Official 25 October squads, six officials, weather and any further medical/preview news remain match-day checks. Miyamoto's earlier four-yellow suspension was served; do not turn his cumulative total into a new ban. Archived Saturday and Wednesday dossiers remain intact. Workload headings now accommodate clubs whose penultimate games fell on different dates.

### 31 October / 1 November — first sweep, 25 October

Three confirmed assignments now have independent preparation dossiers and navigation links: Kashima–Cerezo (14:00 HKT), Yokohama FM–Kawasaki (12:00 HKT), Machida–Gamba (15:00 HKT). The first sweep records round-12 results, Kashima's two medical follow-ups, recent coach/player comments and intervening cup workload. These are explicitly incomplete research pages, not final previews. No old fixture's lineups, officials, discipline or statistical totals were copied forward. New interviews use independent team columns, coach before players and category/date order; archive event views remain accessible in their source files. Result tables now display explicit win/draw/loss labels.

Pending: full nine-section renderer migration, Football LAB round-12/basic/advanced/player tables and ranks, complete schedules and standings, stadium/travel/milestones, additional recent interviews, and post-midweek selection/medical checks. Preserve source URLs in data while displaying plain date/outlet on new interview cards.

### Nine-section commentary layout

Navigation now follows: information, interviews, results comparison, availability, team analytics, formation/rotation, player analytics, match analysis, and table/full logs. Fresh opening uses `info`; existing bookmarked legacy `live`, `officials`, `history`, `tactics`, and `standings` routes continue rendering. Three-match dropdown retains the current section.

Every page has a collapsible quick-read panel with selection status, officials, injury headlines and section shortcuts. Independent interview columns show coaches before players, category before descending date, only within the recent interview window. Date/outlet appear as plain text; source URLs remain in JSON.

Research fields supported by the layout: `match_info.stadium_facts`, `events`, `visitor_travel`, `referee_tendencies` (dated claims); team `milestones`, `home_away_record`, `bench_options`, `goalkeeper_analysis`; dossier `head_to_head_results` (game-log rows), `opening_checks` and `scenarios.leading/trailing/level` (claims). `team_metrics` groups: basic, attack, build_up, defence, set_pieces, timing, goalkeeping. `player_metrics` and `usage_metrics` use the same rows: label, value, rank (optional), unit, sample, as_of, interpretation, sources. Never populate missing ranks or current stats from old club snapshots. Full logs show explicit win/draw/loss with notes; recent/future slices take at most five matches, future notes calculate intervening clear days only for exact dates. Head-to-head entries are stored newest first and limited to five.

This implementation completes the layout; expanded Football LAB research and missing fixture/stadium data remain a separate content task and are shown as pending. Archived dossier content remains intact.
