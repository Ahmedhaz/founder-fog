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
// Scenes: bg is day | hot | rain | night | room. Items are placed in % of the scene box:
//   { i: image name, x: left %, y: bottom %, w: width %, flip, rot, z }.
//   { stand: true, x, w, sign: { en, ar } } draws the juice stand.

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
  },

  title: {
    lines: [
      { en: "A story about Malak, Yousef and Grandpa, and a guide to the free game.", ar: "حكاية عن ملك ويوسف وجدّو، ودليل للعبة المجانية." },
      { en: "Written for children aged 8 to 12 and the grown-ups who read with them.", ar: "مكتوبة للأطفال من 8 إلى 12 عامًا، وللكبار الذين يقرؤون معهم." },
    ],
    credits: [
      { en: "Pictures: Microsoft Fluent Emoji (MIT licence). Font: Baloo Bhaijaan 2 (SIL Open Font Licence).", ar: "الصور: Microsoft Fluent Emoji (رخصة MIT). الخط: Baloo Bhaijaan 2 (رخصة SIL المفتوحة)." },
      { en: "Free to print and share with family, friends and schools.", ar: "مجاني للطباعة والمشاركة مع العائلة والأصدقاء والمدارس." },
      { en: "© 2026 adam.ahmedhaz.com", ar: "© 2026 adam.ahmedhaz.com" },
    ],
  },

  parents: {
    title: { en: "For the grown-ups", ar: "إلى الكبار" },
    paras: [
      { en: "This book has two parts. The story follows Malak and Yousef through one summer with a juice stand. Each scene ends with one of Grandpa's ideas about money: cost, price, profit, saving, honesty and rest.",
        ar: "لهذا الكتاب جزءان. تتبع الحكاية ملك ويوسف خلال صيف واحد مع كشك عصير. وينتهي كل مشهد بفكرة من أفكار جدّو عن المال: التكلفة والسعر والربح والادّخار والأمانة والراحة." },
      { en: "The second part shows how to play The Little Entrepreneur, the free game the story comes from. It works in any browser and on phones, with no ads, no accounts and nothing to buy.",
        ar: "ويشرح الجزء الثاني طريقة لعب «الانتربرونور الصغير»، اللعبة المجانية التي خرجت منها الحكاية. تعمل في أي متصفح وعلى الهواتف، بلا إعلانات ولا حسابات ولا مشتريات." },
      { en: "A good way to use it: read one scene together, talk about Grandpa's idea, then let your child try it in the game. At the end there is a page for planning a real tiny business.",
        ar: "طريقة مقترحة: قراءة مشهد واحد معًا، ثم الحديث عن فكرة جدّو، ثم ترك الطفل يجرّبها في اللعبة. وبعد الحكاية صفحة لتخطيط مشروع صغير حقيقي." },
    ],
  },

  story: [
    {
      title: { en: "Summer begins", ar: "الصيف يبدأ" },
      text: { en: "On the first day of summer, Malak and Yousef had a plan. \"Mum's birthday is at the end of summer,\" said Malak. \"We want to buy her a real gift.\" Yousef emptied his pockets: 15 coins. \"That's not enough,\" he sighed. Grandpa put down his tea. \"Then let's earn the rest. What do people here want on a hot day?\" \"Something cold!\" they shouted together.",
              ar: "في أول يوم من الصيف، كانت لدى ملك ويوسف خطة. قالت ملك: «عيد ميلاد ماما في آخر الصيف، ونريد أن نشتري لها هدية حقيقية.» أفرغ يوسف جيوبه: 15 عملة، وتنهّد: «هذا لا يكفي.» وضع جدّو كوب الشاي وقال: «إذن لنكسب الباقي. ماذا يريد الناس هنا في يوم حار؟» فصاحا معًا: «شيئًا باردًا!»" },
      idea: { en: "A business starts with something people want.", ar: "كل مشروع يبدأ بشيء يريده الناس." },
      scene: { bg: "day", items: [
        { i: "sun", x: 78, y: 70, w: 16 }, { i: "deciduous_tree", x: 2, y: 18, w: 26 },
        { i: "old_man", x: 38, y: 16, w: 22 }, { i: "hot_beverage", x: 57, y: 16, w: 10 },
        { i: "girl", x: 14, y: 12, w: 20 }, { i: "boy", x: 68, y: 12, w: 20, flip: true },
        { i: "coin", x: 86, y: 14, w: 8 }, { i: "wrapped_gift", x: 26, y: 58, w: 12, rot: -10 } ] },
    },
    {
      title: { en: "What does one cup cost?", ar: "كم يكلّف الكوب الواحد؟" },
      text: { en: "Grandpa opened his old notebook. \"Lemons, sugar, water and a paper cup. Let's count.\" They added it all up and divided it by the number of cups. \"One cup costs us one coin to make,\" said Yousef. \"That is our cost,\" said Grandpa. \"We pay for every cup we make, even if nobody buys it.\"",
              ar: "فتح جدّو دفتره القديم وقال: «ليمون وسكر وماء وكوب ورقي. لنحسب.» جمعا كل شيء وقسماه على عدد الأكواب. قال يوسف: «الكوب الواحد يكلّفنا عملة واحدة.» فقال جدّو: «هذه هي التكلفة. كل كوب نصنعه ندفع ثمنه، حتى لو لم يشتره أحد.»" },
      idea: { en: "Cost is what you pay to make something.", ar: "التكلفة هي ما ندفعه لنصنع الشيء." },
      scene: { bg: "room", items: [
        { i: "old_man", x: 40, y: 14, w: 22 }, { i: "notebook", x: 44, y: 54, w: 14, rot: -8 },
        { i: "pencil", x: 60, y: 60, w: 9, rot: 20 }, { i: "girl", x: 10, y: 12, w: 21 },
        { i: "boy", x: 70, y: 12, w: 21, flip: true }, { i: "lemon", x: 22, y: 60, w: 11 },
        { i: "cup_with_straw", x: 76, y: 58, w: 11 }, { i: "abacus", x: 2, y: 64, w: 13 } ] },
    },
    {
      title: { en: "Choosing a price", ar: "اختيار السعر" },
      text: { en: "Two, 3 or 5 coins a cup? \"5!\" said Yousef. \"More money!\" Malak shook her head. \"At 5, fewer people will stop. At two coins lots will come, but we only keep one coin from each cup.\" Grandpa smiled. \"Try 3. It is fair for them, and fair for you.\" They wrote it on the sign in big letters: 3 coins.",
              ar: "عملتان أم 3 أم 5 للكوب؟ قال يوسف: «5! نقود أكثر!» هزّت ملك رأسها: «بـ5 سيتوقف عدد أقل من الناس. وبعملتين سيأتي كثيرون، لكن لن يبقى لنا من كل كوب إلا عملة واحدة.» ابتسم جدّو: «جرّبا 3. سعر عادل لهم، وعادل لكما.» وكتبا على اللافتة بخط كبير: 3 عملات." },
      idea: { en: "A high price brings fewer customers. A low price brings less profit per cup.", ar: "السعر الغالي يجلب زبائن أقل، والرخيص يجلب ربحًا أقل من كل كوب." },
      scene: { bg: "day", items: [
        { stand: true, x: 30, w: 44, sign: { en: "Lemonade · 3", ar: "ليموناضة · 3" } },
        { i: "girl", x: 6, y: 10, w: 20 }, { i: "pencil", x: 21, y: 30, w: 8, rot: -30 },
        { i: "boy", x: 76, y: 10, w: 20, flip: true }, { i: "thinking_face", x: 84, y: 56, w: 11 },
        { i: "sun", x: 4, y: 72, w: 13 } ] },
    },
    {
      title: { en: "Market day!", ar: "يوم السوق!" },
      text: { en: "On Saturday they made 12 cups. The sun was out, and so were the neighbours. By noon, 11 cups were gone. Yousef counted the coins twice: 33 coins. \"We're rich!\" he cheered. \"Not so fast,\" said Grandpa. \"How much did the cups cost?\" \"12 coins.\" \"So what is left?\"",
              ar: "يوم السبت صنعا 12 كوبًا. كانت الشمس مشرقة، والجيران في الخارج. وقبل الظهر بِيع 11 كوبًا. عدّ يوسف النقود مرتين: 33 عملة، وهتف: «صرنا أغنياء!» قال جدّو: «على مهلك. كم كلّفت الأكواب؟» «12 عملة.» «إذن كم بقي؟»" },
      idea: { en: "Counting the coins that came in is only half of the story.", ar: "عدّ النقود التي دخلت نصف الحكاية فقط." },
      scene: { bg: "hot", items: [
        { stand: true, x: 52, w: 44, sign: { en: "Lemonade · 3", ar: "ليموناضة · 3" } },
        { i: "girl", x: 60, y: 30, w: 15 }, { i: "boy", x: 76, y: 30, w: 15, flip: true },
        { i: "woman", x: 2, y: 8, w: 16 }, { i: "child", x: 17, y: 8, w: 13 }, { i: "old_woman", x: 30, y: 8, w: 15 },
        { i: "coin", x: 46, y: 60, w: 8, rot: 15 }, { i: "coin", x: 40, y: 70, w: 7, rot: -20 }, { i: "sun", x: 4, y: 72, w: 14 } ] },
    },
    {
      type: "equation",
      title: { en: "Profit", ar: "الربح" },
      eq: { a: 33, b: 12, c: 21, la: { en: "coins in", ar: "نقود دخلت" }, lb: { en: "coins spent", ar: "نقود صُرفت" }, lc: { en: "profit", ar: "الربح" } },
      text: { en: "Malak wrote it on the back of the sign. 33 coins came in. 12 coins went out. 21 coins are profit. \"Profit is what's left after paying for everything,\" said Grandpa. Yousef put the 21 coins in the piggy bank very slowly, one by one.",
              ar: "كتبت ملك على ظهر اللافتة: دخلت 33 عملة، وخرجت 12 عملة، والربح 21 عملة. قال جدّو: «الربح هو ما يبقى بعد دفع كل شيء.» ووضع يوسف العملات الـ21 في الحصّالة ببطء شديد، واحدة بعد واحدة." },
      idea: { en: "Profit = coins in − coins spent.", ar: "الربح = النقود الداخلة − النقود المصروفة." },
      scene: { bg: "room", items: [ { i: "pig_face", x: 40, y: 14, w: 22 }, { i: "coin", x: 46, y: 64, w: 9 }, { i: "coin", x: 34, y: 76, w: 8, rot: 20 }, { i: "coin", x: 58, y: 80, w: 7, rot: -25 } ] },
    },
    {
      title: { en: "A rainy Saturday", ar: "سبت ماطر" },
      text: { en: "The next Saturday they made 20 cups. Then the clouds came. Only 6 people stopped, and they wanted something warm. That evening, 14 cups of juice went down the sink. \"We paid for those,\" said Yousef quietly. \"Next time,\" said Malak, \"we look at the sky first, and make about as many as people will buy.\"",
              ar: "في السبت التالي صنعا 20 كوبًا. ثم جاءت الغيوم. توقّف 6 أشخاص فقط، وكانوا يريدون شيئًا دافئًا. وفي المساء سُكب 14 كوبًا من العصير في الحوض. قال يوسف بهدوء: «لقد دفعنا ثمنها.» فقالت ملك: «في المرة القادمة ننظر إلى السماء أولًا، ونصنع بقدر ما سيشتري الناس تقريبًا.»" },
      idea: { en: "Leftovers that spoil are coins thrown in the bin. Making fewer is a skill.", ar: "البقايا التي تفسد نقودٌ تُرمى في سلّة المهملات. وصنع كمية أقل مهارة." },
      scene: { bg: "rain", items: [
        { i: "cloud_with_rain", x: 6, y: 62, w: 22 }, { i: "cloud_with_rain", x: 66, y: 66, w: 20 },
        { stand: true, x: 28, w: 44, sign: { en: "Lemonade · 3", ar: "ليموناضة · 3" } },
        { i: "umbrella_with_rain_drops", x: 4, y: 14, w: 22 }, { i: "grimacing_face", x: 76, y: 14, w: 15 },
        { i: "cup_with_straw", x: 36, y: 44, w: 9 }, { i: "cup_with_straw", x: 46, y: 44, w: 9 }, { i: "cup_with_straw", x: 56, y: 44, w: 9 } ] },
    },
    {
      title: { en: "Too sour!", ar: "حامض جدًا!" },
      text: { en: "Uncle Saeed took one sip and made a face. \"Too sour!\" he said, loud enough for the whole line to hear. Yousef's cheeks went red. Malak poured a new cup with more sugar. \"Can you tell us if this one is better?\" He tried it, nodded, and told the line, \"Now it's perfect.\" That afternoon they changed the recipe for good.",
              ar: "أخذ العم سعيد رشفة واحدة وتجهّم وجهه، وقال بصوت سمعه الطابور كله: «حامض جدًا!» احمرّ وجه يوسف. أما ملك فصبّت كوبًا جديدًا بسكر أكثر وقالت: «هل تخبرنا إن كان هذا أفضل؟» جرّبه وهزّ رأسه موافقًا وقال للطابور: «الآن صار ممتازًا.» وفي ذلك العصر غيّرا الوصفة نهائيًا." },
      idea: { en: "A complaint is free advice.", ar: "الشكوى نصيحة مجانية." },
      scene: { bg: "day", items: [
        { stand: true, x: 46, w: 44, sign: { en: "Lemonade · 3", ar: "ليموناضة · 3" } },
        { i: "man", x: 8, y: 10, w: 20 }, { i: "lemon", x: 24, y: 46, w: 11, rot: 25 },
        { i: "girl", x: 54, y: 30, w: 15 }, { i: "boy", x: 70, y: 30, w: 15, flip: true },
        { i: "thumbs_up", x: 30, y: 62, w: 10 } ] },
    },
    {
      title: { en: "6 extra coins", ar: "6 عملات زائدة" },
      text: { en: "At closing time, the box had 6 coins too many. \"The lady with the green basket paid too much,\" said Malak. \"Nobody will know,\" said Yousef. Malak looked at him. Yousef sighed, and they ran after her down the street. The lady laughed. \"Nobody has ever chased me to give money back!\" The next Saturday she came back with two friends.",
              ar: "عند الإغلاق كان في الصندوق 6 عملات زائدة. قالت ملك: «السيدة صاحبة السلّة الخضراء دفعت زيادة.» قال يوسف: «لن يعرف أحد.» نظرت إليه ملك. فتنهّد يوسف، وركضا خلفها في الشارع. ضحكت السيدة: «لم يركض خلفي أحد من قبل ليُرجع لي نقودًا!» وفي السبت التالي عادت ومعها صديقتان." },
      idea: { en: "Trust is like savings: slow to build, quick to spend.", ar: "الثقة مثل الادّخار: تُبنى ببطء وتُصرف بسرعة." },
      scene: { bg: "day", items: [
        { i: "deciduous_tree", x: 72, y: 18, w: 26 }, { i: "woman", x: 56, y: 10, w: 20, flip: true }, { i: "basket", x: 70, y: 12, w: 11 },
        { i: "girl", x: 8, y: 8, w: 19 }, { i: "boy", x: 26, y: 8, w: 19 },
        { i: "coin", x: 44, y: 40, w: 8 }, { i: "heart_hands", x: 44, y: 62, w: 12 } ] },
    },
    {
      title: { en: "The stand next door", ar: "الكشك المجاور" },
      text: { en: "One morning a bigger boy called Karim set up a juice stand 5 steps away. Same sign, same cups, same price. \"He copied us!\" said Yousef. Grandpa sipped his tea. \"Then ask yourselves what makes you different.\" Malak had an idea. She walked over and talked to Karim. Now Karim sells popcorn, they sell juice, and people buy both.",
              ar: "ذات صباح نصب ولد أكبر اسمه كريم كشك عصير على بعد 5 خطوات. اللافتة نفسها والأكواب نفسها والسعر نفسه. قال يوسف: «لقد قلّدنا!» ارتشف جدّو شايه وقال: «إذن اسألا نفسيكما: ما الذي يميّزكما؟» وخطرت لملك فكرة، فذهبت وتحدّثت مع كريم. والآن يبيع كريم الفشار، ويبيعان العصير، والناس يشترون الاثنين." },
      idea: { en: "When someone copies you, the question is: what makes you, you?", ar: "عندما ينسخك أحد، يصبح السؤال: ما الذي يميّزك؟" },
      scene: { bg: "day", items: [
        { stand: true, x: 2, w: 44, sign: { en: "Lemonade · 3", ar: "ليموناضة · 3" } },
        { stand: true, x: 54, w: 44, color: "#FF5C8A", sign: { en: "Popcorn", ar: "فشار" } },
        { i: "girl", x: 10, y: 30, w: 14 }, { i: "boy", x: 26, y: 30, w: 14 }, { i: "child", x: 68, y: 30, w: 14, flip: true },
        { i: "popcorn", x: 82, y: 44, w: 10 }, { i: "handshake", x: 44, y: 66, w: 12 } ] },
    },
    {
      title: { en: "Too tired to count", ar: "تعب يُربك الحساب" },
      text: { en: "In week 6, Malak and Yousef stayed up late making 30 cups. The next day their eyes kept closing. Yousef gave a customer 5 coins change instead of two. Malak forgot the ice. \"Tired sellers make small mistakes,\" said Grandpa. \"Rest is part of the job.\" So on Sunday they played football, did their homework and slept early.",
              ar: "في الأسبوع 6 سهرا حتى وقت متأخر يصنعان 30 كوبًا. وفي اليوم التالي كانت أعينهما تنغلق من النعاس. وردّ يوسف لأحد الزبائن 5 عملات باقيًا بدل عملتين. ونسيت ملك الثلج. قال جدّو: «مع التعب تقع أخطاء صغيرة. والراحة جزء من العمل.» فلعبا الكرة يوم الأحد، وأنجزا واجباتهما، وناما مبكرًا." },
      idea: { en: "Rest is part of the job.", ar: "الراحة جزء من العمل." },
      scene: { bg: "night", items: [
        { i: "crescent_moon", x: 76, y: 70, w: 14 }, { i: "star", x: 60, y: 80, w: 6 }, { i: "star", x: 90, y: 58, w: 5 },
        { i: "bed", x: 6, y: 10, w: 34 }, { i: "sleeping_face", x: 14, y: 36, w: 13 }, { i: "yawning_face", x: 50, y: 18, w: 16 },
        { i: "books", x: 70, y: 12, w: 13 }, { i: "soccer_ball", x: 84, y: 10, w: 10 } ] },
    },
    {
      title: { en: "The new game", ar: "اللعبة الجديدة" },
      text: { en: "The piggy bank was getting heavy. Then everyone at the summer club started talking about a new video game. It cost 30 coins. \"We have enough,\" whispered Yousef. Malak looked at the piggy bank, then at Mum's photo on the fridge. They waited. 3 weeks later, the same game was on sale for 18 coins. They smiled, and kept saving.",
              ar: "صارت الحصّالة ثقيلة. ثم بدأ الجميع في النادي الصيفي يتكلّمون عن لعبة فيديو جديدة سعرها 30 عملة. همس يوسف: «معنا ما يكفي.» نظرت ملك إلى الحصّالة، ثم إلى صورة ماما على باب الثلاجة. وانتظرا. وبعد 3 أسابيع صارت اللعبة نفسها بـ18 عملة. فابتسما، وواصلا الادّخار." },
      idea: { en: "Saving means picking what you want most over what you want right now.", ar: "الادّخار يعني تقديم الحلم الكبير على الرغبة السريعة." },
      scene: { bg: "room", items: [
        { i: "pig_face", x: 8, y: 12, w: 22 }, { i: "video_game", x: 40, y: 50, w: 18, rot: -8 }, { i: "thinking_face", x: 46, y: 14, w: 14 },
        { i: "framed_picture", x: 72, y: 54, w: 16 }, { i: "wrapped_gift", x: 74, y: 12, w: 15 } ] },
    },
    {
      title: { en: "The last day of summer", ar: "آخر يوم في الصيف" },
      text: { en: "On the last Saturday, Yousef opened the piggy bank. They counted every coin twice: 236 coins. The gift for Mum cost 220. \"We did it!\" they cheered. Mum cried happy tears when she opened it. Grandpa gave them a sticker each. \"You didn't just earn coins,\" he said. \"You learned how a business works.\" Malak was already planning next summer.",
              ar: "في آخر سبت فتح يوسف الحصّالة، وعدّا كل عملة مرتين: 236 عملة. وثمن هدية ماما 220 عملة. فهتفا: «نجحنا!» ودمعت عينا ماما من الفرح حين فتحتها. وأعطى جدّو كلًّا منهما ملصقًا وقال: «لم تكسبا نقودًا فقط، بل تعلّمتما كيف يعمل المشروع.» وبدأت ملك تخطّط للصيف القادم." },
      idea: { en: "Every coin you don't spend today walks your goal one step closer.", ar: "كل عملة لا تُصرف اليوم تقرّب الهدف خطوة." },
      scene: { bg: "room", items: [
        { i: "party_popper", x: 4, y: 64, w: 14 }, { i: "sparkles", x: 82, y: 70, w: 12 },
        { i: "woman", x: 38, y: 12, w: 22 }, { i: "wrapped_gift", x: 42, y: 56, w: 14 },
        { i: "girl", x: 8, y: 10, w: 20 }, { i: "boy", x: 62, y: 10, w: 19, flip: true }, { i: "old_man", x: 80, y: 10, w: 18, flip: true } ] },
    },
  ],

  ideasPage: {
    title: { en: "Grandpa's ideas", ar: "أفكار جدّو" },
    intro: { en: "Every idea from the story, in one place. In the game, each one becomes a sticker.", ar: "كل أفكار الحكاية في مكان واحد. وفي اللعبة تصبح كل فكرة ملصقًا." },
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
      { img: "lemon", name: { en: "Juice stand", ar: "كشك العصير" }, cost: 1, prices: "2 · 3 · 5", left: { en: "spoil", ar: "تفسد" } },
      { img: "artist_palette", name: { en: "Drawings & bracelets", ar: "رسومات وأساور" }, cost: 2, prices: "3 · 5 · 8", left: { en: "kept", ar: "تُحفظ" } },
      { img: "bicycle", name: { en: "Bike wash & fix", ar: "غسيل الدراجات وإصلاحها" }, cost: 1, prices: "2 · 3 · 5", left: { en: "kept", ar: "تُحفظ" } },
      { img: "birthday_cake", name: { en: "Cakes & cookies", ar: "كيك وكوكيز" }, cost: 2, prices: "3 · 5 · 8", left: { en: "spoil", ar: "تفسد" } },
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
      { img: "coin", w: { en: "Cost", ar: "التكلفة" }, d: { en: "What you pay to make something.", ar: "ما ندفعه لنصنع الشيء." } },
      { img: "placard", w: { en: "Price", ar: "السعر" }, d: { en: "What a customer pays you for it.", ar: "ما يدفعه الزبون مقابل الشيء." } },
      { img: "money_bag", w: { en: "Profit", ar: "الربح" }, d: { en: "Coins in minus coins spent.", ar: "النقود الداخلة ناقص النقود المصروفة." } },
      { img: "smiling_face_with_smiling_eyes", w: { en: "Customer", ar: "الزبون" }, d: { en: "Someone who buys from you.", ar: "من يشتري منك." } },
      { img: "grimacing_face", w: { en: "Leftovers", ar: "البقايا" }, d: { en: "Things you made but didn't sell.", ar: "ما صُنع ولم يُبع." } },
      { img: "pig_face", w: { en: "Saving", ar: "الادّخار" }, d: { en: "Keeping coins now for something bigger later.", ar: "الاحتفاظ بالنقود الآن من أجل شيء أكبر لاحقًا." } },
      { img: "wrench", w: { en: "Investing", ar: "الاستثمار" }, d: { en: "Spending coins on something that helps you earn more.", ar: "إنفاق النقود على شيء يساعد على كسب المزيد." } },
      { img: "handshake", w: { en: "Partner", ar: "الشريك" }, d: { en: "Someone who shares the work and the profit.", ar: "من يشارك في العمل وفي الربح." } },
    ],
  },

  back: {
    lines: [
      { en: "Play the game free", ar: "اللعبة مجانية" },
      { en: "No ads · No accounts · Nothing to buy", ar: "بلا إعلانات · بلا حسابات · لا شيء للشراء" },
    ],
    blurb: { en: "Malak and Yousef want to buy Mum a gift by the end of summer. With a juice stand, a notebook and Grandpa's ideas, they learn what every business owner knows: cost, price, profit, saving, honesty and rest.",
             ar: "ملك ويوسف يريدان شراء هدية لماما قبل نهاية الصيف. ومع كشك عصير ودفتر وأفكار جدّو، يتعلّمان ما يعرفه كل صاحب مشروع: التكلفة والسعر والربح والادّخار والأمانة والراحة." },
  },
};
