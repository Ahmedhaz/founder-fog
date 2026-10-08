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
    subtitle: { en: "A summer business story, and how to play the game", ar: "حكاية مشروع صيفي، ودليل اللعب" },
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
      { en: "This book has two parts. The stories follow Malak and Yousef through two summers: one with a juice stand, and one making drawings and bracelets. Each scene ends with one of Grandpa's ideas about money: cost, price, profit, saving, stock, partners, honesty and rest.",
        ar: "لهذا الكتاب جزءان. تتبع الحكايات ملك ويوسف خلال صيفين: صيف مع كشك عصير، وصيف يصنعان فيه رسومات وأساور. وينتهي كل مشهد بفكرة من أفكار جدّو عن المال: التكلفة والسعر والربح والادّخار والبضاعة والشراكة والأمانة والراحة." },
      { en: "The second part shows how to play The Little Entrepreneur, the free game the stories come from. It works in any browser and on phones, with no ads, no accounts and nothing to buy.",
        ar: "ويشرح الجزء الثاني طريقة لعب «الانتربرونور الصغير»، اللعبة المجانية التي خرجت منها الحكايات. تعمل في أي متصفح وعلى الهواتف، بلا إعلانات ولا حسابات ولا مشتريات." },
      { en: "A good way to use it: read one scene together, talk about Grandpa's idea, then let your child try it in the game. After each story there are activity pages, and at the end a page for planning a real tiny business.",
        ar: "طريقة مقترحة: قراءة مشهد واحد معًا، ثم الحديث عن فكرة جدّو، ثم ترك الطفل يجرّبها في اللعبة. وبعد كل حكاية صفحات أنشطة، وفي النهاية صفحة لتخطيط مشروع صغير حقيقي." },
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
  ],

  ideasPage: {
    title: { en: "Grandpa's ideas", ar: "أفكار جدّو" },
  },

  // After the bracelet story: pencil puzzles. Answers sit upside down at the bottom.
  priceit: {
    title: { en: "Price it, keep it, count it", ar: "تسعير وحفظ وحساب" },
    intro: { en: "Fill this in with pencil. The answers are upside down at the bottom of the page.", ar: "تُملأ هذه الصفحة بقلم رصاص. والإجابات مقلوبة في أسفل الصفحة." },
    profitTitle: { en: "1. Profit from one", ar: "1. ربح القطعة الواحدة" },
    head: [ { en: "Thing", ar: "الشيء" }, { en: "Cost", ar: "التكلفة" }, { en: "Price", ar: "السعر" }, { en: "Profit", ar: "الربح" } ],
    rows: [
      { img: "o_beads", name: { en: "Bracelet", ar: "سوار" }, cost: 2, price: 5 },
      { img: "o_palette", name: { en: "Drawing", ar: "رسمة" }, cost: 2, price: 3 },
      { img: "o_beads", name: { en: "Special-bead bracelet", ar: "سوار بخرزة مميّزة" }, cost: 3, price: 8 },
    ],
    keepTitle: { en: "2. Keeps or spoils?", ar: "2. يُحفظ أم يفسد؟" },
    keeps: { en: "keeps", ar: "يُحفظ" },
    spoils: { en: "spoils", ar: "يفسد" },
    items: [
      { img: "o_lemon", name: { en: "Juice", ar: "عصير" }, keeps: false },
      { img: "o_beads", name: { en: "Bracelet", ar: "سوار" }, keeps: true },
      { img: "o_cake", name: { en: "Cake", ar: "كيك" }, keeps: false },
      { img: "o_palette", name: { en: "Drawing", ar: "رسمة" }, keeps: true },
    ],
    boxTitle: { en: "3. Coins asleep in the box", ar: "3. نقود نائمة في الصندوق" },
    box: { n: 6, cost: 2, text: { en: "6 bracelets wait in the box. Each one cost 2 coins to make. How many coins are asleep?", ar: "في الصندوق 6 أساور تنتظر، وكل سوار كلّف عملتين. كم عملة نائمة في الصندوق؟" } },
    answers: { en: "Answers", ar: "الإجابات" },
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
      { img: "o_wrench", w: { en: "Investing", ar: "الاستثمار" }, d: { en: "Spending coins on something that helps you earn more.", ar: "إنفاق النقود على شيء يساعد على كسب المزيد." } },
      { img: "o_hands", w: { en: "Partner", ar: "الشريك" }, d: { en: "Someone who shares the work and the profit.", ar: "من يشارك في العمل وفي الربح." } },
    ],
  },

  back: {
    lines: [
      { en: "Play the game free", ar: "اللعبة مجانية" },
      { en: "No ads · No accounts · Nothing to buy", ar: "بلا إعلانات · بلا حسابات · لا شيء للشراء" },
    ],
    blurb: { en: "Two summers, two tiny businesses. With a juice stand, a box of beads, a notebook and Grandpa's ideas, Malak and Yousef learn what every business owner knows: cost, price, profit, stock, partners, saving and honesty.",
             ar: "صيفان ومشروعان صغيران. ومع كشك عصير وعلبة خرز ودفتر وأفكار جدّو، يتعلّم ملك ويوسف ما يعرفه كل صاحب مشروع: التكلفة والسعر والربح والبضاعة والشراكة والادّخار والأمانة." },
  },
};
