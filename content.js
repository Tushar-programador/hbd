/* ============================================================================
   content.js  —  EVERYTHING PERSONAL LIVES HERE
   ----------------------------------------------------------------------------
   To personalize this website you only ever edit THIS file. You never need to
   touch the HTML, CSS, or JavaScript.

   • Change names, messages, dates, stories, and captions below.
   • Replace the placeholder pictures by dropping your real photos into
     assets/images/ using the SAME file names referenced here
     (e.g. save your photo as assets/images/beginning-1.svg -> or change the
      path below to assets/images/beginning-1.jpg).
   • Add songs by dropping .mp3 files into assets/music/ and updating `playlist`.

   Anything written like [this] is a placeholder for you to replace.
   ========================================================================== */

window.CONTENT = {
  /* --- Who this is for ---------------------------------------------------- */
  recipientName: "Varsha",

  /* --- Landing screen ---------------------------------------------------- */
  landingTitle: "Happy Birthday",
  landingMessage: "Today is all about the most beautiful person in my life.",
  beginButton: "Begin our journey",

  /* --- Chapter 1: Happy Birthday ----------------------------------------- */
  birthday: {
    eyebrow: "Chapter One",
    title: "Happy Birthday",
    subtitle: "Make a wish, my love. Then tap the candle.",
    hint: "Tap the cake to blow out the candle",
    cta: "Let's relive our journey",
  },

  /* --- Chapter 2: The Beginning ------------------------------------------ */
  beginning: {
    eyebrow: "Chapter Two",
    title: "The Beginning",
    intro: "Every love story has a first page. This one is ours.",
    cards: [
      {
        date: "The day we met",
        title: "First Meeting",
        text: "[Write about the very first time you saw her — where you were, what she was wearing, the exact moment you knew this was going to matter.]",
        imagePath: "assets/images/beginning-1.svg",
        alt: "Placeholder photo of our first meeting",
      },
      {
        date: "The first hello",
        title: "First Conversation",
        text: "[What did you talk about for hours? What made you laugh? When did you realize you never wanted the conversation to end?]",
        imagePath: "assets/images/beginning-2.svg",
        alt: "Placeholder photo from our first conversation",
      },
      {
        date: "One for the memory",
        title: "First Picture",
        text: "[The first photo of us together. We had no idea how many more we'd take.]",
        imagePath: "assets/images/beginning-3.svg",
        alt: "Placeholder of the first picture of us",
      },
      {
        date: "The one that stuck",
        title: "First Memory",
        text: "[The first moment that became a 'remember when' — the story you two still tell each other.]",
        imagePath: "assets/images/beginning-4.svg",
        alt: "Placeholder photo of our first memory",
      },
      {
        date: "And then, us",
        title: "The Start of Everything",
        text: "[The moment 'you' and 'me' quietly became 'us'.]",
        imagePath: "assets/images/beginning-5.svg",
        alt: "Placeholder photo of the start of us",
      },
    ],
  },

  /* --- Chapter 3: Music player ------------------------------------------- */
  music: {
    eyebrow: "Chapter Three",
    title: "The Sound of Us",
    intro: "A few songs that will always sound like you.",
    // Drop real .mp3 files into assets/music/ and point `src` at them.
    // Until you do, the player still works — it just won't make sound.
    playlist: [
      { title: "[Our Song]", artist: "[Artist]", src: "assets/music/song-1.mp3", note: "The one that always brings you back." },
      { title: "[Song Two]", artist: "[Artist]", src: "assets/music/song-2.mp3", note: "For slow dancing in the kitchen." },
      { title: "[Song Three]", artist: "[Artist]", src: "assets/music/song-3.mp3", note: "Because it makes you smile every time." },
    ],
  },

  /* --- Chapter 4: Love Letter -------------------------------------------- */
  loveLetter: {
    eyebrow: "Chapter Four",
    title: "A Letter For You",
    sealHint: "Tap the seal to open",
    // Use blank lines to separate paragraphs. Write from the heart.
    body:
      "My dearest Varsha,\n\n" +
      "[Start with how it feels to write this — a whole year of us behind these words.]\n\n" +
      "[Tell her the small things you notice. The way she laughs. The way a room changes when she walks in. The way she makes ordinary days feel like something worth remembering.]\n\n" +
      "[Tell her what she's given you. How she's changed you. What you're grateful for that you'll never say out loud enough.]\n\n" +
      "[End with a promise — for this year, and every one after it.]",
    signoff: "All my love, always,",
    signature: "[Your Name]",
  },

  /* --- Chapter 5: Final Surprise ----------------------------------------- */
  final: {
    eyebrow: "One Last Thing",
    intro: "Everything slows down here.",
    prompt: "I have one last gift for you.",
    button: "Open it",
    // Photos for the closing slideshow. Swap these for your favorites.
    photos: [
      { imagePath: "assets/images/memory-1.svg", alt: "Placeholder memory one" },
      { imagePath: "assets/images/memory-2.svg", alt: "Placeholder memory two" },
      { imagePath: "assets/images/memory-3.svg", alt: "Placeholder memory three" },
      { imagePath: "assets/images/memory-4.svg", alt: "Placeholder memory four" },
      { imagePath: "assets/images/memory-5.svg", alt: "Placeholder memory five" },
      { imagePath: "assets/images/memory-6.svg", alt: "Placeholder memory six" },
    ],
    // The closing words. (Verbatim from the brief — change freely.)
    message:
      "Every picture tells a story, but my favorite story will always be the one we're writing together.\n\n" +
      "Happy Birthday, my love.\n\n" +
      "Thank you for being you.\n\n" +
      "I love you. ❤️",
  },
};
