(function () {
  "use strict";

  const state = {
    content: "kana",
    mode: "chart",
    script: "hiragana",
    kanaKind: "seion",
    kanaRow: "all",
    wordCategory: "all",
    sentenceScene: "all",
    quizSize: 50,
    autoSpeak: false,
  };

  let preferredVoice = null;
  let player = null;
  const main = document.getElementById("main");
  const filtersEl = document.getElementById("filters");
  const modeNav = document.getElementById("mode-nav");

  function shuffle(items) {
    const next = items.slice();
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = next[i];
      next[i] = next[j];
      next[j] = t;
    }
    return next;
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function refreshVoice() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    const ranked = voices
      .filter((v) => v.lang.toLowerCase().startsWith("ja"))
      .sort((a, b) => {
        const score = (v) => {
          let s = 0;
          const n = v.name.toLowerCase();
          if (v.lang.toLowerCase() === "ja-jp") s += 10;
          if (n.includes("nanami") || n.includes("七海")) s += 40;
          if (n.includes("kyoko") || n.includes("haruka") || n.includes("ayumi")) s += 24;
          if (n.includes("keita") || n.includes("ichiro") || n.includes("otoya")) s -= 20;
          if (n.includes("google")) s += 4;
          return s;
        };
        return score(b) - score(a);
      });
    preferredVoice = ranked[0] || null;
  }

  function speakBrowser(text, rate) {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = Math.min(rate || 0.82, 0.9);
    u.pitch = 1.06;
    u.volume = 0.92;
    if (preferredVoice) u.voice = preferredVoice;
    window.speechSynthesis.speak(u);
  }

  function speak(text, rate) {
    if (!text) return;
    if (player) {
      player.pause();
      player.src = "";
      player = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const rel = window.VOICE_FILES && window.VOICE_FILES[text];
    if (!rel) {
      speakBrowser(text, rate);
      return;
    }
    const audio = new Audio(rel);
    audio.playbackRate = rate && rate <= 0.75 ? 0.94 : 1;
    player = audio;
    let fellBack = false;
    const fallback = () => {
      if (fellBack || player !== audio) return;
      fellBack = true;
      speakBrowser(text, rate);
    };
    const started = audio.play();
    if (started && started.catch) started.catch(fallback);
    audio.addEventListener("error", fallback);
  }

  function voiceLabel() {
    if (window.VOICE_FILES) return "七海 · 柔和";
    if (!preferredVoice) return "偵測中";
    return preferredVoice.name.replace(/Google |Microsoft /g, "").split(" - ")[0];
  }

  function kanaPool() {
    return window.filterKana(state.kanaKind, state.kanaRow);
  }
  function wordPool() {
    return window.filterWords(state.wordCategory);
  }
  function sentencePool() {
    return window.filterSentences(state.sentenceScene);
  }

  function chipRow(label, value, options, onPick) {
    const group = document.createElement("div");
    group.className = "tag-group";
    group.innerHTML = `<span class="tag-label">${label}</span>`;
    const chips = document.createElement("div");
    chips.className = "chips";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (opt.value === value ? " active" : "");
      btn.textContent = opt.label;
      btn.addEventListener("click", () => onPick(opt.value));
      chips.appendChild(btn);
    });
    group.appendChild(chips);
    return group;
  }

  function selectRow(label, value, options, onPick) {
    const group = document.createElement("div");
    group.className = "tag-group";
    const caption = document.createElement("span");
    caption.className = "tag-label";
    caption.textContent = label;
    const wrap = document.createElement("div");
    wrap.className = "select-wrap";
    const select = document.createElement("select");
    select.setAttribute("aria-label", label);
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.value === value) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener("change", () => onPick(select.value));
    wrap.appendChild(select);
    group.appendChild(caption);
    group.appendChild(wrap);
    return group;
  }

  function renderModeNav() {
    const modes =
      state.content === "kana"
        ? [
            ["chart", "字表"],
            ["flashcard", "閃卡"],
            ["quiz", "測驗"],
          ]
        : [
            ["flashcard", "閃卡"],
            ["quiz", "測驗"],
          ];
    modeNav.className = "seg cols-" + modes.length;
    modeNav.innerHTML = modes
      .map(
        ([id, label]) =>
          `<button type="button" data-mode="${id}" class="${state.mode === id ? "active" : ""}">${label}</button>`,
      )
      .join("");
  }

  function renderFilters() {
    filtersEl.innerHTML = "";
    if (state.content === "kana") {
      filtersEl.appendChild(
        chipRow("假名", state.script, [
          { value: "hiragana", label: "平假名" },
          { value: "katakana", label: "片假名" },
        ], (v) => {
          state.script = v;
          render();
        }),
      );
      filtersEl.appendChild(
        chipRow(
          "教學標籤",
          state.kanaKind,
          ["all", "seion", "dakuon", "handakuon", "youon"].map((k) => ({
            value: k,
            label: window.KIND_ZH[k],
          })),
          (v) => {
            state.kanaKind = v;
            state.kanaRow = "all";
            render();
          },
        ),
      );
      filtersEl.appendChild(
        chipRow(
          "行",
          state.kanaRow,
          [{ value: "all", label: "全部" }].concat(
            window.rowsForKind(state.kanaKind).map((row) => ({
              value: row,
              label: window.ROW_ZH[row] || row,
            })),
          ),
          (v) => {
            state.kanaRow = v;
            render();
          },
        ),
      );
    } else if (state.content === "words") {
      filtersEl.appendChild(
        selectRow(
          "分類",
          state.wordCategory,
          [{ value: "all", label: "全部" }].concat(
            window.CATEGORY_ORDER.map((k) => ({ value: k, label: window.CATEGORY_ZH[k] })),
          ),
          (v) => {
            state.wordCategory = v;
            render();
          },
        ),
      );
    } else {
      filtersEl.appendChild(
        selectRow(
          "情境",
          state.sentenceScene,
          [{ value: "all", label: "全部" }].concat(
            window.SCENE_ORDER.map((k) => ({ value: k, label: window.SCENE_ZH[k] })),
          ),
          (v) => {
            state.sentenceScene = v;
            render();
          },
        ),
      );
    }
    if (state.mode === "quiz") {
      filtersEl.appendChild(
        chipRow(
          "題數",
          String(state.quizSize),
          [
            { value: "20", label: "20" },
            { value: "50", label: "50" },
            { value: "100", label: "100" },
          ],
          (v) => {
            state.quizSize = Number(v);
            render();
          },
        ),
      );
    }
  }

  function gridBlock(title, headers, grid, poolIds, selectedId, onSelect) {
    const wrap = document.createElement("div");
    wrap.innerHTML = `<h3 class="chart-title">${title}</h3>`;
    const table = document.createElement("table");
    table.className = "chart-table";
    table.innerHTML =
      "<thead><tr>" +
      headers.map((h) => `<th>${h}</th>`).join("") +
      "</tr></thead>";
    const tb = document.createElement("tbody");
    grid.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((id) => {
        const td = document.createElement("td");
        if (!id) {
          td.innerHTML = '<div style="height:3rem;min-width:2.75rem"></div>';
          tr.appendChild(td);
          return;
        }
        const item = window.KANA_BY_ID.get(id);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "kana-cell" + (selectedId === id ? " active-sel" : "");
        btn.textContent = window.kanaChar(item, state.script);
        btn.disabled = !poolIds.has(id);
        btn.addEventListener("click", () => {
          speak(window.kanaChar(item, state.script), 0.7);
          onSelect(id);
        });
        td.appendChild(btn);
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    wrap.appendChild(table);
    return wrap;
  }

  function renderChart() {
    const pool = kanaPool();
    const ids = new Set(pool.map((i) => i.id));
    let selectedId = pool[0] ? pool[0].id : null;
    const kind = state.kanaKind;
    const note = kind === "all" ? window.KIND_NOTE.seion : window.KIND_NOTE[kind];
    const card = document.createElement("article");
    card.className = "card";
    const chartMount = document.createElement("div");
    chartMount.style.display = "flex";
    chartMount.style.flexDirection = "column";
    chartMount.style.gap = "1.25rem";
    const detail = document.createElement("article");
    detail.className = "card center";

    function paint(id) {
      selectedId = id;
      chartMount.innerHTML = "";
      const show = (k) => kind === "all" || kind === k;
      if (show("seion"))
        chartMount.appendChild(gridBlock("清音 · 五十音圖", ["あ", "い", "う", "え", "お"], window.SEION_GRID, ids, selectedId, paint));
      if (show("dakuon"))
        chartMount.appendChild(gridBlock("濁音", ["あ", "い", "う", "え", "お"], window.DAKUON_GRID, ids, selectedId, paint));
      if (show("handakuon"))
        chartMount.appendChild(gridBlock("半濁音", ["あ", "い", "う", "え", "お"], window.HANDAKUON_GRID, ids, selectedId, paint));
      if (show("youon"))
        chartMount.appendChild(gridBlock("拗音", ["ゃ", "ゅ", "ょ"], window.YOUON_GRID, ids, selectedId, paint));
      const item = selectedId ? window.KANA_BY_ID.get(selectedId) : null;
      if (!item) {
        detail.innerHTML = '<p class="note">這個篩選目前沒有音。</p>';
        return;
      }
      const glyph = window.kanaChar(item, state.script);
      const other = state.script === "hiragana" ? item.kata : item.hira;
      if (state.autoSpeak) speak(glyph, 0.7);
      detail.innerHTML = `
        <p class="prompt">${state.script === "hiragana" ? "平假名" : "片假名"} · ${item.romaji}</p>
        <button type="button" class="kana-huge" id="glyph-speak" style="border:0;background:transparent;color:inherit;padding:0;width:100%;cursor:pointer">${glyph}</button>
        <p class="romaji">${other} · ${item.romaji}</p>
        <p class="note">${item.mnemonic}</p>
        <div class="example"><span class="jp">${item.example.jp}</span> · ${item.example.zh}</div>
        <button type="button" class="btn btn-primary btn-wide" id="speak-kana">發音</button>
      `;
      const glyphBtn = detail.querySelector("#glyph-speak");
      if (glyphBtn) glyphBtn.addEventListener("click", () => speak(glyph, 0.7));
      detail.querySelector("#speak-kana").addEventListener("click", () => speak(glyph, 0.7));
    }

    main.innerHTML = `<p class="note">${note}</p>`;
    main.appendChild(card);
    card.appendChild(chartMount);
    main.appendChild(detail);
    paint(selectedId);
  }

  function makeDeck(pool) {
    let current = pool.length ? pick(pool) : null;
    let recent = current ? [current.id] : [];
    let history = [];
    return {
      get current() {
        return current;
      },
      get count() {
        return pool.length;
      },
      get canPrev() {
        return history.length > 0;
      },
      next() {
        if (!current) return;
        history = history.concat(current).slice(-50);
        const exclude = new Set(recent.concat(current.id));
        const rest = pool.filter((i) => !exclude.has(i.id));
        current = pick(rest.length ? rest : pool);
        recent = recent.concat(current.id).slice(-40);
      },
      prev() {
        if (!history.length) return;
        current = history.pop();
      },
    };
  }

  function autoBar(onToggle) {
    return `<div class="panel controls">
      <label class="toggle"><input type="checkbox" id="auto-speak" ${state.autoSpeak ? "checked" : ""} /> 自動發音</label>
      <span class="voice">語音：${voiceLabel()}</span>
    </div>`;
  }

  function bindAuto() {
    const el = document.getElementById("auto-speak");
    if (el) el.addEventListener("change", (e) => {
      state.autoSpeak = e.target.checked;
    });
  }

  function renderKanaFlash() {
    const pool = kanaPool();
    const deck = makeDeck(pool);
    function paint() {
      const item = deck.current;
      if (!item) {
        main.innerHTML = '<article class="card center"><p class="note">這個標籤目前沒有音。</p></article>';
        return;
      }
      const glyph = window.kanaChar(item, state.script);
      const other = state.script === "hiragana" ? item.kata : item.hira;
      if (state.autoSpeak) speak(glyph, 0.7);
      main.innerHTML =
        autoBar() +
        `<article class="card center">
          <div class="meta-row"><span>${state.script === "hiragana" ? "平假名" : "片假名"} · ${window.ROW_ZH[item.row] || ""}</span><span>${deck.count} 音</span></div>
          <div class="kana-huge">${glyph}</div>
          <p class="romaji">${item.romaji}</p>
          <p class="note">${state.script === "hiragana" ? "片假名" : "平假名"} ${other}</p>
          <p class="note">${item.mnemonic}</p>
          <div class="example"><span class="jp">${item.example.jp}</span> · ${item.example.zh}</div>
          <div class="actions">
            <button class="btn" id="prev" ${deck.canPrev ? "" : "disabled"}>上一個</button>
            <button class="btn" id="speak">發音</button>
            <button class="btn btn-primary" id="next">下一個</button>
          </div>
        </article>
        <p class="hint">下一個隨機抽音 · 上一個回上一張 · 快捷鍵 N / B，空白鍵發音</p>`;
      bindAuto();
      document.getElementById("prev").addEventListener("click", () => {
        deck.prev();
        paint();
      });
      document.getElementById("next").addEventListener("click", () => {
        deck.next();
        paint();
      });
      document.getElementById("speak").addEventListener("click", () => speak(glyph, 0.7));
    }
    paint();
  }

  function threeOptions(answer, pool) {
    const rest = shuffle(pool.filter((i) => i.id !== answer.id)).slice(0, 2);
    return shuffle([answer].concat(rest));
  }

  function renderQuiz(pool, buildPrompt, optionLabel, speakAnswer) {
    if (pool.length < 3) {
      main.innerHTML = '<article class="card center"><p class="note">這個範圍太少，換「全部」再測。</p></article>';
      return;
    }
    const total = Math.min(state.quizSize, pool.length);
    let index = 0;
    let correct = 0;
    let wrong = 0;
    let attempts = 0;
    let used = [];
    let question = null;
    let status = "idle";
    let pickedId = null;

    function makeQ() {
      const remain = pool.filter((i) => !used.includes(i.id));
      const answer = pick(remain.length ? remain : pool);
      used.push(answer.id);
      return { answer, options: threeOptions(answer, pool), prompt: buildPrompt(answer) };
    }

    function showResults() {
      const acc = Math.round((correct / total) * 100);
      const line = acc >= 90 ? "幾乎滿分，語感很好。" : acc >= 70 ? "穩定進步，再練一輪。" : "沒關係，錯的再看一次就會了。";
      main.innerHTML = `<article class="card center">
        <p class="prompt">測驗完成</p>
        <h2 class="jp-line" style="font-size:1.5rem">共完成 ${total} 題</h2>
        <p class="note">${line}</p>
        <div class="results-grid">
          <div class="result-box"><div class="result-num ok">${correct}</div><div class="note">答對</div></div>
          <div class="result-box"><div class="result-num bad">${wrong}</div><div class="note">答錯（兩次）</div></div>
        </div>
        <p class="zh">正確率 ${acc}%</p>
        <button class="btn btn-primary btn-wide" id="restart">重新開始測驗</button>
      </article>`;
      document.getElementById("restart").addEventListener("click", () => {
        index = 0; correct = 0; wrong = 0; attempts = 0; used = []; status = "idle";
        question = makeQ();
        paint();
      });
    }

    function paint() {
      if (status === "done") {
        showResults();
        return;
      }
      const ratio = (index / total) * 100;
      main.innerHTML = `<div class="panel">
        <div class="progress"><span style="width:${ratio}%"></span></div>
        <div class="quiz-stats"><span>第 ${index + 1} / ${total} 題</span><span><span class="ok">對 ${correct}</span>　<span class="bad">錯 ${wrong}</span></span></div>
      </div>
      <article class="card">
        <p class="prompt">${question.prompt.title}</p>
        <div id="prompt-body"></div>
        <div class="options" id="opts"></div>
        <p class="hint ${status === "wrong" ? "" : "hidden"}" id="try-hint" style="color:var(--bad);margin-top:0.75rem">再試一次</p>
        <button class="btn btn-primary btn-wide hidden" id="advance">下一題</button>
      </article>`;
      const body = document.getElementById("prompt-body");
      body.innerHTML = question.prompt.html;
      const speakBtn = body.querySelector("[data-speak]");
      if (speakBtn) speakBtn.addEventListener("click", () => speakAnswer(question.answer));
      const opts = document.getElementById("opts");
      question.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option";
        btn.innerHTML = optionLabel(opt);
        const revealed = status === "correct" || status === "revealed";
        if (revealed && opt.id === question.answer.id) btn.classList.add("correct");
        if (pickedId === opt.id && opt.id !== question.answer.id && (status === "wrong" || status === "revealed"))
          btn.classList.add("wrong");
        if (revealed) btn.disabled = true;
        btn.addEventListener("click", () => onPick(opt));
        opts.appendChild(btn);
      });
      const adv = document.getElementById("advance");
      if (status === "correct" || status === "revealed") {
        adv.classList.remove("hidden");
        adv.addEventListener("click", () => {
          index += 1;
          if (index >= total) {
            status = "done";
            paint();
            return;
          }
          attempts = 0;
          pickedId = null;
          status = "idle";
          question = makeQ();
          paint();
        });
      }
    }

    function onPick(opt) {
      if (status === "correct" || status === "revealed" || status === "done") return;
      pickedId = opt.id;
      if (opt.id === question.answer.id) {
        status = "correct";
        correct += 1;
      } else {
        attempts += 1;
        if (attempts >= 2) {
          status = "revealed";
          wrong += 1;
        } else {
          status = "wrong";
        }
      }
      paint();
    }

    question = makeQ();
    paint();
  }

  function renderKanaQuiz() {
    function promptFor(id) {
      const kinds = ["romaji", "char", "listen"];
      let n = 0;
      for (let i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) >>> 0;
      return kinds[n % 3];
    }
    renderQuiz(
      kanaPool(),
      (answer) => {
        const kind = promptFor(answer.id);
        const glyph = window.kanaChar(answer, state.script);
        if (kind === "listen") {
          return {
            title: "聽發音，選出假名",
            html: `<div class="center" style="margin-top:1.25rem"><button class="btn btn-primary" data-speak>聽發音</button></div>`,
          };
        }
        if (kind === "char") {
          return {
            title: "看假名，選出羅馬拼音",
            html: `<div class="kana-huge">${glyph}</div><div class="center"><button class="btn" data-speak>聽發音</button></div>`,
          };
        }
        return {
          title: "看羅馬拼音，選出假名",
          html: `<div class="kana-huge" style="font-size:3rem">${answer.romaji}</div><div class="center"><button class="btn" data-speak>聽發音</button></div>`,
        };
      },
      (opt) => {
        const kind = promptFor(questionSafeId());
        function questionSafeId() {
          return opt && main.querySelector(".kana-huge") ? "x" : opt.id;
        }
        return window.kanaChar(opt, state.script) + ` <span class="reading">${opt.romaji}</span>`;
      },
      (answer) => speak(window.kanaChar(answer, state.script), 0.7),
    );
  }

  function renderWordFlash() {
    const pool = wordPool();
    const deck = makeDeck(pool);
    function paint() {
      const item = deck.current;
      if (!item) {
        main.innerHTML = '<article class="card center"><p class="note">這個分類目前沒有單字。</p></article>';
        return;
      }
      if (state.autoSpeak) speak(item.word, 0.82);
      main.innerHTML =
        autoBar() +
        `<article class="card center">
          <div class="meta-row"><span>${window.CATEGORY_ZH[item.category]}</span><span>${deck.count} 詞</span></div>
          <div class="kana-huge" style="font-size:2.75rem">${item.word}</div>
          <p class="romaji">${item.reading}</p>
          <p class="note">${item.romaji}</p>
          <p class="zh">${item.zh}</p>
          <div class="actions">
            <button class="btn" id="prev" ${deck.canPrev ? "" : "disabled"}>上一個</button>
            <button class="btn" id="speak">發音</button>
            <button class="btn btn-primary" id="next">下一個</button>
          </div>
        </article>
        <p class="hint">下一個隨機抽詞 · 上一個回上一張 · 快捷鍵 N / B，空白鍵發音</p>`;
      bindAuto();
      document.getElementById("prev").addEventListener("click", () => { deck.prev(); paint(); });
      document.getElementById("next").addEventListener("click", () => { deck.next(); paint(); });
      document.getElementById("speak").addEventListener("click", () => speak(item.word, 0.82));
    }
    paint();
  }

  function renderWordQuiz() {
    renderQuiz(
      wordPool(),
      (answer) => ({
        title: "看中文，選出正確的日文單字 · 可先聽發音",
        html: `<p class="zh center" style="font-size:1.5rem">${answer.zh}</p><div class="center"><button class="btn" data-speak>聽發音</button></div>`,
      }),
      (opt) => opt.reading,
      (answer) => speak(answer.word, 0.82),
    );
  }

  function renderSentenceFlash() {
    const pool = sentencePool();
    const deck = makeDeck(pool);
    function paint() {
      const item = deck.current;
      if (!item) {
        main.innerHTML = '<article class="card center"><p class="note">這個情境目前沒有句子。</p></article>';
        return;
      }
      if (state.autoSpeak) speak(item.jp, 0.78);
      main.innerHTML =
        autoBar() +
        `<article class="card">
          <div class="meta-row"><span>${window.SCENE_ZH[item.scene]}</span><span>${deck.count} 句</span></div>
          <p class="jp-line">${item.jp}</p>
          <p class="reading-line">${item.reading}</p>
          <p class="zh">${item.zh}</p>
          <div class="actions">
            <button class="btn" id="prev" ${deck.canPrev ? "" : "disabled"}>上一個</button>
            <button class="btn" id="speak">發音</button>
            <button class="btn btn-primary" id="next">下一個</button>
          </div>
        </article>
        <p class="hint">下一個隨機抽句 · 上一個回上一張 · 快捷鍵 N / B，空白鍵發音</p>`;
      bindAuto();
      document.getElementById("prev").addEventListener("click", () => { deck.prev(); paint(); });
      document.getElementById("next").addEventListener("click", () => { deck.next(); paint(); });
      document.getElementById("speak").addEventListener("click", () => speak(item.jp, 0.78));
    }
    paint();
  }

  function renderSentenceQuiz() {
    renderQuiz(
      sentencePool(),
      (answer) => ({
        title: "看中文，選出正確的日文句子 · 可先聽發音",
        html: `<div class="example"><p class="note">${window.SCENE_ZH[answer.scene]}</p><p class="zh">${answer.zh}</p></div><div class="center" style="margin-top:0.75rem"><button class="btn" data-speak>聽發音</button></div>`,
      }),
      (opt) => opt.jp,
      (answer) => speak(answer.jp, 0.78),
    );
  }

  function render() {
    document.querySelectorAll(".content-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.content === state.content);
    });
    renderModeNav();
    renderFilters();
    if (state.content === "kana" && state.mode === "chart") renderChart();
    else if (state.content === "kana" && state.mode === "flashcard") renderKanaFlash();
    else if (state.content === "kana" && state.mode === "quiz") renderKanaQuiz();
    else if (state.content === "words" && state.mode === "quiz") renderWordQuiz();
    else if (state.content === "words") renderWordFlash();
    else if (state.content === "sentences" && state.mode === "quiz") renderSentenceQuiz();
    else renderSentenceFlash();
  }

  document.querySelectorAll(".content-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.content = btn.dataset.content;
      if (state.content !== "kana" && state.mode === "chart") state.mode = "flashcard";
      render();
    });
  });

  modeNav.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-mode]");
    if (!btn) return;
    state.mode = btn.dataset.mode;
    render();
  });

  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    if (state.mode !== "flashcard") return;
    if (e.key === "n" || e.key === "N") {
      const next = document.getElementById("next");
      if (next) next.click();
    }
    if (e.key === "b" || e.key === "B" || e.key === "ArrowLeft") {
      const prev = document.getElementById("prev");
      if (prev) prev.click();
    }
    if (e.key === " ") {
      e.preventDefault();
      const speakBtn = document.getElementById("speak");
      if (speakBtn) speakBtn.click();
    }
  });

  refreshVoice();
  if (window.speechSynthesis) {
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoice);
  }
  render();
})();
