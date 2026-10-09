// Promo site for The Little Entrepreneur: the game (web + phone) and the picture book.
// English and Arabic side by side. Built into littlebreneur/index.html and ar.html by build.mjs.
//
// Writing rules: plain, warm and specific. It talks to parents and teachers (plural in Arabic:
// أطفالكم، تبدؤوا) and never addresses the child with gendered Arabic. No dashes. Every number in
// the English appears as digits in the Arabic. No brand names, no claims about results.

module.exports = {
  meta: {
    title: { en: "The Little Entrepreneur: a game and picture book about money, patience and honesty, for ages 8 to 12", ar: "الانتربرونور الصغير: لعبة وكتاب مصوّر عن المال والصبر والأمانة، للأعمار من 8 إلى 12" },
    desc: { en: "One summer, one tiny business. A free game for the browser and the phone, and a 60-page picture book to read or print. Arabic and English. No ads, no tracking.",
            ar: "صيف واحد ومشروع صغير. لعبة مجانية للمتصفح والهاتف، وكتاب مصوّر من 60 صفحة للقراءة أو الطباعة. بالعربية والإنجليزية، بلا إعلانات ولا تتبّع." },
    brand: { en: "The Little Entrepreneur", ar: "الانتربرونور الصغير" },
  },
  nav: {
    game: { en: "The game", ar: "اللعبة" }, book: { en: "The book", ar: "الكتاب" }, parents: { en: "For parents", ar: "للأهل" },
    play: { en: "Play free", ar: "العبوا مجانًا" }, lang: { en: "عربي", ar: "EN" },
  },
  hero: {
    kicker: { en: "A game and a picture book for ages 8 to 12", ar: "لعبة وكتاب مصوّر للأعمار من 8 إلى 12" },
    h1: { en: "Small choices. Big confidence.", ar: "اختيارات صغيرة. وثقة كبيرة." },
    sub: { en: "Malak and Yousef open a juice stand to buy Mum a gift. Along the way they learn to plan, to wait, to tell the truth and to try again, with Grandpa sharing one idea at a time. A story to read together, and a short game to try the ideas.",
           ar: "ملك ويوسف يفتحان كشك عصير ليشتريا هدية لماما. وفي الطريق يتعلّمان التخطيط والصبر والصدق والمحاولة من جديد، وجدّو يشاركهما فكرة واحدة في كل مرة. حكاية تُقرأ معًا، ولعبة قصيرة لتجربة الأفكار." },
    play: { en: "Play the game", ar: "هيا نلعب" },
    read: { en: "Read the book", ar: "اقرؤوا الكتاب" },
    note: { en: "Free · Arabic and English · No ads, no accounts, nothing to buy", ar: "مجاني · بالعربية والإنجليزية · بلا إعلانات ولا حسابات ولا مشتريات" },
    goal: { en: "Saving for a gift for Mum", ar: "الادّخار لهدية ماما" },
  },
  stats: [
    ["12", { en: "weeks of summer", ar: "أسبوعًا من الصيف" }],
    ["32", { en: "dilemmas in the game", ar: "معضلة في اللعبة" }],
    ["60", { en: "pages in the book", ar: "صفحة في الكتاب" }],
    ["2", { en: "languages", ar: "لغتان" }],
    ["0", { en: "ads or trackers", ar: "إعلانات أو أدوات تتبّع" }],
  ],
  two: {
    kicker: { en: "Two ways in", ar: "طريقان إلى الصيف نفسه" },
    h2: { en: "Read the story. Then live it.", ar: "الحكاية تُقرأ أولًا، ثم تُعاش." },
    game: {
      title: { en: "The game", ar: "اللعبة" },
      lead: { en: "Run your own stand for a 12-week summer. Pick a price, decide how many to make, sell, and save for a goal.", ar: "إدارة كشك خاص طوال صيف من 12 أسبوعًا: تحديد السعر والكمية، ثم البيع والادّخار لهدف." },
      points: [
        { en: "Four businesses: juice, bracelets, bike wash, cakes", ar: "أربعة مشاريع: عصير، وأساور، وغسيل دراجات، وكيك" },
        { en: "Short sessions: a whole summer takes about 15 minutes", ar: "جلسات قصيرة: الصيف كله يستغرق نحو 15 دقيقة" },
        { en: "Works offline once added to the home screen", ar: "تعمل دون اتصال بعد إضافتها إلى الشاشة الرئيسية" },
      ],
      cta: { en: "Play free", ar: "العبوا مجانًا" },
    },
    book: {
      title: { en: "The picture book", ar: "الكتاب المصوّر" },
      lead: { en: "A 60-page book: four stories about four tiny businesses, then a guide to the game and a page for planning a real one.", ar: "كتاب من 60 صفحة: أربع حكايات عن أربعة مشاريع صغيرة، ثم دليل للعبة وصفحة لتخطيط مشروع حقيقي." },
      points: [
        { en: "36 scenes, each ending with one of Grandpa's ideas", ar: "36 مشهدًا، وكل مشهد ينتهي بفكرة من أفكار جدّو" },
        { en: "Read it page by page online", ar: "للقراءة صفحة بعد صفحة على الإنترنت" },
        { en: "A5 PDF, free to print for home and school", ar: "ملف PDF بمقاس A5، مجاني للطباعة في البيت والمدرسة" },
      ],
      cta: { en: "Read online", ar: "اقرؤوه على الإنترنت" },
      pdf: { en: "Download PDF", ar: "تحميل PDF" },
    },
  },
  family: {
    kicker: { en: "Meet the family", ar: "تعرّفوا إلى العائلة" },
    h2: { en: "The same three faces in the book and the game.", ar: "الوجوه الثلاثة نفسها في الكتاب واللعبة." },
    people: [
      { n: { en: "Malak", ar: "ملك" }, d: { en: "The planner. She counts twice and asks the next question.", ar: "تحب التخطيط. تعدّ مرتين وتسأل السؤال التالي." } },
      { n: { en: "Yousef", ar: "يوسف" }, d: { en: "Her little brother, full of energy and big ideas. He learns that some good things are worth waiting for.", ar: "أخوها الصغير، مليء بالحماس والأفكار الكبيرة. ويتعلّم أن بعض الأشياء الجميلة تستحق الانتظار." } },
      { n: { en: "Grandpa", ar: "جدّو" }, d: { en: "Never gives orders and never scolds. He asks a question, then shares one small idea.", ar: "لا يأمر ولا يوبّخ أبدًا. يطرح سؤالًا، ثم يشارك فكرة صغيرة." } },
    ],
  },
  week: {
    kicker: { en: "In the game, every week", ar: "في اللعبة، كل أسبوع" },
    h2: { en: "Plan, sell, count, decide.", ar: "تخطيط، ثم بيع، ثم حساب، ثم قرار." },
    steps: [
      ["placard", { en: "Plan", ar: "التخطيط" }, { en: "Pick a price, how many to make, and one activity: a poster, practice, homework or rest.", ar: "اختيار السعر، وعدد ما يُصنع، ونشاط واحد: ملصق، أو تدريب، أو مذاكرة، أو راحة." }],
      ["lemon", { en: "Market day", ar: "يوم السوق" }, { en: "Customers arrive. Weather, price, quality and smiles decide how many.", ar: "يأتي الزبائن. والطقس والسعر والجودة والابتسامات تحدّد عددهم." }],
      ["coin", { en: "Count", ar: "الحساب" }, { en: "Coins in, coins spent, what is left. Making just enough means less waste.", ar: "نقود دخلت، ونقود صُرفت، ثم ما تبقّى. وصنع ما يكفي فقط يعني هدرًا أقل." }],
      ["thinking_face", { en: "Decide", ar: "القرار" }, { en: "A small dilemma with two fair answers. Then Grandpa shares one idea.", ar: "معضلة صغيرة لها جوابان كلاهما معقول. ثم يشارك جدّو فكرة واحدة." }],
      ["hourglass_not_done", { en: "Echo", ar: "الصدى" }, { en: "Some choices come back weeks later: “This is because of what you did in week 3.”", ar: "بعض الاختيارات تعود بعد أسابيع: «هذا بسبب ما حدث في الأسبوع 3.»" }],
    ],
  },
  screens: {
    kicker: { en: "Inside the game", ar: "داخل اللعبة" },
    h2: { en: "Calm, clear screens made for small hands.", ar: "شاشات هادئة وواضحة لأيدٍ صغيرة." },
    items: [
      ["home", { en: "Home", ar: "البداية" }, { en: "Grandpa welcomes you. Start a summer or keep going.", ar: "جدّو في الاستقبال. بدء صيف جديد أو متابعة الصيف الحالي." }],
      ["plan", { en: "Plan", ar: "الخطة" }, { en: "Price, quantity, and Grandpa's guess of how many will come.", ar: "السعر والكمية، وتوقّع جدّو لعدد الزبائن." }],
      ["results", { en: "Profit", ar: "الربح" }, { en: "33 in − 12 spent = 21. A first sum that makes sense of money.", ar: "33 دخلت − 12 صُرفت = 21. أول معادلة تجعل المال مفهومًا." }],
      ["door", { en: "The wise door", ar: "الباب الحكيم" }, { en: "With 70 energy or more, a third, wiser choice opens.", ar: "مع طاقة 70 أو أكثر، يُفتح خيار ثالث أحكم." }],
      ["echo", { en: "Echoes", ar: "الصدى" }, { en: "Choices come back weeks later, for better or worse.", ar: "بعض الاختيارات تعود بعد أسابيع، للأفضل أو للأسوأ." }],
      ["report", { en: "Report card", ar: "بطاقة التقييم" }, { en: "Stars for money, customers, balance and honesty.", ar: "نجوم للحساب والعملاء والتوازن والأمانة." }],
      ["dark", { en: "Night mode", ar: "الوضع الليلي" }, { en: "A calm teal theme for evening play.", ar: "ألوان فيروزية هادئة للعب في المساء." }],
    ],
  },
  bookIn: {
    kicker: { en: "Inside the book", ar: "داخل الكتاب" },
    h2: { en: "36 scenes, one business lesson in each.", ar: "36 مشهدًا، وفي كل مشهد درس في البيزنس." },
    sub: { en: "From cost and price to investing and partners, every scene teaches one real idea in words children understand. And the numbers in the stories match the game.", ar: "من التكلفة والسعر إلى الاستثمار والشراكة، كل مشهد يعلّم فكرة حقيقية من عالم البيزنس بكلمات يفهمها الأطفال. وأرقام الحكايات تطابق أرقام اللعبة." },
    pages: [
      ["01", { en: "The cover", ar: "الغلاف" }], ["04", { en: "Summer begins", ar: "الصيف يبدأ" }], ["08", { en: "Profit", ar: "الربح" }],
      ["09", { en: "A rainy Saturday", ar: "سبت ماطر" }], ["17", { en: "Your turn", ar: "دورك" }], ["22", { en: "The game guide", ar: "دليل اللعبة" }],
    ],
    cta: { en: "Open the book", ar: "افتحوا الكتاب" },
  },
  energy: {
    kicker: { en: "Energy is a resource", ar: "الطاقة مورد" },
    h2: { en: "Rest is part of doing well.", ar: "الراحة جزء من النجاح." },
    p: { en: "In the game, working and staying up late use energy, and rest, play and sleep bring it back. When energy runs low, small mistakes creep in. When it is high, a wiser third choice opens. A gentle way to talk about bedtime.",
         ar: "في اللعبة، العمل والسهر يستهلكان الطاقة، والراحة واللعب والنوم تعيدها. وحين تنخفض الطاقة تتسلّل أخطاء صغيرة، وحين ترتفع يُفتح خيار ثالث أحكم. طريقة لطيفة للحديث عن موعد النوم." },
    label: { en: "Energy", ar: "الطاقة" }, sleepy: { en: "Sleepy: numbers wobble, mistakes happen", ar: "نعاس: الأرقام تتمايل والأخطاء واردة" },
    normal: { en: "A normal day", ar: "يوم عادي" }, open: { en: "70+: the wise door opens", ar: "70 فما فوق: الباب الحكيم يُفتح" },
    door: { en: "The wise door", ar: "الباب الحكيم" }, try: { en: "Drag to try it", ar: "جرّبوا السحب" },
  },
  skills: {
    kicker: { en: "What children practise", ar: "ماذا يتمرّن عليه الأطفال" },
    h2: { en: "Money skills, and the habits behind them.", ar: "مهارات المال، والعادات التي تقف خلفها." },
    items: [
      ["coin", { en: "Planning and patience", ar: "التخطيط والصبر" }, { en: "Counting before spending, saving for something that matters, and waiting when it is worth it.", ar: "الحساب قبل الإنفاق، والادّخار لشيء مهم، والانتظار حين يستحق." }],
      ["smiling_face_with_smiling_eyes", { en: "Thinking of others", ar: "التفكير في الآخرين" }, { en: "Listening when someone is unhappy, a fair price, and work done with care.", ar: "الإصغاء حين يكون أحد غير راضٍ، والسعر العادل، والعمل المتقَن." }],
      ["high_voltage", { en: "Balance", ar: "التوازن" }, { en: "Rest, play and homework come first. A good plan makes room for all three.", ar: "الراحة واللعب والواجبات أولًا. والخطة الجيدة تتسع للثلاثة." }],
      ["handshake", { en: "Honesty and trying again", ar: "الأمانة والمحاولة من جديد" }, { en: "Owning a mistake, giving back extra change, and learning that a bad week is not the end.", ar: "الاعتراف بالخطأ، وإرجاع الباقي الزائد، ومعرفة أن الأسبوع السيئ ليس النهاية." }],
    ],
  },
  phone: {
    kicker: { en: "On your phone", ar: "على الهاتف" },
    h2: { en: "Add it to the home screen. It works offline.", ar: "أضيفوها إلى الشاشة الرئيسية، وستعمل دون اتصال." },
    steps: [
      { en: "Open adam.ahmedhaz.com/little on the phone.", ar: "افتحوا adam.ahmedhaz.com/little على الهاتف." },
      { en: "iPhone: Share, then Add to Home Screen. Android: the menu, then Install app.", ar: "آيفون: «مشاركة» ثم «إضافة إلى الشاشة الرئيسية». أندرويد: القائمة ثم «تثبيت التطبيق»." },
      { en: "Tap the lemon icon. Saved summers stay on the device.", ar: "اضغطوا على أيقونة الليمونة. وكل صيف محفوظ يبقى على الجهاز." },
    ],
  },
  parents: {
    kicker: { en: "For parents and teachers", ar: "للأهل والمعلّمين" },
    h2: { en: "Made with families in mind.", ar: "مصمّمة والأسرة في البال." },
    items: [
      ["books", { en: "Best together: read, play, talk", ar: "الأفضل معًا: قراءة ثم لعب ثم حديث" }, { en: "Read one scene together, let your child play one short summer, then ask one question: what could be done differently next time? Ten minutes of talk is where most of the learning happens.", ar: "اقرؤوا مشهدًا واحدًا معًا، ثم صيف قصير في اللعبة، ثم سؤال بسيط: ما الذي يمكن فعله بطريقة مختلفة؟ فأغلب التعلّم يحدث في عشر دقائق من الحديث." }],
      ["hourglass_not_done", { en: "Gentle on screen time", ar: "رفيقة بوقت الشاشة" }, { en: "A summer takes about 15 minutes and saves itself, so it is easy to stop. No streaks, no notifications, nothing that pulls children back.", ar: "الصيف يستغرق نحو 15 دقيقة ويُحفظ تلقائيًا، فيسهل التوقّف. بلا سلاسل أيام ولا إشعارات ولا شيء يشدّ الأطفال للعودة." }],
      ["wrapped_gift", { en: "Money with a purpose", ar: "المال من أجل هدف" }, { en: "The goal is a gift for Mum, a book set or a football, never getting rich. Grandpa's ideas are about fairness, effort and patience.", ar: "الهدف هدية لماما أو مجموعة كتب أو كرة، لا الثراء أبدًا. وأفكار جدّو عن العدل والجهد والصبر." }],
      ["house", { en: "Nothing leaves the device", ar: "لا شيء يغادر الجهاز" }, { en: "No accounts, ads, analytics, tracking or leaderboard. The game loads nothing from other websites, and your child's name stays in the browser.", ar: "لا حسابات ولا إعلانات ولا تحليلات ولا تتبّع ولا لوحة صدارة. اللعبة لا تُحمِّل شيئًا من مواقع أخرى، واسم طفلكم يبقى في المتصفح." }],
      ["pig_face", { en: "Nothing to buy", ar: "لا شيء للشراء" }, { en: "Free, with no in-app purchases, no gambling and no loans.", ar: "مجانية، بلا مشتريات داخل اللعبة، ولا مقامرة، ولا قروض." }],
      ["heart_hands", { en: "Kind, never scary", ar: "لطيفة ولا تُخيف" }, { en: "No harsh endings. If the goal isn't reached, Grandpa sums up what was learned and offers another summer.", ar: "لا نهايات قاسية. وإذا لم يكتمل الهدف، يلخّص جدّو ما تعلّمه الطفل ويعرض صيفًا آخر." }],
      ["glowing_star", { en: "Made for class too", ar: "تصلح للفصل أيضًا" }, { en: "One lesson: a scene from the book, a summer in the game, and a talk about Grandpa's idea. Activities and a planning worksheet are in the book.", ar: "حصة واحدة: مشهد من الكتاب، وصيف في اللعبة، وحديث عن فكرة جدّو. والأنشطة وورقة التخطيط موجودة في الكتاب." }],
      ["speech_balloon", { en: "Arabic and English", ar: "بالعربية والإنجليزية" }, { en: "Written for children in Egypt and the Gulf, in Arabic that never assumes whether your child is a boy or a girl.", ar: "مكتوبة لأطفال مصر والخليج، بعربية لا تفترض أن طفلكم ولد أو بنت." }],
    ],
  },
  faq: {
    kicker: { en: "Questions", ar: "أسئلة" }, h2: { en: "Before you start", ar: "قبل أن تبدؤوا" },
    items: [
      [{ en: "What age is it for?", ar: "ما العمر المناسب؟" }, { en: "8 to 12, for children who can read short sentences on their own. Younger children enjoy the book with a parent.", ar: "من 8 إلى 12، للأطفال القادرين على قراءة جمل قصيرة بمفردهم. والأصغر سنًّا يستمتعون بالكتاب مع أحد الوالدين." }],
      [{ en: "Are the game and the book free?", ar: "هل اللعبة والكتاب مجانيان؟" }, { en: "Yes, both. No ads, no account and nothing to buy. The PDF is free to print and share.", ar: "نعم، كلاهما. بلا إعلانات ولا حساب ولا شيء للشراء. وملف PDF مجاني للطباعة والمشاركة." }],
      [{ en: "Will it make my child focus on money?", ar: "هل ستجعل طفلي يركّز على المال؟" }, { en: "It does the opposite of chasing money. Every goal is something to share or enjoy, and the game rewards rest, homework and honesty as much as profit. The report card has stars for balance and honesty.", ar: "بل العكس. كل هدف شيء يُشارَك أو يُستمتَع به، واللعبة تكافئ الراحة والواجبات والأمانة بقدر ما تكافئ الربح. وفي بطاقة التقييم نجوم للتوازن والأمانة." }],
      [{ en: "What if my child doesn't reach the goal?", ar: "ماذا لو لم يصل طفلي إلى الهدف؟" }, { en: "That is part of learning. There are no harsh endings: Grandpa sums up what was learned and offers another summer. A good moment to say: mistakes are how we learn.", ar: "هذا جزء من التعلّم. لا نهايات قاسية: يلخّص جدّو ما تعلّمه الطفل، ويعرض صيفًا آخر. لحظة مناسبة لنقول: بالأخطاء نتعلّم." }],
      [{ en: "How much screen time is it?", ar: "كم من وقت الشاشة تأخذ؟" }, { en: "About 15 minutes for a whole summer. Many families play one summer, then read a scene from the book away from the screen.", ar: "نحو 15 دقيقة للصيف الكامل. وكثير من الأسر تلعب صيفًا واحدًا، ثم تقرأ مشهدًا من الكتاب بعيدًا عن الشاشة." }],
      [{ en: "Do we need the book to play?", ar: "هل نحتاج إلى الكتاب لنلعب؟" }, { en: "No. Each stands on its own. Together they work best: the story shows the ideas, the game lets children try them.", ar: "لا. كلٌّ منهما يكفي وحده. ومعًا يكونان أفضل: الحكاية تعرض الأفكار، واللعبة تتيح للأطفال تجربتها." }],
      [{ en: "Which currency does it use?", ar: "ما العملة المستخدمة؟" }, { en: "Plain coins with no country, so it works the same in Cairo, Riyadh or Dubai.", ar: "عملات بسيطة لا تخصّ أي بلد، فتناسب القاهرة والرياض ودبي بالقدر نفسه." }],
      [{ en: "How do I print the book?", ar: "كيف نطبع الكتاب؟" }, { en: "Download the A5 PDF. Print it on A5, or on A4 at two pages per sheet, then fold.", ar: "حمّلوا ملف PDF بمقاس A5، واطبعوه على ورق A5، أو على A4 بصفحتين في كل ورقة ثم اطووها." }],
      [{ en: "Where is the data stored?", ar: "أين تُحفظ البيانات؟" }, { en: "Only in the browser on this device. Clearing the browser's data starts the game over.", ar: "في المتصفح على هذا الجهاز فقط. ومسح بيانات المتصفح يعيد اللعبة من البداية." }],
    ],
  },
  finale: {
    h2: { en: "Ready for a summer of small, brave choices?", ar: "هل أنتم جاهزون لصيف من الاختيارات الصغيرة الشجاعة؟" },
    p: { en: "Start with the story at bedtime, or try the game together after school. Grandpa will be there either way.", ar: "ابدؤوا بالحكاية قبل النوم، أو جرّبوا اللعبة معًا بعد المدرسة. وجدّو حاضر في الحالتين." },
  },
  foot: {
    line: { en: "The Little Entrepreneur · a sister to Founder Fog", ar: "الانتربرونور الصغير · مشروع شقيق لـ«ضباب المؤسس»" },
    credit: { en: "Pictures made for this project. Fonts: Manrope and Readex Pro (OFL). No cookies, no tracking.", ar: "رسومات صُنعت لهذا المشروع. الخطوط: Manrope و Readex Pro (رخصة OFL). بلا ملفات تعريف ارتباط ولا تتبّع." },
  },
};
