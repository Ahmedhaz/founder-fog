// The Little Entrepreneur: the picture book. All text, English and Arabic side by side.
// Built into littlebreneur/book/ by build.mjs (web reader + A5 PDF for print).
//
// Writing rules:
//   - Ages 8 to 12: short sentences, simple words, nothing scary, no real brands.
//   - No dashes in the text (no em or en dashes). Use full stops and commas.
//   - Numbers match the game: juice costs 1 coin a cup, the fair price is 3, the gift for Mum is 220.
//   - Every number written as digits in the English also appears as digits in the Arabic,
//     except 1 and 2, which Arabic says with words (عملة واحدة، عملتان).
//   - The story's children are Malak (a girl) and Yousef (a boy). Pages that speak to the
//     reader (the worksheet) stay gender-neutral in Arabic: nouns and labels, no imperatives.
//
// Pictures: each story page has art: "sNN" (littlebreneur/book/art/sNN.jpg), needle-felted
// wool dioramas made for this book; optional focus: "x y" moves the crop. Objects are art/o_*.jpg.

module.exports = {
  meta: {
    title: { en: "The Little Entrepreneur", ar: "الانتربرونور الصغير" },
    subtitle: { en: "Four summer business stories, and how to play the game", ar: "أربع حكايات عن مشاريع الصيف، ودليل اللعب" },
    ages: { en: "For ages 8 to 12", ar: "للأعمار من 8 إلى 12" },
    url: "https://adam.ahmedhaz.com/little/",
    promo: "https://adam.ahmedhaz.com/littlebreneur/",
  },

  ui: {
    prev: { en: "Back", ar: "السابق" },
    next: { en: "Next", ar: "التالي" },
    pdf: { en: "Download PDF", ar: "تحميل PDF" },
    play: { en: "Play the game", ar: "هيا نلعب" },
    page: { en: "Page", ar: "صفحة" },
    of: { en: "of", ar: "من" },
    lang: { en: "العربية", ar: "English" },
    idea: { en: "Grandpa's idea", ar: "فكرة جدّو" },
    partOne: { en: "Part 1", ar: "الجزء الأول" },
    partTwo: { en: "Part 2", ar: "الجزء الثاني" },
    contents: { en: "Contents", ar: "المحتويات" },
    story: { en: "Story", ar: "الحكاية" },
  },

  title: {
    lines: [
      { en: "Stories about Malak, Yousef and Grandpa, and a guide to the free game.", ar: "حكايات عن ملك ويوسف وجدّو، ودليل للعبة المجانية." },
      { en: "Written for children aged 8 to 12 and the grown-ups who read with them.", ar: "مكتوبة للأطفال من 8 إلى 12 عامًا، وللكبار الذين يقرؤون معهم." },
    ],
    credits: [
      { en: "Pictures: needle-felted art made for this book. Fonts: Manrope and Readex Pro (SIL Open Font Licence).", ar: "الصور: رسومات صوف ملبّد صُنعت لهذا الكتاب. الخطوط: Manrope و Readex Pro (رخصة SIL المفتوحة)." },
      { en: "Free to print and share with family, friends and schools.", ar: "مجاني للطباعة والمشاركة مع العائلة والأصدقاء والمدارس." },
      { en: "© 2026 adam.ahmedhaz.com", ar: "© 2026 adam.ahmedhaz.com" },
    ],
  },

  parents: {
    title: { en: "For the grown-ups", ar: "إلى الكبار" },
    paras: [
      { en: "This book has two parts. The four stories follow Malak and Yousef through four summers: a juice stand, drawings and bracelets, a bike wash, and a little bakery. Each scene ends with one of Grandpa's ideas about money: cost, price, profit, saving, stock, investing, customers, honesty and rest.",
        ar: "لهذا الكتاب جزءان. تتبع الحكايات الأربع ملك ويوسف خلال أربعة فصول صيف: كشك عصير، ورسومات وأساور، وغسيل الدراجات، ومخبز صغير. وينتهي كل مشهد بفكرة من أفكار جدّو عن المال: التكلفة والسعر والربح والادّخار والبضاعة والاستثمار والزبائن والأمانة والراحة." },
      { en: "The second part shows how to play The Little Entrepreneur, the free game the stories come from. It works in any browser and on phones, with no ads, no accounts and nothing to buy.",
        ar: "ويشرح الجزء الثاني طريقة لعب «الانتربرونور الصغير»، اللعبة المجانية التي خرجت منها الحكايات. تعمل في أي متصفح وعلى الهواتف، بلا إعلانات ولا حسابات ولا مشتريات." },
      { en: "A good way to use it: read one scene together, talk about Grandpa's idea, then let your child try it in the game. After the stories there are activity pages, questions to talk about, a page for planning a real tiny business, and a certificate.",
        ar: "طريقة مقترحة: قراءة مشهد واحد معًا، ثم الحديث عن فكرة جدّو، ثم ترك الطفل يجرّبها في اللعبة. وبعد الحكايات صفحات أنشطة، وأسئلة للنقاش، وصفحة لتخطيط مشروع صغير حقيقي، وشهادة." },
    ],
  },

  stories: [
  {
    name: { en: "The juice stand", ar: "كشك العصير" },
    ideas: { en: "Every idea from the juice summer, in one place. In the game, each one becomes a sticker.", ar: "كل أفكار صيف العصير في مكان واحد. وفي اللعبة تصبح كل فكرة ملصقًا." },
    scenes: [
    {
      title: { en: "Summer begins", ar: "الصيف يبدأ" },
      text: { en: "On the first day of summer, Malak and Yousef had a plan. \"Mum's birthday is at the end of summer,\" said Malak. \"We want to buy her a real gift.\" Yousef emptied his pockets: 15 coins. \"That's not enough,\" he sighed. Grandpa put down his tea. \"Then let's earn the rest. What do people here want on a hot day?\" \"Something cold!\" they shouted together.",
              ar: "في أول يوم من الصيف، كانت لدى ملك ويوسف خطة. قالت ملك: «عيد ميلاد ماما في آخر الصيف، ونريد أن نشتري لها هدية حقيقية.» أفرغ يوسف جيوبه: 15 عملة، وتنهّد: «هذا لا يكفي.» وضع جدّو كوب الشاي وقال: «إذن لنكسب الباقي. ماذا يريد الناس هنا في يوم حار؟» فصاحا معًا: «شيئًا باردًا!»" },
      idea: { en: "A business starts with something people want.", ar: "كل مشروع يبدأ بشيء يريده الناس." },
      art: "s01",
    },
    {
      title: { en: "What does one cup cost?", ar: "كم يكلّف الكوب الواحد؟" },
      text: { en: "Grandpa opened his old notebook. \"Lemons, sugar, water and a paper cup. Let's count.\" They added it all up and divided it by the number of cups. \"One cup costs us one coin to make,\" said Yousef. \"That is our cost,\" said Grandpa. \"We pay for every cup we make, even if nobody buys it.\"",
              ar: "فتح جدّو دفتره القديم وقال: «ليمون وسكر وماء وكوب ورقي. لنحسب.» جمعا كل شيء وقسماه على عدد الأكواب. قال يوسف: «الكوب الواحد يكلّفنا عملة واحدة.» فقال جدّو: «هذه هي التكلفة. كل كوب نصنعه ندفع ثمنه، حتى لو لم يشتره أحد.»" },
      idea: { en: "Cost is what you pay to make something.", ar: "التكلفة هي ما ندفعه لنصنع الشيء." },
      art: "s02",
    },
    {
      title: { en: "Choosing a price", ar: "اختيار السعر" },
      text: { en: "Two, 3 or 5 coins a cup? \"5!\" said Yousef. \"More money!\" Malak shook her head. \"At 5, fewer people will stop. At two coins lots will come, but we only keep one coin from each cup.\" Grandpa smiled. \"Try 3. It is fair for them, and fair for you.\" They wrote it on the sign in big letters: 3 coins.",
              ar: "عملتان أم 3 أم 5 للكوب؟ قال يوسف: «5! نقود أكثر!» هزّت ملك رأسها: «بـ5 سيتوقف عدد أقل من الناس. وبعملتين سيأتي كثيرون، لكن لن يبقى لنا من كل كوب إلا عملة واحدة.» ابتسم جدّو: «جرّبا 3. سعر عادل لهم، وعادل لكما.» وكتبا على اللافتة بخط كبير: 3 عملات." },
      idea: { en: "A high price brings fewer customers. A low price brings less profit per cup.", ar: "السعر الغالي يجلب زبائن أقل، والرخيص يجلب ربحًا أقل من كل كوب." },
      art: "s03",
    },
    {
      title: { en: "Market day!", ar: "يوم السوق!" },
      text: { en: "On Saturday they made 12 cups. The sun was out, and so were the neighbours. By noon, 11 cups were gone. Yousef counted the coins twice: 33 coins. \"We're rich!\" he cheered. \"Not so fast,\" said Grandpa. \"How much did the cups cost?\" \"12 coins.\" \"So what is left?\"",
              ar: "يوم السبت صنعا 12 كوبًا. كانت الشمس مشرقة، والجيران في الخارج. وقبل الظهر بِيع 11 كوبًا. عدّ يوسف النقود مرتين: 33 عملة، وهتف: «صرنا أغنياء!» قال جدّو: «على مهلك. كم كلّفت الأكواب؟» «12 عملة.» «إذن كم بقي؟»" },
      idea: { en: "Counting the coins that came in is only half of the story.", ar: "عدّ النقود التي دخلت نصف الحكاية فقط." },
      art: "s04",
    },
    {
      type: "equation",
      title: { en: "Profit", ar: "الربح" },
      eq: { a: 33, b: 12, c: 21, la: { en: "coins in", ar: "نقود دخلت" }, lb: { en: "coins spent", ar: "نقود صُرفت" }, lc: { en: "profit", ar: "الربح" } },
      text: { en: "Malak wrote it on the back of the sign. 33 coins came in. 12 coins went out. 21 coins are profit. \"Profit is what's left after paying for everything,\" said Grandpa. Yousef put the 21 coins in the piggy bank very slowly, one by one.",
              ar: "كتبت ملك على ظهر اللافتة: دخلت 33 عملة، وخرجت 12 عملة، والربح 21 عملة. قال جدّو: «الربح هو ما يبقى بعد دفع كل شيء.» ووضع يوسف العملات الـ21 في الحصّالة ببطء شديد، واحدة بعد واحدة." },
      idea: { en: "Profit = coins in − coins spent.", ar: "الربح = النقود الداخلة − النقود المصروفة." },
      art: "s05",
    },
    {
      title: { en: "A rainy Saturday", ar: "سبت ماطر" },
      text: { en: "The next Saturday they made 20 cups. Then the clouds came. Only 6 people stopped, and they wanted something warm. That evening, 14 cups of juice went down the sink. \"We paid for those,\" said Yousef quietly. \"Next time,\" said Malak, \"we look at the sky first, and make about as many as people will buy.\"",
              ar: "في السبت التالي صنعا 20 كوبًا. ثم جاءت الغيوم. توقّف 6 أشخاص فقط، وكانوا يريدون شيئًا دافئًا. وفي المساء سُكب 14 كوبًا من العصير في الحوض. قال يوسف بهدوء: «لقد دفعنا ثمنها.» فقالت ملك: «في المرة القادمة ننظر إلى السماء أولًا، ونصنع بقدر ما سيشتري الناس تقريبًا.»" },
      idea: { en: "Leftovers that spoil are coins thrown in the bin. Making fewer is a skill.", ar: "البقايا التي تفسد نقودٌ تُرمى في سلّة المهملات. وصنع كمية أقل مهارة." },
      art: "s06",
    },
    {
      title: { en: "Too sour!", ar: "حامض جدًا!" },
      text: { en: "Uncle Saeed took one sip and made a face. \"Too sour!\" he said, loud enough for the whole line to hear. Yousef's cheeks went red. Malak poured a new cup with more sugar. \"Can you tell us if this one is better?\" He tried it, nodded, and told the line, \"Now it's perfect.\" That afternoon they changed the recipe for good.",
              ar: "أخذ العم سعيد رشفة واحدة وتجهّم وجهه، وقال بصوت سمعه الطابور كله: «حامض جدًا!» احمرّ وجه يوسف. أما ملك فصبّت كوبًا جديدًا بسكر أكثر وقالت: «هل تخبرنا إن كان هذا أفضل؟» جرّبه وهزّ رأسه موافقًا وقال للطابور: «الآن صار ممتازًا.» وفي ذلك العصر غيّرا الوصفة نهائيًا." },
      idea: { en: "A complaint is free advice.", ar: "الشكوى نصيحة مجانية." },
      art: "s07",
    },
    {
      title: { en: "6 extra coins", ar: "6 عملات زائدة" },
      text: { en: "At closing time, the box had 6 coins too many. \"The lady with the green basket paid too much,\" said Malak. \"Nobody will know,\" said Yousef. Malak looked at him. Yousef sighed, and they ran after her down the street. The lady laughed. \"Nobody has ever chased me to give money back!\" The next Saturday she came back with two friends.",
              ar: "عند الإغلاق كان في الصندوق 6 عملات زائدة. قالت ملك: «السيدة صاحبة السلّة الخضراء دفعت زيادة.» قال يوسف: «لن يعرف أحد.» نظرت إليه ملك. فتنهّد يوسف، وركضا خلفها في الشارع. ضحكت السيدة: «لم يركض خلفي أحد من قبل ليُرجع لي نقودًا!» وفي السبت التالي عادت ومعها صديقتان." },
      idea: { en: "Trust is like savings: slow to build, quick to spend.", ar: "الثقة مثل الادّخار: تُبنى ببطء وتُصرف بسرعة." },
      art: "s08",
    },
    {
      title: { en: "The stand next door", ar: "الكشك المجاور" },
      text: { en: "One morning a bigger boy called Karim set up a juice stand 5 steps away. Same sign, same cups, same price. \"He copied us!\" said Yousef. Grandpa sipped his tea. \"Then ask yourselves what makes you different.\" Malak had an idea. She walked over and talked to Karim. Now Karim sells popcorn, they sell juice, and people buy both.",
              ar: "ذات صباح نصب ولد أكبر اسمه كريم كشك عصير على بعد 5 خطوات. اللافتة نفسها والأكواب نفسها والسعر نفسه. قال يوسف: «لقد قلّدنا!» ارتشف جدّو شايه وقال: «إذن اسألا نفسيكما: ما الذي يميّزكما؟» وخطرت لملك فكرة، فذهبت وتحدّثت مع كريم. والآن يبيع كريم الفشار، ويبيعان العصير، والناس يشترون الاثنين." },
      idea: { en: "When someone copies you, the question is: what makes you, you?", ar: "عندما ينسخك أحد، يصبح السؤال: ما الذي يميّزك؟" },
      art: "s09",
    },
    {
      title: { en: "Too tired to count", ar: "تعب يُربك الحساب" },
      text: { en: "In week 6, Malak and Yousef stayed up late making 30 cups. The next day their eyes kept closing. Yousef gave a customer 5 coins change instead of two. Malak forgot the ice. \"Tired sellers make small mistakes,\" said Grandpa. \"Rest is part of the job.\" So on Sunday they played football, did their homework and slept early.",
              ar: "في الأسبوع 6 سهرا حتى وقت متأخر يصنعان 30 كوبًا. وفي اليوم التالي كانت أعينهما تنغلق من النعاس. وردّ يوسف لأحد الزبائن 5 عملات باقيًا بدل عملتين. ونسيت ملك الثلج. قال جدّو: «مع التعب تقع أخطاء صغيرة. والراحة جزء من العمل.» فلعبا الكرة يوم الأحد، وأنجزا واجباتهما، وناما مبكرًا." },
      idea: { en: "Rest is part of the job.", ar: "الراحة جزء من العمل." },
      art: "s10",
    },
    {
      title: { en: "The new game", ar: "اللعبة الجديدة" },
      text: { en: "The piggy bank was getting heavy. Then everyone at the summer club started talking about a new video game. It cost 30 coins. \"We have enough,\" whispered Yousef. Malak looked at the piggy bank, then at Mum's photo on the fridge. They waited. 3 weeks later, the same game was on sale for 18 coins. They smiled, and kept saving.",
              ar: "صارت الحصّالة ثقيلة. ثم بدأ الجميع في النادي الصيفي يتكلّمون عن لعبة فيديو جديدة سعرها 30 عملة. همس يوسف: «معنا ما يكفي.» نظرت ملك إلى الحصّالة، ثم إلى صورة ماما على باب الثلاجة. وانتظرا. وبعد 3 أسابيع صارت اللعبة نفسها بـ18 عملة. فابتسما، وواصلا الادّخار." },
      idea: { en: "Saving means picking what you want most over what you want right now.", ar: "الادّخار يعني تقديم الحلم الكبير على الرغبة السريعة." },
      art: "s11",
    },
    {
      title: { en: "The last day of summer", ar: "آخر يوم في الصيف" },
      text: { en: "On the last Saturday, Yousef opened the piggy bank. They counted every coin twice: 236 coins. The gift for Mum cost 220. \"We did it!\" they cheered. Mum cried happy tears when she opened it. Grandpa gave them a sticker each. \"You didn't just earn coins,\" he said. \"You learned how a business works.\" Malak was already planning next summer.",
              ar: "في آخر سبت فتح يوسف الحصّالة، وعدّا كل عملة مرتين: 236 عملة. وثمن هدية ماما 220 عملة. فهتفا: «نجحنا!» ودمعت عينا ماما من الفرح حين فتحتها. وأعطى جدّو كلًّا منهما ملصقًا وقال: «لم تكسبا نقودًا فقط، بل تعلّمتما كيف يعمل المشروع.» وبدأت ملك تخطّط للصيف القادم." },
      idea: { en: "Every coin you don't spend today walks your goal one step closer.", ar: "كل عملة لا تُصرف اليوم تقرّب الهدف خطوة." },
      art: "s12",
    },
    ],
  },
  {
    name: { en: "Drawings and bracelets", ar: "رسومات وأساور" },
    ideas: { en: "The ideas from the bracelet summer. Which one matters most in a real business?", ar: "أفكار صيف الأساور. أي فكرة منها هي الأهم في مشروع حقيقي؟" },
    activity: "priceit",
    scenes: [
    {
      title: { en: "A new summer, a new idea", ar: "صيف جديد وفكرة جديدة" },
      text: { en: "A year later, summer came back, and so did the plan. This time Malak and Yousef were saving for a set of storybooks: 160 coins. \"No juice this year,\" said Malak, and held up a bracelet of round beads. Yousef held up his drawing of the street cat. \"Everyone at the club asks where we got these.\" Grandpa smiled. \"Then you already have a business. You are good at it, and people want it.\"",
              ar: "بعد عام عاد الصيف، وعادت الخطة معه. هذه المرة كان ملك ويوسف يدّخران لمجموعة كتب حكايات ثمنها 160 عملة. قالت ملك: «لا عصير هذا العام.» ورفعت سوارًا من خرز مستدير. ورفع يوسف رسمته لقطة الشارع وقال: «كل من في النادي يسأل من أين جئنا بهذه.» ابتسم جدّو: «إذن عندكما مشروع بالفعل. أنتما تجيدانه، والناس يريدونه.»" },
      idea: { en: "The best business mixes what we are good at with what people want.", ar: "أفضل مشروع يجمع بين ما نجيده وما يريده الناس." },
      art: "s13",
    },
    {
      title: { en: "Small costs add up", ar: "التكاليف الصغيرة تتجمّع" },
      text: { en: "\"Thread costs almost nothing,\" said Yousef. Grandpa opened his notebook. \"Let's count everything anyway.\" Beads, thread and a little clasp. Paper, and coloured pencils that get shorter every day. They added it all up. One bracelet cost 2 coins to make. One drawing cost 2 coins too. \"Each thing is tiny on its own,\" said Malak, \"but together they are not.\"",
              ar: "قال يوسف: «الخيط لا يكلّف شيئًا تقريبًا.» ففتح جدّو دفتره: «لنحسب كل شيء على أي حال.» خرز وخيط ومشبك صغير. وورق، وأقلام ألوان تقصر كل يوم. جمعوا كل شيء، فإذا السوار الواحد يكلّف عملتين، والرسمة الواحدة تكلّف عملتين أيضًا. قالت ملك: «كل شيء صغير وحده، لكنها معًا ليست صغيرة.»" },
      idea: { en: "Small costs add up. Count every one.", ar: "التكاليف الصغيرة تتجمّع، فلنحسبها كلها." },
      art: "s14",
    },
    {
      title: { en: "What is an hour worth?", ar: "كم تساوي ساعة من العمل؟" },
      text: { en: "Malak wanted to sell her bracelets for 3 coins. \"I don't want to ask for too much,\" she said. Grandpa asked, \"How long does one take?\" \"Almost an hour.\" \"It costs 2 coins. At 3, a whole hour of careful work earns you one coin.\" Malak thought about it. At 8, very few would buy. They chose 5, and people paid it happily, because the bracelets were really good.",
              ar: "أرادت ملك أن تبيع السوار بـ3 عملات، وقالت: «لا أريد أن أطلب كثيرًا.» سألها جدّو: «كم يستغرق السوار الواحد؟» «ساعة تقريبًا.» «يكلّف عملتين. فبـ3 عملات تكسبين من ساعة عمل دقيق عملة واحدة فقط.» فكّرت ملك. بـ8 عملات سيشتري قليلون جدًا. فاختارا 5، ودفعها الناس عن طيب خاطر، لأن الأساور كانت جميلة حقًا." },
      idea: { en: "Good work deserves a fair price. Time and skill are worth something too.", ar: "العمل الجيد يستحق سعرًا عادلًا. فالوقت والمهارة لهما قيمة." },
      art: "s15",
    },
    {
      type: "equation",
      title: { en: "Leftovers that wait", ar: "بقايا تنتظر" },
      eq: { a: 30, b: 20, c: 10, la: { en: "coins in", ar: "نقود دخلت" }, lb: { en: "coins spent", ar: "نقود صُرفت" }, lc: { en: "profit", ar: "الربح" } },
      text: { en: "On Saturday they made 10 bracelets and sold 6, at 5 coins each. 30 coins came in. The 10 bracelets had cost 20 coins. So 10 coins were profit, and 4 bracelets were left. \"Last summer the leftover juice went down the sink,\" said Yousef. \"These don't spoil.\" He put the 4 bracelets in a little wooden box for next week.",
              ar: "يوم السبت صنعا 10 أساور وباعا 6 منها، كل سوار بـ5 عملات. فدخلت 30 عملة. وكانت الأساور الـ10 قد كلّفت 20 عملة. فكان الربح 10 عملات، وبقيت 4 أساور. قال يوسف: «في الصيف الماضي سُكب العصير الباقي في الحوض. أما هذه فلا تفسد.» ووضع الأساور الـ4 في صندوق خشبي صغير للأسبوع القادم." },
      idea: { en: "Some leftovers keep. They wait in a box for the next customer.", ar: "بعض البقايا لا تفسد، بل تنتظر في صندوق زبونًا جديدًا." },
      art: "s16", focus: "center 12%",
    },
    {
      title: { en: "The box that got too full", ar: "الصندوق الذي امتلأ" },
      text: { en: "\"If they don't spoil, let's make lots!\" said Yousef. That week he made 30 bracelets, all in his favourite colour: orange. Only 5 were sold. Soon the box was full and the piggy bank was thin. Grandpa picked up the box and shook it gently by his ear. \"Do you hear that? Those are 50 coins, fast asleep.\"",
              ar: "قال يوسف: «ما دامت لا تفسد، فلنصنع الكثير!» وفي ذلك الأسبوع صنع 30 سوارًا، كلها بلونه المفضّل: البرتقالي. ولم يُبع منها إلا 5. وسرعان ما امتلأ الصندوق ونحفت الحصّالة. رفع جدّو الصندوق وهزّه بلطف قرب أذنه وقال: «هل تسمع؟ هذه 50 عملة نائمة.»" },
      idea: { en: "Things waiting in a box are coins we can't spend yet.", ar: "الأشياء المنتظرة في الصندوق نقود لا يمكن إنفاقها بعد." },
      art: "s17",
    },
    {
      title: { en: "Ask the customers", ar: "سؤال الزبائن" },
      text: { en: "Malak took her notebook to the summer club. \"What colours do you like? What would you buy?\" Most children said teal and sand. Many asked for one special bead with their own little sign: a heart, a star, a cat. Those took longer and cost 3 coins to make, so they sold them for 8. By Saturday every one was gone.",
              ar: "أخذت ملك دفترها إلى النادي الصيفي وسألت: «ما الألوان التي تحبونها؟ وماذا تشترون؟» قال أغلب الأطفال: الأزرق المخضرّ والرملي. وطلب كثيرون خرزة مميّزة عليها رمز خاص بهم: قلب أو نجمة أو قطة. كانت هذه تأخذ وقتًا أطول وتكلّف 3 عملات، فباعاها بـ8. وقبل السبت نفدت كلها." },
      idea: { en: "Customers tell us what to make, if we ask them.", ar: "الزبائن يخبروننا بما نصنع، إذا سألناهم." },
      art: "s18",
    },
    {
      title: { en: "A fair split", ar: "قسمة عادلة" },
      text: { en: "Orders kept coming, and four hands were not enough. Their friend Hana ties the best knots on the street. \"Can I help?\" she asked. Before anyone threaded a single bead, Grandpa opened his notebook. \"First, agree on the split.\" For every bracelet Hana tied, she would get one coin. They wrote it down, and all three signed.",
              ar: "توالت الطلبات، ولم تعد أربع أيادٍ تكفي. وصديقتهما هناء أمهر من يعقد الخيوط في الشارع. سألت: «هل أستطيع المساعدة؟» وقبل أن تُنظم خرزة واحدة، فتح جدّو دفتره وقال: «أولًا، اتفقوا على القسمة.» لكل سوار تعقده هناء عملة واحدة لها. كتبوا ذلك، ووقّع الثلاثة." },
      idea: { en: "Partners agree on the split before the work starts.", ar: "الشركاء يتفقون على القسمة قبل بدء العمل." },
      art: "s19",
    },
    {
      title: { en: "The big sale", ar: "التخفيضات الكبيرة" },
      text: { en: "In the last week, 25 orange bracelets were still asleep in the box. \"Let's sell them for 3,\" said Malak. \"They cost 2, so we still keep one coin from each.\" They made a small sign that said SALE, and by noon the box was empty. They counted the piggy bank twice: 171 coins. The storybooks cost 160. Yousef drew a little orange cat inside the first book.",
              ar: "في الأسبوع الأخير كانت 25 سوارًا برتقاليًا ما تزال نائمة في الصندوق. قالت ملك: «لنبعها بـ3. كلّفت عملتين، فيبقى لنا من كل واحد عملة.» وكتبا على لافتة صغيرة: «تخفيضات»، وقبل الظهر فرغ الصندوق. وعدّا ما في الحصّالة مرتين: 171 عملة. وثمن كتب الحكايات 160. ورسم يوسف قطة برتقالية صغيرة في أول صفحة من الكتاب الأول." },
      idea: { en: "A sale turns waiting stock back into coins.", ar: "التخفيضات تعيد البضاعة المنتظرة نقودًا." },
      art: "s20",
    },
    ],
  },
  {
    name: { en: "Bike wash and fix", ar: "غسيل الدراجات وإصلاحها" },
    ideas: { en: "The ideas from the bike summer. Which one would help most on a rainy day?", ar: "أفكار صيف الدراجات. أي فكرة منها تنفع أكثر في يوم ماطر؟" },
    activity: "payback",
    scenes: [
    {
      title: { en: "Yousef's turn", ar: "دور يوسف" },
      text: { en: "The third summer, it was Yousef's turn to choose. He pointed down the street. Every bike was dusty, and three had flat tyres. \"People here don't need more juice,\" he said. \"They need their bikes to work.\" The street team needed a real football, and it cost 100 coins. Grandpa nodded slowly. \"A problem people have is a business waiting to happen.\"",
              ar: "في الصيف الثالث جاء دور يوسف في الاختيار. أشار إلى آخر الشارع: كل الدراجات مغبّرة، وثلاث منها إطاراتها فارغة من الهواء. قال: «الناس هنا لا يحتاجون عصيرًا آخر، بل يحتاجون دراجات تعمل.» وكان فريق الشارع يحتاج كرة قدم حقيقية ثمنها 100 عملة. هزّ جدّو رأسه ببطء: «المشكلة التي يعاني منها الناس مشروعٌ ينتظر من يبدأه.»" },
      idea: { en: "A problem people have is a business waiting to happen.", ar: "كل مشكلة عند الناس مشروع ينتظر من يبدأه." },
      art: "s21",
    },
    {
      title: { en: "One wash, one coin", ar: "غسلة بعملة واحدة" },
      text: { en: "Grandpa's notebook came out again. Soap, a sponge, a bucket of water and a rag for drying. One wash cost them one coin. A patch for a flat tyre cost one coin too. \"And a wash takes 15 minutes,\" said Malak, \"so we can do 4 in an hour.\" They wrote their prices on a board: wash 3, patch 3, both for 5.",
              ar: "خرج دفتر جدّو مرة أخرى. صابون وإسفنجة ودلو ماء وقطعة قماش للتجفيف. الغسلة الواحدة تكلّفهما عملة واحدة. ورقعة الإطار المثقوب تكلّف عملة واحدة أيضًا. قالت ملك: «والغسلة تستغرق 15 دقيقة، فنستطيع أن نغسل 4 في الساعة.» وكتبا الأسعار على لوح: الغسيل 3، والرقعة 3، والاثنان معًا 5." },
      idea: { en: "Know the cost and the time of every job.", ar: "لكل عمل تكلفة ووقت، فلنعرفهما." },
      art: "s22",
    },
    {
      title: { en: "Rain again", ar: "المطر مرة أخرى" },
      text: { en: "In week 3 the clouds came back. Nobody wants a bike washed in the rain. Yousef stared at the empty street. Then Malak remembered the juice summer. \"Last time, rain meant juice down the sink. This time, let's have a rain plan.\" They moved into Grandpa's garage and fixed chains, brakes and squeaky bells all afternoon. People were happy to wait indoors.",
              ar: "في الأسبوع 3 عادت الغيوم. لا أحد يريد غسل دراجته تحت المطر. حدّق يوسف في الشارع الفارغ. ثم تذكّرت ملك صيف العصير: «في المرة الماضية كان المطر يعني عصيرًا في الحوض. هذه المرة لتكن عندنا خطة للمطر.» فانتقلا إلى مرأب جدّو، وأصلحا السلاسل والفرامل والأجراس المزعجة طوال العصر. وانتظر الناس في الداخل سعداء." },
      idea: { en: "Make a plan for the bad days before they come.", ar: "لنُعدّ خطة للأيام الصعبة قبل أن تأتي." },
      art: "s23",
    },
    {
      type: "equation",
      title: { en: "The new pump", ar: "المنفاخ الجديد" },
      eq: { a: 24, op: "÷", b: 6, c: 4, la: { en: "pump costs", ar: "ثمن المنفاخ" }, lb: { en: "extra coins a week", ar: "عملات إضافية أسبوعيًا" }, lc: { en: "weeks to pay back", ar: "أسابيع لاسترداده" } },
      text: { en: "Their old hand pump was so slow that people gave up waiting. A good pump cost 24 coins. \"That's a lot of coins,\" said Yousef. Grandpa did the sums with them. With the new pump they could fix 2 more bikes a week, and make 6 more coins of profit. \"In 4 weeks it pays for itself. After that, every extra coin is yours.\" They bought it.",
              ar: "كان منفاخهما اليدوي القديم بطيئًا حتى إن الناس كانوا يملّون الانتظار. والمنفاخ الجيد ثمنه 24 عملة. قال يوسف: «هذه عملات كثيرة.» فحسب جدّو معهما: بالمنفاخ الجديد يمكنهما إصلاح دراجتين إضافيتين كل أسبوع، وكسب 6 عملات ربحًا إضافيًا. «في 4 أسابيع يسترد ثمنه. وبعدها كل عملة إضافية لكما.» فاشترياه." },
      idea: { en: "Investing means spending coins now on something that earns more later.", ar: "الاستثمار إنفاق نقود الآن على شيء يكسب أكثر لاحقًا." },
      art: "s24",
    },
    {
      title: { en: "Too many promises", ar: "وعود كثيرة" },
      text: { en: "Everyone wanted the new pump. \"Ready by Saturday!\" Yousef told every customer. By Friday night there were 9 bikes in the garage and only 4 were done. On Saturday Uncle Saeed came for his bike and had to walk home. Yousef felt terrible. That evening he made a new rule: only promise what we can finish, and say the real time.",
              ar: "الكل أراد المنفاخ الجديد. وكان يوسف يقول لكل زبون: «جاهزة يوم السبت!» وفي ليلة الجمعة كانت في المرأب 9 دراجات، لم يكتمل منها إلا 4. ويوم السبت جاء العم سعيد ليأخذ دراجته، فاضطر أن يعود إلى البيت ماشيًا. شعر يوسف بأسف شديد. وفي ذلك المساء وضع قاعدة جديدة: لا نعد إلا بما نستطيع إنهاءه، ونقول الوقت الحقيقي." },
      idea: { en: "Promise a little less, and do a little more.", ar: "لنَعِد بأقل قليلًا، ونفعل أكثر قليلًا." },
      art: "s25",
    },
    {
      title: { en: "The baker's bike", ar: "دراجة الخبّاز" },
      text: { en: "The baker's delivery bike had a wobbly wheel and a chain that kept slipping. They took their time, cleaned every part and tested it twice. The next morning the baker rode past ringing his bell. \"Best repair on the street!\" he told everyone in his shop. By Saturday there was a line of bikes, and nobody had seen a single poster.",
              ar: "كانت دراجة توصيل الخبّاز عجلتها تتمايل وسلسلتها تنزلق باستمرار. فلم يستعجلا، ونظّفا كل قطعة وجرّباها مرتين. وفي الصباح التالي مرّ الخبّاز يرنّ جرسه، وقال لكل من دخل مخبزه: «أفضل تصليح في الشارع!» ويوم السبت كان هناك طابور من الدراجات، مع أن أحدًا لم يرَ ملصقًا واحدًا." },
      idea: { en: "Happy customers tell their friends. That is the best advert.", ar: "الزبون السعيد يخبر أصدقاءه، وهذا أفضل إعلان." },
      art: "s26",
    },
    {
      title: { en: "The rainy-day jar", ar: "برطمان المفاجآت" },
      text: { en: "Every Saturday, Malak put 3 coins into an old jam jar. \"For surprises,\" she said. Yousef thought it was boring. Then the new pump's hose split. A new hose cost 9 coins. Yousef looked at the piggy bank, which was for the football. Malak opened the jam jar. There were 12 coins inside. \"Surprises,\" she smiled.",
              ar: "كل سبت كانت ملك تضع 3 عملات في برطمان مربى قديم، وتقول: «للمفاجآت.» ورأى يوسف ذلك مملًا. ثم انشقّ خرطوم المنفاخ الجديد، والخرطوم الجديد ثمنه 9 عملات. نظر يوسف إلى الحصّالة، وهي مخصّصة للكرة. ففتحت ملك البرطمان، وكان فيه 12 عملة. وابتسمت: «مفاجآت.»" },
      idea: { en: "Keep some coins for surprises, so the goal stays safe.", ar: "لنحتفظ ببعض النقود للمفاجآت، فيبقى الهدف في أمان." },
      art: "s27",
    },
    {
      title: { en: "The street team", ar: "فريق الشارع" },
      text: { en: "On the last Saturday they counted the piggy bank: 118 coins. The football cost 100. That afternoon the whole street team played with a real ball for the first time. Afterwards, Yousef washed every player's bike for free. \"Why for free?\" asked Malak. \"They are our neighbours,\" said Yousef. \"And next summer, they are our customers.\"",
              ar: "في آخر سبت عدّا ما في الحصّالة: 118 عملة. وثمن الكرة 100. وفي ذلك العصر لعب فريق الشارع كله بكرة حقيقية لأول مرة. وبعد المباراة غسل يوسف دراجة كل لاعب مجانًا. سألته ملك: «لماذا مجانًا؟» قال يوسف: «إنهم جيراننا. وفي الصيف القادم سيكونون زبائننا.»" },
      idea: { en: "A good business takes care of the street it lives on.", ar: "المشروع الجيد يهتم بالشارع الذي يعيش فيه." },
      art: "s28",
    },
    ],
  },
  {
    name: { en: "Cakes and cookies", ar: "كيك وكوكيز" },
    ideas: { en: "The ideas from the baking summer. Which one is worth trying first?", ar: "أفكار صيف الخَبز. أي فكرة منها تستحق التجربة أولًا؟" },
    activity: "bake",
    scenes: [
    {
      title: { en: "Kitchen rules", ar: "قواعد المطبخ" },
      text: { en: "The fourth summer, Malak and Yousef wanted the biggest goal yet: a new bike to share, for 300 coins. \"Cakes!\" said Malak. Mum folded her arms. \"My kitchen, my rules. Clean hands, hair tied back, and a grown-up at the oven, every time.\" Grandpa raised his tea glass. \"Food is a business of trust. People eat what you make.\"",
              ar: "في الصيف الرابع أراد ملك ويوسف أكبر هدف حتى الآن: دراجة جديدة يتشاركانها، ثمنها 300 عملة. قالت ملك: «كيك!» فعقدت ماما ذراعيها: «مطبخي وقواعدي: أيدٍ نظيفة، وشعر مربوط، وشخص كبير عند الفرن في كل مرة.» ورفع جدّو كوب الشاي: «الطعام تجارة قائمة على الثقة. فالناس يأكلون ما نصنعه.»" },
      idea: { en: "Some businesses need rules to keep people safe. Food is one of them.", ar: "بعض المشاريع تحتاج قواعد تحمي الناس، والطعام أولها." },
      art: "s29",
    },
    {
      title: { en: "Costs someone else pays", ar: "تكاليف يدفعها غيرنا" },
      text: { en: "Flour, eggs, sugar, butter and paper cases. One cupcake cost 2 coins to make. One cookie cost one coin. \"So a cupcake at 5 is 3 coins of profit,\" said Yousef. \"And who pays for the oven?\" asked Grandpa. They looked at Mum. The oven, the electricity, the washing up. That night they added a new line to the notebook: one coin a tray, for Mum.",
              ar: "دقيق وبيض وسكر وزبدة وقوالب ورقية. الكب كيك الواحدة تكلّف عملتين، والكوكيز الواحدة تكلّف عملة واحدة. قال يوسف: «إذن الكب كيك بـ5 تعني ربح 3 عملات.» فسأل جدّو: «ومن يدفع ثمن الفرن؟» فنظرا إلى ماما. الفرن والكهرباء وغسيل الأطباق. وفي تلك الليلة أضافا سطرًا جديدًا إلى الدفتر: عملة واحدة عن كل صينية، لماما." },
      idea: { en: "Count the costs that someone else pays for us, too.", ar: "لنحسب أيضًا التكاليف التي يدفعها غيرنا عنّا." },
      art: "s30",
    },
    {
      title: { en: "A taste first", ar: "تذوّق أولًا" },
      text: { en: "On the first Saturday, people walked past the table and kept walking. Then Malak cut one cupcake into 8 tiny pieces and put them on a plate. \"Free taste!\" One tiny piece, then a smile, then \"I'll take two.\" By noon everything was sold. One cupcake given away had sold 14.",
              ar: "في السبت الأول كان الناس يمرّون بالطاولة ويواصلون السير. ثم قطّعت ملك كب كيك واحدة إلى 8 قطع صغيرة، ووضعتها في طبق: «تذوّق مجاني!» قطعة صغيرة، ثم ابتسامة، ثم: «سآخذ اثنتين.» وقبل الظهر بيع كل شيء. كب كيك واحدة مجانية باعت 14." },
      idea: { en: "A small free taste can bring a big sale.", ar: "تذوّق صغير مجاني قد يجلب بيعًا كبيرًا." },
      art: "s31",
    },
    {
      type: "equation",
      title: { en: "Orders first", ar: "الطلبات أولًا" },
      eq: { a: 18, b: 16, c: 2, la: { en: "baked", ar: "خُبز" }, lb: { en: "sold", ar: "بِيع" }, lc: { en: "left over", ar: "بقي" } },
      text: { en: "Cakes spoil, just like juice. So on Thursday Yousef went from door to door with the notebook. \"Would you like cupcakes on Saturday?\" 14 people said yes. They baked 18: the orders, plus 4 for people walking by. By evening only 2 were left, and Grandpa ate those happily. In the juice summer, 14 cups had gone down the sink.",
              ar: "الكيك يفسد مثل العصير تمامًا. لذلك مرّ يوسف يوم الخميس على البيوت ومعه الدفتر: «هل تريدون كب كيك يوم السبت؟» فقال 14 شخصًا: نعم. فخبزا 18: الطلبات، و4 للمارّة. وفي المساء لم يبقَ إلا اثنتان، أكلهما جدّو مسرورًا. أما في صيف العصير فقد سُكب 14 كوبًا في الحوض." },
      idea: { en: "When things spoil, take the orders first, then make.", ar: "إذا كانت البضاعة تفسد، فلنأخذ الطلبات أولًا ثم نصنع." },
      art: "s32",
    },
    {
      title: { en: "Three for five", ar: "3 بـ5" },
      text: { en: "Cookies sold one at a time, for 2 coins each. Then Malak tied 3 cookies together with a ribbon and wrote: 3 for 5. Most people who wanted one cookie took 3 instead. \"We earn less on each cookie,\" said Yousef, counting, \"but we sell many more.\" Grandpa winked. \"And the customer feels clever too.\"",
              ar: "كانت الكوكيز تُباع قطعة قطعة، كل قطعة بعملتين. ثم ربطت ملك 3 قطع بشريط، وكتبت: 3 بـ5. فأغلب من أراد قطعة واحدة أخذ 3. قال يوسف وهو يعدّ: «نكسب أقل من كل قطعة، لكننا نبيع أكثر بكثير.» وغمز جدّو: «والزبون يشعر بالذكاء أيضًا.»" },
      idea: { en: "A bundle helps customers buy more, and helps us sell more.", ar: "العرض المجمّع يجعل الزبون يشتري أكثر، ونبيع نحن أكثر." },
      art: "s33",
    },
    {
      title: { en: "The burnt tray", ar: "الصينية المحروقة" },
      text: { en: "One busy morning they were laughing so much that nobody heard the timer. A whole tray of cookies came out dark brown at the edges. \"They're only a bit burnt,\" said Yousef. \"Would you pay for one?\" asked Malak. He thought about it, and shook his head. They ate a few, crumbled the rest for the birds, and baked a new tray. They never forgot the timer again.",
              ar: "في صباح مزدحم كانا يضحكان كثيرًا فلم يسمع أحد المؤقّت. وخرجت صينية كوكيز كاملة أطرافها بنية داكنة. قال يوسف: «محروقة قليلًا فقط.» سألته ملك: «هل تدفع ثمن واحدة منها؟» ففكّر، ثم هزّ رأسه. أكلا القليل منها، وفتّتا الباقي للعصافير، وخبزا صينية جديدة. ولم ينسيا المؤقّت بعد ذلك أبدًا." },
      idea: { en: "Only sell what we would happily buy ourselves.", ar: "لا نبيع إلا ما نشتريه نحن بسرور." },
      art: "s34",
    },
    {
      title: { en: "The notebook of numbers", ar: "دفتر الأرقام" },
      text: { en: "Every Saturday night Malak wrote it all down: what they baked, what they sold, coins in and coins out. After 6 weeks she spotted something. Chocolate cookies always sold out. Lemon cupcakes were always left over. Fridays were busier than Saturdays. \"The numbers are talking to us,\" she said. So they baked more chocolate, less lemon, and opened on Fridays too.",
              ar: "كل ليلة سبت كانت ملك تكتب كل شيء: ما خبزاه، وما باعاه، والنقود الداخلة، والنقود الخارجة. وبعد 6 أسابيع لاحظت شيئًا: كوكيز الشوكولاتة تنفد دائمًا، وكب كيك الليمون يبقى دائمًا، ويوم الجمعة أكثر زحامًا من السبت. قالت: «الأرقام تكلّمنا.» فخبزا شوكولاتة أكثر وليمونًا أقل، وفتحا يوم الجمعة أيضًا." },
      idea: { en: "Writing the numbers down shows what works.", ar: "كتابة الأرقام تكشف ما ينجح." },
      art: "s35",
    },
    {
      title: { en: "Grandpa's new notebook", ar: "دفتر جدّو الجديد" },
      text: { en: "On the last day of the fourth summer they counted 312 coins. The bike cost 300. There were 12 coins left, and they already knew what to buy. That evening they gave Grandpa a brand new notebook. He opened his old one. Every page was full: juice, bracelets, bikes and cakes. \"This one is for your next summer,\" he said, and gave the new notebook back.",
              ar: "في آخر يوم من الصيف الرابع عدّا 312 عملة. وثمن الدراجة 300. فبقيت 12 عملة، وكانا يعرفان ماذا سيشتريان بها. وفي المساء أهديا جدّو دفترًا جديدًا. ففتح دفتره القديم، وكانت كل صفحاته ممتلئة: عصير وأساور ودراجات وكيك. وقال وهو يعيد إليهما الدفتر الجديد: «هذا لصيفكما القادم.»" },
      idea: { en: "The best profit is what we learn, and who we share it with.", ar: "أفضل ربح هو ما نتعلّمه، ومن نشاركه معه." },
      art: "s36",
    },
    ],
  },
  ],

  ideasPage: {
    title: { en: "Grandpa's ideas", ar: "أفكار جدّو" },
  },

  // Pencil activities after stories 2 to 4. Sections: table (blank last column), ticks (pick one),
  // box (one question), lines (free writing). Answers print upside down at the bottom.
  activityUi: {
    intro: { en: "Fill this in with pencil. The answers are upside down at the bottom of the page.", ar: "تُملأ هذه الصفحة بقلم رصاص. والإجابات مقلوبة في أسفل الصفحة." },
    answers: { en: "Answers", ar: "الإجابات" },
  },
  activities: {
    priceit: {
      title: { en: "Price it, keep it, count it", ar: "تسعير وحفظ وحساب" },
      sections: [
        { type: "table", title: { en: "1. Profit from one", ar: "1. ربح القطعة الواحدة" },
          head: [ { en: "Thing", ar: "الشيء" }, { en: "Cost", ar: "التكلفة" }, { en: "Price", ar: "السعر" }, { en: "Profit", ar: "الربح" } ],
          rows: [
            { img: "o_beads", name: { en: "Bracelet", ar: "سوار" }, cells: [2, 5], answer: 3 },
            { img: "o_palette", name: { en: "Drawing", ar: "رسمة" }, cells: [2, 3], answer: 1 },
            { img: "o_beads", name: { en: "Special-bead bracelet", ar: "سوار بخرزة مميّزة" }, cells: [3, 8], answer: 5 },
          ] },
        { type: "ticks", title: { en: "2. Keeps or spoils?", ar: "2. يُحفظ أم يفسد؟" },
          options: [ { en: "keeps", ar: "يُحفظ" }, { en: "spoils", ar: "يفسد" } ],
          items: [
            { img: "o_lemon", name: { en: "Juice", ar: "عصير" }, answer: 1 },
            { img: "o_beads", name: { en: "Bracelet", ar: "سوار" }, answer: 0 },
            { img: "o_cake", name: { en: "Cake", ar: "كيك" }, answer: 1 },
            { img: "o_palette", name: { en: "Drawing", ar: "رسمة" }, answer: 0 },
          ] },
        { type: "box", title: { en: "3. Coins asleep in the box", ar: "3. نقود نائمة في الصندوق" }, img: "o_beads",
          text: { en: "6 bracelets wait in the box. Each one cost 2 coins to make. How many coins are asleep?", ar: "في الصندوق 6 أساور تنتظر، وكل سوار كلّف عملتين. كم عملة نائمة في الصندوق؟" }, answer: 12 },
      ],
    },
    payback: {
      title: { en: "Investing or spending?", ar: "استثمار أم إنفاق؟" },
      sections: [
        { type: "table", title: { en: "1. How many weeks to pay back?", ar: "1. كم أسبوعًا لاسترداد الثمن؟" },
          head: [ { en: "Thing", ar: "الشيء" }, { en: "Cost", ar: "الثمن" }, { en: "Extra a week", ar: "زيادة كل أسبوع" }, { en: "Weeks", ar: "أسابيع" } ],
          rows: [
            { img: "o_wrench", name: { en: "Faster pump", ar: "منفاخ أسرع" }, cells: [24, 6], answer: 4 },
            { img: "o_sign", name: { en: "Big sign", ar: "لافتة كبيرة" }, cells: [10, 5], answer: 2 },
            { img: "o_bike", name: { en: "Bike stand", ar: "حامل دراجات" }, cells: [6, 2], answer: 3 },
          ] },
        { type: "ticks", title: { en: "2. Investing or spending?", ar: "2. استثمار أم إنفاق؟" },
          options: [ { en: "investing", ar: "استثمار" }, { en: "spending", ar: "إنفاق" } ],
          items: [
            { img: "o_wrench", name: { en: "Faster pump", ar: "منفاخ أسرع" }, answer: 0 },
            { img: "o_icecream", name: { en: "Ice cream", ar: "آيس كريم" }, answer: 1 },
            { img: "o_sign", name: { en: "Big sign", ar: "لافتة كبيرة" }, answer: 0 },
            { img: "o_teddy", name: { en: "Toy bear", ar: "دبدوب" }, answer: 1 },
          ] },
        { type: "lines", title: { en: "3. A rainy-day plan: if no customers come, the business can...", ar: "3. خطة اليوم الماطر: إذا لم يأتِ زبائن، يستطيع المشروع أن..." }, n: 3 },
      ],
    },
    bake: {
      title: { en: "From the oven to the table", ar: "من الفرن إلى الطاولة" },
      sections: [
        { type: "table", title: { en: "1. Profit from a tray", ar: "1. ربح الصينية" },
          head: [ { en: "Thing", ar: "الشيء" }, { en: "Made × cost", ar: "صُنع × التكلفة" }, { en: "Sold × price", ar: "بِيع × السعر" }, { en: "Profit", ar: "الربح" } ],
          rows: [
            { img: "o_cupcake", name: { en: "Cupcakes", ar: "كب كيك" }, cells: ["10 × 2", "8 × 5"], answer: 20 },
            { img: "o_cookie", name: { en: "Cookies", ar: "كوكيز" }, cells: ["12 × 1", "12 × 2"], answer: 12 },
            { img: "o_cake", name: { en: "Birthday cake", ar: "كيكة عيد ميلاد" }, cells: ["1 × 12", "1 × 20"], answer: 8 },
          ] },
        { type: "ticks", title: { en: "2. Sell it or not?", ar: "2. يُباع أم لا؟" },
          options: [ { en: "sell", ar: "يُباع" }, { en: "don't sell", ar: "لا يُباع" } ],
          items: [
            { img: "o_cupcake", name: { en: "Today's cupcake", ar: "كب كيك اليوم" }, answer: 0 },
            { img: "o_cookie", name: { en: "Burnt cookie", ar: "كوكيز محروقة" }, answer: 1 },
            { img: "o_cake", name: { en: "Last week's cake", ar: "كيك الأسبوع الماضي" }, answer: 1 },
            { img: "o_cookie", name: { en: "Fresh cookie", ar: "كوكيز طازجة" }, answer: 0 },
          ] },
        { type: "box", title: { en: "3. Three for five", ar: "3. ثلاث قطع بـ5" }, img: "o_cookie",
          text: { en: "One cookie costs 2 coins, or 3 cookies cost 5. How many coins are saved by buying 3 together?", ar: "القطعة الواحدة بعملتين، و3 قطع بـ5. كم عملة تُوفَّر عند شراء 3 معًا؟" }, answer: 1 },
      ],
    },
  },

  talk: {
    title: { en: "Let's talk about it", ar: "لنتحدّث" },
    intro: { en: "Questions for the family or the class, after each story. There are no wrong answers.", ar: "أسئلة للعائلة أو للفصل بعد كل حكاية. لا توجد إجابات خاطئة." },
    questions: [
      [ { en: "Why did 14 cups of juice go down the sink? What could they do differently?", ar: "لماذا سُكب 14 كوبًا من العصير في الحوض؟ وماذا كان يمكن فعله بطريقة مختلفة؟" },
        { en: "Was it right to run after the lady with the 6 extra coins? Why?", ar: "هل كان الركض خلف السيدة لإرجاع العملات الـ6 الزائدة صوابًا؟ ولماذا؟" } ],
      [ { en: "Malak wanted to sell for 3 coins. Why did Grandpa think 5 was fairer?", ar: "أرادت ملك البيع بـ3 عملات. لماذا رأى جدّو أن 5 أعدل؟" },
        { en: "What was the problem with 30 orange bracelets?", ar: "ما المشكلة في 30 سوارًا برتقاليًا؟" } ],
      [ { en: "Was the new pump worth 24 coins? How do we know?", ar: "هل كان المنفاخ الجديد يستحق 24 عملة؟ وكيف نعرف ذلك؟" },
        { en: "Has there ever been a promise that was hard to keep? What happened?", ar: "هل حدث يومًا وعد كان الوفاء به صعبًا؟ وماذا حدث؟" } ],
      [ { en: "Why did they take orders before baking?", ar: "لماذا أخذا الطلبات قبل الخَبز؟" },
        { en: "What should be written first in Grandpa's new notebook?", ar: "ماذا يُكتب أولًا في دفتر جدّو الجديد؟" } ],
    ],
  },

  certificate: {
    title: { en: "Little Entrepreneur", ar: "الانتربرونور الصغير" },
    kicker: { en: "Certificate", ar: "شهادة" },
    line: { en: "For planning, pricing, counting and saving like a real entrepreneur.", ar: "تقديرًا للتخطيط والتسعير والحساب والادّخار، مثل رواد الأعمال الحقيقيين." },
    fields: [ { en: "Name", ar: "الاسم" }, { en: "My business", ar: "المشروع" }, { en: "Date", ar: "التاريخ" }, { en: "Signed by a grown-up", ar: "توقيع أحد الكبار" } ],
  },

  worksheet: {
    title: { en: "Your turn: plan a tiny business", ar: "دورك: خطة مشروع صغير" },
    intro: { en: "Fill this in with pencil. Plan it with a grown-up, and buy supplies together.", ar: "تُملأ هذه الصفحة بقلم رصاص. ويكون التخطيط مع أحد الكبار، وشراء المستلزمات معه." },
    fields: [
      { en: "My business idea", ar: "فكرة المشروع" },
      { en: "What do people want?", ar: "ماذا يريد الناس؟" },
      { en: "Cost to make one", ar: "تكلفة الواحدة", unit: true },
      { en: "My price for one", ar: "سعر الواحدة", unit: true },
      { en: "How many I think I can sell", ar: "العدد المتوقع بيعه" },
    ],
    sum: { en: "Coins in − coins spent = profit", ar: "نقود دخلت − نقود صُرفت = الربح" },
    goal: { en: "I am saving for", ar: "حلم الادّخار" },
    coins: { en: "coins", ar: "عملة" },
  },

  manualIntro: {
    title: { en: "How to play The Little Entrepreneur", ar: "طريقة لعب الانتربرونور الصغير" },
    paras: [
      { en: "In the game you run your own tiny business for a 12-week summer, just like Malak and Yousef. Pick a business, set a savings goal, and make one plan a week.",
        ar: "في اللعبة مشروع صغير خاص بك لصيف من 12 أسبوعًا، تمامًا مثل ملك ويوسف: اختيار المشروع، وتحديد هدف للادّخار، وخطة واحدة كل أسبوع." },
      { en: "Play free at adam.ahmedhaz.com/little in any browser. It works offline once opened, in Arabic and English. A summer takes about 15 minutes.",
        ar: "اللعب مجاني على adam.ahmedhaz.com/little في أي متصفح. واللعبة تعمل دون اتصال بعد فتحها أول مرة، بالعربية والإنجليزية. ويستغرق الصيف نحو 15 دقيقة." },
    ],
  },

  manual: [
    {
      title: { en: "Start a summer", ar: "بداية الصيف" }, shot: "setup",
      steps: [
        { en: "Type your first name. It stays on your device.", ar: "كتابة الاسم الأول. ويبقى على الجهاز فقط." },
        { en: "Pick your picture.", ar: "اختيار صورتك في اللعبة." },
        { en: "Pick a business: Juice stand, Drawings & bracelets, Bike wash & fix, or Cakes & cookies.", ar: "اختيار المشروع: كشك العصير، أو رسومات وأساور، أو غسيل الدراجات وإصلاحها، أو كيك وكوكيز." },
        { en: "Pick a goal: a football (100), a book set (160), a gift for Mum (220) or a new bike (300).", ar: "اختيار الهدف: كرة قدم (100)، أو مجموعة كتب (160)، أو هدية لماما (220)، أو دراجة جديدة (300)." },
      ],
    },
    {
      title: { en: "Your three meters", ar: "العدّادات الثلاثة" }, shot: "plan", crop: "top",
      steps: [
        { en: "Coins: everything you have. Making things costs coins, selling brings them back.", ar: "نقود: كل ما في صندوقك. الصنع يكلّف نقودًا، والبيع يعيدها." },
        { en: "Energy: selling and staying up late use it, rest brings it back. Under 40 you get sleepy. At 70 or more, a wise third choice opens.", ar: "طاقة: البيع والسهر يستهلكانها، والراحة تعيدها. تحت 40 يأتي النعاس. ومن 70 فما فوق يُفتح خيار ثالث حكيم." },
        { en: "Smiles: how much customers like your stand. Fair prices and good quality raise it.", ar: "ابتسامات: مقدار حب الزبائن لكشكك. السعر المعتدل والجودة الجيدة يرفعانها." },
        { en: "The piggy bank bar shows how close you are to your goal.", ar: "شريط الحصّالة يوضّح المسافة الباقية إلى الهدف." },
      ],
    },
    {
      title: { en: "Plan your week", ar: "خطة الأسبوع" }, shot: "plan",
      steps: [
        { en: "Check the market day weather. Hot days bring more juice customers, rain brings fewer.", ar: "نظرة إلى طقس يوم السوق. الأيام الحارة تجلب زبائن عصير أكثر، والمطر يقلّلهم." },
        { en: "Choose a price: cheap, fair or high.", ar: "اختيار السعر: رخيص أو معتدل أو غالٍ." },
        { en: "Choose how many to make. Grandpa guesses how many customers will come.", ar: "اختيار الكمية. وجدّو يتوقّع عدد الزبائن." },
        { en: "Choose one activity: Make a poster, Practise, Study, or Rest & play.", ar: "اختيار نشاط واحد: صنع ملصق، أو تدريب، أو مذاكرة، أو راحة ولعب." },
      ],
    },
    {
      title: { en: "Market day and results", ar: "يوم السوق والنتيجة" }, shot: "results",
      steps: [
        { en: "Watch the customers arrive, or tap Skip.", ar: "مشاهدة الزبائن وهم يصلون، أو الضغط على «هيا نتخطّى»." },
        { en: "Read the results: coins in, coins spent, and the profit.", ar: "قراءة النتيجة: نقود دخلت، ونقود صُرفت، والربح." },
        { en: "Juice and cakes spoil. Drawings and wash kits are kept for next week.", ar: "العصير والكيك يفسدان. أما الرسومات وعُدّة الغسيل فتُحفظ للأسبوع القادم." },
        { en: "Spend a few coins on a treat, or save them in the piggy bank.", ar: "إنفاق بعض النقود على شيء ممتع، أو ادّخارها في الحصّالة." },
      ],
    },
    {
      title: { en: "Dilemmas and the wise door", ar: "المعضلات والباب الحكيم" }, shot: "door",
      steps: [
        { en: "Most weeks bring a small dilemma with two fair answers. Each one costs something.", ar: "أغلب الأسابيع تأتي بمعضلة صغيرة لها جوابان معقولان، ولكل منهما ثمن." },
        { en: "With 70 energy or more, a third door opens: the wise door.", ar: "مع طاقة 70 أو أكثر يُفتح باب ثالث: الباب الحكيم." },
        { en: "After each choice, Grandpa shares an idea, and it goes into your sticker book.", ar: "وبعد كل اختيار يشارك جدّو فكرة تدخل دفتر الملصقات." },
      ],
    },
    {
      title: { en: "Echoes, homework and sleepy days", ar: "الصدى والواجبات والنعاس" }, shot: "echo",
      steps: [
        { en: "Some choices come back weeks later, with the week they came from.", ar: "بعض الاختيارات تعود بعد أسابيع، ومعها رقم الأسبوع الذي جاءت منه." },
        { en: "Study at least once every 3 weeks, or Mum or Dad closes the stand for a week.", ar: "المذاكرة مرة كل 3 أسابيع على الأقل، وإلا أغلقت ماما أو بابا الكشك أسبوعًا." },
        { en: "Under 40 energy, the numbers wobble and change gets miscounted. Rest fixes it.", ar: "تحت 40 من الطاقة تتمايل الأرقام ويُحسب الباقي خطأً. والراحة تصلح ذلك." },
      ],
    },
    {
      title: { en: "The end of summer", ar: "نهاية الصيف" }, shot: "report",
      steps: [
        { en: "Reach your goal by week 12 to win it.", ar: "الوصول إلى الهدف قبل نهاية الأسبوع 12 يعني الفوز به." },
        { en: "Your report card gives stars for Money, Customers, Balance and Honesty.", ar: "بطاقة التقييم تعطي نجومًا للحساب والعملاء والتوازن والأمانة." },
        { en: "No harsh endings. If you don't make it, Grandpa sums up what you learned and offers another summer.", ar: "لا نهايات قاسية. وإذا لم يكتمل الهدف يلخّص جدّو ما تعلّمته ويعرض صيفًا آخر." },
      ],
    },
  ],

  businesses: {
    title: { en: "The four businesses", ar: "المشاريع الأربعة" },
    head: [ { en: "Business", ar: "المشروع" }, { en: "Cost to make one", ar: "تكلفة الواحدة" }, { en: "Prices", ar: "الأسعار" }, { en: "Leftovers", ar: "البقايا" } ],
    rows: [
      { img: "o_lemon", name: { en: "Juice stand", ar: "كشك العصير" }, cost: 1, prices: "2 · 3 · 5", left: { en: "spoil", ar: "تفسد" } },
      { img: "o_palette", name: { en: "Drawings & bracelets", ar: "رسومات وأساور" }, cost: 2, prices: "3 · 5 · 8", left: { en: "kept", ar: "تُحفظ" } },
      { img: "o_bike", name: { en: "Bike wash & fix", ar: "غسيل الدراجات وإصلاحها" }, cost: 1, prices: "2 · 3 · 5", left: { en: "kept", ar: "تُحفظ" } },
      { img: "o_cake", name: { en: "Cakes & cookies", ar: "كيك وكوكيز" }, cost: 2, prices: "3 · 5 · 8", left: { en: "spoil", ar: "تفسد" } },
    ],
    tipsTitle: { en: "Grandpa's tips for a good summer", ar: "نصائح جدّو لصيف ناجح" },
    tips: [
      { en: "Make about as many as Grandpa guesses.", ar: "صنع كمية قريبة من توقّع جدّو." },
      { en: "A fair price is a good place to start.", ar: "السعر المعتدل بداية جيدة." },
      { en: "Rest before energy drops under 40.", ar: "الراحة قبل أن تنزل الطاقة تحت 40." },
      { en: "Study at least once every 3 weeks.", ar: "المذاكرة مرة كل 3 أسابيع على الأقل." },
      { en: "Treats are fine. Just not every week.", ar: "الأشياء الممتعة جميلة، لكن ليس كل أسبوع." },
    ],
  },

  glossary: {
    title: { en: "Words to know", ar: "كلمات مهمة" },
    words: [
      { img: "o_coin", w: { en: "Cost", ar: "التكلفة" }, d: { en: "What you pay to make something.", ar: "ما ندفعه لنصنع الشيء." } },
      { img: "o_sign", w: { en: "Price", ar: "السعر" }, d: { en: "What a customer pays you for it.", ar: "ما يدفعه الزبون مقابل الشيء." } },
      { img: "o_bag", w: { en: "Profit", ar: "الربح" }, d: { en: "Coins in minus coins spent.", ar: "النقود الداخلة ناقص النقود المصروفة." } },
      { img: "o_smile", w: { en: "Customer", ar: "الزبون" }, d: { en: "Someone who buys from you.", ar: "من يشتري منك." } },
      { img: "o_cups", w: { en: "Leftovers", ar: "البقايا" }, d: { en: "Things you made but didn't sell.", ar: "ما صُنع ولم يُبع." } },
      { img: "o_beads", w: { en: "Stock", ar: "البضاعة" }, d: { en: "Things that keep, waiting to be sold.", ar: "أشياء لا تفسد، تنتظر أن تُباع." } },
      { img: "o_piggy", w: { en: "Saving", ar: "الادّخار" }, d: { en: "Keeping coins now for something bigger later.", ar: "الاحتفاظ بالنقود الآن من أجل شيء أكبر لاحقًا." } },
      { img: "o_cake", w: { en: "Order", ar: "الطلب" }, d: { en: "A customer asks for something before you make it.", ar: "زبون يطلب الشيء قبل أن يُصنع." } },
      { img: "o_wrench", w: { en: "Investing", ar: "الاستثمار" }, d: { en: "Spending coins on something that helps you earn more.", ar: "إنفاق النقود على شيء يساعد على كسب المزيد." } },
      { img: "o_hands", w: { en: "Partner", ar: "الشريك" }, d: { en: "Someone who shares the work and the profit.", ar: "من يشارك في العمل وفي الربح." } },
    ],
  },

  back: {
    lines: [
      { en: "Play the game free", ar: "اللعبة مجانية" },
      { en: "No ads · No accounts · Nothing to buy", ar: "بلا إعلانات · بلا حسابات · لا شيء للشراء" },
    ],
    blurb: { en: "Four summers, four tiny businesses. With juice, beads, a bike pump, a mixing bowl and Grandpa's notebook, Malak and Yousef learn what every business owner knows: cost, price, profit, stock, investing, customers, saving and honesty.",
             ar: "أربعة فصول صيف، وأربعة مشاريع صغيرة. ومع العصير والخرز والمنفاخ ووعاء الخَبز ودفتر جدّو، يتعلّم ملك ويوسف ما يعرفه كل صاحب مشروع: التكلفة والسعر والربح والبضاعة والاستثمار والزبائن والادّخار والأمانة." },
  },
};
