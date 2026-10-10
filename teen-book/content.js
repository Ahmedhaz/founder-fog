// Teenpreneur: the picture book. One school year in 8 chapters, English and Arabic side by side.
// Built into teenpreneur/book/ by build.mjs (web reader + A5 PDF), with the same system as the
// Little Entrepreneur and Founder Fog books, so the three read as one series.
//
// Writing rules:
//   - For readers aged 13 to 17: plain words, real numbers, no talking down. No real brands.
//   - No dashes in the text (no em or en dashes). Use full stops and commas.
//   - Money is in pounds (جنيه), written as digits. Every number written as digits in the English
//     also appears as digits in the Arabic.
//   - Nour's notes may speak to the reader. In Arabic they avoid gendered verbs (no imperatives,
//     no second-person present tense): use verbal nouns and statements, as the game does.
//   - Terms match the game: Nour's note ملاحظة نور, reputation السمعة, grades الدرجات.
//
// Cast: Laila (15, designs for local shops), Omar (16, fixes phones and laptops), Salma (15, Laila's
// best friend, bakes), Aunt Nour (Laila's aunt, runs a small print and design shop). Pictures are
// needle-felted wool dioramas, art/*.jpg.

module.exports = {
  meta: {
    title: { en: "Teenpreneur", ar: "تينبرونور" },
    subtitle: { en: "One school year, one side hustle, and everything nobody tells you about money", ar: "عام دراسي واحد، ومشروع جانبي واحد، وكل ما لا يقوله أحد عن المال" },
    tag: { en: "A story for ages 13 to 17", ar: "حكاية للأعمار من 13 إلى 17" },
    url: "https://adam.ahmedhaz.com/teen/",
    promo: "https://adam.ahmedhaz.com/teenpreneur/",
  },

  ui: {
    prev: { en: "Back", ar: "السابق" },
    next: { en: "Next", ar: "التالي" },
    pdf: { en: "Download PDF", ar: "تحميل PDF" },
    sample: { en: "Sample PDF", ar: "عيّنة PDF" },
    play: { en: "Play the game", ar: "العب اللعبة" },
    lang: { en: "العربية", ar: "English" },
    lift: { en: "Nour's note", ar: "ملاحظة نور" },
    chapter: { en: "Chapter", ar: "الفصل" },
    week: { en: "Week", ar: "الأسبوع" },
    contents: { en: "Contents", ar: "المحتويات" },
    inThis: { en: "In this chapter", ar: "في هذا الفصل" },
  },

  title: {
    lines: [
      { en: "A story about Laila, Omar, Salma and Aunt Nour, and one school year with a side hustle.", ar: "حكاية عن ليلى وعمر وسلمى والخالة نور، وعن عام دراسي واحد مع مشروع جانبي." },
      { en: "Written for teenagers who want to earn their own money, and for the adults who cheer them on.", ar: "مكتوبة للمراهقين الذين يريدون كسب مالهم بأنفسهم، وللكبار الذين يشجعونهم." },
    ],
    credits: [
      { en: "Pictures: needle-felted art made for this book. Fonts: Manrope and Readex Pro (SIL Open Font Licence).", ar: "الصور: فن يدوي من الصوف صُنع لهذا الكتاب. الخطوط: Manrope و Readex Pro (رخصة SIL المفتوحة)." },
      { en: "Ideas follow the game Teenpreneur. Not financial or legal advice.", ar: "الأفكار من لعبة «تينبرونور»، وليست نصيحة مالية أو قانونية." },
      { en: "© 2026 adam.ahmedhaz.com", ar: "© 2026 adam.ahmedhaz.com" },
    ],
  },

  intro: {
    title: { en: "Before you start", ar: "قبل أن تبدأ" },
    paras: [
      { en: "Laila is 15. Her sister's old laptop dies in the middle of a maths assignment, and a new one costs 18,000 pounds. This book follows her through one school year of designing menus and posters for the shops on her street, with her friends Omar and Salma, and her Aunt Nour, who has run a small print shop for twenty years.",
        ar: "ليلى عمرها 15 عامًا. يتوقف لابتوب أختها القديم في منتصف واجب رياضيات، والجديد يكلّف 18,000 جنيه. يتبعها هذا الكتاب خلال عام دراسي كامل تصمّم فيه القوائم والملصقات لمحلات شارعها، مع صديقيها عمر وسلمى، وخالتها نور التي تدير مطبعة صغيرة منذ عشرين عامًا." },
      { en: "Each scene ends with Nour's note: one idea, in plain words. At the end of each chapter there is a page of tools to use in your own side hustle this week.",
        ar: "وينتهي كل مشهد بـ«ملاحظة نور»: فكرة واحدة بكلمات بسيطة. وفي آخر كل فصل صفحة أدوات للاستخدام في مشروعك الجانبي هذا الأسبوع." },
      { en: "The story comes from Teenpreneur, a free game where you run a side hustle week by week and keep your grades up. Read a chapter, then play the year.",
        ar: "خرجت الحكاية من «تينبرونور»، لعبة مجانية تدير فيها مشروعًا جانبيًا أسبوعًا بأسبوع وتحافظ على درجاتك. فصل للقراءة، ثم عام كامل للّعب." },
    ],
  },

  chapters: [
    {
      title: { en: "The first price", ar: "السعر الأول" },
      week: 1,
      open: "c1open",
      lead: { en: "Every side hustle starts with something you want, something you can do, and a number you are scared to say out loud.",
              ar: "كل مشروع جانبي يبدأ بشيء تريده، وشيء تجيده، ورقم تخاف أن تقوله بصوت عالٍ." },
      quote: { en: "If you don't put a price on your time, someone else will. Usually zero.", ar: "إن لم تضع سعرًا لوقتك، سيضعه غيرك. وغالبًا يكون صفرًا." },
      quoteBy: { en: "Aunt Nour", ar: "الخالة نور" },
      scenes: [
        {
          type: "equation",
          title: { en: "600 a week", ar: "600 في الأسبوع" },
          eq: { a: "18,000", op: "÷", b: "30", c: "600", la: { en: "the laptop (pounds)", ar: "اللابتوب (جنيه)" }, lb: { en: "school weeks", ar: "أسبوعًا دراسيًا" }, lc: { en: "pounds a week", ar: "جنيه أسبوعيًا" } },
          text: { en: "The screen went black at 11 at night, halfway through a maths assignment. Laila's sister's laptop was 8 years old, and this time it did not wake up. A good used one cost 18,000 pounds. Laila said the number to Aunt Nour like it was a mountain. Nour took a pen and wrote it on a receipt. “How many weeks in the school year?” About 30. She divided. “Then it is not 18,000. It is 600 a week. Can you find 600 a week?” Laila did not know. But 600 sounded like something you could try.",
                  ar: "انطفأت الشاشة في الساعة 11 ليلًا، في منتصف واجب رياضيات. كان لابتوب أخت ليلى عمره 8 سنوات، وهذه المرة لم يعد للحياة. والمستعمل الجيد يكلّف 18,000 جنيه. قالت ليلى الرقم لخالتها نور كأنه جبل. فأخذت نور قلمًا وكتبته على ظهر إيصال، وسألت: «كم أسبوعًا في العام الدراسي؟» نحو 30. فقسمت وقالت: «إذن هو ليس 18,000. هو 600 في الأسبوع. هل يمكن إيجاد 600 في الأسبوع؟» لم تكن ليلى تعرف. لكن 600 بدت شيئًا يمكن تجربته." },
          lift: { t: { en: "A goal you can divide", ar: "هدف يمكن تقسيمه" },
                  d: { en: "A big number is a wish. The same number divided by the weeks you have is a plan you can check every Friday.", ar: "الرقم الكبير أمنية. والرقم نفسه مقسومًا على الأسابيع المتاحة خطة يمكن مراجعتها كل يوم جمعة." } },
          art: "c1s1",
        },
        {
          title: { en: "What is an hour worth?", ar: "كم تساوي الساعة؟" },
          text: { en: "Uncle Fathi's café on the corner had the same menu since before Laila was born. Laila drew him a new one in her sketchbook. He loved it. “How much?” he asked. “100?” said Laila. Aunt Nour, drinking tea at the back table, raised one eyebrow. Later she asked: how many hours did it take? Six, with the changes. And printing it properly? 150 pounds. “So you would pay 50 pounds for the honour of working six hours,” Nour said. Laila went back the next day and said 450. Uncle Fathi said yes before she finished the sentence.",
                  ar: "كانت قائمة مقهى عم فتحي على الناصية هي نفسها منذ ما قبل ولادة ليلى. فرسمت له ليلى قائمة جديدة في دفتر رسمها. أحبّها كثيرًا وسأل: «بكم؟» قالت ليلى: «100؟» فرفعت خالتها نور، التي كانت تشرب الشاي على الطاولة الخلفية، حاجبًا واحدًا. ثم سألتها لاحقًا: كم ساعة استغرقت؟ ست ساعات مع التعديلات. وطباعتها بشكل لائق؟ 150 جنيهًا. فقالت نور: «يعني ستدفعين 50 جنيهًا مقابل شرف العمل ست ساعات.» عادت ليلى في اليوم التالي وقالت: 450. ووافق عم فتحي قبل أن تُكمل جملتها." },
          lift: { t: { en: "A price covers costs and time", ar: "السعر يغطي التكلفة والوقت" },
                  d: { en: "Add up what the job costs you in money, then put a fair value on your hours. The first price people say is usually what they are scared of, not what the work is worth.", ar: "أولًا ما يكلّفه العمل من مال، ثم قيمة عادلة للساعات. والسعر الأول الذي يقوله الناس غالبًا هو ما يخافون منه، لا ما يستحقه العمل." } },
          art: "c1s2",
        },
        {
          type: "equation",
          title: { en: "The first profit", ar: "الربح الأول" },
          eq: { a: "450", op: "−", b: "150", c: "300", la: { en: "Uncle Fathi paid", ar: "دفع عم فتحي" }, lb: { en: "printing", ar: "الطباعة" }, lc: { en: "profit", ar: "الربح" } },
          text: { en: "Uncle Fathi paid in crisp notes and gave her a free mango juice. Laila walked home with 450 pounds and the feeling of being rich. At the print shop, Nour took 150 back for the lamination, and did not give her a family discount. “You are a customer now. Customers pay.” Laila opened a notebook and wrote two columns: in and out. 450 in. 150 out. 300 left. Half of a week's target, from one menu. She drew a small star next to it.",
                  ar: "دفع عم فتحي بأوراق نقدية جديدة وأهداها عصير مانجو مجانًا. ومشت ليلى إلى البيت ومعها 450 جنيهًا وإحساس بالثراء. وفي المطبعة استردّت نور 150 مقابل التغليف، ولم تعطها خصمًا عائليًا، وقالت: «أنتِ زبونة الآن. والزبائن يدفعون.» فتحت ليلى دفترًا ورسمت عمودين: داخل وخارج. 450 داخل. 150 خارج. 300 باقية. نصف هدف أسبوع من قائمة واحدة. ورسمت بجانبها نجمة صغيرة." },
          lift: { t: { en: "Profit is what is left", ar: "الربح هو ما يتبقّى" },
                  d: { en: "The money that comes in is not yours yet. Take out what you spent to do the job, and only the rest counts towards the goal.", ar: "المال الداخل ليس لك بعد. يُطرح منه ما صُرف لإنجاز العمل، والباقي وحده يُحسب نحو الهدف." } },
          art: "c1s3",
        },
        {
          title: { en: "Omar's screwdriver", ar: "مفك عمر" },
          text: { en: "Omar from the fourth floor fixed phones. Everyone knew it, because he did it for almost nothing. A cracked screen, 200 pounds, and he spent 170 on the part. He showed Laila his tiny screwdrivers like a surgeon. “I make 30 pounds an hour,” she said, after counting. He laughed, then stopped laughing. “I never counted the hours.” They sat on the stairs and worked out a real price for a screen: the part, his time, and a little for the screens he breaks while learning. It came to 400. “Nobody will pay that,” said Omar. That week, 3 people did.",
                  ar: "كان عمر من الدور الرابع يصلح الهواتف. والكل يعرف ذلك، لأنه يفعله تقريبًا بلا مقابل. شاشة مكسورة بـ200 جنيه، يدفع منها 170 في القطعة. وأرى ليلى مفكاته الصغيرة كأنه جرّاح. قالت بعد أن حسبت: «أنت تكسب 30 جنيهًا في الساعة.» ضحك، ثم توقف عن الضحك وقال: «لم أحسب الساعات أبدًا.» جلسا على السلّم وحسبا سعرًا حقيقيًا للشاشة: القطعة، ووقته، وقليلًا مقابل الشاشات التي يكسرها وهو يتعلّم. خرج الرقم 400. قال عمر: «لن يدفع أحد هذا.» وفي ذلك الأسبوع دفع 3 أشخاص." },
          lift: { t: { en: "Count the hours", ar: "حساب الساعات" },
                  d: { en: "Divide what you keep by the hours you worked. If the number is smaller than a part-time job, the price is too low, not the work too slow.", ar: "ما يتبقّى مقسومًا على ساعات العمل. وإذا كان الناتج أقل من أجر عمل بدوام جزئي، فالسعر هو المنخفض، لا العمل هو البطيء." } },
          art: "c1s4",
        },
        {
          title: { en: "The deal at home", ar: "الاتفاق في البيت" },
          text: { en: "At dinner Laila announced she had a business. Her mother put down her spoon. “And school?” Laila had expected this. She had written a page, the way Nour told her to. One: school comes first, always. Two: no work after 10 at night. Three: if her grades drop below 70, the business pauses until they come back. Four: every new client, Mum knows who they are. Her father read it twice and signed the bottom, and asked for a menu for his office. Her mother signed too, and stuck the page on the fridge with a magnet shaped like a lemon.",
                  ar: "على العشاء أعلنت ليلى أن لديها مشروعًا. فوضعت أمها ملعقتها وقالت: «والمدرسة؟» كانت ليلى تتوقع هذا. فقد كتبت صفحة كما قالت لها نور. أولًا: المدرسة أولًا دائمًا. ثانيًا: لا عمل بعد الساعة 10 ليلًا. ثالثًا: إذا نزلت الدرجات تحت 70، يتوقف المشروع حتى تعود. رابعًا: كل عميل جديد، ماما تعرف من هو. قرأها أبوها مرتين ووقّع في أسفلها، وطلب قائمة لمكتبه. ووقّعت أمها أيضًا، وثبّتت الصفحة على الثلاجة بمغناطيس على شكل ليمونة." },
          lift: { t: { en: "Rules you write together", ar: "قواعد تُكتب معًا" },
                  d: { en: "Parents worry less about what they can see. A short written deal about school, sleep and safety turns a fight into a plan.", ar: "قلق الأهل يقلّ عندما يرون. واتفاق قصير مكتوب عن الدراسة والنوم والأمان يحوّل الخلاف إلى خطة." } },
          art: "c1s5",
        },
      ],
      tools: {
        title: { en: "Tools for week 1", ar: "أدوات الأسبوع 1" },
        sections: [
          { type: "calc", title: { en: "1. Your goal, divided", ar: "1. الهدف مقسومًا" }, op: "÷",
            a: { en: "the goal", ar: "الهدف" }, b: { en: "weeks", ar: "الأسابيع" }, c: { en: "a week", ar: "في الأسبوع" } },
          { type: "checks", title: { en: "2. Before you say a price", ar: "2. قبل قول أي سعر" }, items: [
            { en: "What will this job cost me in materials, printing or travel?", ar: "كم سيكلّف هذا العمل من مواد أو طباعة أو مواصلات؟" },
            { en: "How many hours will it really take, with changes?", ar: "كم ساعة سيستغرق فعلًا، مع التعديلات؟" },
            { en: "What does similar work cost around here?", ar: "كم يكلّف عمل مشابه في المنطقة؟" },
            { en: "Will I still be happy with this price after the third change?", ar: "هل سيبقى هذا السعر مرضيًا بعد التعديل الثالث؟" },
          ] },
          { type: "lines", title: { en: "3. The deal at home: write your four rules", ar: "3. الاتفاق في البيت: أربع قواعد" }, n: 4 },
        ],
      },
    },
    // Chapters 2 to 8 are the printed book. They are kept outside this public repo and added
    // only for the full build: TEEN_FULL=/path/to/chapters.js (see build.mjs).
    ...(process.env.TEEN_FULL ? require(process.env.TEEN_FULL) : []),
  ],

  // The sample (this public site) ends with the full book's contents and where to get it.
  fullBook: {
    title: { en: "The full book", ar: "الكتاب الكامل" },
    lead: { en: "This was chapter 1 of 8. The whole school year, with every chapter's tools, is in the printed book.", ar: "كان هذا الفصل 1 من 8. والعام الدراسي كاملًا، مع أدوات كل فصل، في الكتاب المطبوع." },
    chapters: [
      [{ en: "The first price", ar: "السعر الأول" }, 1], [{ en: "First customers", ar: "الزبائن الأوائل" }, 4],
      [{ en: "Exam season", ar: "موسم الامتحانات" }, 9], [{ en: "The partner", ar: "الشريك" }, 13],
      [{ en: "The comment", ar: "التعليق" }, 16], [{ en: "Late nights", ar: "ليالٍ متأخرة" }, 19],
      [{ en: "Trust", ar: "الثقة" }, 24], [{ en: "The end of the year", ar: "نهاية العام" }, 30],
    ],
    note: { en: "60 pages · English and Arabic · 48 felted scenes", ar: "60 صفحة · بالعربية والإنجليزية · 48 مشهدًا" },
  },

  back: {
    blurb: { en: "Laila needs 18,000 pounds by the end of the school year. She has a sketchbook, a friend who fixes phones, an aunt with opinions, and a mother who signed a contract on the fridge. A story about pricing your time, saying no, staying safe, keeping your grades, and the first money you ever earned yourself.",
             ar: "تحتاج ليلى إلى 18,000 جنيه قبل نهاية العام الدراسي. لديها دفتر رسم، وصديق يصلح الهواتف، وخالة لها آراء، وأمّ وقّعت عقدًا معلّقًا على الثلاجة. حكاية عن تسعير الوقت، وقول «لا»، والأمان، والحفاظ على الدرجات، وأول مال يُكسب بالجهد الشخصي." },
    play: { en: "Play the game free", ar: "اللعبة مجانية" },
    small: { en: "English and Arabic · No account", ar: "بالعربية والإنجليزية · بلا حساب" },
  },
};
