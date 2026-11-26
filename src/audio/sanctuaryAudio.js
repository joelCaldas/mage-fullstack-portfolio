import { assetUrl } from '../utils/assetUrl.js';

/**
 * Motor de Áudio do Santuário:
 * - Trilha principal cinematográfica de fundo (public/audio/sanctuary-theme.mp3) em loop suave
 *   com fade-in / fade-out orgânico ao clicar em "Entrar no Santuário" ou "SOM ON/OFF".
 * - Micro-SFX arcanos sutis via Web Audio API ao navegar entre estações e virar páginas.
 */

class SanctuaryAudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxGain = null;
    this.bgmAudio = null;
    this.fadeInterval = null;
    this.targetVolume = 0.42;
    this.enabled = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // 1. Trilha musical de fundo (HTML5 Audio com loop nativo estável em desktop & mobile)
    const audio = new Audio(assetUrl('audio/sanctuary-theme.mp3'));
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    this.bgmAudio = audio;

    // 2. Contexto Web Audio leve apenas para os micro-SFX interativos
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.45;
      this.sfxGain.connect(this.ctx.destination);
    }

    this.initialized = true;
  }

  fadeBgmTo(targetVol, durationMs = 700, pauseOnZero = false) {
    if (!this.bgmAudio) return;
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const startVol = this.bgmAudio.volume;
    const steps = 24;
    const stepMs = Math.max(15, durationMs / steps);
    let step = 0;

    this.fadeInterval = setInterval(() => {
      step += 1;
      const t = Math.min(1, step / steps);
      const nextVol = startVol + (targetVol - startVol) * t;
      this.bgmAudio.volume = Math.max(0, Math.min(1, nextVol));

      if (t >= 1) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (pauseOnZero && targetVol <= 0.001) {
          this.bgmAudio.pause();
        }
      }
    }, stepMs);
  }

  async setEnabled(on) {
    this.enabled = Boolean(on);
    if (this.enabled && !this.initialized) {
      this.init();
    }

    if (this.ctx && this.ctx.state === 'suspended' && this.enabled) {
      try {
        await this.ctx.resume();
      } catch {
        // Ignora bloqueio antes de gesto do usuário
      }
    }

    if (this.bgmAudio) {
      if (this.enabled) {
        try {
          await this.bgmAudio.play();
          this.fadeBgmTo(this.targetVolume, 850, false);
        } catch {
          // Navegador pode exigir novo clique caso bloqueie autoplay
        }
      } else {
        this.fadeBgmTo(0, 450, true);
      }
    }
  }

  playNavigate() {
    if (!this.enabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(293.66, now);
    osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.32);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.55);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.58);
  }

  playPageTurn() {
    if (!this.enabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playHover() {
    if (!this.enabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.08);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }
}

export const sanctuaryAudio = new SanctuaryAudioEngine();
