function k(
  id,
  hira,
  kata,
  romaji,
  row,
  kind,
  jp,
  reading,
  zh,
  mnemonic,
) {
  return { id, hira, kata, romaji, row, kind, example: { jp, reading, zh }, mnemonic };
}

const KANA = [
  k("a", "あ", "ア", "a", "a", "seion", "雨", "あめ", "雨", "像安坐的人，開口是 a"),
  k("i", "い", "イ", "i", "a", "seion", "犬", "いぬ", "狗", "兩筆並列，讀 i"),
  k("u", "う", "ウ", "u", "a", "seion", "海", "うみ", "海", "像彎月，嘴型是 u"),
  k("e", "え", "エ", "e", "a", "seion", "駅", "えき", "車站", "橫折如工字，讀 e"),
  k("o", "お", "オ", "o", "a", "seion", "お茶", "おちゃ", "茶", "圈在下方，讀 o"),

  k("ka", "か", "カ", "ka", "ka", "seion", "傘", "かさ", "傘", "像一把打開的傘"),
  k("ki", "き", "キ", "ki", "ka", "seion", "木", "き", "樹", "像樹木的枝幹"),
  k("ku", "く", "ク", "ku", "ka", "seion", "雲", "くも", "雲", "一個尖角，讀 ku"),
  k("ke", "け", "ケ", "ke", "ka", "seion", "今朝", "けさ", "今早", "像 K 的變形"),
  k("ko", "こ", "コ", "ko", "ka", "seion", "子供", "こども", "小孩", "兩橫，讀 ko"),

  k("sa", "さ", "サ", "sa", "sa", "seion", "魚", "さかな", "魚", "像切魚的刀"),
  k("shi", "し", "シ", "shi", "sa", "seion", "塩", "しお", "鹽", "一筆彎下，讀 shi"),
  k("su", "す", "ス", "su", "sa", "seion", "寿司", "すし", "壽司", "像數字 9，讀 su"),
  k("se", "せ", "セ", "se", "sa", "seion", "世界", "せかい", "世界", "像世界的「世」"),
  k("so", "そ", "ソ", "so", "sa", "seion", "空", "そら", "天空", "斜下一筆，讀 so"),

  k("ta", "た", "タ", "ta", "ta", "seion", "食べます", "たべます", "吃", "像「た」字本身"),
  k("chi", "ち", "チ", "chi", "ta", "seion", "地図", "ちず", "地圖", "像數字 5，讀 chi"),
  k("tsu", "つ", "ツ", "tsu", "ta", "seion", "月", "つき", "月亮", "像海浪，讀 tsu"),
  k("te", "て", "テ", "te", "ta", "seion", "手", "て", "手", "像伸出的手"),
  k("to", "と", "ト", "to", "ta", "seion", "友達", "ともだち", "朋友", "像彎鉤，讀 to"),

  k("na", "な", "ナ", "na", "na", "seion", "名前", "なまえ", "名字", "像「な」字"),
  k("ni", "に", "ニ", "ni", "na", "seion", "日本", "にほん", "日本", "兩橫如「二」"),
  k("nu", "ぬ", "ヌ", "nu", "na", "seion", "犬", "いぬ", "狗（ぬ在いぬ）", "像捲線，讀 nu"),
  k("ne", "ね", "ネ", "ne", "na", "seion", "猫", "ねこ", "貓", "像躺著的貓"),
  k("no", "の", "ノ", "no", "na", "seion", "ノート", "のーと", "筆記本", "一個圈，讀 no"),

  k("ha", "は", "ハ", "ha", "ha", "seion", "花", "はな", "花", "助詞は也讀 wa，字本身是 ha"),
  k("hi", "ひ", "ヒ", "hi", "ha", "seion", "人", "ひと", "人", "像微笑的嘴"),
  k("fu", "ふ", "フ", "fu", "ha", "seion", "船", "ふね", "船", "像富士山，讀 fu"),
  k("he", "へ", "ヘ", "he", "ha", "seion", "部屋", "へや", "房間", "一座小山，讀 he"),
  k("ho", "ほ", "ホ", "ho", "ha", "seion", "本", "ほん", "書", "像「ほ」帶一橫"),

  k("ma", "ま", "マ", "ma", "ma", "seion", "町", "まち", "城鎮", "像「ま」字"),
  k("mi", "み", "ミ", "mi", "ma", "seion", "水", "みず", "水", "像數字 21 連寫"),
  k("mu", "む", "ム", "mu", "ma", "seion", "虫", "むし", "蟲", "像繞圈，讀 mu"),
  k("me", "め", "メ", "me", "ma", "seion", "目", "め", "眼睛", "像眼睛的輪廓"),
  k("mo", "も", "モ", "mo", "ma", "seion", "桃", "もも", "桃子", "像「も」帶兩橫"),

  k("ya", "や", "ヤ", "ya", "ya", "seion", "山", "やま", "山", "像屋頂，讀 ya"),
  k("yu", "ゆ", "ユ", "yu", "ya", "seion", "雪", "ゆき", "雪", "像湯氣，讀 yu"),
  k("yo", "よ", "ヨ", "yo", "ya", "seion", "夜", "よる", "夜晚", "像「よ」字"),

  k("ra", "ら", "ラ", "ra", "ra", "seion", "ラーメン", "らーめん", "拉麵", "像「ら」一筆帶過"),
  k("ri", "り", "リ", "ri", "ra", "seion", "りんご", "りんご", "蘋果", "兩筆如リ"),
  k("ru", "る", "ル", "ru", "ra", "seion", "春", "はる", "春天", "比ろ多一圈"),
  k("re", "れ", "レ", "re", "ra", "seion", "冷蔵庫", "れいぞうこ", "冰箱", "像「れ」字"),
  k("ro", "ろ", "ロ", "ro", "ra", "seion", "六", "ろく", "六", "比る少一圈"),

  k("wa", "わ", "ワ", "wa", "wa", "seion", "私", "わたし", "我", "像「わ」字"),
  k("wo", "を", "ヲ", "o", "wa", "seion", "本を読む", "ほんをよむ", "讀書（を是助詞）", "助詞を，羅馬字常寫 wo，發音接近 o"),
  k("n", "ん", "ン", "n", "n", "seion", "日本", "にほん", "日本（ん）", "唯一的鼻音，沒有母音"),

  k("ga", "が", "ガ", "ga", "ga", "dakuon", "学校", "がっこう", "學校", "か加濁點゛→ ga"),
  k("gi", "ぎ", "ギ", "gi", "ga", "dakuon", "ギター", "ぎたー", "吉他", "き加゛→ gi"),
  k("gu", "ぐ", "グ", "gu", "ga", "dakuon", "英語", "えいご", "英語", "く加゛→ gu"),
  k("ge", "げ", "ゲ", "ge", "ga", "dakuon", "元気", "げんき", "有精神", "け加゛→ ge"),
  k("go", "ご", "ゴ", "go", "ga", "dakuon", "午後", "ごご", "下午", "こ加゛→ go"),

  k("za", "ざ", "ザ", "za", "za", "dakuon", "座布団", "ざぶとん", "坐墊", "さ加゛→ za"),
  k("ji", "じ", "ジ", "ji", "za", "dakuon", "時間", "じかん", "時間", "し加゛→ ji"),
  k("zu", "ず", "ズ", "zu", "za", "dakuon", "水", "みず", "水", "す加゛→ zu"),
  k("ze", "ぜ", "ゼ", "ze", "za", "dakuon", "全部", "ぜんぶ", "全部", "せ加゛→ ze"),
  k("zo", "ぞ", "ゾ", "zo", "za", "dakuon", "家族", "かぞく", "家人", "そ加゛→ zo"),

  k("da", "だ", "ダ", "da", "da", "dakuon", "誰", "だれ", "誰", "た加゛→ da"),
  k("dji", "ぢ", "ヂ", "ji", "da", "dakuon", "鼻血", "はなぢ", "鼻血", "ち加゛，現代多寫じ"),
  k("dzu", "づ", "ヅ", "zu", "da", "dakuon", "続き", "つづき", "接續", "つ加゛，現代多寫ず"),
  k("de", "で", "デ", "de", "da", "dakuon", "出口", "でぐち", "出口", "て加゛→ de"),
  k("do", "ど", "ド", "do", "da", "dakuon", "どこ", "どこ", "哪裡", "と加゛→ do"),

  k("ba", "ば", "バ", "ba", "ba", "dakuon", "バス", "ばす", "公車", "は加゛→ ba"),
  k("bi", "び", "ビ", "bi", "ba", "dakuon", "病院", "びょういん", "醫院", "ひ加゛→ bi"),
  k("bu", "ぶ", "ブ", "bu", "ba", "dakuon", "ぶた", "ぶた", "豬", "ふ加゛→ bu"),
  k("be", "べ", "ベ", "be", "ba", "dakuon", "勉強", "べんきょう", "學習", "へ加゛→ be"),
  k("bo", "ぼ", "ボ", "bo", "ba", "dakuon", "帽子", "ぼうし", "帽子", "ほ加゛→ bo"),

  k("pa", "ぱ", "パ", "pa", "pa", "handakuon", "パン", "ぱん", "麵包", "は加半濁點゜→ pa"),
  k("pi", "ぴ", "ピ", "pi", "pa", "handakuon", "ピアノ", "ぴあの", "鋼琴", "ひ加゜→ pi"),
  k("pu", "ぷ", "プ", "pu", "pa", "handakuon", "スプーン", "すぷーん", "湯匙", "ふ加゜→ pu"),
  k("pe", "ぺ", "ペ", "pe", "pa", "handakuon", "ペン", "ぺん", "筆", "へ加゜→ pe"),
  k("po", "ぽ", "ポ", "po", "pa", "handakuon", "ポスト", "ぽすと", "郵筒", "ほ加゜→ po"),

  k("kya", "きゃ", "キャ", "kya", "kya", "youon", "客観", "きゃっかん", "客觀", "き＋や → kya"),
  k("kyu", "きゅ", "キュ", "kyu", "kya", "youon", "急", "きゅう", "急", "き＋ゆ → kyu"),
  k("kyo", "きょ", "キョ", "kyo", "kya", "youon", "今日", "きょう", "今天", "き＋よ → kyo"),

  k("sha", "しゃ", "シャ", "sha", "sha", "youon", "写真", "しゃしん", "照片", "し＋や → sha"),
  k("shu", "しゅ", "シュ", "shu", "sha", "youon", "宿題", "しゅくだい", "功課", "し＋ゆ → shu"),
  k("sho", "しょ", "ショ", "sho", "sha", "youon", "食堂", "しょくどう", "食堂", "し＋よ → sho"),

  k("cha", "ちゃ", "チャ", "cha", "cha", "youon", "お茶", "おちゃ", "茶", "ち＋や → cha"),
  k("chu", "ちゅ", "チュ", "chu", "cha", "youon", "中", "ちゅう", "中", "ち＋ゆ → chu"),
  k("cho", "ちょ", "チョ", "cho", "cha", "youon", "ちょうど", "ちょうど", "正好", "ち＋よ → cho"),

  k("nya", "にゃ", "ニャ", "nya", "nya", "youon", "にゃあ", "にゃあ", "喵", "に＋や → nya"),
  k("nyu", "にゅ", "ニュ", "nyu", "nya", "youon", "入院", "にゅういん", "住院", "に＋ゆ → nyu"),
  k("nyo", "にょ", "ニョ", "nyo", "nya", "youon", "女房", "にょうぼう", "妻子（古）", "に＋よ → nyo"),

  k("hya", "ひゃ", "ヒャ", "hya", "hya", "youon", "百", "ひゃく", "百", "ひ＋や → hya"),
  k("hyu", "ひゅ", "ヒュ", "hyu", "hya", "youon", "ヒュッ", "ひゅっ", "嗦一聲", "ひ＋ゆ → hyu"),
  k("hyo", "ひょ", "ヒョ", "hyo", "hya", "youon", "表", "ひょう", "表格", "ひ＋よ → hyo"),

  k("mya", "みゃ", "ミャ", "mya", "mya", "youon", "みゃく", "みゃく", "脈", "み＋や → mya"),
  k("myu", "みゅ", "ミュ", "myu", "mya", "youon", "ミュウ", "みゅう", "喵（擬音）", "み＋ゆ → myu"),
  k("myo", "みょ", "ミョ", "myo", "mya", "youon", "名字", "みょうじ", "姓氏", "み＋よ → myo"),

  k("rya", "りゃ", "リャ", "rya", "rya", "youon", "略", "りゃく", "省略", "り＋や → rya"),
  k("ryu", "りゅ", "リュ", "ryu", "rya", "youon", "留学生", "りゅうがくせい", "留學生", "り＋ゆ → ryu"),
  k("ryo", "りょ", "リョ", "ryo", "rya", "youon", "料理", "りょうり", "料理", "り＋よ → ryo"),

  k("gya", "ぎゃ", "ギャ", "gya", "gya", "youon", "逆", "ぎゃく", "相反", "ぎ＋や → gya"),
  k("gyu", "ぎゅ", "ギュ", "gyu", "gya", "youon", "牛乳", "ぎゅうにゅう", "牛奶", "ぎ＋ゆ → gyu"),
  k("gyo", "ぎょ", "ギョ", "gyo", "gya", "youon", "魚", "さかな／ぎょ", "魚（音讀）", "ぎ＋よ → gyo"),

  k("ja", "じゃ", "ジャ", "ja", "ja", "youon", "じゃあ", "じゃあ", "那麼", "じ＋や → ja"),
  k("ju", "じゅ", "ジュ", "ju", "ja", "youon", "十", "じゅう", "十", "じ＋ゆ → ju"),
  k("jo", "じょ", "ジョ", "jo", "ja", "youon", "女", "じょ", "女（音讀）", "じ＋よ → jo"),

  k("bya", "びゃ", "ビャ", "bya", "bya", "youon", "百（濁）", "びゃく", "百（音讀變體）", "び＋や → bya"),
  k("byu", "びゅ", "ビュ", "byu", "bya", "youon", "ビュー", "びゅー", "景色（外來語）", "び＋ゆ → byu"),
  k("byo", "びょ", "ビョ", "byo", "bya", "youon", "病院", "びょういん", "醫院", "び＋よ → byo"),

  k("pya", "ぴゃ", "ピャ", "pya", "pya", "youon", "ぴゃっ", "ぴゃっ", "啪一聲", "ぴ＋や → pya"),
  k("pyu", "ぴゅ", "ピュ", "pyu", "pya", "youon", "コンピューター", "こんぴゅーたー", "電腦", "ぴ＋ゆ → pyu"),
  k("pyo", "ぴょ", "ピョ", "pyo", "pya", "youon", "ぴょん", "ぴょん", "蹭跳", "ぴ＋よ → pyo"),
];

const KANA_BY_ID = new Map(KANA.map((item) => [item.id, item]));

const KIND_ZH = {
  all: "全部",
  seion: "清音",
  dakuon: "濁音",
  handakuon: "半濁音",
  youon: "拗音",
};

const ROW_ZH = {
  a: "あ行",
  ka: "か行",
  sa: "さ行",
  ta: "た行",
  na: "な行",
  ha: "は行",
  ma: "ま行",
  ya: "や行",
  ra: "ら行",
  wa: "わ行",
  n: "ん",
  ga: "が行",
  za: "ざ行",
  da: "だ行",
  ba: "ば行",
  pa: "ぱ行",
  kya: "きゃ行",
  sha: "しゃ行",
  cha: "ちゃ行",
  nya: "にゃ行",
  hya: "ひゃ行",
  mya: "みゃ行",
  rya: "りゃ行",
  gya: "ぎゃ行",
  ja: "じゃ行",
  bya: "びゃ行",
  pya: "ぴゃ行",
};

const SEION_GRID = [
  ["a", "i", "u", "e", "o"],
  ["ka", "ki", "ku", "ke", "ko"],
  ["sa", "shi", "su", "se", "so"],
  ["ta", "chi", "tsu", "te", "to"],
  ["na", "ni", "nu", "ne", "no"],
  ["ha", "hi", "fu", "he", "ho"],
  ["ma", "mi", "mu", "me", "mo"],
  ["ya", null, "yu", null, "yo"],
  ["ra", "ri", "ru", "re", "ro"],
  ["wa", null, null, null, "wo"],
  ["n", null, null, null, null],
];

const DAKUON_GRID = [
  ["ga", "gi", "gu", "ge", "go"],
  ["za", "ji", "zu", "ze", "zo"],
  ["da", "dji", "dzu", "de", "do"],
  ["ba", "bi", "bu", "be", "bo"],
];

const HANDAKUON_GRID = [["pa", "pi", "pu", "pe", "po"]];

const YOUON_GRID = [
  ["kya", "kyu", "kyo"],
  ["sha", "shu", "sho"],
  ["cha", "chu", "cho"],
  ["nya", "nyu", "nyo"],
  ["hya", "hyu", "hyo"],
  ["mya", "myu", "myo"],
  ["rya", "ryu", "ryo"],
  ["gya", "gyu", "gyo"],
  ["ja", "ju", "jo"],
  ["bya", "byu", "byo"],
  ["pya", "pyu", "pyo"],
];

const VOWEL_HEADERS_5 = ["a", "i", "u", "e", "o"];
const VOWEL_HEADERS_3 = ["a", "u", "o"];

function kanaChar(item, script) {
  return script === "katakana" ? item.kata : item.hira;
}

function filterKana(kind, row) {
  return KANA.filter((item) => {
    if (kind !== "all" && item.kind !== kind) return false;
    if (row !== "all" && item.row !== row) return false;
    return true;
  });
}

function rowsForKind(kind) {
  const kinds =
    kind === "all" ? ["seion", "dakuon", "handakuon", "youon"] : [kind];
  const seen = new Set();
  const rows = [];
  for (const item of KANA) {
    if (!kinds.includes(item.kind)) continue;
    if (seen.has(item.row)) continue;
    seen.add(item.row);
    rows.push(item.row);
  }
  return rows;
}

const KIND_NOTE = {
  seion: "清音是五十音的基礎 46 音。先把あ行到わ行讀熟，後面的濁音、拗音都從這裡變出來。",
  dakuon: "濁音在清音右上加「゛」。か行變が行、さ行變ざ行、た行變だ行、は行變ば行。",
  handakuon: "半濁音只出現在は行，加「゜」變成ぱ行，讀 pa / pi / pu / pe / po。",
  youon: "拗音是い段假名加上小寫的や・ゆ・よ，讀成一拍，例如き＋や＝きゃ（kya）。",
};

window.KANA = KANA;
window.KIND_ZH = KIND_ZH;
window.ROW_ZH = ROW_ZH;
window.SEION_GRID = SEION_GRID;
window.DAKUON_GRID = DAKUON_GRID;
window.HANDAKUON_GRID = HANDAKUON_GRID;
window.YOUON_GRID = YOUON_GRID;
window.KIND_NOTE = KIND_NOTE;
window.KANA_BY_ID = KANA_BY_ID;
window.kanaChar = kanaChar;
window.filterKana = filterKana;
window.rowsForKind = rowsForKind;
