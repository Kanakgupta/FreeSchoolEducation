/* FreeSchoolEducation - Reading comprehension
 * Uses the exact story catalog from ReadingStories (reading-stories.js).
 * Every chapter is grouped under a "Reading comprehension" label, and each
 * grade shows a DIFFERENT selection so content is not repeated across grades.
 *
 * getChapters(gradeId) -> [{ name, stories:[{ id, title, paragraphs:[...], questions:[[q,correct,...],...] }] }]
 *
 *   grade-4                     -> full grade-4 collections (short)  [exact]
 *   grade-5                     -> full grade-5 collections (long)   [exact]
 *   grade-3, 6, 7, 8, 9-12      -> a distinct slice of the catalog per grade
 *   pre-k, k, grade-1, grade-2  -> age-appropriate authored stories (distinct per grade)
 */
(function (global) {
  "use strict";

  const PREFIX = "Reading comprehension \u00B7 ";

  // Chapter display titles mapped to catalog keys.
  const G4_TITLES = [["Science Inventions", "inventions"], ["Great Presidents and People", "presidents"], ["Great Business Builders", "business"], ["Historical Events", "history"]];
  const G5_TITLES = [["World-Changing Inventions", "inventions"], ["Presidents and American Change", "presidents"], ["American History in Motion", "history"], ["Business Ideas That Changed Daily Life", "business"]];

  // Distinct catalog window per grade so no two grades show the same list.
  const SLICE = {
    "grade-3":     { variant: "short", offset: 40, count: 10 },
    "algebra-1":   { variant: "long",  offset: 2,  count: 10 },
    "geometry":    { variant: "long",  offset: 7,  count: 10 },
    "algebra-2":   { variant: "long",  offset: 17, count: 10 },
    "precalculus": { variant: "long",  offset: 27, count: 10 },
  };

  // ---- Age-appropriate authored stories for the youngest grades ----------
  const S = {
    seed: { title: "The Little Seed", paragraphs: ["A tiny seed sat in the warm brown dirt. The sun was bright. The rain came down soft and cool.", "Soon a small green sprout came up. It grew taller and taller. One day it was a big yellow flower!"], questions: [["Where did the seed sit?", "In the dirt", "In a cup", "On a bed", "In the sky"], ["What came down soft and cool?", "The rain", "A ball", "A dog", "The moon"], ["What color was the flower?", "Yellow", "Blue", "Purple", "Black"], ["What did the seed become?", "A flower", "A rock", "A bird", "A fish"], ["What helped the seed grow?", "Sun and rain", "Snow and ice", "Wind and sand", "Toys and games"]] },
    max: { title: "Max the Dog", paragraphs: ["Max is a brown dog. He likes to run and play in the park.", "Max has a red ball. He runs fast to get the ball. Then he brings it back to his friend."], questions: [["What color is Max?", "Brown", "White", "Green", "Pink"], ["Where does Max play?", "In the park", "In a boat", "On the moon", "In a box"], ["What does Max have?", "A red ball", "A blue hat", "A green book", "A yellow cup"], ["What does Max do with the ball?", "Brings it back", "Eats it", "Hides it", "Throws it away"], ["How does Max run for the ball?", "Fast", "Slow", "Backwards", "He does not run"]] },
    beach: { title: "A Day at the Beach", paragraphs: ["Mia went to the beach with her mom. The sand was warm on her feet.", "Mia made a sandcastle. A wave came and washed it away. Mia just laughed and made a new one."], questions: [["Who did Mia go with?", "Her mom", "Her dog", "Her teacher", "Alone"], ["How did the sand feel?", "Warm", "Cold", "Wet and icy", "Hard like rock"], ["What did Mia make?", "A sandcastle", "A cake", "A kite", "A boat"], ["What washed the castle away?", "A wave", "The wind", "A bird", "A car"], ["How did Mia feel?", "Happy \u2014 she laughed", "Angry", "Scared", "Sleepy"]] },
    kite: { title: "The Red Kite", paragraphs: ["Ben got a red kite for his birthday. He ran to the park with his dad.", "The wind lifted the kite high into the blue sky. Ben held the string tight and smiled."], questions: [["What did Ben get?", "A red kite", "A bike", "A ball", "A book"], ["Where did Ben go?", "The park", "School", "The store", "The beach"], ["Who went with Ben?", "His dad", "His mom", "His dog", "A friend"], ["What lifted the kite?", "The wind", "A bird", "A car", "The rain"], ["How did Ben feel?", "Happy \u2014 he smiled", "Sad", "Angry", "Scared"]] },
    kitten: { title: "The Lost Kitten", paragraphs: ["One rainy day, Sam heard a small cry near his house. He looked under the steps and found a wet kitten.", "Sam wrapped the kitten in a soft towel and gave it warm milk. The kitten stopped shaking and began to purr.", "Sam put up signs around the block. The next day, a girl named Ana knocked on the door. The kitten was hers! Sam was happy to help."], questions: [["What did Sam hear?", "A small cry", "A loud horn", "A song", "A bell"], ["Where did Sam find the kitten?", "Under the steps", "In a tree", "On the roof", "In a car"], ["What did Sam give the kitten?", "Warm milk", "Cold water", "A toy", "A book"], ["How did Sam try to find the owner?", "He put up signs", "He called the police", "He waited quietly", "He kept it a secret"], ["Why was Sam happy at the end?", "He helped return the kitten", "He kept the kitten", "It stopped raining", "He found money"]] },
    snowman: { title: "The Snowman's Hat", paragraphs: ["On a cold morning, Lily built a snowman. She gave him two stone eyes and a carrot nose.", "The snowman needed a hat. Lily ran inside and found her dad's old blue hat. Now the snowman looked perfect!"], questions: [["What did Lily build?", "A snowman", "A sandcastle", "A fort", "A cake"], ["What did she use for eyes?", "Two stones", "Two coins", "Two leaves", "Two buttons"], ["What was the nose?", "A carrot", "A stick", "A stone", "A flower"], ["What did the snowman need?", "A hat", "Shoes", "A scarf", "Gloves"], ["Whose hat did she find?", "Her dad's", "Her mom's", "Her own", "A friend's"]] },
    garden: { title: "Grandpa's Garden", paragraphs: ["Every summer, Leo visits his grandpa's garden. Grandpa grows tomatoes, beans, and bright sunflowers.", "Grandpa taught Leo to pull weeds and water the plants each morning. Leo learned that plants need care every day, not just once.", "At the end of summer, they picked baskets of vegetables. Grandpa said the best part of a garden is sharing what you grow."], questions: [["When does Leo visit the garden?", "Every summer", "Every winter", "Once in fall", "Never"], ["What grows in the garden?", "Tomatoes, beans, and sunflowers", "Only roses", "Apples and pears", "Cactus"], ["What chores did Leo learn?", "Pulling weeds and watering", "Cooking and cleaning", "Painting the fence", "Feeding chickens"], ["What did Leo learn about plants?", "They need care every day", "They grow with no help", "They only need one drink", "They grow indoors best"], ["What is the best part of a garden?", "Sharing what you grow", "Winning a prize", "Selling everything", "Keeping it private"]] },
    pet: { title: "The Class Pet", paragraphs: ["Room 5 had a class pet, a small brown hamster named Nibbles. Each day a different student filled his bowl and gave him fresh water.", "On Friday it was Priya's turn. She cleaned his cage and let him run on his wheel. Nibbles squeaked happily.", "Taking care of a pet, Priya learned, means doing a small job every single day."], questions: [["What kind of pet was Nibbles?", "A hamster", "A fish", "A bird", "A cat"], ["What did students do each day?", "Fill his bowl and give water", "Take him home", "Paint his cage", "Feed the class"], ["Whose turn was it on Friday?", "Priya's", "Ben's", "Sam's", "Mia's"], ["What did Nibbles run on?", "His wheel", "A track", "The floor", "A rope"], ["What did Priya learn?", "Caring for a pet means a daily job", "Pets are easy", "Pets need nothing", "Pets clean themselves"]] },
  };
  const EARLY = {
    "pre-k": [S.seed, S.max],
    "kindergarten": [S.beach, S.kite],
    "grade-1": [S.kitten, S.snowman],
    "grade-2": [S.garden, S.pet],
  };

  function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function toStory(s, i) { return { id: s.id || slugify(s.title) + "-" + i, title: s.title, paragraphs: s.passage.split("\n\n"), questions: s.questions }; }
  function toEarly(s, i) { return { id: slugify(s.title) + "-" + i, title: s.title, paragraphs: s.paragraphs, questions: s.questions }; }
  function slice(arr, offset, count) { const out = []; if (!arr || !arr.length) return out; const n = Math.min(count, arr.length); for (let i = 0; i < n; i++) out.push(arr[(offset + i) % arr.length]); return out; }

  const _cache = {};
  function getChapters(gradeId) {
    if (_cache[gradeId]) return _cache[gradeId];
    let chapters = [];
    const RS = global.ReadingStories;
    const MID = global.ReadingMiddle;

    if (EARLY[gradeId]) {
      chapters = [{ name: "Reading comprehension", stories: EARLY[gradeId].map(toEarly) }];
    } else if (MID && MID[gradeId]) {
      // Grades 6-8: detailed, topic-specific passages with more questions.
      chapters = MID[gradeId].map((chap) => ({
        name: PREFIX + chap.name,
        stories: chap.stories.map((s, i) => ({ id: slugify(s.title) + "-" + i, title: s.title, paragraphs: s.paragraphs, questions: s.questions })),
      }));
    } else if (RS && gradeId === "grade-4") {
      chapters = G4_TITLES.map(([title, key]) => ({ name: PREFIX + title, stories: (RS.collections[key] || []).map(toStory) }));
    } else if (RS && gradeId === "grade-5") {
      chapters = G5_TITLES.map(([title, key]) => ({ name: PREFIX + title, stories: (RS.grade5Collections[key] || []).map(toStory) }));
    } else if (RS && SLICE[gradeId]) {
      const cfg = SLICE[gradeId];
      const titles = cfg.variant === "long" ? G5_TITLES : G4_TITLES;
      const source = cfg.variant === "long" ? RS.grade5Collections : RS.collections;
      chapters = titles.map(([title, key]) => ({ name: PREFIX + title, stories: slice(source[key], cfg.offset, cfg.count).map(toStory) }));
    }
    _cache[gradeId] = chapters;
    return chapters;
  }

  global.READING = { getChapters: getChapters };
})(window);
