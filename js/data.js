/* FreeSchoolEducation - Curriculum data model
 * Builds the full tree: subjects -> grades -> categories -> skills.
 * Every skill is a navigable leaf page with an interactive quiz.
 * Skill lists are auto-generated from category templates per grade band.
 */
(function (global) {
  "use strict";

  // ---- Subjects -----------------------------------------------------------
  const SUBJECTS = {
    math: { id: "math", name: "Math", color: "#1a9988", icon: "M" },
    ela: { id: "ela", name: "Language arts", color: "#c0392b", icon: "A" },
    science: { id: "science", name: "Science", color: "#8e44ad", icon: "S" },
    social: { id: "social", name: "Social studies", color: "#e67e22", icon: "H" },
    spanish: { id: "spanish", name: "Spanish", color: "#2980b9", icon: "E" },
  };

  // ---- Grades -------------------------------------------------------------
  // band: early | elementary | middle | high
  const GRADES = [
    { id: "pre-k", name: "Pre-K", band: "early", subjects: ["math", "ela"] },
    { id: "kindergarten", name: "Kindergarten", band: "early", subjects: ["math", "ela", "science", "social"] },
    { id: "grade-1", name: "First grade", band: "early", subjects: ["math", "ela", "science", "social"] },
    { id: "grade-2", name: "Second grade", band: "early", subjects: ["math", "ela", "science", "social"] },
    { id: "grade-3", name: "Third grade", band: "elementary", subjects: ["math", "ela", "science", "social"] },
    { id: "grade-4", name: "Fourth grade", band: "elementary", subjects: ["math", "ela", "science", "social"] },
    { id: "grade-5", name: "Fifth grade", band: "elementary", subjects: ["math", "ela", "science", "social"] },
    { id: "grade-6", name: "Sixth grade", band: "middle", subjects: ["math", "ela", "science", "social"] },
    { id: "grade-7", name: "Seventh grade", band: "middle", subjects: ["math", "ela", "science", "social"] },
    { id: "grade-8", name: "Eighth grade", band: "middle", subjects: ["math", "ela", "science", "social"] },
    { id: "algebra-1", name: "Algebra 1", band: "high", subjects: ["math", "ela", "science", "social"] },
    { id: "geometry", name: "Geometry", band: "high", subjects: ["math", "ela", "science", "social"] },
    { id: "algebra-2", name: "Algebra 2", band: "high", subjects: ["math", "ela", "science", "social"] },
    { id: "precalculus", name: "Precalculus", band: "high", subjects: ["math", "ela", "science"] },
    { id: "calculus", name: "Calculus", band: "high", subjects: ["math"] },
    { id: "spanish", name: "Spanish", band: "all", subjects: ["spanish"] },
  ];

  // ---- Category templates -------------------------------------------------
  // For each subject and band a list of categories. Each category has skills,
  // each skill has a name and a quiz "type" understood by the quiz engine.
  // {n} in a skill name is replaced with numbers to expand into several skills.
  const T = {
    math: {
      early: [
        { name: "Counting and number sense", skills: [
          ["Count to {n}", "count", [3, 5, 10, 20]],
          ["Count objects", "count", 3],
          ["Count on ten frames", "count", 2],
          ["Represent numbers", "count", 2],
        ]},
        { name: "Comparing", skills: [
          ["Comparing numbers up to {n}", "compare", [10, 20, 100]],
          ["More or fewer", "compare", 2],
          ["Order numbers", "order", 2],
        ]},
        { name: "Addition", skills: [
          ["Add with pictures - sums up to {n}", "add", [5, 10, 20]],
          ["Addition facts up to {n}", "add", [10, 20]],
          ["Add three numbers", "add3", 2],
          ["Complete the addition sentence", "add", 2],
        ]},
        { name: "Subtraction", skills: [
          ["Subtract with pictures - up to {n}", "sub", [5, 10, 20]],
          ["Subtraction facts up to {n}", "sub", [10, 20]],
          ["Complete the subtraction sentence", "sub", 2],
        ]},
        { name: "Geometry and shapes", skills: [
          ["Name the shape", "mcq", 3],
          ["Count sides and corners", "count", 2],
          ["Above and below", "mcq", 2],
        ]},
        { name: "Measurement and data", skills: [
          ["Long and short", "mcq", 2],
          ["Read a picture graph", "count", 2],
          ["Tell time to the hour", "mcq", 2],
        ]},
      ],
      elementary: [
        { name: "Place value", skills: [
          ["Place value up to {n}", "place", [1000, 100000]],
          ["Convert between standard and expanded form", "place", 2],
          ["Round to the nearest {n}", "round", [10, 100, 1000]],
        ]},
        { name: "Addition and subtraction", skills: [
          ["Add numbers up to {n}", "add", [1000, 100000]],
          ["Subtract numbers up to {n}", "sub", [1000, 100000]],
          ["Add and subtract word problems", "add", 2],
        ]},
        { name: "Multiplication", skills: [
          ["Multiplication facts up to {n}", "mul", [10, 12]],
          ["Multiply by {n}-digit numbers", "mul", [1, 2]],
          ["Multiplication word problems", "mul", 2],
        ]},
        { name: "Division", skills: [
          ["Division facts up to {n}", "div", [10, 12]],
          ["Divide larger numbers", "div", 2],
          ["Division word problems", "div", 2],
        ]},
        { name: "Fractions", skills: [
          ["Understand fractions", "mcq", 2],
          ["Add fractions with like denominators", "frac-add", 3],
          ["Subtract fractions with like denominators", "frac-sub", 2],
          ["Compare fractions", "compare", 2],
        ]},
        { name: "Decimals", skills: [
          ["Understand decimals", "mcq", 2],
          ["Add and subtract decimals", "add", 2],
          ["Compare decimals", "compare", 2],
        ]},
        { name: "Geometry and measurement", skills: [
          ["Area of rectangles", "area", 2],
          ["Perimeter", "perimeter", 2],
          ["Classify angles", "mcq", 2],
        ]},
      ],
      middle: [
        { name: "Ratios and proportions", skills: [
          ["Understand ratios", "mcq", 2],
          ["Equivalent ratios", "mul", 2],
          ["Unit rates", "div", 2],
          ["Percent of a number", "percent", 3],
        ]},
        { name: "Integers and rational numbers", skills: [
          ["Add and subtract integers", "int-add", 3],
          ["Multiply and divide integers", "int-mul", 2],
          ["Absolute value", "abs", 2],
        ]},
        { name: "Expressions and equations", skills: [
          ["Evaluate expressions", "eval", 3],
          ["Solve one-step equations", "linear", 3],
          ["Solve two-step equations", "linear2", 3],
        ]},
        { name: "Geometry", skills: [
          ["Area of triangles", "area-tri", 2],
          ["Circumference of circles", "circle", 2],
          ["Volume of prisms", "volume", 2],
        ]},
        { name: "Statistics and probability", skills: [
          ["Mean, median, and mode", "mean", 3],
          ["Simple probability", "mcq", 2],
        ]},
      ],
      high: [
        { name: "Linear equations", skills: [
          ["Solve linear equations", "linear2", 4],
          ["Slope of a line", "slope", 2],
          ["Graph linear functions", "mcq", 2],
        ]},
        { name: "Exponents and polynomials", skills: [
          ["Simplify exponents", "power", 3],
          ["Multiply monomials", "mul", 2],
          ["Add and subtract polynomials", "mcq", 2],
        ]},
        { name: "Quadratics", skills: [
          ["Evaluate quadratic expressions", "eval", 3],
          ["Solve quadratic equations", "quadratic", 2],
          ["The discriminant", "mcq", 2],
        ]},
        { name: "Functions", skills: [
          ["Evaluate functions", "eval", 3],
          ["Domain and range", "mcq", 2],
          ["Function transformations", "mcq", 2],
        ]},
        { name: "Trigonometry and beyond", skills: [
          ["Pythagorean theorem", "pythagorean", 2],
          ["Trigonometric ratios", "mcq", 2],
          ["Logarithms", "mcq", 2],
        ]},
      ],
    },
    ela: {
      early: [
        { name: "Letters and phonics", skills: [
          ["Letter names", "mcq", 3], ["Beginning sounds", "mcq", 3],
          ["Rhyming words", "mcq", 2], ["Short vowel words", "mcq", 2],
        ]},
        { name: "Sight words and vocabulary", skills: [
          ["Choose the sight word", "mcq", 3], ["Picture and word match", "mcq", 2],
          ["Categories", "mcq", 2],
        ]},
        { name: "Grammar basics", skills: [
          ["Identify nouns", "mcq", 2], ["Identify verbs", "mcq", 2],
          ["Complete the sentence", "mcq", 2],
        ]},
      ],
      elementary: [
        { name: "Vocabulary", skills: [
          ["Synonyms", "mcq", 3], ["Antonyms", "mcq", 3],
          ["Homophones", "mcq", 2], ["Prefixes and suffixes", "mcq", 2],
        ]},
        { name: "Grammar and mechanics", skills: [
          ["Nouns and pronouns", "mcq", 2], ["Verb tenses", "mcq", 2],
          ["Subject-verb agreement", "mcq", 2], ["Capitalization", "mcq", 2],
          ["Commas", "mcq", 2],
        ]},
      ],
      middle: [
        { name: "Vocabulary and word study", skills: [
          ["Greek and Latin roots", "mcq", 3], ["Figurative language", "mcq", 3],
          ["Denotation and connotation", "mcq", 2],
        ]},
        { name: "Grammar and usage", skills: [
          ["Phrases and clauses", "mcq", 2], ["Active and passive voice", "mcq", 2],
          ["Punctuation", "mcq", 2], ["Parallel structure", "mcq", 2],
        ]},
      ],
      high: [
        { name: "Advanced vocabulary", skills: [
          ["Domain-specific vocabulary", "mcq", 3], ["Analogies", "mcq", 2],
          ["Word patterns", "mcq", 2],
        ]},
        { name: "Grammar and style", skills: [
          ["Semicolons and colons", "mcq", 2], ["Misplaced modifiers", "mcq", 2],
          ["Formal and informal language", "mcq", 2],
        ]},
      ],
    },
    science: {
      early: [
        { name: "Living things", skills: [["Plants and animals", "mcq", 3], ["Animal needs", "mcq", 2], ["Life cycles", "mcq", 2]]},
        { name: "Earth and sky", skills: [["Weather", "mcq", 2], ["Day and night", "mcq", 2], ["Seasons", "mcq", 2]]},
        { name: "Matter and motion", skills: [["Push and pull", "mcq", 2], ["Materials", "mcq", 2]]},
      ],
      elementary: [
        { name: "Life science", skills: [["Ecosystems", "mcq", 3], ["Adaptations", "mcq", 2], ["Food chains", "mcq", 2]]},
        { name: "Earth science", skills: [["Weather and climate", "mcq", 3], ["Rocks and minerals", "mcq", 2], ["The water cycle", "mcq", 2]]},
        { name: "Physical science", skills: [["States of matter", "mcq", 2], ["Forces and motion", "mcq", 2], ["Energy", "mcq", 2]]},
      ],
      middle: [
        { name: "Biology", skills: [["Cells", "mcq", 3], ["Genetics", "mcq", 2], ["Human body systems", "mcq", 2]]},
        { name: "Chemistry", skills: [["Atoms and elements", "mcq", 3], ["Chemical reactions", "mcq", 2], ["The periodic table", "mcq", 2]]},
        { name: "Physics and Earth", skills: [["Forces and motion", "mcq", 2], ["Energy transfer", "mcq", 2], ["Plate tectonics", "mcq", 2]]},
      ],
      high: [
        { name: "Biology", skills: [["Cell division", "mcq", 3], ["Biomolecules", "mcq", 2], ["Evolution", "mcq", 2]]},
        { name: "Chemistry", skills: [["Chemical bonding", "mcq", 3], ["Stoichiometry", "mcq", 2], ["Acids and bases", "mcq", 2]]},
        { name: "Physics", skills: [["Kinematics", "mcq", 2], ["Newton's laws", "mcq", 2], ["Waves", "mcq", 2]]},
      ],
    },
    social: {
      early: [
        { name: "My community", skills: [["Communities", "mcq", 2], ["Rules and laws", "mcq", 2], ["Maps", "mcq", 2]]},
        { name: "People and history", skills: [["Historical figures", "mcq", 2], ["Holidays", "mcq", 2]]},
      ],
      elementary: [
        { name: "Geography", skills: [["Continents and oceans", "mcq", 3], ["Reading maps", "mcq", 2], ["Landforms", "mcq", 2]]},
        { name: "Civics and government", skills: [["Branches of government", "mcq", 2], ["Rights and responsibilities", "mcq", 2]]},
        { name: "History", skills: [["Early civilizations", "mcq", 2], ["American history", "mcq", 2]]},
      ],
      middle: [
        { name: "World history", skills: [["Ancient history", "mcq", 3], ["The Middle Ages", "mcq", 2], ["World religions", "mcq", 2]]},
        { name: "Geography", skills: [["Physical geography", "mcq", 2], ["Human geography", "mcq", 2]]},
        { name: "Economics", skills: [["Supply and demand", "mcq", 2], ["Money and trade", "mcq", 2]]},
      ],
      high: [
        { name: "U.S. history", skills: [["The American Revolution", "mcq", 3], ["The Civil War", "mcq", 2], ["The 20th century", "mcq", 2]]},
        { name: "Civics and government", skills: [["The Constitution", "mcq", 3], ["Foundations of government", "mcq", 2], ["Elections", "mcq", 2]]},
        { name: "World studies", skills: [["World War I and II", "mcq", 2], ["The Cold War", "mcq", 2]]},
      ],
    },
    spanish: {
      all: [
        { name: "Vocabulary", skills: [["Numbers and time expressions", "mcq", 3], ["Adjectives to describe people", "mcq", 3], ["Food and drink", "mcq", 2], ["Family members", "mcq", 2]]},
        { name: "Grammar", skills: [["Present tense of regular verbs", "mcq", 3], ["Ser and estar", "mcq", 2], ["Gender and articles", "mcq", 2], ["Formality", "mcq", 2]]},
        { name: "Conversation", skills: [["Greetings", "mcq", 2], ["Asking questions", "mcq", 2]]},
      ],
    },
  };

  // ---- Skill code helpers -------------------------------------------------
  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // Expand a template skill entry into one or more skill objects.
  function expandSkill(entry) {
    const [nameTpl, type, arg] = entry;
    const out = [];
    if (Array.isArray(arg)) {
      arg.forEach((val) => {
        out.push({ name: nameTpl.replace("{n}", val), type: type, param: val });
      });
    } else {
      const count = typeof arg === "number" ? arg : 1;
      if (nameTpl.indexOf("{n}") >= 0) {
        for (let i = 0; i < count; i++) out.push({ name: nameTpl.replace("{n}", i + 1), type: type });
      } else if (count > 1) {
        for (let i = 0; i < count; i++) out.push({ name: nameTpl + (count > 1 ? " " + toRoman(i + 1) : ""), type: type });
      } else {
        out.push({ name: nameTpl, type: type });
      }
    }
    return out;
  }

  function toRoman(n) {
    return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n - 1] || String(n);
  }

  // ---- Build tree for a given grade + subject -----------------------------
  // Returns { categories: [{ name, skills: [{ code, name, type, param }] }] }
  const _cache = {};
  function buildGradeSubject(gradeId, subjectId) {
    const key = gradeId + "|" + subjectId;
    if (_cache[key]) return _cache[key];

    const grade = GRADES.find((g) => g.id === gradeId);
    if (!grade || grade.subjects.indexOf(subjectId) < 0) {
      _cache[key] = { categories: [] };
      return _cache[key];
    }
    const band = subjectId === "spanish" ? "all" : grade.band;
    const templates = (T[subjectId] && T[subjectId][band]) || [];

    // Letter codes A, B, C ... like IXL skill codes.
    let letterIdx = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const categories = templates.map((cat) => {
      let num = 0;
      const skills = [];
      cat.skills.forEach((entry) => {
        expandSkill(entry).forEach((sk) => {
          num += 1;
          const letter = letters[letterIdx] || "Z";
          skills.push({
            code: letter + "." + num,
            name: sk.name,
            type: sk.type,
            param: sk.param,
            id: (slug(sk.name) + "-" + letter + num).toLowerCase(),
          });
        });
      });
      letterIdx += 1;
      return { name: cat.name, skills: skills };
    });

    // Inject the exact reading-comprehension story chapters for Language arts.
    if (subjectId === "ela" && global.READING && global.READING.getChapters) {
      global.READING.getChapters(gradeId).forEach((chap) => {
        const letter = letters[letterIdx] || "Z";
        letterIdx += 1;
        const skills = chap.stories.map((story, si) => ({
          code: letter + "." + (si + 1),
          name: story.title,
          type: "reading",
          story: story,
          id: (slug(story.title) + "-" + letter + (si + 1)).toLowerCase(),
        }));
        categories.push({ name: chap.name, skills: skills });
      });
    }

    _cache[key] = { categories: categories };
    return _cache[key];
  }

  function countSkills(gradeId, subjectId) {
    const data = buildGradeSubject(gradeId, subjectId);
    return data.categories.reduce((sum, c) => sum + c.skills.length, 0);
  }

  function findSkill(gradeId, subjectId, skillId) {
    const data = buildGradeSubject(gradeId, subjectId);
    for (const cat of data.categories) {
      for (const sk of cat.skills) {
        if (sk.id === skillId) return { skill: sk, category: cat };
      }
    }
    return null;
  }

  global.CURRICULUM = {
    SUBJECTS: SUBJECTS,
    GRADES: GRADES,
    buildGradeSubject: buildGradeSubject,
    countSkills: countSkills,
    findSkill: findSkill,
    getGrade: (id) => GRADES.find((g) => g.id === id),
    getSubject: (id) => SUBJECTS[id],
  };
})(window);
