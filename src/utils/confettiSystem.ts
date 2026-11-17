import confetti from 'canvas-confetti';

const PASTEL_COLORS = [
  '#f472b6', // Pink
  '#c084fc', // Purple
  '#93c5fd', // Sky blue
  '#fbcfe8', // Soft pink
  '#fde047', // Soft gold
  '#fed7aa', // Peach
  '#e9d5ff', // Lavender
  '#ffffff', // Pearl white
];

/**
 * Fires a magical celebratory confetti shower with heart shapes and pastel stars
 */
export function fireBirthdayConfetti(origin = { x: 0.5, y: 0.6 }) {
  // Center blast
  confetti({
    particleCount: 80,
    spread: 100,
    origin,
    colors: PASTEL_COLORS,
    shapes: ['circle', 'square'],
    scalar: 1.2,
    ticks: 250,
  });

  // Delayed side bursts
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0.1, y: 0.7 },
      colors: PASTEL_COLORS,
      scalar: 1.1,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 0.9, y: 0.7 },
      colors: PASTEL_COLORS,
      scalar: 1.1,
    });
  }, 180);
}

/**
 * Giant Grand Finale fireworks and star showers
 */
export function fireGrandFinaleShower() {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 120, zIndex: 1000 };

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 45 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.15, 0.35), y: Math.random() - 0.2 },
      colors: PASTEL_COLORS,
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.65, 0.85), y: Math.random() - 0.2 },
      colors: PASTEL_COLORS,
    });
  }, 300);
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
