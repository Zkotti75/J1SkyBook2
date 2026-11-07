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

## 2026-10-31 用戶補充：下場及往後每次更新的完成要求

「本場速讀」只顯示於01比賽相關資料；02–09及舊有分頁不重複顯示。

每場更新逐項核實以下內容，不能把空框、待核實提示、來源連結或「稍後補」當作資料已完成。保留來源、日期、賽事範圍與統計截點；找不到的項目須明列缺口及已查來源，不得捏造。未完成項目不得在交接聲稱整場已完成。

- 03 球隊成績比較：兩隊各自最近五場實際賽果（日期、賽事、對手、主客、比分、勝和負）；未來五場實際賽程（日期或官方日期範圍、賽事、對手、主客）；主客場走勢及勝和負／得失球；最近五次交手列表及對賽總紀錄，清楚界定統計範圍。不能只寫近期表現摘要。
- 04 轉會／傷患／停賽：逐人列累積黃牌實際張數、所屬賽事、截至日期、停賽門檻及距停賽差額；不同賽事分列，不從聯賽總數猜測盃賽。缺乏可靠記錄時寫未核實，不以「沒有風險」代替。
- 05 球隊統計分析：Football LAB可取得的基本與進階數據並排比較，列聯賽排名、截點、定義及單位；包括攻守、射門／轉化、xG／失球、進攻路徑、控球、死球、門將與CBP等來源實際提供項目。衍生數據列明算法；不能只列xG或留下整頁空白。
- 06 陣式／輪換：兩隊前兩場正式比賽逐人分鐘表（先發／後備及換入換出），對照本場與上場輪換、球季使用率、常用陣式及近期變化。註明是否含補時；未公布本場名單不可當已確認。
- 07 球員統計分析／資訊：兩隊球員實際基本與進階數字、出場／正選／分鐘、入球／助攻及有來源的每90分鐘數據；標明樣本與截點。加入核心、近期表現者、外援及青年焦點與具體媒體描述，不用泛泛位置介紹填空。
- 08 比賽分析：整合已核實的近況、數據、訪問、傷停、陣式、輪換與疲勞，分析關鍵對位、攻守與死球、可觀察的開局訊號、領先／落後時調整及後備影響。明確區分事實、媒體觀點與天書推論，不只重複故事線。
- 09 聯賽榜／全季賽程：同一截點完整聯賽榜；兩隊全季正式比賽紀錄及已公布賽程，已賽逐場比分和清楚勝／和／負，未賽日期不冒充賽果，區分聯賽與盃賽。

下一場起交接須逐節列出完成／部分／未核實，以及具體待補項目。這份清單記錄需求，並不代表既有研究檔已補完；下一次研究必須核對畫面實際可見內容，而不僅是JSON已有欄位。

來源顯示規則：賽事頁面只顯示來源名稱及日期，不提供外部資料連結（包括逐場賽果的來源箭嘴）；原始URL繼續保存在研究JSON供覆核。球隊、球員與分頁的內部導航保留。

## 2026-10-31 直播閱讀介面修訂

- 不渲染資料來源連結或獨立來源清單；研究JSON保留原始URL。訪問的日期與媒體名稱保留。
- 左右資料欄採球隊主色淡底與色條，並於各欄內重複置頂隊名及主客標記；同色系球隊不只依靠顏色辨認。
- 07不顯示整塊「球員基本／進階統計」，保留關鍵球員、外援、青年球員研究及球員卡導航。
- 04黃牌區只列已核實有效累積3張、再領黃即停賽者；不以賽季單黃牌場數等同有效累積。未知者不補成名單。
- 左側分頁標題與副標題加大，維持清楚換行及手機橫向導航。


## 2026-11-05：每次賽事掃描先核對Gmail評述編排

每次賽事頁面掃描（初次準備、跟進掃描及比賽日最後掃描），一併搜尋用戶Gmail中Carlos Fung／TVB發出的最新每週評述編排及其後更改通知。讀取完整編排中「史葛」所在行，確認日期、場次、播出時間及「＋」旁的共同評述者。以最新可核實修訂為準；不把舊場拍檔沿用到新場。將確認的場次及拍檔更新至賽事頁面，並保留電郵日期／主旨作內部核對記錄，不公開電郵地址或原文。此為用戶授權的排期讀取，並不授權寄信。

拍檔簡稱：高＝高志超；江＝江忠德；富＝黃耀富；范＝范俊業；鍾＝鍾志光；貝＝貝可泓；偉文＝李偉文；崔＝崔錦棠；廸＝潘文廸；亨利＝鄭少偉；ELSON＝何俊然。若「冼」與史葛配搭，先向用戶確認全名；其他未能辨認的簡稱亦不可自行猜測。若Gmail未能讀取或排期未有本場，明示未核實並保留既有已確認資料，不宣稱完成核對。

## 2026-11-06：FC東京–鹿島，Gmail排期覆核及賽前掃描

11月7日FC東京–鹿島（15:00 JST／14:00 HKT；播出13:55 HKT）設為featured，拍檔黃耀富；11月8日町田–廣島拍檔高志超。排期依11月2日「6-8/11 講波ROSTER」電郵核對，11月5日另一封「11-15/11 J LEAGUE講波ROSTER」屬下一週；未見本週修訂。不要把另一週編排誤當本週改動。不將電郵地址或完整原文放入賽事JSON。

用戶要求移除已完成場次：`index.json.fixtures`只保留未完成任務，舊研究JSON仍保留供內部覆核；新開頁預設7日東京–鹿島，8日任務仍可選。這不是刪除球隊全季戰績中的已賽記錄。

7日研究檔核對兩隊各13輪聯賽、同截點20隊榜、38輪聯賽全季表及已公布一隊盃賽。Football LAB採11月2日更新；J.League個人頁11月6日覆核，按本會日期／對手／賽果過濾加盟前賽事，特別避免把大森渚生的水戶紀錄加到鹿島。32名東京＋38名鹿島有號碼現役球員全部已有卡；荒木#71舊將卡保留離隊狀態，不算現役。球員季內數據／CBP刷新不等同重做傳記，不改已完成研究批次的驗證狀態。

傷情更正：本間至恩、橋本健人31日已復出；施亞拉及樋口亦已有正式上陣。三黃臨界：東京佐藤恵允、鹿島三竿及鈴木優磨。高宇洋季內3黃含單場兩黃一紅，不能當作有效累積3黃。官方逐人分鐘按90分鐘口徑，半場換人算45；東京25／31日、鹿島31日／4日均各對帳990分鐘。鹿島周三較聯賽換8名正選，東京上仗換1名。

畫面覆核：01基本資料、城市預報、球場／活動／遠征資料已補；02有16則訪問，必須用`interview_layout: team_columns`；03完整近期／未來／主客與近5次交手及總紀錄；04醫療／登錄／紀律；05基本、進階、風格、死球與近兩場半場時段；06陣式、兩場分鐘與季內使用率；07具體球員焦點（不恢復已移除的大統計表）；08分析及領先／落後／僵持情境；09完整榜與日誌。球場最新設備表48,013席，J.League登記47,851，不沿用舊49,970為最新實體容量。

具體仍待官方：7日正式名單／本場輪換、六名球證及對應主球證傾向、球場實測天氣。無公開同口徑的完整球季入失球時段、門將撲救率及所有球員xA，不能聲稱取得全部進階資料；時段表只計最近兩場並明示樣本。部分Football LAB表內有0.1射門／場差異與個人分鐘差異，保留來源原值、註明口徑，CBP每90分鐘沿用其本身分母。


## 2026-11-07：FC東京–鹿島正式名單後最後掃描

J.League及鹿島官方互核兩隊各11正選、9後備及六名球證；40名入選者全有球員卡。東京較31日換2人（大森、俵積田），大森此前0次聯賽正選；鹿島較周三換9人、較上輪聯賽只換1人（小池代津久井）。陣式圖改為本場官方4-4-2；輪換、對位、後備情境均按名單重寫，既有兩場分鐘不預填今日數據。32＋38名現役有號碼球員與今日J.League註冊表無差異；離隊舊將卡保持離隊。

室屋成已回後備，修正尚未確認復出的舊傷情說明；石原及佐藤未入20人，未有可靠缺席原因，不寫成傷患或停賽。佐藤、三竿、鈴木的有效3黃名單不變。Gmail重新讀取本週排期及下一週信件，未見本週修訂，黃耀富／高志超配搭不變。

球證：池内明彦；旁證坂本晋悟、赤阪修；第4竹田明弘；VAR飯田淳平；AVAR平間亮。池內今季9場J1全部逐場核對官方SFMS02（34518、34545、34565、34582、34588、34600、34614、34636、34645）：球員黃牌事件5、6、3、2、2、6、2、3、6，共35，場均3.89；1次兩黃一紅、0直接紅牌，教練警告剔除。不能混用只計首黃的34張／非完整7場副資料，亦不混入春季賽事或其他球證職務。

新增7日スポニチ仲川報道及6日FC東京佳史扶訪問，合共19則公開訪問摘要；佳史扶受小川鼓勵及訓練調整均明示本人自述。FREAKS鬼木6日及松村7日訪問已檢查但會員牆阻擋，未以標題補寫。天氣改用7日13:00 JST更新的調布市15:00預報19.8°C，非球場實測。Football LAB仍是13輪後樣本，沒有用已公布正選增加上陣、正選或分鐘數。

## 2026-11-07：06 球員體力負荷

06改名「球員體力負荷」。先列缺席常規主力（本會聯賽正選超過一半作透明篩選），區分已確認休息及原因未公布；傷停及其他已確認原因留在04，不能由沒有傷停公告推定輪休。正式名單公布後，正選與後備分開按上仗分鐘由低至高排列，0分鐘優先，並列前仗分鐘與兩場合計。前置顯示兩場日期、賽事、對手及本場休息日數。底部列今日入選且最近兩場均上陣者，按總分鐘由高至低，標出連續兩場踢足。現有逐人樣本只有兩場，不冒充更長連續正選紀錄；陣式圖收於可展開區，不再列整隊使用率表。未公布本場正式名單時不使用舊陣容代填。只有兩場分鐘各完整對帳990分鐘，才可將該表未列參賽者的分鐘判作0；不完整樣本保留未知。
