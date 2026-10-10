# 比賽資料介面

網站名稱：**TVB 體育組天書系列 / 日職 J1 天書 2026/27**。

首次開啟（沒有既有球員深層連結）進入兩軍比較。中央「比賽資料」返回比賽模式；兩個球隊按鈕保留球員目錄。比賽模式左側按順序顯示：兩軍比較、賽前深度分析、賽前聲音、焦點球員、全季賽程與戰績、聯賽榜、對賽歷史與故事線、戰術對位、即場速覽。

比賽中心只維護下一場評述任務。目前為2026-10-11千葉主場對長崎，資料核對至2026-10-10。選擇其他球隊會開啟球隊資料，中央按鈕返回固定任務；舊有任意對賽網址也回到固定任務，同時保留所選分頁。日期為唯讀。

本場資料來自官方比賽、紀律、傷患、聯賽榜、Football LAB數據及日本採訪；新聞、觀點與天書分析分別標示。10月7日千葉0–1負岡山、長崎加時1–2負清水均已補入；缺少新訪問、累積黃牌或正選確認時明示待補，沒有自動更新或預先填結果。

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
