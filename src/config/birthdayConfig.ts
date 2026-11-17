export interface MemoryItem {
  id: number;
  image: string;
  title: string;
  date: string;
  caption: string;
  rotation: [number, number, number];
  position: [number, number, number];
}

export interface BirthdayConfig {
  friend: {
    name: string;
    nickname: string;
    title: string;
  };
  birthday: {
    // Target date in YYYY-MM-DDTHH:mm:ss format
    date: string;
    timezone: string; // e.g., 'Asia/Kolkata'
  };
  letter: {
    title: string;
    salutation: string;
    body: string[];
    closing: string;
    signature: string;
  };
  secretBox: {
    title: string;
    prompt: string;
    password: string; // Case-insensitive demo password
    secretMessage: {
      headline: string;
      subheadline: string;
      content: string[];
      highlight: string;
    };
  };
  cake: {
    heading: string;
    subheading: string;
    wishMessage: string;
    buttonText: string;
    successMessage: string;
  };
  music: {
    title: string;
    artist: string;
    filePath: string;
  };
  memories: MemoryItem[];
  finale: {
    heading: string;
    subheading: string;
    finalWish: string;
    quote: string;
  };
}

export const birthdayConfig: BirthdayConfig = {
  friend: {
    name: "Mentalleyy",
    nickname: "Mentalley",
    title: "Best Friend Forever",
  },

  birthday: {
    // Current date/time configured for Asia/Kolkata celebration
    // You can set this to her exact upcoming birthday date!
    date: "2026-11-18T00:00:00",
    timezone: "Asia/Kolkata",
  },

  letter: {
    title: "A LITTLE LETTER FOR YOU 💌",
    salutation: "Dear Mentalleyy,",
    body: [
      "Happy Birthday! ❤️",
      "Today is your special day, and I hope it brings you endless happiness, laughter and unforgettable memories.",
      "Thank you for being such a wonderful best friend.",
      "Keep smiling, keep shining and always be the amazing person you are.",
      "You deserve all the happiness in the world.",
      "Happy Birthday once again! 💗"
    ],
    closing: "With all my love & gratitude,",
    signature: "Your Best Friend 🌸"
  },

  secretBox: {
    title: "A HIDDEN TREASURE FOR YOU 💎",
    prompt: "Enter the secret magic password to unlock this mystery box...",
    password: "MENTALLEY", // You can change this to any password you like!
    secretMessage: {
      headline: "YOU UNLOCKED THE SECRET VAULT! ✨💖",
      subheadline: "A Promise From My Heart to Yours",
      content: [
        "In a world where everything changes so fast, having you as my best friend has been one of life's greatest blessings.",
        "You've been the one who listened when no one else understood, the one who turned ordinary mundane days into laughing marathons, and the truest soul I know.",
        "No matter where life takes us, how crazy the world gets, or how many years pass—I will always be in your corner, cheering for your dreams, protecting your smile, and celebrating you."
      ],
      highlight: "Forever my favorite human, my confidante, and my eternal best friend. Happy Birthday Mentalleyy! 🌸💫"
    }
  },

  cake: {
    heading: "MAKE A WISH, MENTALLEY ! ✨",
    subheading: "Close your eyes, think of your sweetest dream, and blow the candles...",
    wishMessage: "Every candle represents a wish waiting to take flight.",
    buttonText: "BLOW THE CANDLES 🕯️💨",
    successMessage: "YOUR WISHES ARE READY TO COME TRUE! 💗"
  },

  music: {
    title: "Birthday Special 🎵",
    artist: "Personal Song for Mentalleyy",
    filePath: "/music/birthday-song.mp3",
  },

  memories: [
    {
      id: 1,
      image: "/images/memory1.jpg",
      title: "The Unforgettable Laughs",
      date: "Golden Moments",
      caption: "Those late-night conversations where we laughed until our stomachs hurt and tears streamed down our faces.",
      rotation: [-0.05, 0.15, -0.06],
      position: [-2.6, 1.2, 0.2]
    },
    {
      id: 2,
      image: "/images/memory2.jpg",
      title: "Wild Adventures & Road Trips",
      date: "Sweet Explorations",
      caption: "Getting lost, singing at the top of our lungs, and discovering that the journey is ten times better with you.",
      rotation: [0.08, -0.12, 0.05],
      position: [0, 1.8, -0.4]
    },
    {
      id: 3,
      image: "/images/memory3.jpg",
      title: "Always In My Corner",
      date: "Pure Heart",
      caption: "Through thick and thin, stormy weather and sunny skies—thank you for having my back unconditionally.",
      rotation: [-0.06, -0.18, 0.04],
      position: [2.6, 1.1, 0.3]
    },
    {
      id: 4,
      image: "/images/memory4.jpg",
      title: "Loosu Friendship",
      date: "Partner in Crime",
      caption: "Nobody gets our jokes or our weird dances quite like we do. Proof that best friends share one brain cell!",
      rotation: [0.04, 0.16, -0.05],
      position: [-2.4, -1.2, -0.2]
    },
    {
      id: 5,
      image: "/images/memory5.jpg",
      title: "Quiet Comfort",
      date: "Soul Friend",
      caption: "Sitting in comfortable silence, knowing we understand each other without exchanging a single word.",
      rotation: [-0.08, 0.02, 0.07],
      position: [0, -1.6, 0.3]
    },
    {
      id: 6,
      image: "/images/memory6.jpg",
      title: "To A Thousand More Memories",
      date: "Forever & Always",
      caption: "May this upcoming year be overflowing with new adventures, radiant health, gigantic smiles, and boundless joy!",
      rotation: [0.05, -0.14, -0.04],
      position: [2.5, -1.3, -0.1]
    }
  ],

  finale: {
    heading: "THANK YOU FOR BEING YOU, MENTALLEY ! 💗",
    subheading: "YOU MAKE THE WORLD A LITTLE MORE BEAUTIFUL.",
    finalWish: "HAPPY BIRTHDAY, MENTALLEY ! 🎂✨",
    quote: "True friendship is a rare gem that shines brighter with every passing year."
  }
};
