/* FreeSchoolEducation - Reading comprehension
 * Real reading passages with comprehension questions for every grade band.
 * getPassages(gradeId) -> [{ title, paragraphs:[...], questions:[[q,correct,d1,d2,d3], ...] }]
 * Questions are ordered easy -> hard so the practice ramp still applies.
 */
(function (global) {
  "use strict";

  // Each band has a pool of passages. Grades map to a band.
  const BAND_OF = {
    "pre-k": "early", "kindergarten": "early", "grade-1": "early", "grade-2": "early2",
    "grade-3": "elem", "grade-4": "elem", "grade-5": "elem2",
    "grade-6": "middle", "grade-7": "middle", "grade-8": "middle2",
    "algebra-1": "high", "geometry": "high", "algebra-2": "high", "precalculus": "high", "calculus": "high",
  };

  const POOLS = {
    early: [
      {
        title: "The Little Seed",
        paragraphs: [
          "A tiny seed sat in the warm brown dirt. The sun was bright. The rain came down soft and cool.",
          "Soon a small green sprout came up. It grew taller and taller. One day it was a big yellow flower!",
        ],
        questions: [
          ["Where did the seed sit?", "In the dirt", "In a cup", "On a bed", "In the sky"],
          ["What came down soft and cool?", "The rain", "A ball", "A dog", "The moon"],
          ["What color was the flower?", "Yellow", "Blue", "Purple", "Black"],
          ["What did the seed become?", "A flower", "A rock", "A bird", "A fish"],
          ["What helped the seed grow?", "Sun and rain", "Snow and ice", "Wind and sand", "Toys and games"],
        ],
      },
      {
        title: "Max the Dog",
        paragraphs: [
          "Max is a brown dog. He likes to run and play in the park.",
          "Max has a red ball. He runs fast to get the ball. Then he brings it back to his friend.",
        ],
        questions: [
          ["What color is Max?", "Brown", "White", "Green", "Pink"],
          ["Where does Max play?", "In the park", "In a boat", "On the moon", "In a box"],
          ["What does Max have?", "A red ball", "A blue hat", "A green book", "A yellow cup"],
          ["What does Max do with the ball?", "Brings it back", "Eats it", "Hides it", "Throws it away"],
          ["How does Max run for the ball?", "Fast", "Slow", "Backwards", "He does not run"],
        ],
      },
      {
        title: "A Day at the Beach",
        paragraphs: [
          "Mia went to the beach with her mom. The sand was warm on her feet.",
          "Mia made a sandcastle. A wave came and washed it away. Mia just laughed and made a new one.",
        ],
        questions: [
          ["Who did Mia go with?", "Her mom", "Her dog", "Her teacher", "Alone"],
          ["How did the sand feel?", "Warm", "Cold", "Wet and icy", "Hard like rock"],
          ["What did Mia make?", "A sandcastle", "A cake", "A kite", "A boat"],
          ["What washed the castle away?", "A wave", "The wind", "A bird", "A car"],
          ["How did Mia feel when the castle washed away?", "Happy \u2014 she laughed", "Angry", "Scared", "Sleepy"],
        ],
      },
    ],
    early2: [
      {
        title: "The Lost Kitten",
        paragraphs: [
          "One rainy day, Sam heard a small cry near his house. He looked under the steps and found a wet kitten.",
          "Sam wrapped the kitten in a soft towel. He gave it warm milk. The kitten stopped shaking and began to purr.",
          "Sam put up signs around the block. The next day, a girl named Ana knocked on the door. The kitten was hers! Sam was happy to help.",
        ],
        questions: [
          ["What did Sam hear?", "A small cry", "A loud horn", "A song", "A bell"],
          ["Where did Sam find the kitten?", "Under the steps", "In a tree", "On the roof", "In a car"],
          ["What did Sam give the kitten?", "Warm milk", "Cold water", "A toy", "A book"],
          ["How did Sam try to find the owner?", "He put up signs", "He called the police", "He waited quietly", "He kept it a secret"],
          ["Why was Sam happy at the end?", "He helped return the kitten", "He kept the kitten", "It stopped raining", "He found money"],
        ],
      },
      {
        title: "Grandpa's Garden",
        paragraphs: [
          "Every summer, Leo visits his grandpa's garden. Grandpa grows tomatoes, beans, and bright sunflowers.",
          "Grandpa taught Leo to pull weeds and water the plants each morning. Leo learned that plants need care every day, not just once.",
          "At the end of summer, they picked baskets of vegetables. Grandpa said the best part of a garden is sharing what you grow.",
        ],
        questions: [
          ["When does Leo visit the garden?", "Every summer", "Every winter", "Once a year in fall", "Never"],
          ["What grows in the garden?", "Tomatoes, beans, and sunflowers", "Only roses", "Apples and pears", "Cactus"],
          ["What chores did Leo learn?", "Pulling weeds and watering", "Cooking and cleaning", "Painting the fence", "Feeding chickens"],
          ["What did Leo learn about plants?", "They need care every day", "They grow with no help", "They only need one drink", "They grow indoors best"],
          ["What did Grandpa say is the best part of a garden?", "Sharing what you grow", "Winning a prize", "Selling everything", "Keeping it private"],
        ],
      },
    ],
    elem: [
      {
        title: "The Light Bulb",
        paragraphs: [
          "For a long time people used candles and oil lamps to see after dark. These lights were dim, smoky, and sometimes dangerous.",
          "Thomas Edison and his team wanted a safer light. They tested hundreds of materials to find a thin thread, called a filament, that would glow for a long time without burning up quickly.",
          "After many failures, they found a filament that lasted. The electric light bulb changed how people lived and worked. Cities could stay bright at night, and factories and homes became safer.",
        ],
        questions: [
          ["What did people use for light before the bulb?", "Candles and oil lamps", "Televisions", "Flashlights", "Computers"],
          ["What is a filament?", "A thin thread that glows", "A type of candle", "A glass jar", "A battery"],
          ["Who worked to improve the light bulb?", "Thomas Edison and his team", "The Wright brothers", "Rosa Parks", "Galileo"],
          ["How did Edison's team find a good filament?", "By testing many materials", "By guessing once", "By copying a book", "By waiting"],
          ["What is the main idea of the passage?", "Careful testing led to a lasting electric light", "Candles are the best light", "Edison gave up quickly", "Cities should be dark at night"],
        ],
      },
      {
        title: "Harriet Tubman",
        paragraphs: [
          "Harriet Tubman was born into slavery, but she escaped to freedom in the North. She could have stayed safe, but she chose to go back and help others.",
          "Again and again, Tubman guided enslaved people along secret routes known as the Underground Railroad. She traveled at night and used clever signals to avoid being caught.",
          "Tubman risked her own freedom many times. Her courage helped many people reach safety, and today she is remembered as a hero.",
        ],
        questions: [
          ["What did Harriet Tubman do after escaping?", "Went back to help others", "Moved far away and hid", "Stopped traveling", "Wrote only books"],
          ["What was the Underground Railroad?", "Secret routes to freedom", "A train under the ground", "A type of factory", "A city park"],
          ["When did Tubman travel?", "At night", "Only at noon", "Once a year", "During storms only"],
          ["What did Tubman risk?", "Her own freedom", "Nothing at all", "Her books", "Her garden"],
          ["Why is Tubman remembered as a hero?", "Her courage helped many reach safety", "She built railroads", "She was never in danger", "She stayed hidden"],
        ],
      },
      {
        title: "The Water Cycle",
        paragraphs: [
          "Water is always moving in a pattern called the water cycle. The sun heats water in oceans and lakes, turning it into an invisible gas called water vapor. This step is evaporation.",
          "High in the sky the vapor cools and forms tiny drops that gather into clouds. This is condensation. When the drops grow heavy, they fall as rain or snow, which is precipitation.",
          "The fallen water flows into rivers and back to the ocean, and the cycle begins again. The water cycle brings fresh water to plants, animals, and people.",
        ],
        questions: [
          ["What powers the water cycle?", "The sun", "The wind alone", "Cars", "Electric lights"],
          ["What is evaporation?", "Water turning into vapor", "Rain falling", "Clouds cooling", "Rivers freezing"],
          ["How do clouds form?", "Vapor cools and condenses", "Rain freezes on the ground", "Wind pushes dust", "The sun sets"],
          ["What is precipitation?", "Rain or snow falling", "Water heating up", "Vapor rising", "Rivers drying"],
          ["What is the main idea?", "Water moves in a repeating cycle", "Rain only falls in winter", "Oceans never change", "Clouds are made of dust"],
        ],
      },
    ],
    elem2: [
      {
        title: "The Printing Press",
        paragraphs: [
          "Before the 1400s, books were copied by hand. This slow work meant books were rare and expensive, so few people owned them or learned to read well.",
          "Johannes Gutenberg developed a machine with movable metal letters. He could arrange the letters, cover them with ink, and press them onto paper. This press could make many copies of a page quickly.",
          "As books became cheaper and more common, more people learned to read. New ideas about science, government, and religion spread across many lands. The printing press changed the world by sharing knowledge widely.",
        ],
        questions: [
          ["How were books made before the printing press?", "Copied by hand", "Printed by machines", "Typed on computers", "Not made at all"],
          ["Who developed the movable-type press?", "Johannes Gutenberg", "Thomas Edison", "Isaac Newton", "Marie Curie"],
          ["Why were early books rare?", "Copying by hand was slow and costly", "No one wanted them", "Paper did not exist", "They were banned"],
          ["What effect did cheaper books have?", "More people learned to read", "Fewer people read", "Ideas stopped spreading", "Schools closed"],
          ["Which statement is best supported by the passage?", "Sharing knowledge widely can change the world", "Handwriting is faster than printing", "Books should stay rare", "Reading did not matter"],
        ],
      },
      {
        title: "Franklin D. Roosevelt and the New Deal",
        paragraphs: [
          "During the Great Depression of the 1930s, millions of Americans lost their jobs and savings. Many families struggled to afford food and housing.",
          "President Franklin D. Roosevelt introduced a set of programs called the New Deal. These programs created jobs building roads, parks, and bridges, and they set new rules to make banks safer.",
          "The New Deal did not end all hardship, but it offered relief and hope. It also changed how many people viewed the government's role in helping citizens during hard times.",
        ],
        questions: [
          ["What was the Great Depression?", "A time when many lost jobs and savings", "A famous building", "A type of bank", "A holiday"],
          ["What was the New Deal?", "A set of relief and job programs", "A single new law", "A war", "A city"],
          ["What did New Deal jobs build?", "Roads, parks, and bridges", "Only houses", "Spaceships", "Nothing"],
          ["Did the New Deal end all hardship?", "No, but it offered relief and hope", "Yes, completely", "It made things worse only", "It had no effect"],
          ["Which idea is best supported?", "Government programs can help citizens in hard times", "Depressions never end", "Banks should have no rules", "Jobs do not help families"],
        ],
      },
    ],
    middle: [
      {
        title: "The Internet",
        paragraphs: [
          "The internet is a global network that links billions of computers so they can share information. It grew out of a research project designed to let separate computer networks communicate with one another.",
          "Engineers agreed on shared rules, called protocols, that let very different machines exchange data reliably. Because no single company owns the whole system, information can travel along many possible paths, which makes the network hard to shut down.",
          "The internet transformed how people learn, work, and connect. Yet it also raised new questions about privacy, accuracy, and who can access this powerful tool. Understanding both its benefits and its risks helps people use it wisely.",
        ],
        questions: [
          ["What is the internet?", "A global network linking computers", "A single powerful computer", "A television channel", "A type of phone"],
          ["What are protocols?", "Shared rules for exchanging data", "Physical cables only", "Company names", "Passwords"],
          ["Why is the network hard to shut down?", "Data can travel many paths", "One company controls it", "It uses no rules", "It is very small"],
          ["What new questions did the internet raise?", "Privacy, accuracy, and access", "Only the price of computers", "How to build roads", "Nothing new"],
          ["What is the author's main point?", "Understanding benefits and risks helps people use it wisely", "The internet has no risks", "Networks should be secret", "Computers cannot share data"],
        ],
      },
      {
        title: "Cells: The Building Blocks of Life",
        paragraphs: [
          "Every living thing is made of cells, the smallest units that can carry out the processes of life. Some organisms are a single cell, while others, like humans, contain trillions.",
          "Cells take in nutrients, release energy, and remove waste. Inside a cell, tiny structures called organelles each do a specific job. The nucleus, for example, stores instructions that direct the cell's activities.",
          "Cells also grow and divide to make new cells, which lets living things develop and repair injuries. Studying cells helps scientists understand health, disease, and how life works.",
        ],
        questions: [
          ["What are cells?", "The smallest units of life", "Types of minerals", "Large organs", "Nonliving crystals"],
          ["What do organelles do?", "Each does a specific job in the cell", "They store water only", "They are outside the cell", "They do nothing"],
          ["What does the nucleus store?", "Instructions that direct the cell", "Extra food", "Waste", "Water"],
          ["Why do cells divide?", "To grow and repair injuries", "To shrink the body", "To stop growth", "For no reason"],
          ["What is the main idea?", "Cells carry out the processes of life", "Only humans have cells", "Cells never change", "Organelles are useless"],
        ],
      },
    ],
    middle2: [
      {
        title: "The Civil Rights Movement",
        paragraphs: [
          "In the mid-1900s, laws in many parts of the United States enforced segregation, keeping Black Americans apart from white Americans in schools, buses, and other public places. These laws denied equal rights and dignity.",
          "Activists challenged segregation through the courts, community organizing, and peaceful protest. Court cases such as Brown v. Board of Education, boycotts like the Montgomery Bus Boycott, and marches drew national attention.",
          "Their persistent efforts led to landmark laws, including the Civil Rights Act of 1964 and the Voting Rights Act of 1965. Progress was hard-won and remains ongoing, but the movement reshaped the nation's understanding of equality.",
        ],
        questions: [
          ["What did segregation laws do?", "Kept Black and white Americans apart", "Made schools free", "Ended slavery", "Built new buses"],
          ["How did activists challenge segregation?", "Courts, organizing, and peaceful protest", "Only by waiting", "By ignoring it", "With violence alone"],
          ["Which court case is named?", "Brown v. Board of Education", "The Montgomery Trial", "The Voting Case", "The Bus Law"],
          ["What laws resulted from the movement?", "The Civil Rights Act and Voting Rights Act", "Only local rules", "No laws changed", "Segregation laws"],
          ["Which statement is best supported?", "Persistent, organized effort can reshape a nation", "Change happened instantly", "Protest never works", "Laws cannot protect rights"],
        ],
      },
      {
        title: "Supply and Demand",
        paragraphs: [
          "In a market, the price of a good is influenced by supply, the amount available, and demand, how much people want it. When many buyers want a scarce item, its price tends to rise.",
          "When sellers produce more than buyers want, prices often fall as sellers compete to attract customers. Prices act like signals, guiding producers about what to make and consumers about what to buy.",
          "Real markets are more complex, affected by costs, competition, and events in the world. Still, the basic idea of supply and demand helps explain many of the price changes people see every day.",
        ],
        questions: [
          ["What is demand?", "How much people want a good", "The amount available", "The cost to make it", "A type of tax"],
          ["What happens when many buyers want a scarce item?", "The price tends to rise", "The price falls", "Nothing changes", "The item disappears"],
          ["Why might prices fall?", "Sellers make more than buyers want", "Buyers want more", "Supply runs out", "Costs rise sharply"],
          ["What do prices act like?", "Signals guiding producers and consumers", "Random numbers", "Fixed rules", "Government orders"],
          ["What is the author's main point?", "Supply and demand help explain price changes", "Prices never change", "Only costs set prices", "Markets are simple and fixed"],
        ],
      },
    ],
    high: [
      {
        title: "Artificial Intelligence and Responsibility",
        paragraphs: [
          "Artificial intelligence, or AI, refers to computer systems that find patterns in large amounts of data and use them to make predictions or decisions. AI now helps translate languages, recommend content, and support medical diagnosis.",
          "These systems learn from examples rather than following only fixed instructions. That power comes with limits: an AI trained on biased or incomplete data can produce unfair or inaccurate results, and it cannot truly understand meaning the way a person does.",
          "Because AI increasingly affects jobs, privacy, and important decisions, its designers and users share responsibility. Evaluating an AI system means asking what data it learned from, who benefits, what could go wrong, and how humans stay accountable for the outcomes.",
        ],
        questions: [
          ["What does AI do?", "Finds patterns in data to make predictions", "Only stores files", "Replaces all electricity", "Prints books"],
          ["How do these systems learn?", "From examples, not only fixed rules", "By memorizing one page", "Without any data", "By guessing randomly"],
          ["What problem can biased data cause?", "Unfair or inaccurate results", "Faster computers", "Perfect fairness", "Cheaper data"],
          ["According to the passage, who is responsible for AI's effects?", "Its designers and users", "No one", "Only governments", "The computers themselves"],
          ["Which claim is best supported by the passage?", "Powerful tools require careful, responsible evaluation", "AI understands meaning like people", "AI has no limits", "Data quality does not matter"],
        ],
      },
      {
        title: "Rhetoric and Persuasion",
        paragraphs: [
          "Since ancient times, speakers and writers have used rhetoric, the art of persuasion, to influence audiences. Classical thinkers described three appeals: ethos, an appeal to credibility; pathos, an appeal to emotion; and logos, an appeal to logic.",
          "A strong argument often blends these appeals. A writer might establish expertise (ethos), share a moving story (pathos), and present evidence and reasoning (logos). The balance depends on the audience and purpose.",
          "Careful readers analyze these techniques rather than simply reacting to them. By identifying an author's appeals and evidence, a reader can judge whether an argument is sound or whether it relies on emotion in place of proof.",
        ],
        questions: [
          ["What is rhetoric?", "The art of persuasion", "A type of poem", "A grammar rule", "A kind of story"],
          ["What does ethos appeal to?", "Credibility", "Emotion", "Logic", "Rhythm"],
          ["What does pathos appeal to?", "Emotion", "Credibility", "Logic", "Grammar"],
          ["Why do strong arguments blend appeals?", "To suit the audience and purpose", "To confuse readers", "To avoid evidence", "To be longer"],
          ["What is the author's main point?", "Analyzing appeals helps readers judge arguments", "Emotion always beats logic", "Rhetoric is dishonest", "Readers should never analyze"],
        ],
      },
    ],
  };

  function getPassages(gradeId) {
    const band = BAND_OF[gradeId] || "elem";
    return POOLS[band] || POOLS.elem;
  }

  global.READING = { getPassages: getPassages };
})(window);
