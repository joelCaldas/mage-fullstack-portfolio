import React from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { NAV_ORDER, PROFILE, STATIONS } from '../data/portfolioData.js';

/**
 * Header HUD minimalista fixo no topo:
 * Esquerda: Nome, classe e barras RPG finas (HP rubi, MP ciano dinâmico, XP dourado).
 * Centro/Direita: Links das 5 estações + controle discreto de Som ON/OFF.
 */
export default function HeaderHUD({ activeStation, currentMp, soundEnabled, onSelectStation, onToggleSound }) {
  const { hp, xp } = PROFILE.stats;

  return (
    <>
      <header className="hud-header">
        {/* Esquerda: Identidade & Mini HUD HP/MP/XP */}
        <div className="hud-brand">
          <button
            type="button"
            className="hud-crest"
            data-magnetic="true"
            onClick={() => onSelectStation('inicio')}
            aria-label="Voltar ao Início"
            style={{ cursor: 'pointer' }}
          >
            <Sparkles size={18} color="#F2D28B" />
          </button>

          <div style={{ minWidth: 0 }}>
            <div
              className="font-display"
              style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}
            >
              {PROFILE.name.toUpperCase()}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: 10,
                color: 'var(--accent-gold)',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {PROFILE.title}
            </div>
          </div>

          <div className="hud-divider" />

          {/* Barras RPG finas e animadas */}
          <div className="hud-mini-stats" aria-label="Status RPG do personagem">
            <div className="hud-mini-bar">
              <div className="hud-mini-bar-head">
                <span style={{ color: 'var(--accent-ruby)', fontWeight: 600 }}>HP</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {hp.current}/{hp.max}
                </span>
              </div>
              <div className="hud-bar-track">
                <div className="hud-bar-fill ruby" style={{ width: `${(hp.current / hp.max) * 100}%` }} />
              </div>
            </div>

            <div className="hud-mini-bar">
              <div className="hud-mini-bar-head">
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>MP</span>
                <span style={{ color: 'var(--text-primary)' }}>{Math.round(currentMp)}/100</span>
              </div>
              <div className="hud-bar-track">
                <div className="hud-bar-fill cyan" style={{ width: `${currentMp}%` }} />
              </div>
            </div>

            <div className="hud-mini-bar">
              <div className="hud-mini-bar-head">
                <span style={{ color: 'var(--accent-gold-bright)', fontWeight: 600 }}>XP</span>
                <span style={{ color: 'var(--text-primary)' }}>Nv. {xp.level}</span>
              </div>
              <div className="hud-bar-track">
                <div className="hud-bar-fill gold" style={{ width: `${xp.percent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Centro/Direita: Navegação das Estações + Som ON/OFF */}
        <div className="hud-nav-group">
          <nav className="hud-nav" aria-label="Estações do Santuário">
            {NAV_ORDER.map((id) => {
              const st = STATIONS[id];
              const isAct = id === activeStation;
              return (
                <button
                  key={id}
                  type="button"
                  data-magnetic="true"
                  className={`hud-nav-btn ${isAct ? 'is-active' : ''}`}
                  onClick={() => onSelectStation(id)}
                >
                  {st.navLabel}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            data-magnetic="true"
            className="hud-sound-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Desativar som ambiente' : 'Ativar som ambiente'}
          >
            {soundEnabled ? <Volume2 size={14} color="#38D9F5" /> : <VolumeX size={14} color="#6E7C99" />}
            <span>{soundEnabled ? 'SOM ON' : 'SOM OFF'}</span>
          </button>
        </div>
      </header>

      {/* Navegação Mobile Inferior */}
      <nav className="mobile-nav-bar" aria-label="Navegação Mobile">
        {NAV_ORDER.map((id) => {
          const st = STATIONS[id];
          return (
            <button
              key={id}
              type="button"
              className={`mobile-nav-item ${id === activeStation ? 'is-active' : ''}`}
              onClick={() => onSelectStation(id)}
            >
              {st.navLabel}
            </button>
          );
        })}
      </nav>
    </>
  );
}
