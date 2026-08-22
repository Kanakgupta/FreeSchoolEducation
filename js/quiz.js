/* FreeSchoolEducation - Quiz engine
 * buildQuestionSet(skill) -> array of 20 questions, ordered easy -> expert.
 * Each question: { prompt, mode:"input"|"mcq", choices?, answer, explanation, level }
 * Difficulty tier = Math.floor(index / 5): 0 Easy, 1 Medium, 2 Hard, 3 Expert.
 */
(function (global) {
  "use strict";

  const SET_SIZE = 20;
  const LEVELS = ["Easy", "Medium", "Hard", "Expert"];
  function levelFor(i) { return LEVELS[Math.min(3, Math.floor(i / 5))]; }

  function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[rnd(0, arr.length - 1)]; }
  function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function gcd(a, b) { return b === 0 ? a : gcd(b, Math.abs(a % b)); }
  function tier(i) { return Math.floor(i / 5); }

  function mcq(prompt, correct, distractors, explanation) {
    const uniq = [];
    [correct].concat(distractors).forEach((c) => { const s = String(c); if (uniq.indexOf(s) < 0) uniq.push(s); });
    while (uniq.length < 4) uniq.push(String(rnd(1, 999)));
    return { prompt: prompt, mode: "mcq", choices: shuffle(uniq.slice(0, 4)), answer: String(correct), explanation: explanation || "" };
  }
  function input(prompt, answer, explanation) {
    return { prompt: prompt, mode: "input", answer: String(answer), explanation: explanation || "" };
  }

  // ---- Math generators: function(index 0-19) -----------------------------
  const MATH = {
    count: (i) => { const cap = [6, 10, 15, 20][tier(i)]; const n = rnd(Math.max(1, cap - 6), cap); const dots = "\u25CF ".repeat(n).trim(); return mcq("How many dots?<br><span class='dots'>" + dots + "</span>", n, [n + 1, n - 1, n + 2], "Count each dot: " + n + "."); },
    add: (i) => { const cap = [12, 60, 400, 5000][tier(i)]; const a = rnd(cap / 4, cap), b = rnd(cap / 4, cap); return input(a + " + " + b + " = ?", a + b, a + " + " + b + " = " + (a + b) + "."); },
    add3: (i) => { const cap = [10, 25, 60, 120][tier(i)]; const a = rnd(2, cap), b = rnd(2, cap), c = rnd(2, cap); return input(a + " + " + b + " + " + c + " = ?", a + b + c, "Add step by step: " + (a + b) + " + " + c + " = " + (a + b + c) + "."); },
    sub: (i) => { const cap = [12, 60, 400, 5000][tier(i)]; let a = rnd(cap / 3, cap), b = rnd(1, cap); if (b > a) { const t = a; a = b; b = t; } return input(a + " \u2212 " + b + " = ?", a - b, a + " \u2212 " + b + " = " + (a - b) + "."); },
    mul: (i) => { const caps = [[2, 5], [3, 9], [6, 12], [12, 25]][tier(i)]; const a = rnd(caps[0], caps[1]), b = rnd(3, 12); return input(a + " \u00D7 " + b + " = ?", a * b, a + " \u00D7 " + b + " = " + (a * b) + "."); },
    div: (i) => { const caps = [[2, 5], [3, 9], [6, 12], [8, 15]][tier(i)]; const b = rnd(caps[0], caps[1]), q = rnd(3, 12); return input((b * q) + " \u00F7 " + b + " = ?", q, (b * q) + " \u00F7 " + b + " = " + q + "."); },
    compare: (i) => { const cap = [20, 100, 1000, 100000][tier(i)]; const a = rnd(1, cap), b = rnd(1, cap); const c = a > b ? ">" : a < b ? "<" : "="; return mcq("Compare: " + a + " ___ " + b, c, ["<", ">", "="].filter((x) => x !== c), a + (c === ">" ? " is greater than " : c === "<" ? " is less than " : " equals ") + b + "."); },
    order: (i) => { const cap = [20, 60, 200, 2000][tier(i)]; const nums = [rnd(1, cap), rnd(1, cap), rnd(1, cap), rnd(1, cap)]; const sorted = nums.slice().sort((x, y) => x - y); return mcq("Order from least to greatest:<br>" + nums.join(", "), sorted.join(", "), [sorted.slice().reverse().join(", "), shuffle(nums).join(", "), nums.join(", ")], "Least to greatest: " + sorted.join(", ") + "."); },
    place: (i) => { const cap = [1000, 10000, 100000, 1000000][tier(i)]; const n = rnd(cap / 10, cap); const digits = String(n).split(""); const idx = rnd(0, digits.length - 1); const pv = Math.pow(10, digits.length - 1 - idx); const names = { 1: "ones", 10: "tens", 100: "hundreds", 1000: "thousands", 10000: "ten thousands", 100000: "hundred thousands" }; const d = digits[idx]; return mcq("In " + n.toLocaleString() + ", which digit is in the " + (names[pv] || pv + "s") + " place?", d, shuffle(digits.filter((_, k) => k !== idx)).slice(0, 3), "The " + (names[pv] || "") + " digit is " + d + "."); },
    round: (i) => { const to = [10, 100, 1000, 10000][tier(i)]; const n = rnd(to, to * 100); const r = Math.round(n / to) * to; return mcq("Round " + n.toLocaleString() + " to the nearest " + to.toLocaleString() + ".", r, [r + to, r - to, r + to * 2], n.toLocaleString() + " rounds to " + r.toLocaleString() + "."); },
    "frac-add": (i) => { const d = [4, 6, 10, 12][tier(i)]; const a = rnd(1, d - 1), b = rnd(1, d - 1); const num = a + b, g = gcd(num, d); const ans = (num / g) + "/" + (d / g); return input(a + "/" + d + " + " + b + "/" + d + " = ? (as a fraction)", ans, "Add numerators: " + a + "+" + b + "=" + num + " over " + d + " = " + ans + "."); },
    "frac-sub": (i) => { const d = [4, 6, 10, 12][tier(i)]; const a = rnd(2, d - 1); let b = rnd(1, a - 1 < 1 ? 1 : a - 1); if (b >= a) b = a - 1; const num = a - b, g = gcd(num, d) || 1; const ans = (num / g) + "/" + (d / g); return input(a + "/" + d + " \u2212 " + b + "/" + d + " = ? (as a fraction)", ans, "Subtract numerators: " + a + "\u2212" + b + "=" + num + " over " + d + "."); },
    percent: (i) => { const pcts = [[10, 50], [20, 25], [5, 75], [15, 35]][tier(i)]; const pct = pick(pcts); const base = rnd(2, 20) * 4; return input("What is " + pct + "% of " + base + "?", (pct / 100) * base, pct + "% of " + base + " = " + ((pct / 100) * base) + "."); },
    "int-add": (i) => { const cap = [10, 20, 40, 80][tier(i)]; const a = rnd(-cap, cap), b = rnd(-cap, cap); const bs = b < 0 ? "(" + b + ")" : b; return input(a + " + " + bs + " = ?", a + b, a + " + " + b + " = " + (a + b) + "."); },
    "int-mul": (i) => { const cap = [6, 9, 12, 15][tier(i)]; const a = rnd(-cap, cap), b = rnd(-cap, cap); const bs = b < 0 ? "(" + b + ")" : b; return input(a + " \u00D7 " + bs + " = ?", a * b, a + " \u00D7 " + b + " = " + (a * b) + "."); },
    abs: (i) => { const cap = [10, 25, 50, 100][tier(i)]; const n = rnd(-cap, cap); return input("| " + n + " | = ?", Math.abs(n), "The distance of " + n + " from zero is " + Math.abs(n) + "."); },
    eval: (i) => { const cap = [5, 9, 12, 20][tier(i)]; const x = rnd(2, cap), a = rnd(2, cap), b = rnd(1, cap); return input("Evaluate " + a + "x + " + b + " when x = " + x, a * x + b, a + "\u00D7" + x + "+" + b + " = " + (a * x + b) + "."); },
    linear: (i) => { const cap = [8, 15, 25, 40][tier(i)]; const x = rnd(1, cap), a = rnd(2, cap); return input("Solve for x:  x + " + a + " = " + (x + a), x, "x = " + (x + a) + " \u2212 " + a + " = " + x + "."); },
    linear2: (i) => { const cap = [6, 10, 15, 25][tier(i)]; const x = rnd(1, cap), a = rnd(2, 9), b = rnd(1, cap); return input("Solve for x:  " + a + "x + " + b + " = " + (a * x + b), x, "x = (" + (a * x + b) + " \u2212 " + b + ") \u00F7 " + a + " = " + x + "."); },
    slope: (i) => { const cap = [4, 6, 9, 12][tier(i)]; const x1 = rnd(0, cap), y1 = rnd(0, cap), x2 = x1 + rnd(1, cap), y2 = rnd(0, cap * 2); const g = gcd(y2 - y1, x2 - x1) || 1; const ans = ((y2 - y1) / g) + "/" + ((x2 - x1) / g); return input("Slope through (" + x1 + ", " + y1 + ") and (" + x2 + ", " + y2 + ")? Give rise/run.", ans, "(" + y2 + "\u2212" + y1 + ")/(" + x2 + "\u2212" + x1 + ") = " + ans + "."); },
    power: (i) => { const spec = [[2, 3], [2, 6], [3, 6], [4, 7]][tier(i)]; const base = rnd(spec[0], spec[1]), exp = rnd(2, 3 + tier(i)); return input(base + "^" + exp + " = ?", Math.pow(base, exp), base + "^" + exp + " = " + Math.pow(base, exp) + "."); },
    quadratic: (i) => { const cap = [6, 9, 12, 20][tier(i)]; const r = rnd(2, cap); return input("Solve x\u00B2 = " + (r * r) + " (positive root)", r, "\u221A" + (r * r) + " = " + r + "."); },
    area: (i) => { const cap = [8, 15, 30, 60][tier(i)]; const w = rnd(2, cap), h = rnd(2, cap); return input("Area of a rectangle " + w + " by " + h + "?", w * h, w + " \u00D7 " + h + " = " + (w * h) + "."); },
    perimeter: (i) => { const cap = [8, 15, 30, 60][tier(i)]; const w = rnd(2, cap), h = rnd(2, cap); return input("Perimeter of a rectangle " + w + " by " + h + "?", 2 * (w + h), "2 \u00D7 (" + w + "+" + h + ") = " + (2 * (w + h)) + "."); },
    "area-tri": (i) => { const cap = [6, 10, 16, 24][tier(i)]; const b = rnd(2, cap) * 2, h = rnd(2, cap); return input("Area of a triangle with base " + b + " and height " + h + "?", (b * h) / 2, "\u00BD \u00D7 " + b + " \u00D7 " + h + " = " + ((b * h) / 2) + "."); },
    circle: (i) => { const cap = [6, 10, 15, 20][tier(i)]; const r = rnd(1, cap); return input("Circumference with radius " + r + "? Use \u03C0 \u2248 3.14.", (2 * 3.14 * r).toFixed(2), "2\u03C0r = " + (2 * 3.14 * r).toFixed(2) + "."); },
    volume: (i) => { const cap = [4, 7, 10, 15][tier(i)]; const l = rnd(2, cap), w = rnd(2, cap), h = rnd(2, cap); return input("Volume of a box " + l + " \u00D7 " + w + " \u00D7 " + h + "?", l * w * h, l + "\u00D7" + w + "\u00D7" + h + " = " + (l * w * h) + "."); },
    mean: (i) => { const cap = [10, 20, 40, 80][tier(i)]; const nums = [rnd(1, cap), rnd(1, cap), rnd(1, cap), rnd(1, cap)]; const sum = nums.reduce((a, b) => a + b, 0); const ans = sum % 4 === 0 ? sum / 4 : (sum / 4).toFixed(2); return input("Find the mean of " + nums.join(", "), ans, "Sum " + sum + " \u00F7 4 = " + ans + "."); },
    pythagorean: (i) => { const triples = [[[3, 4, 5]], [[6, 8, 10]], [[5, 12, 13]], [[8, 15, 17], [9, 12, 15]]][tier(i)]; const t = pick(triples); return input("Right triangle with legs " + t[0] + " and " + t[1] + ". Find the hypotenuse.", t[2], "\u221A(" + t[0] + "\u00B2+" + t[1] + "\u00B2) = " + t[2] + "."); },
  };

  // ---- MCQ banks keyed by keyword (question, correct, d1, d2, d3) --------
  const BANK = {
    "synonym": [
      ["Synonym for <b>happy</b>?", "joyful", "angry", "tired", "empty"],
      ["Synonym for <b>big</b>?", "large", "tiny", "quiet", "fast"],
      ["Synonym for <b>fast</b>?", "quick", "slow", "heavy", "dull"],
      ["Synonym for <b>begin</b>?", "start", "end", "close", "lose"],
      ["Synonym for <b>smart</b>?", "clever", "silly", "weak", "loud"],
      ["Synonym for <b>cold</b>?", "chilly", "warm", "bright", "soft"],
      ["Synonym for <b>tired</b>?", "weary", "eager", "fresh", "brave"],
      ["Synonym for <b>angry</b>?", "furious", "calm", "kind", "gentle"],
      ["Synonym for <b>pretty</b>?", "beautiful", "ugly", "plain", "rough"],
      ["Synonym for <b>quiet</b>?", "silent", "noisy", "busy", "bright"],
      ["Which pair are synonyms?", "shout / yell", "hot / cold", "up / down", "day / night"],
      ["Choose the best synonym for <b>enormous</b>.", "gigantic", "minor", "narrow", "brief"],
    ],
    "antonym": [
      ["Antonym for <b>hot</b>?", "cold", "warm", "boiling", "red"],
      ["Antonym for <b>up</b>?", "down", "over", "high", "top"],
      ["Antonym for <b>begin</b>?", "end", "start", "open", "run"],
      ["Antonym for <b>happy</b>?", "sad", "glad", "merry", "cheerful"],
      ["Antonym for <b>full</b>?", "empty", "packed", "loaded", "heavy"],
      ["Antonym for <b>fast</b>?", "slow", "quick", "rapid", "swift"],
      ["Antonym for <b>light</b>?", "dark", "bright", "pale", "shiny"],
      ["Antonym for <b>brave</b>?", "fearful", "bold", "daring", "strong"],
      ["Antonym for <b>ancient</b>?", "modern", "old", "aged", "past"],
      ["Which pair are antonyms?", "wet / dry", "big / large", "happy / glad", "fast / quick"],
      ["Choose the antonym of <b>expand</b>.", "shrink", "grow", "widen", "stretch"],
    ],
    "rhym": [
      ["Which word rhymes with <b>cat</b>?", "hat", "dog", "cup", "sun"],
      ["Which word rhymes with <b>tree</b>?", "bee", "car", "book", "milk"],
      ["Which word rhymes with <b>night</b>?", "light", "noon", "day", "dark"],
      ["Which word rhymes with <b>blue</b>?", "shoe", "green", "red", "pink"],
      ["Which word rhymes with <b>star</b>?", "car", "sky", "moon", "sun"],
      ["Which word rhymes with <b>cake</b>?", "lake", "pie", "milk", "food"],
      ["Which word rhymes with <b>ring</b>?", "sing", "bell", "gold", "hand"],
      ["Which word rhymes with <b>mouse</b>?", "house", "rat", "cheese", "hole"],
    ],
    "root": [
      ["The root <b>bio-</b> means:", "life", "water", "earth", "sound"],
      ["The root <b>tele-</b> means:", "far", "small", "light", "time"],
      ["The root <b>port</b> means:", "carry", "see", "write", "break"],
      ["The root <b>aqua-</b> means:", "water", "air", "fire", "land"],
      ["The root <b>geo-</b> means:", "earth", "star", "life", "sound"],
      ["The root <b>scrib/script</b> means:", "write", "read", "count", "build"],
      ["The root <b>audi-</b> means:", "hear", "see", "speak", "move"],
      ["The root <b>dict</b> means:", "say/speak", "carry", "look", "make"],
      ["The root <b>photo-</b> means:", "light", "sound", "water", "earth"],
      ["The word <b>transport</b> uses <b>port</b>, meaning to:", "carry across", "see through", "write down", "break apart"],
    ],
    "plant": [
      ["What do plants need to make food?", "sunlight", "darkness", "rocks", "plastic"],
      ["Which part of a plant takes in water?", "roots", "petals", "seeds", "buds"],
      ["The process plants use to make food is called:", "photosynthesis", "digestion", "erosion", "gravity"],
      ["Which part makes seeds?", "flower", "root", "stem only", "bark"],
      ["What gas do plants take in to make food?", "carbon dioxide", "helium", "smoke", "nitrogen only"],
      ["Leaves are usually green because of:", "chlorophyll", "water", "sunlight color", "soil"],
    ],
    "weather": [
      ["Which tool measures temperature?", "thermometer", "ruler", "scale", "compass"],
      ["Frozen rain is called:", "snow", "fog", "wind", "dew"],
      ["A scientist who studies weather is a:", "meteorologist", "biologist", "geologist", "chemist"],
      ["Heavy storms with lightning are called:", "thunderstorms", "breezes", "rainbows", "sunsets"],
      ["Which measures wind direction?", "weather vane", "thermometer", "ruler", "clock"],
    ],
    "cell": [
      ["The basic unit of life is the:", "cell", "atom", "organ", "tissue"],
      ["Which part controls the cell?", "nucleus", "wall", "vacuole", "membrane"],
      ["What stores the cell's instructions?", "DNA in the nucleus", "the water", "the wall", "the food"],
      ["Cells make new cells by:", "dividing", "shrinking", "melting", "freezing"],
      ["Which is found in a plant cell but not an animal cell?", "cell wall", "nucleus", "membrane", "cytoplasm"],
    ],
    "atom": [
      ["The center of an atom is the:", "nucleus", "electron", "shell", "molecule"],
      ["Which particle has a negative charge?", "electron", "proton", "neutron", "nucleus"],
      ["Which particle has a positive charge?", "proton", "electron", "neutron", "atom"],
      ["A substance made of one kind of atom is an:", "element", "mixture", "compound", "solution"],
      ["The periodic table organizes:", "elements", "planets", "animals", "rocks"],
    ],
    "continent": [
      ["Which is a continent?", "Africa", "Pacific", "Amazon", "Nile"],
      ["How many continents are there?", "7", "5", "9", "4"],
      ["Which is the largest continent?", "Asia", "Europe", "Australia", "Antarctica"],
      ["Which continent is the coldest?", "Antarctica", "Africa", "Asia", "Europe"],
      ["The imaginary line around the middle of Earth is the:", "equator", "border", "meridian only", "coast"],
    ],
    "government": [
      ["How many branches does the U.S. government have?", "3", "2", "4", "5"],
      ["Who makes laws in the U.S.?", "Congress", "the President", "the Courts", "Governors"],
      ["Who is the head of the executive branch?", "the President", "a judge", "a senator", "the mayor"],
      ["Which branch interprets laws?", "the judicial branch", "the legislative branch", "the executive branch", "the military"],
      ["A government where citizens vote for leaders is a:", "democracy", "monarchy", "dictatorship", "colony"],
    ],
    "constitution": [
      ["The first ten amendments are called the:", "Bill of Rights", "Preamble", "Articles", "Declaration"],
      ["The Constitution set up a government with how many branches?", "3", "1", "2", "5"],
      ["The Constitution begins with the words:", "We the People", "Four score", "In God we trust", "Long ago"],
      ["Changes to the Constitution are called:", "amendments", "articles", "laws", "orders"],
    ],
    "present tense": [
      ["Choose the correct form: <i>Yo ___ (hablar)</i>", "hablo", "hablas", "habla", "hablan"],
      ["Choose the correct form: <i>Nosotros ___ (comer)</i>", "comemos", "como", "comen", "comes"],
      ["Choose the correct form: <i>T\u00FA ___ (vivir)</i>", "vives", "vivo", "vive", "viven"],
      ["Choose the correct form: <i>Ella ___ (cantar)</i>", "canta", "canto", "cantas", "cantan"],
      ["Choose the correct form: <i>Ellos ___ (correr)</i>", "corren", "corre", "corro", "corres"],
    ],
    "greeting": [
      ["How do you say <b>Hello</b> in Spanish?", "Hola", "Adi\u00F3s", "Gracias", "Por favor"],
      ["How do you say <b>Good morning</b>?", "Buenos d\u00EDas", "Buenas noches", "Hasta luego", "De nada"],
      ["How do you say <b>Thank you</b>?", "Gracias", "Hola", "Adi\u00F3s", "S\u00ED"],
      ["How do you say <b>Goodbye</b>?", "Adi\u00F3s", "Hola", "Gracias", "Buenos"],
    ],
    "number": [
      ["How do you say <b>three</b> in Spanish?", "tres", "dos", "cuatro", "cinco"],
      ["How do you say <b>five</b>?", "cinco", "cuatro", "seis", "siete"],
      ["How do you say <b>ten</b>?", "diez", "nueve", "ocho", "once"],
    ],
    "family": [
      ["How do you say <b>mother</b> in Spanish?", "madre", "padre", "hermano", "hija"],
      ["How do you say <b>father</b>?", "padre", "madre", "hermana", "abuelo"],
      ["How do you say <b>brother</b>?", "hermano", "hermana", "primo", "t\u00EDo"],
    ],
    "noun": [
      ["Which word is a noun?", "dog", "run", "quickly", "blue"],
      ["Choose the noun: <i>The bright <u>star</u> shines.</i>", "star", "bright", "shines", "the"],
      ["Which is a noun?", "city", "jump", "happy", "slowly"],
      ["Which is a proper noun?", "London", "town", "river", "girl"],
    ],
    "verb": [
      ["Which word is a verb?", "jump", "table", "happy", "slowly"],
      ["Choose the verb: <i>She <u>reads</u> a book.</i>", "reads", "she", "book", "a"],
      ["Which is a verb?", "swim", "ocean", "cold", "blue"],
      ["Which is the past tense of <b>run</b>?", "ran", "runs", "running", "runner"],
    ],
    "main idea": [
      ["The main idea of a passage is:", "what it is mostly about", "a small detail", "the last word", "the title font"],
      ["Where is the main idea often found?", "the first or last sentence", "only the middle", "never stated", "in the page number"],
      ["Details in a passage usually:", "support the main idea", "replace the main idea", "hide the topic", "list the author"],
    ],
    "ecosystem": [
      ["An ecosystem includes:", "living things and their environment", "only animals", "only rocks", "only water"],
      ["Plants in an ecosystem are:", "producers", "consumers", "decomposers", "predators"],
      ["An animal that eats only plants is a:", "herbivore", "carnivore", "omnivore", "producer"],
      ["Decomposers, such as fungi, help by:", "breaking down dead material", "making sunlight", "eating live prey", "producing oxygen only"],
      ["If one species disappears, an ecosystem usually:", "is affected in many ways", "stays exactly the same", "gains more sunlight", "grows a new sun"],
      ["Energy in an ecosystem starts with:", "the sun", "the soil", "the wind", "predators"],
    ],
    "adaptation": [
      ["An adaptation is a trait that:", "helps an organism survive", "always harms it", "never changes", "is only learned"],
      ["A thick fur coat is an adaptation for:", "cold climates", "hot deserts", "deep oceans", "bright light"],
      ["Camouflage helps an animal:", "hide from predators", "run faster", "fly higher", "make food"],
      ["A cactus stores water to survive in:", "a desert", "a rainforest", "the ocean", "the arctic"],
      ["Adaptations develop over:", "many generations", "a single day", "one hour", "one meal"],
    ],
    "food chain": [
      ["A food chain shows:", "how energy passes between living things", "how rocks form", "the weather", "the water cycle"],
      ["The first link in a food chain is a:", "producer", "consumer", "decomposer", "predator"],
      ["An arrow in a food chain points:", "toward the one receiving energy", "toward the sun", "away from food", "in a circle"],
      ["A hawk that eats a snake is a:", "consumer", "producer", "decomposer", "plant"],
      ["Removing top predators can cause prey to:", "increase too much", "vanish instantly", "become plants", "stop eating"],
    ],
    "matter": [
      ["The three common states of matter are:", "solid, liquid, gas", "hot, cold, warm", "big, small, tiny", "up, down, side"],
      ["Ice melting into water is a change of:", "state", "color only", "mass to zero", "atoms into new elements"],
      ["A gas takes the shape of:", "its container", "a solid block", "nothing", "only a cube"],
      ["When water boils it becomes:", "water vapor (gas)", "ice", "a solid", "a rock"],
      ["Matter is anything that has:", "mass and takes up space", "only color", "only weight in water", "no volume"],
    ],
    "force": [
      ["A force is a:", "push or a pull", "type of color", "kind of sound", "unit of time"],
      ["Friction is a force that:", "slows motion", "speeds everything up", "creates light", "adds mass"],
      ["Gravity pulls objects:", "toward Earth's center", "sideways", "upward", "away from Earth"],
      ["A larger force on an object causes a greater:", "change in motion", "color", "temperature only", "smell"],
      ["Balanced forces on an object cause:", "no change in motion", "instant stopping only", "it to vanish", "it to glow"],
    ],
    "energy": [
      ["Energy is the ability to:", "do work or cause change", "take up space only", "have color", "stay still forever"],
      ["The sun is a source of:", "light and heat energy", "sound only", "gravity only", "friction"],
      ["A moving object has ___ energy.", "kinetic", "frozen", "empty", "silent"],
      ["Stored energy in a stretched spring is:", "potential energy", "sound energy", "no energy", "light energy"],
      ["Energy can be:", "changed from one form to another", "created from nothing", "destroyed easily", "seen as a solid"],
    ],
    "genetic": [
      ["Traits are passed from parents to offspring through:", "genes", "the weather", "food only", "exercise"],
      ["Genes are found on:", "chromosomes", "muscles", "the skin only", "teeth"],
      ["Eye color is an example of a(n):", "inherited trait", "learned skill", "weather event", "food"],
      ["Offspring usually resemble:", "their parents", "random strangers", "rocks", "the sun"],
      ["The study of heredity is called:", "genetics", "geology", "astronomy", "botany only"],
    ],
    "human body": [
      ["The organ that pumps blood is the:", "heart", "lung", "brain", "stomach"],
      ["The lungs are used for:", "breathing", "pumping blood", "digesting food", "thinking"],
      ["The brain is part of the ___ system.", "nervous", "digestive", "skeletal", "muscular"],
      ["Bones make up the ___ system.", "skeletal", "nervous", "respiratory", "circulatory"],
      ["The stomach helps to:", "digest food", "pump blood", "breathe air", "see light"],
    ],
    "revolution": [
      ["The American Revolution was a war for:", "independence from Britain", "control of France", "new inventions", "gold"],
      ["The Declaration of Independence was signed in:", "1776", "1492", "1865", "1920"],
      ["'No taxation without representation' protested:", "taxes without a voice in government", "the price of tea only", "school rules", "farming"],
      ["The first U.S. president was:", "George Washington", "Abraham Lincoln", "Thomas Edison", "Benjamin Franklin"],
      ["A result of the Revolution was:", "a new independent nation", "a larger British colony", "the end of all trade", "a king for America"],
    ],
    "civil war": [
      ["The U.S. Civil War was fought between:", "the North and the South", "the U.S. and Britain", "France and Spain", "two cities"],
      ["A major issue of the Civil War was:", "slavery", "the price of cars", "space travel", "the internet"],
      ["Abraham Lincoln was president during the:", "Civil War", "Revolution", "Cold War", "World War II"],
      ["The Emancipation Proclamation aimed to:", "free enslaved people", "raise taxes", "build railroads", "start trade"],
      ["The Civil War ended in:", "1865", "1776", "1941", "2001"],
    ],
    "world war": [
      ["World War II began for the U.S. after:", "the attack on Pearl Harbor", "the Civil War", "the moon landing", "the Great Fire"],
      ["The Allied Powers fought against the:", "Axis Powers", "United Nations", "Thirteen Colonies", "Roman Empire"],
      ["World War II ended in:", "1945", "1865", "1776", "1969"],
      ["On the home front, many people helped by:", "working in factories", "ignoring the war", "moving to the moon", "closing all schools"],
      ["A lasting result of the world wars was:", "new global cooperation efforts", "the end of all nations", "no change at all", "the first wheel"],
    ],
    "supply and demand": [
      ["Demand is:", "how much people want a good", "the amount available", "the cost to make it", "a tax"],
      ["When demand is high and supply is low, prices usually:", "rise", "fall", "disappear", "freeze"],
      ["When supply is greater than demand, prices tend to:", "fall", "rise", "stay fixed forever", "double"],
      ["A market is a place where people:", "buy and sell goods", "only store food", "make laws", "study stars"],
      ["Prices act as ___ for buyers and sellers.", "signals", "taxes", "laws", "rivers"],
    ],
    "civilization": [
      ["Early civilizations often began near:", "rivers", "deserts with no water", "the poles", "volcanoes only"],
      ["A civilization usually has:", "cities, government, and writing", "no people", "only animals", "no rules"],
      ["Ancient Egypt is known for:", "pyramids and the Nile", "skyscrapers", "the internet", "cars"],
      ["Writing helped civilizations:", "keep records", "stop trading", "forget history", "avoid farming"],
      ["Farming allowed people to:", "settle in one place", "never eat", "stop building", "avoid water"],
    ],
    "map": [
      ["A map is a:", "drawing of a place from above", "type of animal", "kind of weather", "musical sound"],
      ["A map key or legend explains:", "the symbols on the map", "the price of the map", "the author", "the weather"],
      ["A compass rose shows:", "directions like N, S, E, W", "the time", "the temperature", "the population"],
      ["The equator divides Earth into:", "Northern and Southern hemispheres", "east and west only", "land and sea", "hot and cold rocks"],
      ["Lines showing distance on a map are the:", "scale", "title", "border only", "author"],
    ],
    "religion": [
      ["World religions often teach:", "shared beliefs and values", "only math", "how to build cars", "weather forecasts"],
      ["A sacred text is a:", "important religious book", "map", "menu", "calendar only"],
      ["Studying world religions helps people:", "understand different cultures", "ignore others", "avoid history", "stop reading"],
      ["Many religions include:", "traditions and celebrations", "no ideas", "only sports", "car races"],
    ],
    "water cycle": [
      ["What powers the water cycle?", "The sun", "The wind alone", "Cars", "The moon only"],
      ["Turning liquid water into vapor is called:", "evaporation", "condensation", "precipitation", "erosion"],
      ["Clouds form when vapor:", "condenses into droplets", "freezes into rock", "burns up", "sinks into soil"],
      ["Rain, snow, and hail are all:", "precipitation", "evaporation", "condensation", "erosion"],
      ["Where does most fallen water return?", "To the oceans", "To outer space", "Into the sun", "Nowhere"],
    ],
    "rock": [
      ["Rocks are made of:", "minerals", "plastic", "glass only", "water"],
      ["Which rock forms when melted rock cools?", "Igneous", "Sedimentary", "Metamorphic", "Fossil"],
      ["Which rock forms in layers of sediment?", "Sedimentary", "Igneous", "Metamorphic", "Molten"],
      ["Which rock is changed by heat and pressure?", "Metamorphic", "Sedimentary", "Igneous", "Liquid"],
      ["Wearing away of rock by wind and water is called:", "erosion", "condensation", "reflection", "orbit"],
    ],
    "life cycle": [
      ["A life cycle shows the:", "stages of a living thing's life", "path of a river", "layers of rock", "phases of the moon"],
      ["A caterpillar becomes a:", "butterfly", "frog", "bird", "fish"],
      ["The change in form as some animals grow is called:", "metamorphosis", "erosion", "reflection", "gravity"],
      ["A seed grows into a plant that makes:", "new seeds", "rocks", "clouds", "minerals"],
      ["Which is the first stage of a butterfly's life?", "Egg", "Adult", "Pupa", "Larva"],
    ],
    "day and night": [
      ["Day and night are caused by Earth's:", "rotation", "distance from the moon", "color", "size"],
      ["About how long does one rotation take?", "24 hours", "1 hour", "1 year", "1 month"],
      ["The side of Earth facing the sun has:", "day", "night", "winter", "an eclipse"],
      ["Does the sun move across the sky?", "No \u2014 Earth rotates", "Yes, it flies", "Only at night", "Only in winter"],
    ],
    "season": [
      ["Seasons are caused by Earth's:", "tilted axis", "color", "moons", "clouds"],
      ["When your area tilts toward the sun, it is:", "summer", "winter", "midnight", "an eclipse"],
      ["Earth orbits the sun once every:", "year", "day", "hour", "week"],
      ["What mainly causes seasons?", "The tilt of Earth's axis", "Distance to the sun", "The wind", "Ocean waves"],
    ],
    "magnet": [
      ["Opposite magnetic poles:", "attract", "repel", "disappear", "melt"],
      ["Like magnetic poles:", "repel", "attract", "vanish", "freeze"],
      ["Magnets attract which metal?", "Iron", "Plastic", "Wood", "Glass"],
      ["A magnet can push or pull another magnet:", "without touching it", "only by touching", "only underwater", "never"],
    ],
    "electric": [
      ["Electricity flows through a complete loop called a:", "circuit", "magnet", "wave", "fossil"],
      ["Current flows when a circuit is:", "closed (complete)", "open (broken)", "wet", "cold"],
      ["Which material is a good conductor?", "Metal", "Rubber", "Wood", "Plastic"],
      ["Which material is an insulator?", "Rubber", "Copper", "Iron", "Aluminum"],
      ["A device that stores electrical energy is a:", "battery", "ruler", "magnet", "mirror"],
    ],
    "light": [
      ["Light travels in:", "straight lines", "circles only", "zigzags always", "no direction"],
      ["We see an object when light:", "bounces off it into our eyes", "disappears", "freezes", "sinks"],
      ["Light bouncing off a mirror is called:", "reflection", "absorption", "erosion", "orbit"],
      ["Light passes through which material?", "Clear glass", "A brick wall", "A wooden door", "Metal"],
    ],
    "heat": [
      ["Heat always flows from:", "warmer to cooler objects", "cooler to warmer", "left to right", "up only"],
      ["Thermal energy is the energy of:", "moving particles", "still rocks", "empty space", "light only"],
      ["What tool measures temperature?", "A thermometer", "A ruler", "A scale", "A compass"],
      ["Heat moving through direct contact is called:", "conduction", "reflection", "orbit", "erosion"],
    ],
    "fossil": [
      ["A fossil is the preserved remains of:", "a living thing from long ago", "a fresh plant", "a cloud", "a star"],
      ["Fossils are usually found in:", "rock", "the sky", "the ocean surface", "fire"],
      ["A dinosaur footprint in rock is a:", "trace fossil", "body fossil", "mineral", "crystal"],
      ["In undisturbed rock layers, older fossils are usually:", "deeper down", "on top", "floating", "missing"],
    ],
    "planet": [
      ["The center of our solar system is the:", "sun", "moon", "Earth", "Mars"],
      ["How many planets orbit the sun?", "8", "5", "12", "3"],
      ["Which planet do we live on?", "Earth", "Mars", "Venus", "Jupiter"],
      ["A moon orbits a:", "planet", "star only", "comet", "galaxy"],
      ["The planet closest to the sun is:", "Mercury", "Neptune", "Earth", "Saturn"],
    ],
    "reaction": [
      ["In a chemical reaction, substances form:", "new substances", "nothing new", "only heat", "only light"],
      ["Rust forms when iron combines with:", "oxygen", "plastic", "sound", "light"],
      ["A sign of a chemical reaction is:", "a color change or gas bubbles", "no change at all", "a straight line", "a rainbow only"],
      ["In a reaction, total mass is:", "conserved", "created from nothing", "destroyed", "doubled"],
    ],
    "periodic table": [
      ["The periodic table organizes:", "chemical elements", "planets", "animals", "rocks"],
      ["An element's atomic number equals its number of:", "protons", "clouds", "leaves", "moons"],
      ["The symbol for oxygen is:", "O", "Ox", "Og", "Oy"],
      ["Elements in the same column have:", "similar properties", "no pattern", "the same color", "the same mass"],
    ],
    "plate tectonic": [
      ["Earth's outer shell is broken into:", "large moving plates", "one solid piece", "water only", "clouds"],
      ["Two plates colliding can build:", "mountains", "oceans of air", "rainbows", "stars"],
      ["Sudden plate movement can cause:", "earthquakes", "sunsets", "rain only", "day and night"],
      ["Plates move:", "very slowly over time", "instantly", "never", "only at night"],
    ],
    "evolution": [
      ["Evolution is the change in a species' traits over:", "many generations", "one day", "one hour", "one meal"],
      ["Traits that help survival are:", "passed on more often", "always lost", "never inherited", "chosen by the animal"],
      ["Differences among individuals are called:", "variation", "erosion", "reflection", "gravity"],
      ["The process where helpful traits become common is:", "natural selection", "condensation", "orbit", "friction"],
    ],
    "wave": [
      ["A wave carries:", "energy", "matter across the room", "rocks", "color only"],
      ["The height of a wave is its:", "amplitude", "wavelength", "speed only", "color"],
      ["The distance between wave peaks is the:", "wavelength", "amplitude", "volume", "mass"],
      ["Which is a type of wave?", "Sound", "A rock", "A tree", "A magnet"],
    ],
  };

  function bankFor(name) {
    const lower = (name || "").toLowerCase();
    for (const key in BANK) if (lower.indexOf(key) >= 0) return BANK[key];
    return null;
  }

  // Concept-based fallback questions when no bank matches, using CONCEPTS cases.
  function genericItems(skill) {
    const items = [];
    const concept = (global.CONCEPTS && global.CONCEPTS.getConcept) ? global.CONCEPTS.getConcept(skill) : null;
    if (concept && concept.cases) {
      concept.cases.forEach((c) => {
        items.push(["Which statement about " + skill.name.toLowerCase() + " is true?", c[1], "It never applies.", "It has no rule.", "It cannot be checked."]);
      });
      items.push(["What is the key idea of \"" + skill.name + "\"?", concept.remember, "There is no key idea.", "Only guessing works.", "It is always the same answer."]);
      items.push(["\"" + concept.title + "\" is mainly about:", concept.means.split(".")[0] + ".", "an unrelated topic", "the title only", "a random number"]);
    }
    return items;
  }

  // ---- Build a 20-question set for a skill --------------------------------
  function buildQuestionSet(skill) {
    const out = [];
    if (MATH[skill.type]) {
      const seen = new Set();
      let guard = 0;
      while (out.length < SET_SIZE && guard < 200) {
        guard++;
        const q = MATH[skill.type](out.length);
        if (seen.has(q.prompt)) continue;
        seen.add(q.prompt);
        q.level = levelFor(out.length);
        out.push(q);
      }
      while (out.length < SET_SIZE) { const q = MATH[skill.type](out.length); q.level = levelFor(out.length); out.push(q); }
      return out;
    }

    // MCQ path.
    const pool = shuffle((bankFor(skill.name) || []).slice());
    const generic = genericItems(skill);
    let gi = 0;
    for (let k = 0; k < SET_SIZE; k++) {
      let item;
      if (k < pool.length) item = pool[k];
      else if (generic.length) item = generic[gi++ % generic.length];
      else item = ["Read carefully: which is the best-supported answer for " + skill.name + "?", "The clearly supported choice", "An unrelated choice", "A partly correct choice", "An off-topic choice"];
      const q = mcq(item[0], item[1], item.slice(2));
      q.level = levelFor(k);
      out.push(q);
    }
    return out;
  }

  // Build a set from an explicit list of [q, correct, d1, d2, d3] (reading).
  function buildFromItems(itemList) {
    return itemList.map((item, k) => {
      const q = mcq(item[0], item[1], item.slice(2));
      q.level = k < itemList.length / 3 ? "Easy" : k < (2 * itemList.length) / 3 ? "Medium" : "Hard";
      return q;
    });
  }

  function check(question, userAnswer) {
    const norm = (s) => String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, "");
    return norm(userAnswer) === norm(question.answer);
  }

  global.QUIZ = { buildQuestionSet: buildQuestionSet, buildFromItems: buildFromItems, check: check, SET_SIZE: SET_SIZE };
})(window);
