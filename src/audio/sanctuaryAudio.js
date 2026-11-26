/**
 * Motor de Áudio Espacial Procedural (Web Audio API) — Zero dependências externas.
 * Gera atmosfera mística contínua (drone harmônico obsidiana/arcano) e micro-SFX
 * sutis ao navegar entre estações ou virar páginas no carrossel.
 */

class SanctuaryAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.oscillators = [];
    this.enabled = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0;
    this.masterGain.connect(this.ctx.destination);

    // Low-pass filter for warm mystical library acoustics
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 540;
    filter.Q.value = 1.2;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0.14;
    this.ambientGain.connect(filter);
    filter.connect(this.masterGain);

    // Subtle fifth + octave arcane chord (D2, A2, F#3, A3) with ultra-slow LFO shimmer
    const freqs = [73.42, 110.0, 146.83, 220.0];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      gain.gain.value = idx < 2 ? 0.32 : 0.12;

      // Subtle breathing LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.08 + idx * 0.03;
      lfoGain.gain.value = gain.gain.value * 0.25;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();
      lfo.start();
      this.oscillators.push(osc, lfo);
    });

    this.initialized = true;
  }

  async setEnabled(on) {
    this.enabled = Boolean(on);
    if (this.enabled && !this.initialized) {
      this.init();
    }
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended' && this.enabled) {
      await this.ctx.resume();
    }
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(this.enabled ? 0.55 : 0.0, now, 0.35);
  }

  playNavigate() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(293.66, now); // D4
    osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.36); // D5
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.62);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.65);
  }

  playPageTurn() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.14);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.065, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.22);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  playHover() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.025, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.09);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const sanctuaryAudio = new SanctuaryAudioEngine();
