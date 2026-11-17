import { birthdayConfig } from '../config/birthdayConfig';

type AudioStateListener = (isPlaying: boolean) => void;

class CelestialMusicEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private isSynthesizing: boolean = false;
  private isPlayingState: boolean = false;
  private volume: number = 0.65;
  private listeners: Set<AudioStateListener> = new Set();
  private melodyTimer: ReturnType<typeof setInterval> | null = null;
  private melodyIndex: number = 0;

  // Dreamy celestial "Happy Birthday" melody in C Major with music-box frequencies (Hz) & durations (seconds)
  private melody = [
    { freq: 523.25, dur: 0.35, chord: [261.63, 329.63] }, // C5 (Happy)
    { freq: 523.25, dur: 0.25, chord: [] },               // C5 (birth-)
    { freq: 587.33, dur: 0.6, chord: [293.66, 349.23] }, // D5 (-day)
    { freq: 523.25, dur: 0.6, chord: [] },               // C5 (to)
    { freq: 698.46, dur: 0.6, chord: [349.23, 440.0] },  // F5 (you)
    { freq: 659.25, dur: 1.0, chord: [329.63, 392.0] },  // E5

    { freq: 523.25, dur: 0.35, chord: [261.63] },        // C5 (Happy)
    { freq: 523.25, dur: 0.25, chord: [] },               // C5 (birth-)
    { freq: 587.33, dur: 0.6, chord: [293.66, 392.0] },  // D5 (-day)
    { freq: 523.25, dur: 0.6, chord: [] },               // C5 (to)
    { freq: 783.99, dur: 0.6, chord: [392.0, 493.88] },  // G5 (you)
    { freq: 698.46, dur: 1.0, chord: [349.23, 440.0] },  // F5

    { freq: 523.25, dur: 0.35, chord: [261.63, 329.63] }, // C5 (Happy)
    { freq: 523.25, dur: 0.25, chord: [] },               // C5 (birth-)
    { freq: 1046.5, dur: 0.7, chord: [523.25, 659.25] }, // C6 (-day)
    { freq: 880.00, dur: 0.7, chord: [440.0, 523.25] },  // A5 (dear)
    { freq: 698.46, dur: 0.6, chord: [349.23, 440.0] },  // F5 (Men-)
    { freq: 659.25, dur: 0.6, chord: [329.63, 392.0] },  // E5 (-tal-)
    { freq: 587.33, dur: 0.9, chord: [293.66, 349.23] }, // D5 (-leyy)

    { freq: 932.33, dur: 0.4, chord: [466.16, 587.33] }, // Bb5 (Happy)
    { freq: 932.33, dur: 0.3, chord: [] },               // Bb5 (birth-)
    { freq: 880.00, dur: 0.7, chord: [440.0, 523.25] },  // A5 (-day)
    { freq: 698.46, dur: 0.6, chord: [349.23, 440.0] },  // F5 (to)
    { freq: 783.99, dur: 0.7, chord: [392.0, 493.88] },  // G5 (you)
    { freq: 698.46, dur: 1.5, chord: [261.63, 349.23, 523.25] }, // F5
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  private initAudioElement() {
    if (this.audioElement) return;

    try {
      this.audioElement = new Audio();
      this.audioElement.src = birthdayConfig.music.filePath;
      this.audioElement.loop = true;
      this.audioElement.volume = this.volume;
      this.audioElement.preload = 'auto';

      this.audioElement.addEventListener('playing', () => {
        this.isPlayingState = true;
        this.stopSynthesizedMusic();
        this.notify();
      });

      this.audioElement.addEventListener('pause', () => {
        this.isPlayingState = false;
        this.notify();
      });

      this.audioElement.addEventListener('ended', () => {
        this.audioElement?.play().catch(() => {});
      });

      this.audioElement.addEventListener('error', (err) => {
        console.warn('Local MP3 playback error, engaging celestial music synth fallback:', err);
        if (this.isPlayingState) {
          this.startSynthesizedMusic();
        }
      });
    } catch (e) {
      console.warn('Failed to initialize Audio Element:', e);
    }
  }

  public subscribe(listener: AudioStateListener) {
    this.listeners.add(listener);
    listener(this.isPlayingState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isPlayingState));
  }

  /**
   * Starts background playback with a gentle volume fade-in
   */
  public async fadeIn(targetVolume: number = 0.65, durationMs: number = 2000): Promise<boolean> {
    if (this.isPlayingState) return true; // Already playing

    this.initAudioContext();
    this.initAudioElement();

    if (this.audioElement) {
      try {
        this.audioElement.volume = 0.02;
        await this.audioElement.play();
        this.isPlayingState = true;
        this.stopSynthesizedMusic();
        this.notify();

        // Connect media source once
        if (this.audioCtx && !this.mediaSource && this.analyser) {
          try {
            this.mediaSource = this.audioCtx.createMediaElementSource(this.audioElement);
            this.mediaSource.connect(this.analyser);
          } catch {
            // Already connected
          }
        }

        // Smooth volume step ramp
        const steps = 20;
        const interval = durationMs / steps;
        const volStep = (targetVolume - 0.02) / steps;
        let cur = 0.02;
        const timer = setInterval(() => {
          cur += volStep;
          if (cur >= targetVolume) {
            cur = targetVolume;
            clearInterval(timer);
          }
          if (this.audioElement && this.isPlayingState) {
            this.audioElement.volume = cur;
          }
        }, interval);

        return true;
      } catch (err) {
        // Autoplay restricted by browser
        return false;
      }
    }
    return false;
  }

  public async play(): Promise<boolean> {
    if (this.isPlayingState) return true;
    this.initAudioContext();
    this.initAudioElement();

    if (this.audioElement) {
      try {
        await this.audioElement.play();
        this.isPlayingState = true;
        this.stopSynthesizedMusic();
        this.notify();

        if (this.audioCtx && !this.mediaSource && this.analyser) {
          try {
            this.mediaSource = this.audioCtx.createMediaElementSource(this.audioElement);
            this.mediaSource.connect(this.analyser);
          } catch {
            // Already connected
          }
        }
        return true;
      } catch (e) {
        console.warn('Direct MP3 playback restricted or failed, falling back to synth:', e);
      }
    }

    // Default to celestial synthesized music box if MP3 failed
    this.isPlayingState = true;
    this.notify();
    this.startSynthesizedMusic();
    return true;
  }

  public pause(): void {
    this.isPlayingState = false;
    this.stopSynthesizedMusic();
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.notify();
  }

  public toggle(): void {
    if (this.isPlayingState) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isPlaying(): boolean {
    return this.isPlayingState;
  }

  private startSynthesizedMusic() {
    if (this.isSynthesizing) return;
    this.isSynthesizing = true;
    this.melodyIndex = 0;
    this.playNextSynthNote();
  }

  private stopSynthesizedMusic() {
    this.isSynthesizing = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
  }

  private playNextSynthNote() {
    if (!this.isSynthesizing || !this.isPlayingState) return;
    this.initAudioContext();
    if (!this.audioCtx || !this.gainNode) return;

    const note = this.melody[this.melodyIndex];
    const now = this.audioCtx.currentTime;

    // Main music box note (sine + harmonic bell chime)
    const osc = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now);

    // Harmonic bell shimmer
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + note.dur * 1.8);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + note.dur * 1.9);

    // Soft bass/chord accompaniment
    if (note.chord && note.chord.length > 0) {
      note.chord.forEach((chordFreq) => {
        if (!this.audioCtx || !this.gainNode) return;
        const chordOsc = this.audioCtx.createOscillator();
        const chordGain = this.audioCtx.createGain();

        chordOsc.type = 'triangle';
        chordOsc.frequency.setValueAtTime(chordFreq, now);

        chordGain.gain.setValueAtTime(0.001, now);
        chordGain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, now + note.dur * 2.2);

        chordOsc.connect(chordGain);
        chordGain.connect(this.gainNode);

        chordOsc.start(now);
        chordOsc.stop(now + note.dur * 2.3);
      });
    }

    this.melodyIndex = (this.melodyIndex + 1) % this.melody.length;
    const nextInterval = note.dur * 1000;
    this.melodyTimer = setTimeout(() => {
      this.playNextSynthNote();
    }, nextInterval);
  }
}

export const celestialMusic = new CelestialMusicEngine();
