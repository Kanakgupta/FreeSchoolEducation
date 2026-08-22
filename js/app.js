/* FreeSchoolEducation - App: hash router + views
 * Works from file:// with no server. Every link is a #hash route -> leaf page.
 */
(function (global) {
  "use strict";

  const C = global.CURRICULUM;
  const Q = global.QUIZ;
  const CO = global.CONCEPTS;
  const R = global.READING;
  const app = document.getElementById("app");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function h(strings) { return strings.join(""); }

  // ---- Routing ------------------------------------------------------------
  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    return raw ? raw.split("/").map(decodeURIComponent) : [];
  }
  function go(path) { location.hash = "#/" + path; }

  function route() {
    const parts = parseHash();
    window.scrollTo(0, 0);
    if (parts.length === 0) return renderHome();
    switch (parts[0]) {
      case "subject": return renderSubject(parts[1]);
      case "grade": return renderGrade(parts[1]);
      case "skills": return renderSkillList(parts[1], parts[2]);
      case "skill": return renderSkill(parts[1], parts[2], parts[3]);
      case "search": return renderSearch(parts[1] || "");
      default: return renderHome();
    }
  }

  // ---- Breadcrumb ---------------------------------------------------------
  function crumb(items) {
    return h(["<nav class='crumb'>",
      items.map((it, i) => it.path
        ? "<a href='#/" + it.path + "'>" + esc(it.label) + "</a>"
        : "<span>" + esc(it.label) + "</span>"
      ).join("<span class='sep'>\u203A</span>"),
      "</nav>"]);
  }

  // ---- Home ---------------------------------------------------------------
  function renderHome() {
    const subjects = Object.values(C.SUBJECTS);
    const subjectCards = subjects.map((s) =>
      "<a class='subject-card' style='--c:" + s.color + "' href='#/subject/" + s.id + "'>" +
        "<span class='badge'>" + s.icon + "</span><span>" + esc(s.name) + "</span></a>"
    ).join("");

    const gradeRows = C.GRADES.map((g) => {
      const subs = g.subjects.map((sid) => {
        const s = C.SUBJECTS[sid];
        const n = C.countSkills(g.id, sid);
        return "<a class='grade-sub' style='--c:" + s.color + "' href='#/skills/" + g.id + "/" + sid + "'>" +
          "<span class='gs-name'>" + esc(s.name) + "</span>" +
          "<span class='gs-count'>" + n + " skills</span></a>";
      }).join("");
      return "<div class='grade-row'>" +
        "<a class='grade-title' href='#/grade/" + g.id + "'>" + esc(g.name) + "</a>" +
        "<div class='grade-subs'>" + subs + "</div></div>";
    }).join("");

    app.innerHTML = h([
      "<section class='hero'>",
        "<div class='hero-copy'>",
          "<p class='eyebrow'>Your daily learning adventure</p>",
          "<h1>Big bright learning starts here.</h1>",
          "<p>A joyful K\u201312 world of practice. Choose a subject, earn a streak, and grow one skill at a time.</p>",
          "<div class='subject-cards'>", subjectCards, "</div>",
        "</div>",
        "<div class='hero-board' aria-hidden='true'>",
          "<span class='board-orbit orbit-one'></span><span class='board-orbit orbit-two'></span>",
          "<span class='board-chip chip-sun'>3 \u00D7 4</span><span class='board-chip chip-mint'>A+</span>",
          "<span class='board-chip chip-coral'>\u2605</span><span class='board-plus'>+</span>",
          "<span class='board-caption'>You can do this!</span>",
        "</div>",
      "</section>",
      "<section class='section'>",
        "<h2>Explore by grade</h2>",
        "<div class='grade-list'>", gradeRows, "</div>",
      "</section>",
    ]);
  }

  // ---- Subject page (all grades for one subject) --------------------------
  function renderSubject(subjectId) {
    const s = C.SUBJECTS[subjectId];
    if (!s) return renderHome();
    const grades = C.GRADES.filter((g) => g.subjects.indexOf(subjectId) >= 0);
    const cards = grades.map((g) =>
      "<a class='tile' style='--c:" + s.color + "' href='#/skills/" + g.id + "/" + subjectId + "'>" +
        "<span class='tile-title'>" + esc(g.name) + "</span>" +
        "<span class='tile-sub'>" + C.countSkills(g.id, subjectId) + " skills</span></a>"
    ).join("");
    app.innerHTML = h([
      crumb([{ label: "Home", path: "" }, { label: s.name }]),
      "<header class='page-head' style='--c:" + s.color + "'>",
        "<span class='page-badge'>" + s.icon + "</span>",
        "<h1>" + esc(s.name) + "</h1>",
        "<p>Choose a grade to see all " + esc(s.name.toLowerCase()) + " skills.</p>",
      "</header>",
      "<div class='tile-grid'>", cards, "</div>",
    ]);
  }

  // ---- Grade page (all subjects for one grade) ----------------------------
  function renderGrade(gradeId) {
    const g = C.getGrade(gradeId);
    if (!g) return renderHome();
    const cards = g.subjects.map((sid) => {
      const s = C.SUBJECTS[sid];
      return "<a class='tile' style='--c:" + s.color + "' href='#/skills/" + g.id + "/" + sid + "'>" +
        "<span class='tile-badge'>" + s.icon + "</span>" +
        "<span class='tile-title'>" + esc(s.name) + "</span>" +
        "<span class='tile-sub'>" + C.countSkills(g.id, sid) + " skills</span></a>";
    }).join("");
    app.innerHTML = h([
      crumb([{ label: "Home", path: "" }, { label: g.name }]),
      "<header class='page-head'>",
        "<h1>" + esc(g.name) + "</h1>",
        "<p>Select a subject to start practicing.</p>",
      "</header>",
      "<div class='tile-grid'>", cards, "</div>",
    ]);
  }

  // ---- Skill list (grade + subject) ---------------------------------------
  function renderSkillList(gradeId, subjectId) {
    const g = C.getGrade(gradeId), s = C.SUBJECTS[subjectId];
    if (!g || !s) return renderHome();
    const data = C.buildGradeSubject(gradeId, subjectId);
    const total = C.countSkills(gradeId, subjectId);

    const cats = data.categories.map((cat) => {
      const rows = cat.skills.map((sk) =>
        "<li><a class='skill-link' href='#/skill/" + gradeId + "/" + subjectId + "/" + sk.id + "'>" +
          "<span class='skill-code'>" + esc(sk.code) + "</span>" +
          "<span class='skill-name'>" + esc(sk.name) + "</span></a></li>"
      ).join("");
      return "<div class='cat'><h3>" + esc(cat.name) + "</h3><ul class='skill-ul'>" + rows + "</ul></div>";
    }).join("");

    app.innerHTML = h([
      crumb([{ label: "Home", path: "" }, { label: s.name, path: "subject/" + subjectId }, { label: g.name }]),
      "<header class='page-head' style='--c:" + s.color + "'>",
        "<span class='page-badge'>" + s.icon + "</span>",
        "<h1>" + esc(g.name) + " \u00B7 " + esc(s.name) + "</h1>",
        "<p>" + total + " skills. Click any skill to start unlimited practice.</p>",
      "</header>",
      "<div class='cat-grid'>", cats, "</div>",
    ]);
  }

  // ---- Skill leaf: Concept + Practice sections ----------------------------
  const session = {}; // keyed by stateKey -> { questions, answers, index, correct }

  function renderSkill(gradeId, subjectId, skillId) {
    const g = C.getGrade(gradeId), s = C.SUBJECTS[subjectId];
    const found = C.findSkill(gradeId, subjectId, skillId);
    if (!g || !s || !found) return renderHome();
    const sk = found.skill;
    const stateKey = gradeId + "/" + subjectId + "/" + skillId;

    const isReading = sk.type === "reading";
    let passage = null, questions;
    if (isReading) {
      const passages = R.getPassages(gradeId);
      passage = passages[(sk.param || 0) % passages.length];
      questions = Q.buildFromItems(passage.questions);
    } else {
      questions = Q.buildQuestionSet(sk);
    }

    if (!session[stateKey] || session[stateKey].skillVer !== questions.length) {
      session[stateKey] = { questions: questions, answers: {}, index: 0, correct: 0, skillVer: questions.length, passage: passage };
    }
    const st = session[stateKey];

    app.innerHTML = h([
      crumb([
        { label: "Home", path: "" },
        { label: s.name, path: "subject/" + subjectId },
        { label: g.name, path: "skills/" + gradeId + "/" + subjectId },
        { label: sk.code },
      ]),
      "<div class='skill-page' style='--c:" + s.color + "'>",
        "<header class='skill-head'>",
          "<span class='skill-code big'>" + esc(sk.code) + "</span>",
          "<h1>" + esc(sk.name) + "</h1>",
        "</header>",
        "<div class='tabs' role='tablist'>",
          "<button class='tab active' id='tab-learn'>\uD83D\uDCD8 Learn the concept</button>",
          "<button class='tab' id='tab-practice'>\u270F\uFE0F Practice \u00B7 " + st.questions.length + " questions</button>",
        "</div>",
        "<section id='panel-learn' class='panel'>" + conceptMarkup(sk, passage) + "</section>",
        "<section id='panel-practice' class='panel' hidden>" + practiceShell() + "</section>",
      "</div>",
    ]);

    const learnBtn = document.getElementById("tab-learn");
    const pracBtn = document.getElementById("tab-practice");
    const learnPanel = document.getElementById("panel-learn");
    const pracPanel = document.getElementById("panel-practice");
    function show(which) {
      const learn = which === "learn";
      learnBtn.classList.toggle("active", learn);
      pracBtn.classList.toggle("active", !learn);
      learnPanel.hidden = !learn;
      pracPanel.hidden = learn;
      if (!learn) renderQuestion(stateKey);
    }
    learnBtn.addEventListener("click", () => show("learn"));
    pracBtn.addEventListener("click", () => show("practice"));
    const startBtn = document.getElementById("start-practice");
    if (startBtn) startBtn.addEventListener("click", () => show("practice"));
  }

  function conceptMarkup(sk, passage) {
    if (passage) {
      return h([
        "<div class='concept'>",
          "<p class='concept-lead'>Read the passage carefully, then head to Practice to answer questions about it.</p>",
          "<article class='passage'>",
            "<h2>" + esc(passage.title) + "</h2>",
            passage.paragraphs.map((p) => "<p>" + esc(p) + "</p>").join(""),
          "</article>",
          "<div class='concept-tip'><b>Reading tip:</b> The best answer is always supported by a detail in the text. Reread before you choose.</div>",
          "<button class='btn primary' id='start-practice'>Start practice \u2192</button>",
        "</div>",
      ]);
    }
    const c = CO.getConcept(sk);
    return h([
      "<div class='concept'>",
        "<h2>" + esc(c.title) + "</h2>",
        "<p class='concept-lead'><b>What it means:</b> " + esc(c.means) + "</p>",
        "<div class='concept-example'><b>Example:</b> " + esc(c.example) + "</div>",
        "<div class='concept-remember'><b>Remember:</b> " + esc(c.remember) + "</div>",
        "<div class='concept-cases'>",
          "<p class='cases-heading'>Explore every case</p>",
          "<div class='case-grid'>",
            c.cases.map((cs) => "<div class='case-card'><b>" + esc(cs[0]) + "</b><span>" + esc(cs[1]) + "</span></div>").join(""),
          "</div>",
        "</div>",
        "<button class='btn primary' id='start-practice'>Start practice \u2192</button>",
      "</div>",
    ]);
  }

  function practiceShell() {
    return h([
      "<div class='scoreboard'>",
        "<span>Question <b id='sc-index'>1</b> / <b id='sc-total'>20</b></span>",
        "<span>Correct: <b id='sc-correct'>0</b></span>",
        "<span id='sc-level' class='level-badge'>Easy</span>",
      "</div>",
      "<div class='qnav' id='qnav'></div>",
      "<div id='quiz' class='quiz'></div>",
    ]);
  }

  function renderQuestion(stateKey) {
    const st = session[stateKey];
    const quiz = document.getElementById("quiz");
    if (!quiz) return;
    const question = st.questions[st.index];
    const done = st.answers[st.index];

    // Scoreboard + nav.
    document.getElementById("sc-index").textContent = st.index + 1;
    document.getElementById("sc-total").textContent = st.questions.length;
    document.getElementById("sc-correct").textContent = st.correct;
    const lvl = document.getElementById("sc-level");
    lvl.textContent = question.level || "";
    lvl.className = "level-badge level-" + (question.level || "Easy").toLowerCase();

    const nav = document.getElementById("qnav");
    nav.innerHTML = st.questions.map((_, k) =>
      "<button class='qdot " + (k === st.index ? "active " : "") + (st.answers[k] ? "done" : "") + "' data-go='" + k + "'>" + (k + 1) + "</button>"
    ).join("");
    nav.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => { st.index = Number(b.dataset.go); renderQuestion(stateKey); }));

    let controls;
    if (question.mode === "mcq") {
      controls = "<div class='choices'>" +
        question.choices.map((c) => "<button class='choice' data-val=\"" + esc(c) + "\"" + (done ? " disabled" : "") + ">" + c + "</button>").join("") +
        "</div>";
    } else {
      controls = "<div class='answer-row'>" +
        "<input id='answer' class='answer-input' type='text' autocomplete='off' placeholder='Type your answer'" + (done ? " disabled" : "") + " />" +
        "<button id='submit' class='btn primary'" + (done ? " disabled" : "") + ">Submit</button></div>";
    }

    quiz.innerHTML = h([
      "<div class='question'>" + question.prompt + "</div>",
      controls,
      "<div id='feedback' class='feedback'></div>",
      "<div class='question-arrows'>",
        "<button class='btn ghost' id='prevq'" + (st.index === 0 ? " disabled" : "") + ">\u2190 Previous</button>",
        "<button class='btn ghost' id='nextq'" + (st.index === st.questions.length - 1 ? " disabled" : "") + ">Next \u2192</button>",
      "</div>",
    ]);

    const feedback = document.getElementById("feedback");
    const prevq = document.getElementById("prevq");
    const nextq = document.getElementById("nextq");
    if (prevq) prevq.addEventListener("click", () => { if (st.index > 0) { st.index--; renderQuestion(stateKey); } });
    if (nextq) nextq.addEventListener("click", () => { if (st.index < st.questions.length - 1) { st.index++; renderQuestion(stateKey); } });

    if (done) {
      showResolved(question, done);
      return;
    }

    function grade(val) {
      const ok = Q.check(question, val);
      st.answers[st.index] = ok ? "correct" : "wrong";
      if (ok) st.correct += 1;
      document.getElementById("sc-correct").textContent = st.correct;
      showResolved(question, st.answers[st.index], val);
      // Update nav dot.
      const dot = nav.querySelector("[data-go='" + st.index + "']");
      if (dot) dot.classList.add("done");
      if (Object.keys(st.answers).length === st.questions.length) setTimeout(() => showSummary(stateKey), 400);
    }

    if (question.mode === "mcq") {
      quiz.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => grade(b.dataset.val)));
    } else {
      const inp = document.getElementById("answer");
      const submit = document.getElementById("submit");
      submit.addEventListener("click", () => grade(inp.value));
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") grade(inp.value); });
      inp.focus();
    }
  }

  function showResolved(question, result, val) {
    const ok = result === "correct";
    if (question.mode === "mcq") {
      document.querySelectorAll(".choice").forEach((b) => {
        b.disabled = true;
        if (b.dataset.val === question.answer) b.classList.add("correct");
        else if (val !== undefined && b.dataset.val === String(val)) b.classList.add("wrong");
      });
    } else {
      const inp = document.getElementById("answer");
      if (inp) { inp.disabled = true; inp.value = val !== undefined ? val : inp.value; inp.classList.add(ok ? "ok" : "bad"); }
      const submit = document.getElementById("submit");
      if (submit) submit.disabled = true;
    }
    const feedback = document.getElementById("feedback");
    if (!feedback) return;
    feedback.innerHTML =
      (ok ? "<div class='fb ok'>\u2713 " + celebrate() + "</div>"
          : "<div class='fb bad'>\u2717 The answer is <b>" + esc(question.answer) + "</b>.</div>") +
      (question.explanation ? "<div class='explain'>" + esc(question.explanation) + "</div>" : "");
  }

  const CHEERS = ["Correct!", "Nice work!", "You nailed it!", "Brilliant!", "Well done!", "Spot on!", "Great thinking!", "Superb!"];
  function celebrate() { return CHEERS[Math.floor(Math.random() * CHEERS.length)]; }

  function showSummary(stateKey) {
    const st = session[stateKey];
    const total = st.questions.length;
    const correct = st.correct;
    const pct = Math.round((correct / total) * 100);
    const tier = pct >= 90 ? ["Diamond", "\u25C6"] : pct >= 70 ? ["Gold", "\u2605"] : pct >= 50 ? ["Silver", "\u25CF"] : ["Bronze", "\u25B2"];
    const quiz = document.getElementById("quiz");
    if (!quiz) return;
    document.getElementById("qnav").innerHTML = "";
    quiz.innerHTML = h([
      "<div class='summary'>",
        "<div class='summary-coin " + tier[0].toLowerCase() + "'>" + tier[1] + "</div>",
        "<h2>" + tier[0] + " \u2014 " + correct + " / " + total + " correct</h2>",
        "<p class='muted'>" + (pct >= 70 ? "Excellent work! Try a harder skill next." : "Good effort \u2014 review the concept and try again to improve.") + "</p>",
        "<button class='btn primary' id='retry'>Practice again</button>",
      "</div>",
    ]);
    document.getElementById("retry").addEventListener("click", () => {
      delete session[stateKey];
      const parts = location.hash.replace(/^#\/?/, "").split("/");
      renderSkill(parts[1], parts[2], parts[3]);
      document.getElementById("tab-practice").click();
    });
  }

  // ---- Search -------------------------------------------------------------
  function renderSearch(query) {
    const qLower = query.toLowerCase().trim();
    let results = [];
    if (qLower.length >= 2) {
      C.GRADES.forEach((g) => {
        g.subjects.forEach((sid) => {
          const data = C.buildGradeSubject(g.id, sid);
          data.categories.forEach((cat) => {
            cat.skills.forEach((sk) => {
              if (sk.name.toLowerCase().indexOf(qLower) >= 0) {
                results.push({ g: g, sid: sid, sk: sk });
              }
            });
          });
        });
      });
    }
    results = results.slice(0, 200);
    const list = results.length
      ? results.map((r) => {
          const s = C.SUBJECTS[r.sid];
          return "<a class='search-hit' style='--c:" + s.color + "' href='#/skill/" + r.g.id + "/" + r.sid + "/" + r.sk.id + "'>" +
            "<span class='hit-name'>" + esc(r.sk.name) + "</span>" +
            "<span class='hit-meta'>" + esc(s.name) + " \u00B7 " + esc(r.g.name) + "</span></a>";
        }).join("")
      : "<p class='muted'>" + (qLower.length >= 2 ? "No skills found." : "Type at least 2 characters.") + "</p>";
    app.innerHTML = h([
      crumb([{ label: "Home", path: "" }, { label: "Search" }]),
      "<header class='page-head'><h1>Search results</h1><p>\u201C" + esc(query) + "\u201D</p></header>",
      "<div class='search-results'>", list, "</div>",
    ]);
  }

  // ---- Global search box in header ---------------------------------------
  function initSearchBox() {
    const box = document.getElementById("searchBox");
    if (!box) return;
    function run() {
      const v = box.value.trim();
      if (v) go("search/" + encodeURIComponent(v));
    }
    box.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
    const btn = document.getElementById("searchBtn");
    if (btn) btn.addEventListener("click", run);
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", () => { initSearchBox(); route(); });
  // In case DOMContentLoaded already fired.
  if (document.readyState !== "loading") { initSearchBox(); route(); }
})(window);
