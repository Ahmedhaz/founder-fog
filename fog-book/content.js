// Founder Fog: the picture book. A year in 12 chapters for early founders, English and Arabic side by side.
// Built into fog/book/ by build.mjs (web reader + A5 PDF), with the same system as the Little
// Entrepreneur book (little-book/), so the two read as one series.
//
// Writing rules:
//   - For grown-ups starting a company: plain words, real numbers, real sources. No real brands.
//   - No dashes in the text (no em or en dashes). Use full stops and commas.
//   - Terms match the game's Arabic: runway مدة الصمود, vesting الاستحقاق التدريجي للحصص,
//     The Mom Test اختبار الأم, clarity الوضوح.
//   - Every number written as digits in the English also appears as digits in the Arabic.
//   - Tools pages use nouns and labels. "The fog lifts" boxes may address the reader the way the
//     game's Founder Playbook does, and use its Arabic titles.
//
// Cast: Salma (founder), Tariq Mansour (co-founder and CTO, as in the game), Hisham (mentor,
// sold his first company). Pictures are needle-felted wool dioramas with wool fog, art/*.jpg.

module.exports = {
  meta: {
    title: { en: "Founder Fog", ar: "ضباب المؤسس" },
    subtitle: { en: "A year in the founder's chair, and how to see through the fog", ar: "عام على كرسي المؤسس، وكيف ترى عبر الضباب" },
    tag: { en: "A story for founders", ar: "حكاية للمؤسسين" },
    url: "https://adam.ahmedhaz.com/founder-fog/",
    promo: "https://adam.ahmedhaz.com/fog/",
  },

  ui: {
    prev: { en: "Back", ar: "السابق" },
    next: { en: "Next", ar: "التالي" },
    pdf: { en: "Download PDF", ar: "تحميل PDF" },
    sample: { en: "Sample PDF", ar: "عيّنة PDF" },
    play: { en: "Play the game", ar: "العب اللعبة" },
    lang: { en: "العربية", ar: "English" },
    lift: { en: "The fog lifts", ar: "الضباب ينقشع" },
    chapter: { en: "Chapter", ar: "الفصل" },
    week: { en: "Week", ar: "الأسبوع" },
    contents: { en: "Contents", ar: "المحتويات" },
    inThis: { en: "In this chapter", ar: "في هذا الفصل" },
  },

  title: {
    lines: [
      { en: "A story about Salma, Tariq and Hisham, and the first year of a company.", ar: "حكاية عن سلمى وطارق وهشام، وعن العام الأول في عمر شركة." },
      { en: "Written for people starting a company, and for anyone thinking about it.", ar: "مكتوبة لمن يبدأ شركة، ولكل من يفكّر في ذلك." },
    ],
    credits: [
      { en: "Pictures: needle-felted art made for this book. Fonts: Manrope and Readex Pro (SIL Open Font Licence).", ar: "الصور: رسومات صوف ملبّد صُنعت لهذا الكتاب. الخطوط: Manrope و Readex Pro (رخصة SIL المفتوحة)." },
      { en: "Ideas and sources follow the Founder Playbook in the game. Not financial or legal advice.", ar: "الأفكار والمصادر من «دليل المؤسس» في اللعبة، وليست نصيحة مالية أو قانونية." },
      { en: "© 2026 adam.ahmedhaz.com", ar: "© 2026 adam.ahmedhaz.com" },
    ],
  },

  intro: {
    title: { en: "Before you start", ar: "قبل أن تبدأ" },
    paras: [
      { en: "Every founder works in a fog. You cannot see the market clearly, the numbers arrive late, and when you are tired the fog gets thicker. This book follows Salma through the first year of a company that helps small shops get paid on time.",
        ar: "كل مؤسس يعمل وسط ضباب. لا يرى السوق بوضوح، والأرقام تصل متأخرة، ومع التعب يزداد الضباب كثافة. يتبع هذا الكتاب سلمى خلال العام الأول من شركة تساعد المحلات الصغيرة على تحصيل أموالها في موعدها." },
      { en: "Each scene ends with a box called The fog lifts: one idea, in plain words, with where it comes from. At the end of each chapter there is a page of tools to use in your own company this week.",
        ar: "وينتهي كل مشهد بصندوق اسمه «الضباب ينقشع»: فكرة واحدة بكلمات بسيطة، ومصدرها. وفي آخر كل فصل صفحة أدوات للاستخدام في شركتك هذا الأسبوع." },
      { en: "The story comes from Founder Fog, a free game where you run a startup week by week. Play a chapter, then play the year.",
        ar: "خرجت الحكاية من «ضباب المؤسس»، لعبة مجانية تدير فيها شركة ناشئة أسبوعًا بأسبوع. فصل للقراءة، ثم عام كامل للّعب." },
    ],
  },

  chapters: [
    {
      title: { en: "The jump", ar: "القفزة" },
      week: 0,
      open: "c1open",
      lead: { en: "Every company starts before it has a name: with a person, a problem that will not let go, and a sum on the back of an envelope.",
              ar: "كل شركة تبدأ قبل أن يكون لها اسم: بشخص، ومشكلة لا تتركه، وحساب على ظهر ظرف." },
      quote: { en: "The fog isn't out there in the market. Most of it is in your own head.", ar: "الضباب ليس هناك في السوق. معظمه في رأسك أنت." },
      quoteBy: { en: "Hisham", ar: "هشام" },
      scenes: [
        {
          type: "equation",
          title: { en: "12 months", ar: "12 شهرًا" },
          eq: { a: "18,000", op: "÷", b: "1,500", c: "12", la: { en: "savings ($)", ar: "المدّخرات ($)" }, lb: { en: "to live, a month", ar: "للعيش شهريًا" }, lc: { en: "months", ar: "شهرًا" } },
          text: { en: "For six years Salma managed products at a bank in Cairo. Every month she watched small shops wait weeks to get paid, and borrow to cover the gap. Before she handed in her notice, she did one sum. Savings: $18,000. Rent, food and bills: $1,500 a month. That gave her 12 months, if nothing went wrong. Hisham, who had sold his first company, called it her personal runway. “Write it on the wall,” he said. “Not to scare you. So you always know.”",
                  ar: "ستّ سنوات قضتها سلمى تدير المنتجات في بنك بالقاهرة. وكل شهر كانت ترى محلات صغيرة تنتظر أسابيع حتى تحصل على أموالها، وتقترض لتسدّ الفجوة. وقبل أن تقدّم استقالتها أجرت حسابًا واحدًا: مدّخرات 18,000 دولار، وإيجار وطعام وفواتير 1,500 دولار في الشهر. أي 12 شهرًا، إن لم يحدث شيء غير متوقّع. وسمّى هشام، الذي باع شركته الأولى، ذلك «مدة صمودها الشخصية»، وقال: «اكتبيها على الحائط. لا لتخافي، بل لتعرفي دائمًا.»" },
          lift: { t: { en: "Personal runway", ar: "مدة الصمود الشخصية" },
                  d: { en: "Savings divided by what you need to live each month. It is the clock that starts the day you quit, and founders who know it make calmer decisions.", ar: "المدّخرات مقسومة على ما يلزم للعيش كل شهر. إنها الساعة التي تبدأ يوم الاستقالة، والمؤسس الذي يعرفها يتخذ قرارات أهدأ." } },
          art: "c1s1",
        },
        {
          title: { en: "Half and half on a napkin", ar: "نصف بنصف على منديل" },
          text: { en: "Tariq had built two apps nobody used, and he wanted this one to be different. In a café near Tahrir they drew a line down a paper napkin. Half for Salma, half for Tariq. “Deal?” said Tariq. Hisham put down his coffee. “Imagine it is month 8, and one of you wants to leave. Who keeps the half?” Nobody spoke. That night they agreed on vesting: shares earned over 4 years, and nothing until the end of year one. It felt unromantic. It was the kindest thing they did all year.",
                  ar: "كان طارق قد بنى تطبيقين لم يستخدمهما أحد، وأراد أن يكون هذا مختلفًا. وفي مقهى قرب التحرير رسما خطًا في منتصف منديل ورقي: نصف لسلمى، ونصف لطارق. قال طارق: «اتفقنا؟» فوضع هشام فنجانه وقال: «تخيّلا أننا في الشهر 8، وأحدكما يريد الرحيل. من يحتفظ بالنصف؟» ساد الصمت. وفي تلك الليلة اتفقا على الاستحقاق التدريجي للحصص: تُكتسب على 4 سنوات، ولا شيء قبل نهاية السنة الأولى. بدا الأمر بلا رومانسية، لكنه كان ألطف ما فعلاه طوال العام." },
          lift: { t: { en: "Vesting", ar: "الاستحقاق التدريجي للحصص" },
                  d: { en: "Founder shares are earned over time, usually 4 years with a 1-year cliff. It protects whoever stays, and investors will ask for it anyway.", ar: "تُكتسب حصص المؤسسين مع الوقت، عادةً على 4 سنوات مع فترة انتظار مدتها سنة. هذا يحمي من يبقى، والمستثمرون سيطلبونه على أي حال." },
                  src: { en: "Brad Feld and Jason Mendelson, Venture Deals", ar: "براد فيلد وجيسون مندلسون، Venture Deals" } },
          art: "c1s2",
        },
        {
          title: { en: "Don't build yet", ar: "لا تبنِ بعد" },
          text: { en: "Tariq wanted to start coding on Monday. Hisham asked for 20 conversations first, with one rule: never ask if they like the idea. So Salma sat on a stool in Umm Hany's grocery shop and asked about last month instead. How many customers paid later? How long did she wait? What did she do while she waited? Umm Hany pulled out a shoebox of paper receipts. “40 days, sometimes,” she said. “I borrow from my brother.” Nobody said the word app. Salma filled 6 pages.",
                  ar: "أراد طارق أن يبدأ البرمجة يوم الاثنين. فطلب هشام 20 محادثة أولًا، بقاعدة واحدة: لا سؤال أبدًا عن إعجابهم بالفكرة. فجلست سلمى على كرسي صغير في بقالة أم هاني، وسألت عن الشهر الماضي بدلًا من ذلك: كم زبونًا دفع لاحقًا؟ وكم انتظرت؟ وماذا فعلت وهي تنتظر؟ أخرجت أم هاني علبة أحذية مليئة بالإيصالات الورقية وقالت: «40 يومًا أحيانًا. وأقترض من أخي.» لم يذكر أحد كلمة تطبيق. وملأت سلمى 6 صفحات." },
          lift: { t: { en: "The Mom Test", ar: "اختبار الأم" },
                  d: { en: "Ask about what people did, not about your idea. Opinions are polite. What they did last month is data.", ar: "السؤال عمّا فعله الناس، لا عن الفكرة. الآراء مجاملة، وما فعلوه الشهر الماضي بيانات." },
                  src: { en: "Rob Fitzpatrick, The Mom Test (2013)", ar: "روب فيتزباتريك، The Mom Test (2013)" } },
          art: "c1s3",
        },
        {
          title: { en: "The first fog", ar: "الضباب الأول" },
          text: { en: "3 weeks in, Salma was sleeping 5 hours a night. Her notes stopped making sense. She read the same email 4 times and answered the wrong question. Hisham called at midnight and heard it in her voice. “In my first company I thought being tired proved I cared,” he said. “It was just the fog. It hides the numbers first, then the people.” She closed the laptop. The next day she slept 8 hours, walked by the Nile, and found the mistake in her spreadsheet in 10 minutes.",
                  ar: "بعد 3 أسابيع كانت سلمى تنام 5 ساعات في الليلة. لم تعد ملاحظاتها مفهومة، وقرأت البريد نفسه 4 مرات ثم أجابت عن السؤال الخطأ. اتصل هشام في منتصف الليل وسمع ذلك في صوتها، وقال: «في شركتي الأولى ظننت أن التعب دليل على أنني أهتم. لم يكن إلا الضباب. يخفي الأرقام أولًا، ثم الناس.» فأغلقت الحاسوب. وفي اليوم التالي نامت 8 ساعات، ومشت على النيل، ووجدت الخطأ في جدولها خلال 10 دقائق." },
          lift: { t: { en: "Clarity", ar: "الوضوح" },
                  d: { en: "The founder is the company's first resource. Sleep, exercise and one evening off a week are how good decisions keep coming.", ar: "المؤسس هو أول موارد الشركة. النوم والرياضة وأمسية حرّة كل أسبوع هي ما يُبقي القرارات الجيدة ممكنة." },
                  src: { en: "Michael A. Freeman et al., Are Entrepreneurs Touched with Fire? (2015)", ar: "مايكل فريمان وزملاؤه، Are Entrepreneurs Touched with Fire? (2015)" } },
          art: "c1s4",
        },
      ],
      tools: {
        title: { en: "Tools for week 0", ar: "أدوات الأسبوع 0" },
        sections: [
          { type: "calc", title: { en: "1. Personal runway", ar: "1. مدة الصمود الشخصية" }, op: "÷",
            a: { en: "savings", ar: "المدّخرات" }, b: { en: "to live, a month", ar: "للعيش شهريًا" }, c: { en: "months", ar: "شهور" } },
          { type: "checks", title: { en: "2. The co-founder talk: five questions for this month", ar: "2. حديث الشركاء: خمسة أسئلة لهذا الشهر" }, items: [
            { en: "Who decides what, and who breaks a tie?", ar: "من يقرّر ماذا، ومن يحسم الخلاف؟" },
            { en: "How is the equity split, and does it vest?", ar: "كيف تُقسم الحصص، وهل تُستحق تدريجيًا؟" },
            { en: "What happens if one of us leaves?", ar: "ماذا يحدث إذا رحل أحد الشركاء؟" },
            { en: "How much does each of us need to live on?", ar: "كم يحتاج كل شريك ليعيش؟" },
            { en: "How do we disagree without breaking up?", ar: "كيف نختلف دون أن ننفصل؟" },
          ] },
          { type: "tally", title: { en: "3. Twenty conversations, before any code", ar: "3. عشرون محادثة، قبل أي سطر برمجة" }, n: 20,
            note: { en: "One circle per conversation about what someone did last month.", ar: "دائرة لكل محادثة عمّا فعله شخص ما الشهر الماضي." } },
        ],
      },
    },
    // Chapters 2 to 12 are the printed book. They are kept outside this public repo and added
    // only for the full build: FOG_FULL=/path/to/chapters.js (see build.mjs).
    ...(process.env.FOG_FULL ? require(process.env.FOG_FULL) : []),
  ],

  // The sample (this public site) ends with the full book's contents and where to get it.
  fullBook: {
    title: { en: "The full book", ar: "الكتاب الكامل" },
    lead: { en: "This was chapter 1 of 12. The full year, with every chapter's tools, is in the printed book.", ar: "كان هذا الفصل 1 من 12. والعام الكامل، مع أدوات كل فصل، في الكتاب المطبوع." },
    chapters: [
      [{ en: "The jump", ar: "القفزة" }, 0], [{ en: "Looking for fit", ar: "البحث عن التوافق" }, 2], [{ en: "The angel", ar: "المستثمرة الملاك" }, 5],
      [{ en: "The big customer", ar: "العميل الكبير" }, 7], [{ en: "Four days without sleep", ar: "أربعة أيام بلا نوم" }, 9], [{ en: "The clock", ar: "الساعة" }, 12],
      [{ en: "The rival", ar: "المنافس" }, 14], [{ en: "Ramadan", ar: "رمضان" }, 21], [{ en: "The first salesperson", ar: "أول مندوب مبيعات" }, 26],
      [{ en: "The licence and the family", ar: "الترخيص والعائلة" }, 30], [{ en: "The pivot", ar: "التحوّل" }, 44], [{ en: "A year later", ar: "بعد عام" }, 52],
    ],
    note: { en: "76 pages · English and Arabic · 61 felted scenes", ar: "76 صفحة · بالعربية والإنجليزية · 61 مشهدًا" },
  },

  back: {
    blurb: { en: "Salma has 12 months of savings, a co-founder, a mentor and a problem worth solving. What she does not have is a clear view. A story about the first year of a company, the fog every founder works in, and the ideas that help it lift.",
             ar: "لدى سلمى مدّخرات تكفي 12 شهرًا، وشريك، ومرشد، ومشكلة تستحق الحل. أما ما ينقصها فهو الرؤية الواضحة. حكاية عن العام الأول في عمر شركة، وعن الضباب الذي يعمل وسطه كل مؤسس، والأفكار التي تساعده على الانقشاع." },
    play: { en: "Play the game free", ar: "اللعبة مجانية" },
    small: { en: "English and Arabic · No account", ar: "بالعربية والإنجليزية · بلا حساب" },
  },
};
