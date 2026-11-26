import React, { useState } from 'react';
import { PROFILE, STATIONS, GRIMOIRES, MISSIONS, QUALIFICATIONS, SCROLLS } from './data/portfolioData.js';

/**
 * Fundação da Parte 2 — será expandida na Parte 3 com a Cena 3D WebGL completa
 * (React Three Fiber, GLSL Shaders, Bloom, Coreografia GSAP e NLA Animations do Blender).
 */
export default function App() {
  const [activeStation, setActiveStation] = useState('inicio');
  const current = STATIONS[activeStation];

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'radial-gradient(circle at 50% 35%, #10172b 0%, #070912 72%)',
        padding: 32,
      }}
    >
      <section className="glass-panel" style={{ maxWidth: 680, width: '100%', padding: 32 }}>
        <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--accent-gold)', marginBottom: 8 }}>
          PARTE 2 · FUNDAÇÃO WEBGL PRONTA // {current.code} · CLIP BLENDER: {current.blenderClip}
        </p>
        <h1 className="font-display" style={{ fontSize: 30, letterSpacing: '0.06em', marginBottom: 8 }}>
          {PROFILE.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          {PROFILE.title} — {GRIMOIRES.length} Grimórios, {MISSIONS.length} Missões, {QUALIFICATIONS.length} Qualificações e {SCROLLS.length} Pergaminhos verificados carregados em{' '}
          <code className="font-mono" style={{ color: 'var(--accent-cyan)' }}>src/data/portfolioData.js</code>.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.values(STATIONS).map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStation(st.id)}
              className="font-mono"
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                fontSize: 12,
                cursor: 'pointer',
                background: st.id === activeStation ? 'rgba(216,178,104,0.18)' : 'rgba(22,30,54,0.6)',
                color: st.id === activeStation ? 'var(--accent-gold-bright)' : 'var(--text-secondary)',
                border: `1px solid ${st.id === activeStation ? 'var(--border-gold-active)' : 'var(--border-glass-subtle)'}`,
              }}
            >
              {st.navLabel} ({st.blenderClip})
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
