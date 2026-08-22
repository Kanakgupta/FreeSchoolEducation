/* FreeSchoolEducation - Reading comprehension
 * Uses the exact story catalog from ReadingStories (reading-stories.js),
 * organized by category, and fits it to the skill/leaf design.
 *
 * getChapters(gradeId) -> [{ name, stories:[{ id, title, paragraphs:[...], questions:[[q,correct,...],...] }] }]
 *
 * Mapping:
 *   grade-3, grade-4        -> grade-4 collections (short passages)   [exact]
 *   grade-5 and up          -> grade-5 collections (long passages)    [exact]
 *   pre-k, k, grade-1, 2    -> simple authored short stories (age-appropriate)
 */
(function (global) {
  "use strict";

  // Grade-4 chapter titles map to catalog keys (short passages).
  const G4_CHAPTERS = [
    ["Science Inventions", "inventions"],
    ["Great Presidents and People", "presidents"],
    ["Great Business Builders", "business"],
    ["Historical Events", "history"],
  ];
  // Grade-5 chapter titles map to catalog keys (long passages).
  const G5_CHAPTERS = [
    ["World-Changing Inventions", "inventions"],
    ["Presidents and American Change", "presidents"],
    ["American History in Motion", "history"],
    ["Business Ideas That Changed Daily Life", "business"],
  ];

  // Simple authored stories for the youngest grades.
  const EARLY = {
    early: [
      { title: "The Little Seed", paragraphs: [
        "A tiny seed sat in the warm brown dirt. The sun was bright. The rain came down soft and cool.",
        "Soon a small green sprout came up. It grew taller and taller. One day it was a big yellow flower!"],
        questions: [
          ["Where did the seed sit?", "In the dirt", "In a cup", "On a bed", "In the sky"],
          ["What came down soft and cool?", "The rain", "A ball", "A dog", "The moon"],
          ["What color was the flower?", "Yellow", "Blue", "Purple", "Black"],
          ["What did the seed become?", "A flower", "A rock", "A bird", "A fish"],
          ["What helped the seed grow?", "Sun and rain", "Snow and ice", "Wind and sand", "Toys and games"]] },
      { title: "Max the Dog", paragraphs: [
        "Max is a brown dog. He likes to run and play in the park.",
        "Max has a red ball. He runs fast to get the ball. Then he brings it back to his friend."],
        questions: [
          ["What color is Max?", "Brown", "White", "Green", "Pink"],
          ["Where does Max play?", "In the park", "In a boat", "On the moon", "In a box"],
          ["What does Max have?", "A red ball", "A blue hat", "A green book", "A yellow cup"],
          ["What does Max do with the ball?", "Brings it back", "Eats it", "Hides it", "Throws it away"],
          ["How does Max run for the ball?", "Fast", "Slow", "Backwards", "He does not run"]] },
      { title: "A Day at the Beach", paragraphs: [
        "Mia went to the beach with her mom. The sand was warm on her feet.",
        "Mia made a sandcastle. A wave came and washed it away. Mia just laughed and made a new one."],
        questions: [
          ["Who did Mia go with?", "Her mom", "Her dog", "Her teacher", "Alone"],
          ["How did the sand feel?", "Warm", "Cold", "Wet and icy", "Hard like rock"],
          ["What did Mia make?", "A sandcastle", "A cake", "A kite", "A boat"],
          ["What washed the castle away?", "A wave", "The wind", "A bird", "A car"],
          ["How did Mia feel when the castle washed away?", "Happy \u2014 she laughed", "Angry", "Scared", "Sleepy"]] },
    ],
    early2: [
      { title: "The Lost Kitten", paragraphs: [
        "One rainy day, Sam heard a small cry near his house. He looked under the steps and found a wet kitten.",
        "Sam wrapped the kitten in a soft towel. He gave it warm milk. The kitten stopped shaking and began to purr.",
        "Sam put up signs around the block. The next day, a girl named Ana knocked on the door. The kitten was hers! Sam was happy to help."],
        questions: [
          ["What did Sam hear?", "A small cry", "A loud horn", "A song", "A bell"],
          ["Where did Sam find the kitten?", "Under the steps", "In a tree", "On the roof", "In a car"],
          ["What did Sam give the kitten?", "Warm milk", "Cold water", "A toy", "A book"],
          ["How did Sam try to find the owner?", "He put up signs", "He called the police", "He waited quietly", "He kept it a secret"],
          ["Why was Sam happy at the end?", "He helped return the kitten", "He kept the kitten", "It stopped raining", "He found money"]] },
      { title: "Grandpa's Garden", paragraphs: [
        "Every summer, Leo visits his grandpa's garden. Grandpa grows tomatoes, beans, and bright sunflowers.",
        "Grandpa taught Leo to pull weeds and water the plants each morning. Leo learned that plants need care every day, not just once.",
        "At the end of summer, they picked baskets of vegetables. Grandpa said the best part of a garden is sharing what you grow."],
        questions: [
          ["When does Leo visit the garden?", "Every summer", "Every winter", "Once a year in fall", "Never"],
          ["What grows in the garden?", "Tomatoes, beans, and sunflowers", "Only roses", "Apples and pears", "Cactus"],
          ["What chores did Leo learn?", "Pulling weeds and watering", "Cooking and cleaning", "Painting the fence", "Feeding chickens"],
          ["What did Leo learn about plants?", "They need care every day", "They grow with no help", "They only need one drink", "They grow indoors best"],
          ["What did Grandpa say is the best part of a garden?", "Sharing what you grow", "Winning a prize", "Selling everything", "Keeping it private"]] },
    ],
  };

  function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  // Convert a ReadingStories story ({id,title,passage,questions}) to leaf shape.
  function toStory(s, i) {
    return {
      id: s.id || slugify(s.title) + "-" + i,
      title: s.title,
      paragraphs: s.passage.split("\n\n"),
      questions: s.questions,
    };
  }
  function toEarlyStory(s, i) {
    return { id: slugify(s.title) + "-" + i, title: s.title, paragraphs: s.paragraphs, questions: s.questions };
  }

  const EARLY_BAND = { "pre-k": "early", "kindergarten": "early", "grade-1": "early2", "grade-2": "early2" };

  const _cache = {};
  function getChapters(gradeId) {
    if (_cache[gradeId]) return _cache[gradeId];
    let chapters = [];
    const RS = global.ReadingStories;

    if (EARLY_BAND[gradeId]) {
      const list = EARLY[EARLY_BAND[gradeId]] || [];
      chapters = [{ name: "Reading comprehension", stories: list.map(toEarlyStory) }];
    } else if (RS) {
      const useG5 = ["grade-3", "grade-4"].indexOf(gradeId) < 0; // grade-5 and up use long passages
      const map = useG5 ? G5_CHAPTERS : G4_CHAPTERS;
      const source = useG5 ? RS.grade5Collections : RS.collections;
      chapters = map.map(([name, key]) => ({
        name: name,
        stories: (source[key] || []).map(toStory),
      }));
    }
    _cache[gradeId] = chapters;
    return chapters;
  }

  global.READING = { getChapters: getChapters };
})(window);
