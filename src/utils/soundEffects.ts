/**
 * Web Audio API Sound Synthesizer for Cyber-Lab UI Audio Feedback
 * Clean, subtle, zero external dependencies, with mute toggle and local persistence.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundMuted: boolean = false;
  private volume: number = 0.08; // subtle volume by default

  constructor() {
    // Load mute state from localStorage
    const savedMute = localStorage.getItem('cyber_lab_audio_muted');
    this.soundMuted = savedMute !== null ? JSON.parse(savedMute) : false;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.soundMuted;
  }

  public setMuted(muted: boolean): boolean {
    this.soundMuted = muted;
    localStorage.setItem('cyber_lab_audio_muted', JSON.stringify(muted));
    if (!muted) {
      this.playToggle(true);
    }
    return this.soundMuted;
  }

  public toggleMute(): boolean {
    return this.setMuted(!this.soundMuted);
  }

  /**
   * Subtle Cyber Click sound for standard button presses
   */
  public playClick() {
    if (this.soundMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(this.volume * 0.8, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  /**
   * Modal Open / Cyber Dialog Sweep
   */
  public playModalOpen() {
    if (this.soundMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(960, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.9, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  /**
   * Cyber Blip for Tab Switch or Section Jump
   */
  public playCyberBlip() {
    if (this.soundMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  /**
   * Success / Threat Mitigation Chime
   */
  public playSuccess() {
    if (this.soundMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(this.volume * 0.7, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.12);
      });
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  /**
   * Toggle Sound Effect
   */
  public playToggle(forcePlay = false) {
    if (this.soundMuted && !forcePlay) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.7, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }
}

export const soundFx = new SoundEngine();
