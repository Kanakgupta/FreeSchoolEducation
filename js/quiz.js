/* FreeSchoolEducation - Quiz engine
 * Generates interactive questions for a skill based on its "type".
 * Each generator returns:
 *   { prompt, mode: "input"|"mcq", choices?, answer, explanation }
 * answer is compared as a trimmed, lowercased string.
 */
(function (global) {
  "use strict";

  function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[rnd(0, arr.length - 1)]; }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rnd(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

  // Build an MCQ from a correct answer and a set of distractors.
  function mcq(prompt, correct, distractors, explanation) {
    const choices = shuffle([correct].concat(distractors).slice(0, 4));
    return { prompt: prompt, mode: "mcq", choices: choices.map(String), answer: String(correct), explanation: explanation || "" };
  }
  function input(prompt, answer, explanation) {
    return { prompt: prompt, mode: "input", answer: String(answer), explanation: explanation || "" };
  }

  // ---- Math generators ----------------------------------------------------
  const MATH = {
    count: function (p) {
      const cap = typeof p === "number" ? p : 10;
      const n = rnd(1, Math.min(cap, 12));
      const dots = "\u25CF ".repeat(n).trim();
      const correct = n;
      const distractors = shuffle([n + 1, n - 1, n + 2, Math.max(1, n - 2)]).slice(0, 3);
      return mcq("How many dots?<br><span class='dots'>" + dots + "</span>", correct, distractors, "Count each dot: " + n + ".");
    },
    add: function (p) {
      const cap = typeof p === "number" ? p : 20;
      const a = rnd(1, cap), b = rnd(1, cap);
      return input(a + " + " + b + " = ?", a + b, a + " + " + b + " = " + (a + b) + ".");
    },
    add3: function () {
      const a = rnd(1, 20), b = rnd(1, 20), c = rnd(1, 20);
      return input(a + " + " + b + " + " + c + " = ?", a + b + c);
    },
    sub: function (p) {
      const cap = typeof p === "number" ? p : 20;
      let a = rnd(1, cap), b = rnd(1, cap);
      if (b > a) [a, b] = [b, a];
      return input(a + " \u2212 " + b + " = ?", a - b, a + " \u2212 " + b + " = " + (a - b) + ".");
    },
    mul: function (p) {
      const cap = typeof p === "number" && p <= 12 ? p : 12;
      const a = rnd(2, cap), b = rnd(2, 12);
      return input(a + " \u00D7 " + b + " = ?", a * b, a + " \u00D7 " + b + " = " + (a * b) + ".");
    },
    div: function () {
      const b = rnd(2, 12), q = rnd(2, 12);
      return input((b * q) + " \u00F7 " + b + " = ?", q, (b * q) + " \u00F7 " + b + " = " + q + ".");
    },
    compare: function () {
      const a = rnd(1, 100), b = rnd(1, 100);
      const correct = a > b ? ">" : a < b ? "<" : "=";
      return mcq("Compare: " + a + " ___ " + b, correct, ["<", ">", "="].filter((c) => c !== correct), a + (correct === ">" ? " is greater than " : correct === "<" ? " is less than " : " equals ") + b + ".");
    },
    order: function () {
      const nums = [rnd(1, 50), rnd(1, 50), rnd(1, 50), rnd(1, 50)];
      const sorted = nums.slice().sort((x, y) => x - y);
      const correct = sorted.join(", ");
      const d1 = sorted.slice().reverse().join(", ");
      const d2 = shuffle(nums).join(", ");
      const d3 = nums.join(", ");
      return mcq("Put these numbers in order from least to greatest:<br>" + nums.join(", "), correct, [d1, d2, d3], "Least to greatest: " + correct + ".");
    },
    place: function (p) {
      const cap = typeof p === "number" ? p : 1000;
      const n = rnd(cap / 10, cap);
      const digits = String(n).split("");
      const idx = rnd(0, digits.length - 1);
      const placeVal = Math.pow(10, digits.length - 1 - idx);
      const names = { 1: "ones", 10: "tens", 100: "hundreds", 1000: "thousands", 10000: "ten thousands" };
      const correct = digits[idx];
      const distractors = shuffle(digits.filter((_, i) => i !== idx)).slice(0, 3);
      return mcq("In " + n + ", which digit is in the " + (names[placeVal] || placeVal + "s") + " place?", correct, distractors.length ? distractors : ["0", "1", "2"], "The " + (names[placeVal] || "") + " digit is " + correct + ".");
    },
    round: function (p) {
      const to = typeof p === "number" ? p : 10;
      const n = rnd(to, to * 100);
      const rounded = Math.round(n / to) * to;
      const distractors = [rounded + to, rounded - to, Math.floor(n / to) * to + (rounded === Math.floor(n / to) * to ? to * 2 : 0)];
      return mcq("Round " + n + " to the nearest " + to + ".", rounded, distractors, n + " rounds to " + rounded + ".");
    },
    "frac-add": function () {
      const d = rnd(3, 12);
      let a = rnd(1, d - 1), b = rnd(1, d - 1);
      const num = a + b;
      const g = gcd(num, d);
      const ans = (num / g) + "/" + (d / g);
      return input(a + "/" + d + " + " + b + "/" + d + " = ? (as a fraction, e.g. 3/4)", ans, "Add numerators: " + a + "+" + b + "=" + num + " over " + d + " = " + ans + ".");
    },
    "frac-sub": function () {
      const d = rnd(3, 12);
      let a = rnd(2, d - 1), b = rnd(1, a - 1 < 1 ? 1 : a - 1);
      if (b >= a) b = a - 1;
      const num = a - b;
      const g = gcd(num, d) || 1;
      const ans = (num / g) + "/" + (d / g);
      return input(a + "/" + d + " \u2212 " + b + "/" + d + " = ? (as a fraction)", ans, "Subtract numerators: " + a + "\u2212" + b + "=" + num + " over " + d + ".");
    },
    percent: function () {
      const pct = pick([10, 20, 25, 50, 5, 75]);
      const base = rnd(2, 20) * 4;
      return input("What is " + pct + "% of " + base + "?", (pct / 100) * base, pct + "% of " + base + " = " + ((pct / 100) * base) + ".");
    },
    "int-add": function () {
      const a = rnd(-20, 20), b = rnd(-20, 20);
      const bStr = b < 0 ? "(" + b + ")" : b;
      return input(a + " + " + bStr + " = ?", a + b, a + " + " + b + " = " + (a + b) + ".");
    },
    "int-mul": function () {
      const a = rnd(-12, 12), b = rnd(-12, 12);
      const bStr = b < 0 ? "(" + b + ")" : b;
      return input(a + " \u00D7 " + bStr + " = ?", a * b, a + " \u00D7 " + b + " = " + (a * b) + ".");
    },
    abs: function () {
      const n = rnd(-50, 50);
      return input("| " + n + " | = ?", Math.abs(n), "The absolute value of " + n + " is " + Math.abs(n) + ".");
    },
    eval: function () {
      const x = rnd(2, 9), a = rnd(2, 9), b = rnd(1, 12);
      return input("Evaluate " + a + "x + " + b + " when x = " + x, a * x + b, a + "\u00D7" + x + "+" + b + " = " + (a * x + b) + ".");
    },
    linear: function () {
      const x = rnd(1, 12), a = rnd(2, 9);
      return input("Solve for x:  x + " + a + " = " + (x + a), x, "x = " + (x + a) + " \u2212 " + a + " = " + x + ".");
    },
    linear2: function () {
      const x = rnd(1, 12), a = rnd(2, 9), b = rnd(1, 12);
      return input("Solve for x:  " + a + "x + " + b + " = " + (a * x + b), x, "x = (" + (a * x + b) + " \u2212 " + b + ") \u00F7 " + a + " = " + x + ".");
    },
    slope: function () {
      const x1 = rnd(0, 6), y1 = rnd(0, 6), x2 = x1 + rnd(1, 5), y2 = rnd(0, 10);
      const ans = (y2 - y1) + "/" + (x2 - x1);
      return input("Find the slope through (" + x1 + ", " + y1 + ") and (" + x2 + ", " + y2 + "). Give as rise/run.", ans, "Slope = (" + y2 + "\u2212" + y1 + ")/(" + x2 + "\u2212" + x1 + ") = " + ans + ".");
    },
    power: function () {
      const base = rnd(2, 6), exp = rnd(2, 4);
      return input(base + "^" + exp + " = ?", Math.pow(base, exp), base + "^" + exp + " = " + Math.pow(base, exp) + ".");
    },
    quadratic: function () {
      const r = rnd(1, 8);
      return input("Solve x\u00B2 = " + (r * r) + " (positive root)", r, "\u221A" + (r * r) + " = " + r + ".");
    },
    area: function () {
      const w = rnd(2, 15), h = rnd(2, 15);
      return input("Area of a rectangle " + w + " by " + h + "?", w * h, w + " \u00D7 " + h + " = " + (w * h) + ".");
    },
    perimeter: function () {
      const w = rnd(2, 15), h = rnd(2, 15);
      return input("Perimeter of a rectangle " + w + " by " + h + "?", 2 * (w + h), "2 \u00D7 (" + w + "+" + h + ") = " + (2 * (w + h)) + ".");
    },
    "area-tri": function () {
      const b = rnd(2, 12) * 2, h = rnd(2, 12);
      return input("Area of a triangle with base " + b + " and height " + h + "?", (b * h) / 2, "\u00BD \u00D7 " + b + " \u00D7 " + h + " = " + ((b * h) / 2) + ".");
    },
    circle: function () {
      const r = rnd(1, 10);
      return input("Circumference of a circle with radius " + r + "? Use \u03C0 \u2248 3.14.", (2 * 3.14 * r).toFixed(2), "2\u03C0r = " + (2 * 3.14 * r).toFixed(2) + ".");
    },
    volume: function () {
      const l = rnd(2, 8), w = rnd(2, 8), h = rnd(2, 8);
      return input("Volume of a box " + l + " \u00D7 " + w + " \u00D7 " + h + "?", l * w * h, l + "\u00D7" + w + "\u00D7" + h + " = " + (l * w * h) + ".");
    },
    mean: function () {
      const nums = [rnd(1, 20), rnd(1, 20), rnd(1, 20), rnd(1, 20)];
      const sum = nums.reduce((a, b) => a + b, 0);
      return input("Find the mean of " + nums.join(", "), sum / 4, "Sum " + sum + " \u00F7 4 = " + (sum / 4) + ".");
    },
    pythagorean: function () {
      const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];
      const t = pick(triples);
      return input("A right triangle has legs " + t[0] + " and " + t[1] + ". Find the hypotenuse.", t[2], "\u221A(" + t[0] + "\u00B2+" + t[1] + "\u00B2) = " + t[2] + ".");
    },
  };

  // ---- MCQ question banks by keyword -------------------------------------
  // Matched against the skill name (case-insensitive substring).
  const BANK = {
    "synonym": [
      { q: "Which word is a synonym for <b>happy</b>?", a: "joyful", d: ["angry", "tired", "empty"] },
      { q: "Which word is a synonym for <b>big</b>?", a: "large", d: ["tiny", "quiet", "fast"] },
      { q: "Which word is a synonym for <b>fast</b>?", a: "quick", d: ["slow", "heavy", "dull"] },
    ],
    "antonym": [
      { q: "Which word is an antonym for <b>hot</b>?", a: "cold", d: ["warm", "boiling", "red"] },
      { q: "Which word is an antonym for <b>up</b>?", a: "down", d: ["over", "high", "top"] },
      { q: "Which word is an antonym for <b>begin</b>?", a: "end", d: ["start", "open", "run"] },
    ],
    "rhym": [
      { q: "Which word rhymes with <b>cat</b>?", a: "hat", d: ["dog", "cup", "sun"] },
      { q: "Which word rhymes with <b>tree</b>?", a: "bee", d: ["car", "book", "milk"] },
    ],
    "letter name": [
      { q: "Which letter comes after <b>C</b>?", a: "D", d: ["B", "F", "A"] },
      { q: "Which is a vowel?", a: "E", d: ["B", "T", "R"] },
    ],
    "beginning sound": [
      { q: "Which word begins with the /b/ sound?", a: "ball", d: ["cat", "sun", "dog"] },
      { q: "Which word begins with the /s/ sound?", a: "sun", d: ["map", "pen", "top"] },
    ],
    "noun": [
      { q: "Which word is a noun?", a: "dog", d: ["run", "quickly", "blue"] },
      { q: "Choose the noun: <i>The bright <u>star</u> shines.</i>", a: "star", d: ["bright", "shines", "the"] },
    ],
    "verb": [
      { q: "Which word is a verb?", a: "jump", d: ["table", "happy", "slowly"] },
      { q: "Choose the verb: <i>She <u>reads</u> a book.</i>", a: "reads", d: ["she", "book", "a"] },
    ],
    "plant": [
      { q: "What do plants need to make food?", a: "sunlight", d: ["darkness", "rocks", "plastic"] },
      { q: "Which part of a plant takes in water?", a: "roots", d: ["petals", "leaves tips", "seeds"] },
    ],
    "weather": [
      { q: "Which tool measures temperature?", a: "thermometer", d: ["ruler", "scale", "compass"] },
      { q: "Frozen rain is called:", a: "snow", d: ["fog", "wind", "dew"] },
    ],
    "cell": [
      { q: "The basic unit of life is the:", a: "cell", d: ["atom", "organ", "tissue"] },
      { q: "Which part controls the cell?", a: "nucleus", d: ["wall", "vacuole", "ribosome"] },
    ],
    "atom": [
      { q: "The center of an atom is the:", a: "nucleus", d: ["electron", "shell", "molecule"] },
      { q: "Which particle has a negative charge?", a: "electron", d: ["proton", "neutron", "nucleus"] },
    ],
    "continent": [
      { q: "Which is a continent?", a: "Africa", d: ["Pacific", "Amazon", "Nile"] },
      { q: "How many continents are there?", a: "7", d: ["5", "9", "4"] },
    ],
    "government": [
      { q: "How many branches does the U.S. government have?", a: "3", d: ["2", "4", "5"] },
      { q: "Who makes laws in the U.S.?", a: "Congress", d: ["President", "Courts", "Governors"] },
    ],
    "constitution": [
      { q: "The first ten amendments are called the:", a: "Bill of Rights", d: ["Preamble", "Articles", "Federalist Papers"] },
    ],
    "present tense": [
      { q: "Choose the correct form: <i>Yo ___ (hablar)</i>", a: "hablo", d: ["hablas", "habla", "hablan"] },
      { q: "Choose the correct form: <i>Nosotros ___ (comer)</i>", a: "comemos", d: ["como", "comen", "comes"] },
    ],
    "greeting": [
      { q: "How do you say <b>Hello</b> in Spanish?", a: "Hola", d: ["Adi\u00F3s", "Gracias", "Por favor"] },
      { q: "How do you say <b>Good morning</b> in Spanish?", a: "Buenos d\u00EDas", d: ["Buenas noches", "Hasta luego", "De nada"] },
    ],
    "number": [
      { q: "How do you say <b>three</b> in Spanish?", a: "tres", d: ["dos", "cuatro", "cinco"] },
    ],
    "family": [
      { q: "How do you say <b>mother</b> in Spanish?", a: "madre", d: ["padre", "hermano", "hija"] },
    ],
    "root": [
      { q: "The root <b>bio-</b> means:", a: "life", d: ["water", "earth", "sound"] },
      { q: "The root <b>tele-</b> means:", a: "far", d: ["small", "light", "time"] },
    ],
    "main idea": [
      { q: "The main idea of a passage is:", a: "what it is mostly about", d: ["a small detail", "the last word", "the title font"] },
    ],
  };

  const GENERIC = [
    { q: "Read carefully and choose the best answer for this skill practice question.", a: "The best-supported choice", d: ["An unrelated choice", "A partially correct choice", "An off-topic choice"] },
  ];

  function bankFor(skillName) {
    const lower = (skillName || "").toLowerCase();
    for (const key in BANK) {
      if (lower.indexOf(key) >= 0) return BANK[key];
    }
    return null;
  }

  // ---- Public: generate one question for a skill --------------------------
  function generate(skill) {
    const type = skill.type;
    if (MATH[type]) {
      try { return MATH[type](skill.param); } catch (e) { /* fall through */ }
    }
    // MCQ-based subjects.
    const bank = bankFor(skill.name) || GENERIC;
    const item = pick(bank);
    return mcq(item.q, item.a, item.d, "");
  }

  function check(question, userAnswer) {
    const norm = (s) => String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, "");
    return norm(userAnswer) === norm(question.answer);
  }

  global.QUIZ = { generate: generate, check: check };
})(window);
