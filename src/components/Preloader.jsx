import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { PROFILE } from '../data/portfolioData.js';

/**
 * Preloader cinematográfico minimalista com círculo rúnico fino (0% → 100%)
 * e botão "Entrar no Santuário" que também desbloqueia o áudio espacial Web Audio API.
 */
export default function Preloader({ entered, onEnter }) {
  const { progress, active } = useProgress();
  const [displayPct, setDisplayPct] = useState(0);
  const [ready, setReady] = useState(false);

  // Suaviza a contagem 0% → 100% mesmo quando o Draco GLB carrega quase instantaneamente
  useEffect(() => {
    const target = active ? Math.max(progress, 12) : 100;
    const timer = setInterval(() => {
      setDisplayPct((prev) => {
        if (prev >= target) {
          if (target >= 100) setReady(true);
          return prev;
        }
        const step = Math.max(1, Math.ceil((target - prev) * 0.18));
        const next = Math.min(100, prev + step);
        if (next >= 100) setReady(true);
        return next;
      });
    }, 28);
    return () => clearInterval(timer);
  }, [progress, active]);

  // Garante liberação em no máximo 2.4s mesmo se algum recurso ficar em cache sem evento
  useEffect(() => {
    const fallback = setTimeout(() => {
      setDisplayPct(100);
      setReady(true);
    }, 2400);
    return () => clearTimeout(fallback);
  }, []);

  const radius = 94;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - displayPct / 100);

  return (
    <div className={`preloader ${entered ? 'is-exiting' : ''}`} aria-hidden={entered}>
      <div className="preloader-inner">
        <div className="preloader-ring-wrap">
          <svg className="preloader-ring-svg" viewBox="0 0 210 210" fill="none">
            <circle cx="105" cy="105" r="100" stroke="#D8B268" strokeOpacity="0.18" strokeWidth="1" />
            <circle
              cx="105"
              cy="105"
              r="86"
              stroke="#38D9F5"
              strokeOpacity="0.22"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
            <circle
              cx="105"
              cy="105"
              r={radius}
              stroke="#F2D28B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.18s ease-out' }}
            />
            <path d="M105 14L109 21L105 28L101 21L105 14Z" fill="#F2D28B" />
            <path d="M105 182L109 189L105 196L101 189L105 182Z" fill="#38D9F5" />
          </svg>
          <div className="preloader-ring-center">
            <span className="font-display" style={{ fontSize: 34, color: 'var(--accent-gold-bright)', letterSpacing: '0.06em' }}>
              {Math.round(displayPct)}%
            </span>
            <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--accent-cyan)' }}>
              {ready ? 'SANTUÁRIO PRONTO' : 'CONJURANDO 3D'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="eyebrow">PORTFÓLIO INTERATIVO WEBGL 3D</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(24px, 4vw, 38px)', letterSpacing: '0.08em' }}>
            {PROFILE.name.toUpperCase()}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {PROFILE.archetype}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: ready ? 1 : 0.35,
            transition: 'opacity 0.4s ease',
          }}
        >
          <button
            className="btn-arcane-primary"
            data-magnetic="true"
            disabled={!ready}
            onClick={() => onEnter(true)}
          >
            <Volume2 size={15} />
            Entrar no Santuário
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            data-magnetic="true"
            disabled={!ready}
            onClick={() => onEnter(false)}
            className="font-mono"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 11,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: ready ? 'pointer' : 'default',
            }}
          >
            <VolumeX size={13} />
            Entrar em modo silencioso
          </button>
        </div>
      </div>
    </div>
  );
}
