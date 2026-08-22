(() => {
  const themes = {
    inventions: {
      title: 'Science Inventions',
      description: 'Original stories about people solving problems through science and invention.',
      seeds: [
        ['The Light Bulb', 'Thomas Edison', 'worked with a team to improve a long-lasting electric light', 'help people see after dark'],
        ['The Telephone', 'Alexander Graham Bell', 'developed a device that carried voices along a wire', 'help people talk across long distances'],
        ['Braille', 'Louis Braille', 'created a raised-dot reading system', 'help blind readers read and write'],
        ['The Airplane', 'the Wright brothers', 'tested wing shapes and built a powered flying machine', 'help people travel through the air'],
        ['The Refrigerator', 'early engineers', 'used cooling systems to keep food cold', 'help families save fresh food'],
        ['The Traffic Light', 'Garrett Morgan', 'designed a safer signal for busy streets', 'help drivers and walkers move safely'],
        ['The Computer Mouse', 'Douglas Engelbart', 'created a hand-held tool for moving a computer pointer', 'help people use computers more easily'],
        ['The Telescope', 'Galileo Galilei', 'improved a tool for seeing faraway objects in the sky', 'help people study space'],
        ['The Microscope', 'Antonie van Leeuwenhoek', 'made lenses that enlarged tiny living things', 'help people explore a hidden small world'],
        ['The Vaccination Idea', 'Edward Jenner', 'tested an early method for protecting people from smallpox', 'help prevent serious illness']
      ]
    },
    people: {
      title: 'Great Presidents and People',
      description: 'Original biographies about leaders, helpers, artists, and changemakers.',
      seeds: [
        ['George Washington', 'George Washington', 'served as the first president of the United States', 'help a new country begin its government'],
        ['Abraham Lincoln', 'Abraham Lincoln', 'led the country during the Civil War', 'keep the nation together and oppose slavery'],
        ['Theodore Roosevelt', 'Theodore Roosevelt', 'supported the protection of forests and parks', 'save natural places for future generations'],
        ['Eleanor Roosevelt', 'Eleanor Roosevelt', 'spoke up for human rights', 'encourage fairness and dignity for all people'],
        ['Harriet Tubman', 'Harriet Tubman', 'guided enslaved people toward freedom on the Underground Railroad', 'help people reach safety'],
        ['Rosa Parks', 'Rosa Parks', 'refused to give up her bus seat in Montgomery', 'challenge unfair segregation laws'],
        ['Martin Luther King Jr.', 'Martin Luther King Jr.', 'organized peaceful protests for civil rights', 'seek equal rights through nonviolent action'],
        ['Mae Jemison', 'Mae Jemison', 'became the first Black woman to travel in space', 'show young people that science careers are possible'],
        ['Jane Goodall', 'Jane Goodall', 'carefully observed chimpanzees in the wild', 'help people understand and protect animals'],
        ['Cesar Chavez', 'Cesar Chavez', 'organized farmworkers to ask for safer and fairer working conditions', 'help workers speak with a stronger voice']
      ]
    },
    business: {
      title: 'Great Business Builders',
      description: 'Original stories about entrepreneurs, useful ideas, responsible choices, and serving a community.',
      seeds: [
        ['A Neighborhood Bakery', 'a neighborhood baker', 'listened when families asked for affordable fresh bread', 'serve customers with useful food and friendly service'],
        ['The Repair Shop', 'a young repair shop owner', 'learned to fix bicycles and explain each repair clearly', 'help riders travel safely and save money'],
        ['The Book Cart', 'a book cart team', 'brought low-cost used books to places without nearby bookstores', 'help more children find stories to read'],
        ['The Refill Station', 'a refill station founder', 'offered containers that customers could use again', 'reduce waste while serving a community need'],
        ['The Garden Stand', 'a garden stand family', 'grew vegetables and kept careful records of costs and sales', 'provide healthy local food'],
        ['The Toy Designer', 'a toy designer', 'asked children which features made a game fun and fair', 'create a product that solved a play problem'],
        ['The Delivery Route', 'a delivery service owner', 'planned safe routes and kept promises about arrival times', 'help neighbors receive important supplies'],
        ['The Community Cafe', 'a cafe manager', 'trained workers to welcome customers and avoid wasting food', 'create jobs and serve meals responsibly'],
        ['The Clean Water Project', 'a social entrepreneur', 'built simple filters for places with unsafe water', 'help families get cleaner water'],
        ['The Helpful App', 'a student app team', 'designed a simple tool that reminded people about community events', 'help neighbors share useful information']
      ]
    },
    history: {
      title: 'Historical Events',
      description: 'Original historical stories about events that shaped communities and the United States.',
      seeds: [
        ['The Declaration of Independence', 'the Declaration of Independence', 'was approved in 1776 by representatives of thirteen colonies', 'announce a wish for self-government'],
        ['The Constitution', 'the Constitution', 'set out rules for the United States government in 1787', 'create a lasting framework for government'],
        ['The Transcontinental Railroad', 'the transcontinental railroad', 'connected rail lines across the United States in 1869', 'make long-distance travel and trade faster'],
        ['The Statue of Liberty', 'the Statue of Liberty', 'was a gift from France dedicated in 1886', 'welcome many people arriving by sea'],
        ['The National Park Idea', 'Yellowstone National Park', 'became the first U.S. national park in 1872', 'protect a special natural area'],
        ['Women Win the Vote', 'the Nineteenth Amendment', 'was ratified in 1920', 'protect women’s right to vote in U.S. elections'],
        ['The Great Migration', 'many Black families', 'moved from the rural South to cities in other parts of the country', 'seek jobs, safety, and new opportunities'],
        ['The First Earth Day', 'the first Earth Day', 'was held in 1970', 'encourage people to care for the environment'],
        ['The Civil Rights Act', 'the Civil Rights Act of 1964', 'banned many forms of discrimination in public places and jobs', 'support equal treatment under the law'],
        ['The Apollo 11 Mission', 'Apollo 11', 'landed astronauts on the Moon in 1969', 'show what careful science and teamwork could accomplish']
      ]
    }
  };

  const inventionTitles = ['The Wheel', 'The Plow', 'The Sailboat', 'The Compass', 'Paper', 'The Printing Press', 'The Mechanical Clock', 'The Microscope', 'The Telescope', 'The Steam Engine', 'The Cotton Gin', 'The Battery', 'The Locomotive', 'The Telegraph', 'The Telephone', 'The Light Bulb', 'The Camera', 'The Radio', 'The Airplane', 'The Refrigerator', 'The Safety Elevator', 'The Sewing Machine', 'The Bicycle', 'The Zipper', 'The Dishwasher', 'The Washing Machine', 'Anesthesia', 'Vaccination', 'Penicillin', 'Insulin', 'The Transistor', 'The Microchip', 'The Personal Computer', 'The Internet', 'GPS', 'The Satellite', 'The Laser', 'MRI Scanning', 'The Pacemaker', 'Solar Panels', 'Wind Turbines', 'The Barcode', 'The 3D Printer', 'The Smartphone', 'Cloud Computing', 'Robotic Surgery', 'CRISPR Gene Editing', 'Lithium-Ion Batteries', 'Artificial Intelligence', 'Modern mRNA Medicines'];
  const historyTitles = ['The Declaration of Independence', 'The U.S. Constitution', 'The Bill of Rights', 'The Louisiana Purchase', 'The War of 1812', 'The Trail of Tears', 'Texas Joins the United States', 'The Oregon Trail', 'The California Gold Rush', 'The Compromise of 1850', 'The Civil War Begins', 'The Emancipation Proclamation', 'The Gettysburg Address', 'Reconstruction', 'The Transcontinental Railroad', 'The Gilded Age', 'The Statue of Liberty Dedication', 'The Spanish-American War', 'The Progressive Era', 'Women Win the Vote', 'The Great Migration', 'The Harlem Renaissance', 'The Great Depression', 'The New Deal', 'Pearl Harbor', 'World War II on the Home Front', 'The GI Bill', 'The Korean War', 'Brown v. Board of Education', 'The Montgomery Bus Boycott', 'The Civil Rights Act', 'The Voting Rights Act', 'The Apollo 11 Moon Landing', 'The First Earth Day', 'Watergate', 'The Fall of the Berlin Wall', 'The Americans with Disabilities Act', 'The Internet Age', 'September 11, 2001', 'Hurricane Katrina', 'California Statehood', 'Oregon Statehood', 'Alaska Statehood', 'Hawaii Statehood', 'The National Park System', 'The Homestead Act', 'The Interstate Highway System', 'The Immigration Act of 1965', 'The Clean Air Act', 'The Americans with Disabilities Movement'];
  const businessTitles = ['Microsoft', 'Apple', 'Google', 'Amazon', 'Uber', 'Costco', "Trader Joe's", "McDonald's", 'Walmart', 'Target', 'Starbucks', 'Netflix', 'Tesla', 'Intel', 'IBM', 'Oracle', 'Adobe', 'Salesforce', 'NVIDIA', 'PayPal', 'Visa', 'Mastercard', 'JPMorgan Chase', 'Bank of America', 'Goldman Sachs', 'Fidelity', 'Charles Schwab', 'Shopify', 'eBay', 'Airbnb', 'Spotify', 'Disney', 'Nike', 'Coca-Cola', 'PepsiCo', 'Home Depot', "Lowe's", 'IKEA', 'LEGO', 'FedEx', 'UPS', 'Southwest Airlines', 'Delta Air Lines', 'Toyota', 'Ford', 'Johnson & Johnson', 'Procter & Gamble', 'Whole Foods Market', 'Khan Academy', 'Wikipedia'];
  const presidentEntries = [
    ['George Washington', 'set early government traditions and left office after two terms'], ['John Adams', 'guided the young nation during a difficult time with France'], ['Thomas Jefferson', 'supported the Louisiana Purchase and expanded the nation’s land'], ['James Madison', 'helped shape the Constitution and led during the War of 1812'], ['James Monroe', 'announced the Monroe Doctrine about foreign influence in the Americas'], ['John Quincy Adams', 'supported roads, canals, science, and education'], ['Andrew Jackson', 'made decisions about voting, banking, and Native American removal that changed the country'], ['Martin Van Buren', 'faced the Panic of 1837 during an economic crisis'], ['William Henry Harrison', 'served the shortest presidency after becoming ill soon after inauguration'], ['John Tyler', 'became the first vice president to take over after a president died'], ['James K. Polk', 'led during a period of major territorial expansion'], ['Zachary Taylor', 'was a military leader elected during debates over slavery and new territories'], ['Millard Fillmore', 'signed laws connected to the Compromise of 1850'], ['Franklin Pierce', 'served during rising disagreements before the Civil War'], ['James Buchanan', 'served immediately before the Civil War began'], ['Abraham Lincoln', 'led the nation during the Civil War and opposed slavery'], ['Andrew Johnson', 'led during early Reconstruction after Lincoln’s death'], ['Ulysses S. Grant', 'supported Reconstruction and civil rights enforcement'], ['Rutherford B. Hayes', 'ended the disputed election crisis of 1876 and began the end of Reconstruction'], ['James Garfield', 'supported civil service reform before his assassination'], ['Chester Arthur', 'signed the Pendleton Civil Service Reform Act'], ['Grover Cleveland', 'served two nonconsecutive terms and focused on government reform'], ['Benjamin Harrison', 'signed the Sherman Antitrust Act and expanded national parks'], ['William McKinley', 'led during the Spanish-American War and a period of industrial growth'], ['Theodore Roosevelt', 'supported conservation, consumer protection, and fair business rules'], ['William Howard Taft', 'continued antitrust efforts and later served as chief justice'], ['Woodrow Wilson', 'led during World War I and supported major economic reforms'], ['Warren Harding', 'called for a return to normalcy after World War I'], ['Calvin Coolidge', 'supported limited government during the economic growth of the 1920s'], ['Herbert Hoover', 'served when the Great Depression began'], ['Franklin D. Roosevelt', 'created New Deal programs and led during most of World War II'], ['Harry Truman', 'made major postwar decisions and supported the Marshall Plan'], ['Dwight Eisenhower', 'supported interstate highways and enforced desegregation in Little Rock'], ['John F. Kennedy', 'challenged Americans to support space exploration and public service'], ['Lyndon B. Johnson', 'signed major civil rights, voting rights, and anti-poverty laws'], ['Richard Nixon', 'opened relations with China and later resigned after Watergate'], ['Gerald Ford', 'helped the country respond to a crisis of trust after Watergate'], ['Jimmy Carter', 'focused on human rights and helped negotiate the Camp David Accords'], ['Ronald Reagan', 'led during the final years of the Cold War'], ['George H. W. Bush', 'led during the end of the Cold War and the Gulf War'], ['Bill Clinton', 'served during economic growth and the early internet era'], ['George W. Bush', 'led after the September 11 attacks and during wars in Afghanistan and Iraq'], ['Barack Obama', 'signed the Affordable Care Act and responded to the Great Recession'], ['Donald Trump', 'served during major debates about trade, immigration, and the COVID-19 pandemic'], ['Joe Biden', 'signed major infrastructure and clean-energy laws'], ['The First Cabinet', 'showed how presidents rely on advisers and departments'], ['The Peaceful Transfer of Power', 'became an important democratic tradition after elections'], ['The White House', 'became a symbol of the presidency and a place where national decisions are made'], ['Presidential Inaugurations', 'mark the public start of a new presidential term'], ['Presidents and the Constitution', 'show how presidential power is limited by laws, courts, Congress, and voters']
  ];
  const catalogSeeds = (titles, category, purpose) => titles.map(title => [title, title, `${title} changed how people approached a problem in ${category}`, purpose]);
  const presidentSeeds = presidentEntries.map(([title, fact]) => [title, title, fact, 'show how presidential choices can affect Americans and the nation']);
  const catalogThemes = {
    inventions: { title: 'World-Changing Inventions', description: 'One long-form story per invention, from the wheel to modern medicine and artificial intelligence.', seeds: catalogSeeds(inventionTitles, 'science, technology, or medicine', 'help people solve practical problems and imagine new possibilities'), onePerSeed: true },
    presidents: { title: 'Presidents and American Change', description: 'One long-form story per U.S. president or presidential-history topic, focused on contributions and effects.', seeds: presidentSeeds, onePerSeed: true },
    history: { title: 'American History in Motion', description: 'One long-form story per event, migration, conflict, law, or statehood milestone.', seeds: catalogSeeds(historyTitles, 'American history', 'help readers understand how events changed communities and the country'), onePerSeed: true },
    business: { title: 'Business Ideas That Changed Daily Life', description: 'One long-form story per company or business model and the customer problem it addressed.', seeds: catalogSeeds(businessTitles, 'business, technology, retail, finance, or service', 'help readers understand how organizations respond to customer and community needs'), onePerSeed: true }
  };

  const focus = [
    ['A Curious Question', 'asked a careful question before beginning the work'],
    ['Testing Ideas', 'tried more than one idea and learned from mistakes'],
    ['Teamwork', 'depended on helpers who shared skills and observations'],
    ['A Problem Solved', 'focused on a real problem that people faced'],
    ['A Lasting Impact', 'left an idea that still matters today']
  ];

  const makeOptions = (correct, values) => {
    const options = [correct];
    for (const value of values) if (value !== correct && !options.includes(value) && options.length < 4) options.push(value);
    let filler = 1;
    while (options.length < 4) options.push(`A different idea (${filler++})`);
    return options;
  };

  const buildStory = (theme, seed, focusItem, index) => {
    const [title, subject, fact, purpose] = seed;
    const [focusTitle, focusAction] = focusItem;
    const storyTitle = `${title}: ${focusTitle}`;
    const paragraphs = [
      `${subject} ${fact}. Long before this work was widely known, people had a problem they wanted to solve. Some needed a safer way to travel, communicate, learn, or care for their community. Others simply wanted to understand the world more clearly. The story of ${title} begins with a careful observation: everyday problems can become important questions when someone is willing to look closely.`,
      `The people connected with this story did not find an answer all at once. They gathered information, noticed small details, and compared one idea with another. Sometimes a test worked only partly. Sometimes it created a new question. Instead of giving up, they recorded what happened and tried again. This patient process helped them learn which choices were useful and which choices needed to change.`,
      `In this version of the story, the focus is ${focusTitle.toLowerCase()}. The people involved ${focusAction}. They understood that good work is stronger when it is checked with evidence. They also learned from helpers, teachers, family members, or teammates. Different people could bring different skills, such as drawing, measuring, listening, building, reading, or explaining. Each small contribution moved the work forward.`,
      `Over time, their effort could ${purpose}. The result was not important only because it was new. It mattered because it connected an idea to the needs of real people. A useful invention, decision, discovery, or historical action can change daily life in ways that are easy to miss. It can also inspire another person to ask a new question and continue learning.`,
      `As you read, notice the relationship between the problem, the process, and the result. Ask yourself what evidence helped the people make progress and why their work mattered. The biggest lesson is that curiosity grows when people observe carefully, keep trying after mistakes, and share what they learn with others.`
    ];
    const passage = paragraphs.join('\n\n');
    const sameTheme = theme.seeds.map(item => item[1]);
    const purposes = theme.seeds.map(item => item[3]);
    const questions = [
      [`What is the main idea of "${storyTitle}"?`, `How ${subject} could ${purpose}`, `Why games are important`, `How to bake a cake`, `Why people avoid questions`],
      [`Who or what is the passage mainly about?`, subject, ...makeOptions(subject, sameTheme).slice(1)],
      [`What did ${subject} do or use?`, fact, ...makeOptions(fact, theme.seeds.map(item => item[2])).slice(1)],
      [`What was one purpose of this work?`, purpose, ...makeOptions(purpose, purposes).slice(1)],
      [`Which action best matches the lesson of the story?`, 'Observe carefully, keep trying, and share ideas', 'Stop after one mistake', 'Ignore evidence', 'Keep useful ideas secret']
    ];
    return { id: `${theme.title}-${index}`, title: storyTitle, passage, questions };
  };

  const buildThemeStories = theme => theme.onePerSeed ? theme.seeds.map((seed, index) => buildStory(theme, seed, focus[index % focus.length], `${seed[0]}-${index}`)) : theme.seeds.flatMap(seed => focus.map((focusItem, focusIndex) => buildStory(theme, seed, focusItem, `${seed[0]}-${focusIndex}`)));
  const collections = Object.fromEntries(Object.entries(catalogThemes).map(([key, theme]) => [key, buildThemeStories(theme)]));

  const grade5Themes = {
    inventions: {
      title: 'World-Changing Inventions',
      description: 'Long-form stories about inventions from the wheel to artificial intelligence.',
      seeds: [
        ['The Wheel', 'early wheel makers', 'used round wooden parts to move heavy loads with less effort', 'make travel, trade, and building easier'],
        ['The Printing Press', 'Johannes Gutenberg', 'developed movable type that could print many pages more quickly', 'spread books and ideas to more readers'],
        ['The Steam Engine', 'James Watt and other engineers', 'improved engines that turned steam into useful power', 'change travel and factory work'],
        ['The Telegraph', 'Samuel Morse and other inventors', 'sent coded messages along wires', 'share news across long distances more quickly'],
        ['The Telephone', 'Alexander Graham Bell and other early telephone researchers', 'helped develop devices that carried voices along a wire', 'make distant conversation possible'],
        ['Electric Power Systems', 'Nikola Tesla, Thomas Edison, and many engineers', 'helped build systems for producing and delivering electric power', 'bring light and useful machines into daily life'],
        ['Antibiotics', 'Alexander Fleming and medical researchers', 'studied medicines that fight many bacterial infections', 'help doctors save lives from dangerous illnesses'],
        ['Vaccines', 'medical researchers around the world', 'developed safe ways to train the body to recognize diseases', 'prevent serious illness before it spreads'],
        ['The Internet', 'scientists and engineers', 'connected computer networks so information could travel between them', 'help people communicate and share knowledge globally'],
        ['Artificial Intelligence', 'computer scientists and researchers', 'created systems that find patterns in information and make useful predictions', 'help people solve complex problems while using human judgment']
      ]
    },
    presidents: {
      title: 'Presidents and American Change',
      description: 'Long-form stories about notable presidents and how their decisions affected Americans.',
      seeds: [
        ['George Washington', 'George Washington', 'set early examples for a new national government and left office after two terms', 'show that elected leadership could follow democratic limits'],
        ['Thomas Jefferson', 'Thomas Jefferson', 'supported the Louisiana Purchase during his presidency', 'greatly expand the land controlled by the United States'],
        ['James Madison', 'James Madison', 'helped shape the Constitution and later led the nation during the War of 1812', 'strengthen the ideas behind the young republic'],
        ['Andrew Jackson', 'Andrew Jackson', 'supported policies that greatly affected voting, banking, and Native American communities', 'show how presidential decisions can create both change and serious harm'],
        ['Abraham Lincoln', 'Abraham Lincoln', 'led the nation during the Civil War and issued the Emancipation Proclamation', 'help preserve the Union and move the country toward ending slavery'],
        ['Ulysses S. Grant', 'Ulysses S. Grant', 'supported Reconstruction and federal efforts to protect civil rights after the Civil War', 'defend new constitutional rights during a difficult period'],
        ['Theodore Roosevelt', 'Theodore Roosevelt', 'supported conservation, national parks, and rules for large businesses', 'protect natural places and address unfair business practices'],
        ['Franklin D. Roosevelt', 'Franklin D. Roosevelt', 'led during the Great Depression and much of World War II', 'create programs that offered relief and changed the role of government'],
        ['Dwight Eisenhower', 'Dwight Eisenhower', 'supported the Interstate Highway System and enforced school desegregation in Little Rock', 'shape transportation and federal responsibility for civil rights'],
        ['Lyndon B. Johnson', 'Lyndon B. Johnson', 'signed major civil rights and voting rights laws', 'strengthen legal protections against discrimination']
      ]
    },
    history: {
      title: 'American History in Motion',
      description: 'Long-form stories about major events, statehood, migration, conflict, and change in the United States.',
      seeds: [
        ['The California Gold Rush', 'the California Gold Rush', 'began after gold was found in 1848 and brought many newcomers west', 'rapidly change California while creating opportunity and hardship'],
        ['The Oregon Trail', 'families traveling the Oregon Trail', 'crossed long distances in wagons during the nineteenth century', 'show the risks and hopes involved in westward migration'],
        ['The Civil War', 'the Civil War', 'was fought from 1861 to 1865 over union, slavery, and the future of the nation', 'reshape the United States at an enormous human cost'],
        ['Alaska Becomes a State', 'Alaska', 'became the forty-ninth state in 1959 after a long period as a U.S. territory', 'add a vast northern region to the United States'],
        ['Hawaii Becomes a State', 'Hawaii', 'became the fiftieth state in 1959 after a complex history involving Native Hawaiian people and U.S. control', 'complete the modern list of U.S. states'],
        ['World War I', 'the United States in World War I', 'entered the global conflict in 1917', 'connect American history more closely to events around the world'],
        ['World War II', 'the United States in World War II', 'joined the conflict after the attack on Pearl Harbor in 1941', 'change industry, military service, and life at home'],
        ['The New Deal', 'the New Deal', 'created public programs during the Great Depression', 'offer jobs, relief, and new rules for the economy'],
        ['The Civil Rights Movement', 'the Civil Rights Movement', 'used court cases, organizing, and peaceful protest to challenge segregation', 'press the country to protect equal rights more fully'],
        ['The Voting Rights Act', 'the Voting Rights Act of 1965', 'banned barriers that had kept many citizens from voting', 'strengthen access to elections']
      ]
    },
    business: {
      title: 'Business Ideas That Changed Daily Life',
      description: 'Long-form stories about companies, services, customers, and the problems business ideas tried to solve.',
      seeds: [
        ['Microsoft', 'Microsoft', 'built software that helped personal computers become useful tools for homes, schools, and offices', 'make computing more available to many people'],
        ['Apple', 'Apple', 'combined hardware, software, and design to make personal technology easier to use', 'help people use powerful tools in everyday life'],
        ['Google', 'Google', 'developed search tools that organized information on the growing internet', 'help people find useful information more quickly'],
        ['Amazon', 'Amazon', 'began by selling books online and expanded its delivery and marketplace services', 'give customers more ways to find and receive products'],
        ['Uber', 'Uber', 'used smartphone technology to connect riders with available drivers', 'make it easier to request transportation in many cities'],
        ['Costco', 'Costco', 'used a membership warehouse model to sell many goods in larger quantities', 'offer value to customers who planned purchases carefully'],
        ["Trader Joe's", "Trader Joe's", 'built smaller stores with distinctive products and a friendly shopping experience', 'give customers a different way to shop for groceries'],
        ["McDonald's", "McDonald's", 'developed systems for serving familiar food quickly and consistently', 'show how careful processes can help a business serve many customers'],
        ['A Community Bank', 'community banks and credit unions', 'help families save money, borrow responsibly, and support local businesses', 'connect financial services to the needs of a community'],
        ['The Stock Market', 'the stock market', 'offers a place where people can buy and sell ownership shares in companies', 'help businesses raise money while reminding investors to understand risk']
      ]
    }
  };

  const buildLongStory = (theme, seed, focusItem, index) => {
    const [title, subject, fact, purpose] = seed;
    const [focusTitle, focusAction] = focusItem;
    const storyTitle = `${title}: ${focusTitle}`;
    const paragraphs = [
      `${subject} ${fact}. This Grade 5 reading story looks beyond a short fact and asks how an idea, decision, or event changed daily life. Before the change happened, people faced practical problems. They needed to move goods, share information, make choices, protect rights, receive care, or understand a rapidly changing world. A useful historical or business story begins by noticing that people’s needs are connected to the choices made by inventors, leaders, workers, customers, and communities.`,
      `The work behind ${title} required more than one good idea. People had to define the problem carefully, collect information, test plans, and learn from results. A plan might work well for one group but create a new problem for another. That is why responsible decision makers ask questions about fairness, safety, cost, access, and long-term effects. They compare evidence instead of depending only on a quick opinion.`,
      `In this passage, the focus is ${focusTitle.toLowerCase()}. The people involved ${focusAction}. They often needed a team because complex work uses many skills. Someone may understand science or technology. Another person may organize supplies, explain an idea clearly, check a budget, protect a customer, or listen to people affected by a decision. Teams are strongest when members share information honestly and are willing to revise a plan.`,
      `The main action in this story could ${purpose}. Yet every major change has more than one effect. New tools can make work easier while also changing jobs. New laws can protect rights while requiring communities to learn new rules. A successful business can serve customers while needing to treat workers and the environment responsibly. Reading history and business closely means looking at benefits, limits, and the people whose lives are affected.`,
      `Consider the evidence in the story. Which problem came first? What actions were taken? Who helped? What result followed? These questions help readers separate a claim from the details that support it. They also help readers understand why an event matters beyond one date or one name. Strong readers connect causes to effects and notice that a decision can be important even when it is complicated.`,
      `The story of ${title} also shows why communication matters. An idea becomes more useful when people can explain it, test it, teach it, and improve it. Leaders and business builders must listen to questions, including difficult questions. Scientists and historians must check sources. Customers and citizens must think about how their choices affect other people. This kind of careful thinking is a skill students can practice in school and in daily life.`,
      `Another important part of the story is decision making. A strong decision is not simply the fastest or most popular choice. People may compare several plans and ask what each plan will cost, who will benefit, and what risks might appear. They may need to protect private information, use resources wisely, or make sure that a new service is safe. When readers notice these details, they see that innovation and leadership include responsibility as well as creativity.`,
      `Good sources also matter. A newspaper article, letter, photograph, speech, interview, map, scientific report, or business record can offer evidence about the past. However, a source may show only one point of view. Careful readers ask who created the source, when it was made, and what information may be missing. Comparing more than one reliable source helps people make a fuller and fairer picture of an event or idea.`,
      `The choices connected with ${title} can also teach a lesson about adaptation. Conditions change when new customers arrive, new laws are passed, a discovery is made, or a community faces a challenge. People who respond thoughtfully do not throw away every old idea, but they stay ready to improve a process when evidence suggests a better path. That balance between stability and change is useful in history, science, government, and business.`,
      `Finally, consider how the story connects to your own life. Students make decisions when they plan a project, work with classmates, use technology, spend money, or choose how to solve a problem. The scale may be smaller, but the habits are similar: ask useful questions, check facts, listen to others, and think about consequences. Learning these habits now prepares readers to participate thoughtfully in their communities later.`,
      `As you finish the passage, return to the central lesson: curiosity needs evidence, and progress needs responsibility. Ask what problem was being solved, how the people approached the work, and why the outcome mattered to Americans or to people around the world. The best answer to a comprehension question will be supported by a clear detail from the story, not by a guess.`
    ];
    const passage = paragraphs.join('\n\n');
    const sameTheme = theme.seeds.map(item => item[1]);
    const purposes = theme.seeds.map(item => item[3]);
    const questions = [
      [`What is the main idea of "${storyTitle}"?`, `How ${subject} could ${purpose}`, 'Why guessing is better than evidence', 'How to avoid learning from mistakes', 'Why every change has only one effect'],
      [`Who or what is the passage mainly about?`, subject, ...makeOptions(subject, sameTheme).slice(1)],
      [`What did ${subject} do or use?`, fact, ...makeOptions(fact, theme.seeds.map(item => item[2])).slice(1)],
      [`What was one purpose of this work?`, purpose, ...makeOptions(purpose, purposes).slice(1)],
      ['Which statement is best supported by the passage?', 'Responsible progress considers evidence, people, and long-term effects', 'A good plan never needs revision', 'Only one person matters in major change', 'Benefits never create new questions']
    ];
    return { id: `Grade5-${theme.title}-${index}`, title: storyTitle, passage, questions };
  };

  const buildLongThemeStories = theme => theme.onePerSeed ? theme.seeds.map((seed, index) => buildLongStory(theme, seed, focus[index % focus.length], `${seed[0]}-${index}`)) : theme.seeds.flatMap(seed => focus.map((focusItem, focusIndex) => buildLongStory(theme, seed, focusItem, `${seed[0]}-${focusIndex}`)));
  const grade5Collections = Object.fromEntries(Object.entries(catalogThemes).map(([key, theme]) => [key, buildLongThemeStories(theme)]));
  window.ReadingStories = Object.freeze({ themes: catalogThemes, collections, grade5Themes: catalogThemes, grade5Collections });
})();
