# 💗 A Magical 3D Birthday World for Mentalleyy

A visually stunning, highly interactive, cinematic 3D birthday surprise website built with **React**, **Three.js**, **React Three Fiber**, **Drei**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Highlights & Features (8 Cinematic Scenes)

1. **Scene 1 – Cinematic 3D Introduction**
   - Floating dream island in a cosmic purple/pink sky.
   - Interactive 3D Gift Box with ribbons, bow, and particle explosions.
   - Click-to-open sequence with camera zoom transition.

2. **Scene 2 – The Birthday World**
   - Panoramic 3D floating island with birthday cake and balloon clusters with real physics sway.
   - Metallic pearl 3D title: `HAPPY BIRTHDAY MENTALLEY !`.
   - Grand confetti explosion.

3. **Scene 3 – 3D Memory Gallery**
   - 6 floating Polaroid frames at different depths and rotations with mouse hover tilt.
   - Fixed aspect ratio containers with `object-fit: contain` keeping portrait and landscape photos fully visible without distortion.
   - Centered fullscreen Lightbox with `max-w-[90vw]`, `max-h-[85vh]`, keyboard arrows, and Escape/backdrop click to close.

4. **Scene 4 – The Magical Letter**
   - 3D floating envelope with glowing heart wax seal.
   - Click to break the wax seal, animate envelope opening, and slide out the heartfelt parchment letter.

5. **Scene 5 – Interactive 3D Birthday Cake**
   - 3 pastel tiers, cream piping beads, strawberries, and glowing candles with animated flames.
   - "BLOW THE CANDLES" button triggers flame extinguishment, soft smoke particles, camera zoom-out, and heart confetti.

6. **Scene 6 – Birthday Countdown**
   - 4 floating 3D glass cards showing Days, Hours, Minutes, and Seconds.
   - Configured for `Asia/Kolkata` timezone with automatic celebratory mode when the day arrives.

7. **Scene 7 – Secret Message Vault**
   - Mysterious 3D treasure chest with glowing rune gems.
   - Password prompt modal with hint toggle.
   - Opening releases golden light beams and unveils the secret best-friend message!

8. **Scene 8 – The Grand Finale**
   - Giant glowing 3D heart with pulsating heartbeat rhythm.
   - Orbiting stars, butterflies, and celebratory fireworks showers.
   - Replay button to experience the world again anytime.

---

## 🎵 Persistent Floating Music Player

The cute floating music player in the top-right corner stays active across all 8 scenes:
- Track display title: `"Birthday Special 🎵"`
- Dedicated **Play** and **Pause** buttons
- Volume slider with percentage indicator
- Mute/Unmute toggle and magic sparkle sound effect
- Animated music notes (`♪ ♫ ♬`) and 5-bar equalizer visualizer

---

## 🛠️ How to Customize

All content is managed through a single configuration file:
👉 **`src/config/birthdayConfig.ts`**

### 1. Replace the Photos
Add your photos to `public/images/`:
- `public/images/memory1.jpg` through `memory6.jpg`
- Update captions and titles in `src/config/birthdayConfig.ts`.

### 2. Add Your Background Music
Place your MP3 file into `public/music/birthday-song.mp3`.

---

## 🚀 How to Run Locally

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 How to Deploy to GitHub & Vercel (Free 1-Click Deployment)

```bash
git init
git add .
git commit -m "Complete website fix and personal media integration"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/mentalley-birthday.git
git push -u origin main
```
Import into Vercel and click **Deploy**!
