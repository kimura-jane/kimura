// ---------- データ ----------
const TYPES = [
  {name:"小松菜と炙り鮭チーズ",img:"images/01_komatsuna_aburishake_cheese.jpg",tag:"ヘルシーだけど攻める！"},
  {name:"山わさびとクリームチーズ",img:"images/02_yamawasabi_creamcheese.jpg",tag:"ツンと来て、とろける。"},
  {name:"ダブル昆布",img:"images/03_double_konbu.jpg",tag:"旨み、二段重ね。"},
  {name:"梅きんぴらごぼう",img:"images/04_umekin_gobo.jpg",tag:"シャキッと爽やか。"},
  {name:"大葉みそ",img:"images/05_ohba_miso.jpg",tag:"和の心、香り立つ。"},
  {name:"じゃがいもとカレーそぼろ",img:"images/06_jagaimo_curry_soboro.jpg",tag:"ボリューム満点、元気全開！"}
];

const QUESTIONS = [
  {
    q:"いまの気分に一番近いのは？",
    opts:[
      {text:"のんびり落ち着きたい",scores:{1:1,3:2,6:1}},
      {text:"ガツンと挑戦したい",scores:{2:3,5:2,6:2}},
      {text:"体にやさしくいきたい",scores:{1:2,3:1,5:3}}
    ]
  },
  {
    q:"おにぎりで重視するポイントは？",
    opts:[
      {text:"具がゴロッと贅沢",scores:{1:1,2:3,5:1,6:2}},
      {text:"ご飯と具の一体感",scores:{1:2,3:1,4:2,5:2}},
      {text:"片手でサクッと食べやすい",scores:{2:1,3:2,6:3}}
    ]
  },
  {
    q:"理想の “海苔 × ご飯” の食感は？",
    opts:[
      {text:"海苔パリッ × ご飯ほかほか",scores:{3:3,5:1,2:2}},
      {text:"海苔しっとり × ご飯もちもち",scores:{1:2,2:3,5:1}},
      {text:"海苔控えめで具をがっつり",scores:{6:3,1:1,5:2,3:1}}
    ]
  },
  {
    q:"今いちばん食べたいおにぎりの具は？",
    opts:[
      {text:"魚介系（鮭・ツナ・昆布）",scores:{1:2,3:3}},
      {text:"肉系（焼き鳥・そぼろ）",scores:{4:2,5:1,6:3}},
      {text:"変わり種（クリームチーズ系・梅きんぴら）",scores:{2:2,4:3,5:2}}
    ]
  },
  {
    q:"おにぎりと一緒に飲むなら？",
    opts:[
      {text:"コーヒー・カフェラテ",scores:{2:2,4:2,6:2}},
      {text:"緑茶・麦茶",scores:{1:3,3:2,5:2}},
      {text:"炭酸やレモンソーダ",scores:{4:3,6:3,3:1}}
    ]
  }
];

const luckyTastes = ["しょうゆ","塩こんぶ","柚子こしょう","七味","ゆかり","ごま塩","バターしょうゆ","ガーリック","バジル","わさび"];
const luckyActions = ["深呼吸してリセット","新しい音楽を聴く","散歩でリフレッシュ","部屋を片付ける","お気に入りの香りを楽しむ","ちょい辛フードを試す","水を多めに飲む","10分ストレッチ","笑える動画を見る","早めに就寝"];

// Build quiz UI
const quizContainer = document.getElementById("quizContainer");
QUESTIONS.forEach((q, qi) => {
  const div = document.createElement("div");
  div.className = "question";
  div.innerHTML = `<p>${qi+1}. ${q.q}</p>`;
  q.opts.forEach((opt, oi) => {
    div.innerHTML += `<label><input type="radio" name="q${qi}" value="${oi}"> ${opt.text}</label>`;
  });
  quizContainer.appendChild(div);
});

document.getElementById("startBtn").addEventListener("click", () => {
  document.querySelector("header").classList.add("hidden");
  document.getElementById("quizSection").classList.remove("hidden");
});
document.getElementById("submitBtn").addEventListener("click", () => {
  // Score tally
  const scores = Array(TYPES.length).fill(0);
  for(let i=0;i<QUESTIONS.length;i++){
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    if(!sel){ alert("全て回答してください！"); return; }
    const opt = QUESTIONS[i].opts[+sel.value];
    Object.entries(opt.scores).forEach(([k,v]) => {
      scores[k-1] += v;
    });
  }
  // Determine best type
  let bestIdx = scores.indexOf(Math.max(...scores));
  const type = TYPES[bestIdx];
  // Daily luck
  const today = new Date().toISOString().slice(0,10);
  let hash = 0;
  (today + bestIdx).split("").forEach(ch => { hash = ((hash<<5)-hash)+ch.charCodeAt(0); hash |= 0; });
  const stars = (Math.abs(hash)%5)+1;
  const taste = luckyTastes[Math.abs(hash)%luckyTastes.length];
  const action = luckyActions[(Math.abs(hash)>>1)%luckyActions.length];

  document.getElementById("resultTitle").innerText = `あなたは「${type.name}」タイプ！`;
  document.getElementById("resultImg").src = type.img;
  document.getElementById("resultTagline").innerText = type.tag;
  document.getElementById("dailyLuck").innerText = `今日の運勢：${"★".repeat(stars)}`;
  document.getElementById("luckyTaste").innerText = `ラッキー味：${taste}`;
  document.getElementById("luckyAction").innerText = `ラッキー行動：${action}`;
  document.getElementById("advice").innerText = `${type.tag}の気分で楽しもう！`;

  document.getElementById("quizSection").classList.add("hidden");
  document.getElementById("resultSection").classList.remove("hidden");
});
