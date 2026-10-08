// Promo site for The Little Entrepreneur: the game (web + phone) and the picture book.
// English and Arabic side by side. Built into littlebreneur/index.html and ar.html by build.mjs.
//
// Writing rules: plain, warm and specific. It talks to parents and teachers (plural in Arabic:
// أطفالكم، تبدؤوا) and never addresses the child with gendered Arabic. No dashes. Every number in
// the English appears as digits in the Arabic. No brand names, no claims about results.

module.exports = {
  meta: {
    title: { en: "The Little Entrepreneur: a money game and picture book for kids 8 to 12", ar: "الانتربرونور الصغير: لعبة وكتاب مصوّر عن المال للأطفال من 8 إلى 12" },
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
    h1: { en: "One summer. One tiny business. Lots of first lessons.", ar: "صيف واحد. مشروع صغير. ودروس أولى كثيرة." },
    sub: { en: "Malak and Yousef open a juice stand to buy Mum a gift, and Grandpa helps with one idea at a time. Read their story in the book, then run your own stand in the game.",
           ar: "ملك ويوسف يفتحان كشك عصير ليشتريا هدية لماما، وجدّو يساعدهما بفكرة واحدة في كل مرة. اقرؤوا حكايتهما في الكتاب، ثم دعوا أطفالكم يديرون كشكهم في اللعبة." },
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
        { en: "About 15 minutes a summer, in the browser or on a phone", ar: "نحو 15 دقيقة للصيف الواحد، في المتصفح أو على الهاتف" },
        { en: "Works offline once added to the home screen", ar: "تعمل دون اتصال بعد إضافتها إلى الشاشة الرئيسية" },
      ],
      cta: { en: "Play free", ar: "العبوا مجانًا" },
    },
    book: {
      title: { en: "The picture book", ar: "الكتاب المصوّر" },
      lead: { en: "A 60-page book: four stories in needle-felted pictures, then a guide to the game and a page for planning a real tiny business.", ar: "كتاب من 60 صفحة: أربع حكايات برسومات من الصوف الملبّد، ثم دليل للعبة وصفحة لتخطيط مشروع صغير حقيقي." },
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
      { n: { en: "Yousef", ar: "يوسف" }, d: { en: "Her little brother, full of energy. He wants everything now, and learns why waiting can pay.", ar: "أخوها الصغير، مليء بالحماس. يريد كل شيء الآن، ويتعلّم لماذا قد يكون الانتظار مربحًا." } },
      { n: { en: "Grandpa", ar: "جدّو" }, d: { en: "Never gives orders. He shares one small idea after every choice.", ar: "لا يُصدر أوامر أبدًا، بل يشارك فكرة صغيرة بعد كل اختيار." } },
    ],
  },
  week: {
    kicker: { en: "In the game, every week", ar: "في اللعبة، كل أسبوع" },
    h2: { en: "Plan, sell, count, decide.", ar: "تخطيط، ثم بيع، ثم حساب، ثم قرار." },
    steps: [
      ["placard", { en: "Plan", ar: "التخطيط" }, { en: "Pick a price, how many to make, and one activity: a poster, practice, homework or rest.", ar: "اختيار السعر، وعدد ما يُصنع، ونشاط واحد: ملصق، أو تدريب، أو مذاكرة، أو راحة." }],
      ["lemon", { en: "Market day", ar: "يوم السوق" }, { en: "Customers arrive. Weather, price, quality and smiles decide how many.", ar: "يأتي الزبائن. والطقس والسعر والجودة والابتسامات تحدّد عددهم." }],
      ["coin", { en: "Count", ar: "الحساب" }, { en: "Coins in, coins spent, profit. Leftover cakes are coins in the bin.", ar: "نقود دخلت، ونقود صُرفت، ثم الربح. والكيك الذي يتبقّى نقود تذهب إلى سلّة المهملات." }],
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
      ["results", { en: "Profit", ar: "الربح" }, { en: "33 in − 12 spent = 21. The sum every child should know.", ar: "33 دخلت − 12 صُرفت = 21. المعادلة التي ينبغي أن يعرفها كل طفل." }],
      ["door", { en: "The wise door", ar: "الباب الحكيم" }, { en: "With 70 energy or more, a third, wiser choice opens.", ar: "مع طاقة 70 أو أكثر، يُفتح خيار ثالث أحكم." }],
      ["echo", { en: "Echoes", ar: "الصدى" }, { en: "Choices come back weeks later, for better or worse.", ar: "بعض الاختيارات تعود بعد أسابيع، للأفضل أو للأسوأ." }],
      ["report", { en: "Report card", ar: "بطاقة التقييم" }, { en: "Stars for money, customers, balance and honesty.", ar: "نجوم للحساب والعملاء والتوازن والأمانة." }],
      ["dark", { en: "Night mode", ar: "الوضع الليلي" }, { en: "A calm teal theme for evening play.", ar: "ألوان فيروزية هادئة للعب في المساء." }],
    ],
  },
  bookIn: {
    kicker: { en: "Inside the book", ar: "داخل الكتاب" },
    h2: { en: "36 felted scenes and one idea each.", ar: "36 مشهدًا من الصوف الملبّد، وفكرة في كل مشهد." },
    sub: { en: "Every picture was made in the same handmade wool style, so Malak, Yousef and Grandpa look the same on every page. The numbers in the story match the game.", ar: "كل الصور مصنوعة بأسلوب الصوف اليدوي نفسه، فيظهر ملك ويوسف وجدّو بالشكل نفسه في كل صفحة. وأرقام الحكاية تطابق أرقام اللعبة." },
    pages: [
      ["01", { en: "The cover", ar: "الغلاف" }], ["04", { en: "Summer begins", ar: "الصيف يبدأ" }], ["08", { en: "Profit", ar: "الربح" }],
      ["09", { en: "A rainy Saturday", ar: "سبت ماطر" }], ["17", { en: "Your turn", ar: "دورك" }], ["22", { en: "The game guide", ar: "دليل اللعبة" }],
    ],
    cta: { en: "Open the book", ar: "افتحوا الكتاب" },
  },
  energy: {
    kicker: { en: "Energy is a resource", ar: "الطاقة مورد" },
    h2: { en: "Tired sellers make mistakes.", ar: "مع التعب تقع الأخطاء." },
    p: { en: "In the game, selling and staying up late use energy, and rest brings it back. Below 40 the numbers wobble and change gets miscounted. At 70 or more, a wiser third choice opens.",
         ar: "في اللعبة، البيع والسهر يستهلكان الطاقة، والراحة تعيدها. تحت 40 تتمايل الأرقام ويُحسب الباقي خطأً. ومن 70 فما فوق يُفتح خيار ثالث أحكم." },
    label: { en: "Energy", ar: "الطاقة" }, sleepy: { en: "Sleepy: numbers wobble, mistakes happen", ar: "نعاس: الأرقام تتمايل والأخطاء واردة" },
    normal: { en: "A normal day", ar: "يوم عادي" }, open: { en: "70+: the wise door opens", ar: "70 فما فوق: الباب الحكيم يُفتح" },
    door: { en: "The wise door", ar: "الباب الحكيم" }, try: { en: "Drag to try it", ar: "جرّبوا السحب" },
  },
  skills: {
    kicker: { en: "What children learn", ar: "ماذا يتعلّم الأطفال" },
    h2: { en: "Real money basics, never a lecture.", ar: "أساسيات المال الحقيقية، بلا محاضرات." },
    items: [
      ["coin", { en: "Money", ar: "الحساب" }, { en: "Profit = sales − costs. Saving vs spending. Not making too much.", ar: "الربح = المبيعات − التكاليف. الادّخار مقابل الإنفاق. وعدم صنع أكثر من الحاجة." }],
      ["smiling_face_with_smiling_eyes", { en: "Customers", ar: "العملاء" }, { en: "Listening to a complaint, fair prices, better quality.", ar: "الإصغاء إلى الشكوى، والسعر العادل، والجودة الأعلى." }],
      ["high_voltage", { en: "Balance", ar: "التوازن" }, { en: "Energy, rest and homework are part of a good business.", ar: "الطاقة والراحة والواجبات جزء من أي مشروع ناجح." }],
      ["handshake", { en: "Honesty", ar: "الأمانة" }, { en: "Owning a mistake, a truthful sign, giving back extra change.", ar: "الاعتراف بالخطأ، واللافتة الصادقة، وإرجاع الباقي الزائد." }],
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
    h2: { en: "Private by design.", ar: "الخصوصية جزء من التصميم." },
    items: [
      ["house", { en: "Nothing leaves the device", ar: "لا شيء يغادر الجهاز" }, { en: "No accounts, ads, analytics, tracking or leaderboard. The game loads nothing from other websites, and your child's name stays in the browser.", ar: "لا حسابات ولا إعلانات ولا تحليلات ولا تتبّع ولا لوحة صدارة. اللعبة لا تُحمِّل شيئًا من مواقع أخرى، واسم طفلكم يبقى في المتصفح." }],
      ["pig_face", { en: "Nothing to buy", ar: "لا شيء للشراء" }, { en: "Free, with no in-app purchases, no gambling and no loans.", ar: "مجانية، بلا مشتريات داخل اللعبة، ولا مقامرة، ولا قروض." }],
      ["heart_hands", { en: "Kind, never scary", ar: "لطيفة ولا تُخيف" }, { en: "No harsh endings. If the goal isn't reached, Grandpa sums up what was learned and offers another summer.", ar: "لا نهايات قاسية. وإذا لم يكتمل الهدف، يلخّص جدّو ما تعلّمه الطفل ويعرض صيفًا آخر." }],
      ["books", { en: "Made for class too", ar: "تصلح للفصل أيضًا" }, { en: "Read a scene together, play a summer in 15 minutes, then talk about Grandpa's idea. The worksheet is in the book.", ar: "اقرؤوا مشهدًا معًا، والعبوا صيفًا في 15 دقيقة، ثم تحدّثوا عن فكرة جدّو. وورقة التخطيط موجودة في الكتاب." }],
      ["speech_balloon", { en: "Arabic and English", ar: "بالعربية والإنجليزية" }, { en: "Written for children in Egypt and the Gulf, in Arabic that never assumes whether your child is a boy or a girl.", ar: "مكتوبة لأطفال مصر والخليج، بعربية لا تفترض أن طفلكم ولد أو بنت." }],
    ],
  },
  faq: {
    kicker: { en: "Questions", ar: "أسئلة" }, h2: { en: "Before you start", ar: "قبل أن تبدؤوا" },
    items: [
      [{ en: "What age is it for?", ar: "ما العمر المناسب؟" }, { en: "8 to 12, for children who can read short sentences on their own. Younger children enjoy the book with a parent.", ar: "من 8 إلى 12، للأطفال القادرين على قراءة جمل قصيرة بمفردهم. والأصغر سنًّا يستمتعون بالكتاب مع أحد الوالدين." }],
      [{ en: "Are the game and the book free?", ar: "هل اللعبة والكتاب مجانيان؟" }, { en: "Yes, both. No ads, no account and nothing to buy. The PDF is free to print and share.", ar: "نعم، كلاهما. بلا إعلانات ولا حساب ولا شيء للشراء. وملف PDF مجاني للطباعة والمشاركة." }],
      [{ en: "Do we need the book to play?", ar: "هل نحتاج إلى الكتاب لنلعب؟" }, { en: "No. Each stands on its own. Together they work best: the story shows the ideas, the game lets children try them.", ar: "لا. كلٌّ منهما يكفي وحده. ومعًا يكونان أفضل: الحكاية تعرض الأفكار، واللعبة تتيح للأطفال تجربتها." }],
      [{ en: "Which currency does it use?", ar: "ما العملة المستخدمة؟" }, { en: "Plain coins with no country, so it works the same in Cairo, Riyadh or Dubai.", ar: "عملات بسيطة لا تخصّ أي بلد، فتناسب القاهرة والرياض ودبي بالقدر نفسه." }],
      [{ en: "How do I print the book?", ar: "كيف نطبع الكتاب؟" }, { en: "Download the A5 PDF. Print it on A5, or on A4 at two pages per sheet, then fold.", ar: "حمّلوا ملف PDF بمقاس A5، واطبعوه على ورق A5، أو على A4 بصفحتين في كل ورقة ثم اطووها." }],
      [{ en: "Where is the data stored?", ar: "أين تُحفظ البيانات؟" }, { en: "Only in the browser on this device. Clearing the browser's data starts the game over.", ar: "في المتصفح على هذا الجهاز فقط. ومسح بيانات المتصفح يعيد اللعبة من البداية." }],
    ],
  },
  finale: {
    h2: { en: "Ready for a summer of business?", ar: "هل أنتم جاهزون لصيف من المشاريع؟" },
    p: { en: "Start with the story or jump into the game. Grandpa will be there either way.", ar: "ابدؤوا بالحكاية أو ادخلوا اللعبة مباشرة. وجدّو حاضر في الحالتين." },
  },
  foot: {
    line: { en: "The Little Entrepreneur · a sister to Founder Fog", ar: "الانتربرونور الصغير · مشروع شقيق لـ«ضباب المؤسس»" },
    credit: { en: "Needle-felted pictures made for this project. Fonts: Manrope and Readex Pro (OFL). No cookies, no tracking.", ar: "رسومات الصوف الملبّد صُنعت لهذا المشروع. الخطوط: Manrope و Readex Pro (رخصة OFL). بلا ملفات تعريف ارتباط ولا تتبّع." },
  },
};
