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
  recipientName: "Tarushi",

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
        text: "I still remember the way that evening felt — like the room got a little warmer the moment you walked in. I didn't know your name yet, but I remember thinking I wanted to.",
        imagePath: "assets/images/beginning-1.jpeg",
        alt: "Photo of our first meeting",
      },
      {
        date: "The first hello",
        title: "First Conversation",
        text: "We talked for hours and it felt like minutes. I don't remember everything we said, but I remember laughing more than I had in a long time, and not wanting it to end.",
        imagePath: "assets/images/beginning-2.jpeg",
        alt: "Photo from our first conversation",
      },
      {
        date: "One for the memory",
        title: "First Picture",
        text: "Our first photo together — we had no idea how many more we'd take after this one, or how many more nights out we'd steal just to make new memories.",
        imagePath: "assets/images/beginning-3.jpeg",
        alt: "The first picture of us",
      },
      {
        date: "The one that stuck",
        title: "First Memory",
        text: "This is the one we still bring up and laugh about — our own little 'remember when'. It's small, but it's ours, and that's what makes it matter.",
        imagePath: "assets/images/beginning-4.jpeg",
        alt: "Photo of our first memory",
      },
      {
        date: "And then, us",
        title: "The Start of Everything",
        text: "Somewhere between all those firsts, 'you' and 'me' quietly became 'us' — and it's been the easiest, best thing I've ever fallen into.",
        imagePath: "assets/images/beginning-5.jpeg",
        alt: "Photo of the start of us",
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
      { title: "Kesariya", artist: "Arijit Singh · Brahmāstra", src: "assets/music/song-1.mp3", note: "The one that always brings you back." },
      { title: "Raataan Lambiyan", artist: "Tanishk Bagchi, Jubin Nautiyal, Asees Kaur · Shershaah", src: "assets/music/song-2.mp3", note: "For slow dancing when no one's watching." },
      { title: "Tum Hi Ho", artist: "Arijit Singh · Aashiqui 2", src: "assets/music/song-3.mp3", note: "Because it still means every word." },
      { title: "Kal Ho Naa Ho", artist: "Sonu Nigam · Wake Up Sid / KHNH", src: "assets/music/song-4.mp3", note: "A reminder to hold on to days like this one." },
    ],
  },

  /* --- Chapter 4: Love Letter -------------------------------------------- */
  loveLetter: {
    eyebrow: "Chapter Four",
    title: "A Letter For You",
    sealHint: "Tap the seal to open",
    // Use blank lines to separate paragraphs. Write from the heart.
    body:
      "My dearest Tarushi,\n\n" +
      "I've started writing this letter more times than I can count, because no version of it feels big enough for everything I actually want to say to you.\n\n" +
      "I notice the small things about you more than you probably realize — the way you laugh with your whole face, the way a room feels different the second you walk into it, the way you can turn an ordinary Tuesday into something I still think about days later. You do that without even trying.\n\n" +
      "You've given me more than I know how to put into words — patience when I didn't deserve it, comfort on the hard days, and a kind of happiness that sneaks up on me in the middle of the most ordinary moments. I don't say it enough, so I'm saying it here: thank you, for all of it, and for being exactly who you are.\n\n" +
      "So here's my promise — for this year, and for every one after it: more silly arguments that end in laughing, more songs in the car, more nights that turn into mornings before we're ready, and me, choosing you, again and again.\n\n" +
      "Happy Birthday, my love. Here's to us.",
    signoff: "All my love, always,",
    signature: "Yours",
  },

  /* --- Chapter 5: Final Surprise ----------------------------------------- */
  final: {
    eyebrow: "One Last Thing",
    intro: "Everything slows down here.",
    prompt: "I have one last gift for you.",
    button: "Open it",
    // Photos for the closing slideshow. Swap these for your favorites.
    photos: [
      { imagePath: "assets/images/memory-1.jpeg", alt: "Memory one" },
      { imagePath: "assets/images/memory-2.jpeg", alt: "Memory two" },
      { imagePath: "assets/images/memory-3.jpeg", alt: "Memory three" },
      { imagePath: "assets/images/memory-4.jpeg", alt: "Memory four" },
      { imagePath: "assets/images/memory-5.jpeg", alt: "Memory five" },
    ],
    // The closing words. (Verbatim from the brief — change freely.)
    message:
      "Every picture tells a story, but my favorite story will always be the one we're writing together.\n\n" +
      "Happy Birthday, my love.\n\n" +
      "Thank you for being you.\n\n" +
      "I love you. ❤️",
  },

  /* --- Hidden surprises (easter eggs) ------------------------------------ */
  // Little secrets tucked around the site. All optional to change.
  easterEggs: {
    // How many hidden hearts are scattered across the chapters to find.
    hiddenHeartCount: 5,
    // Toast shown each time she finds one.
    heartFoundToast: "You found a hidden heart",
    // Shown when all hidden hearts are found.
    allFoundTitle: "You found them all",
    allFoundMessage:
      "A tiny secret, just for you: you have a way of finding the good in everything — " +
      "even hidden hearts. That's one of a hundred reasons I adore you.",
    // Secret when she types her own name anywhere.
    nameSecret: "You typed your name. Funny — I think about it all the time too. 💕",
    // Secret for the classic up-up-down-down… code.
    konamiSecret: "Unlocked: extra fireworks, just because you deserve more of everything.",
    // Whisper when she taps the wax seal a few times before opening it.
    sealWhisper: "Patience… the best things are worth opening slowly. 💌",
    closeLabel: "Close",
  },
};
