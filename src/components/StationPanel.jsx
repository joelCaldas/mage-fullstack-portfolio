import React, { useRef } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  GraduationCap,
  Mail,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  GRIMOIRES,
  MISSIONS,
  PROFILE,
  QUALIFICATIONS,
  SCROLLS,
  STATIONS,
  TOTAL_CERTIFIED_HOURS,
} from '../data/portfolioData.js';

function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * Painel editorial flutuante translúcido (Glassmorphism escuro + filete dourado).
 * - Na estação Início: exibe a Ficha do Arquimago + barras RPG (HP, MP, XP com 4 marcos acadêmicos).
 * - Nas 4 estações (Grimório, Missões, Qualificações, Pergaminhos): carrossel fluido com
 *   setas, teclado (← → ESC), scroll horizontal/Shift+scroll e swipe tátil no mobile.
 */
export default function StationPanel({
  activeStation,
  visible,
  currentMp,
  carouselIndex,
  onPrev,
  onNext,
  onSelectIndex,
  onNavigateStation,
}) {
  const touchStartX = useRef(null);
  const wheelLock = useRef(0);

  const station = STATIONS[activeStation] || STATIONS.inicio;
  const sideClass = station.panelSide === 'left' ? 'side-left' : 'side-right';

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || activeStation === 'inicio') return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 46) {
      if (dx < 0) onNext();
      else onPrev();
    }
  };

  const handleWheel = (e) => {
    if (activeStation === 'inicio') return;
    const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (Math.abs(horizontalDelta) > 26) {
      const now = Date.now();
      if (now - wheelLock.current > 360) {
        wheelLock.current = now;
        if (horizontalDelta > 0) onNext();
        else onPrev();
      }
    }
  };

  return (
    <aside
      className={`station-panel-shell ${sideClass}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className={`glass-panel station-card ${visible ? 'is-visible' : ''}`}>
        {activeStation === 'inicio' && (
          <InicioSheet currentMp={currentMp} onNavigateStation={onNavigateStation} />
        )}
        {activeStation === 'grimorio' && (
          <GrimoireView
            index={carouselIndex}
            onPrev={onPrev}
            onNext={onNext}
            onSelectIndex={onSelectIndex}
            onBackHome={() => onNavigateStation('inicio')}
          />
        )}
        {activeStation === 'missoes' && (
          <MissionsView
            index={carouselIndex}
            onPrev={onPrev}
            onNext={onNext}
            onSelectIndex={onSelectIndex}
            onBackHome={() => onNavigateStation('inicio')}
          />
        )}
        {activeStation === 'qualificacoes' && (
          <QualificationsView
            index={carouselIndex}
            onPrev={onPrev}
            onNext={onNext}
            onSelectIndex={onSelectIndex}
            onBackHome={() => onNavigateStation('inicio')}
          />
        )}
        {activeStation === 'pergaminhos' && (
          <ScrollsView
            index={carouselIndex}
            onPrev={onPrev}
            onNext={onNext}
            onSelectIndex={onSelectIndex}
            onBackHome={() => onNavigateStation('inicio')}
          />
        )}
      </div>
    </aside>
  );
}

/* ============================================================================
   ESTAÇÃO 00 — INÍCIO / FICHA DO ARQUIMAGO
   ============================================================================ */
function InicioSheet({ currentMp, onNavigateStation }) {
  const { hp, xp } = PROFILE.stats;

  return (
    <>
      <div className="status-pill">
        <span className="status-dot" />
        <span>NV. {PROFILE.level} · DISPONÍVEL PARA MISSÕES</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h1 className="font-display" style={{ fontSize: 'clamp(24px, 2.5vw, 34px)', lineHeight: 1.12, letterSpacing: '0.06em' }}>
          {PROFILE.name.toUpperCase()}
        </h1>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent-gold)' }}>{PROFILE.title}</p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: 4 }}>{PROFILE.bio}</p>
      </div>

      <div style={{ height: 1, background: 'rgba(216, 178, 104, 0.20)' }} />

      {/* Barras RPG ao lado do personagem 3D */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <div className="rpg-bar-row">
          <div className="rpg-bar-labels">
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>HP · DISPONIBILIDADE</span>
            <span style={{ color: 'var(--accent-ruby)' }}>
              {hp.current}/{hp.max} · {hp.detail}
            </span>
          </div>
          <div className="rpg-bar-track-lg">
            <div className="hud-bar-fill ruby" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="rpg-bar-row">
          <div className="rpg-bar-labels">
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>MP · MANA DE IA & CÓDIGO</span>
            <span style={{ color: 'var(--accent-cyan)' }}>{Math.round(currentMp)}/100 · IA & Sistemas</span>
          </div>
          <div className="rpg-bar-track-lg">
            <div className="hud-bar-fill cyan" style={{ width: `${currentMp}%` }} />
          </div>
        </div>

        <div className="rpg-bar-row">
          <div className="rpg-bar-labels">
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>XP · CURSOS & FORMAÇÃO</span>
            <span style={{ color: 'var(--accent-gold-bright)' }}>{xp.detail}</span>
          </div>
          <div className="rpg-bar-track-lg">
            <div className="hud-bar-fill gold" style={{ width: `${xp.percent}%` }} />
          </div>
        </div>

        <div className="milestones-grid">
          {xp.milestones.map((m) => (
            <div key={m.id} className={`milestone-chip ${m.status}`}>
              {m.status === 'done' ? '✓ ' : m.status === 'active' ? '◉ ' : '○ '}
              {m.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 4 }}>
        <button
          type="button"
          className="btn-arcane-primary"
          data-magnetic="true"
          onClick={() => onNavigateStation('grimorio')}
        >
          <BookOpen size={14} />
          Abrir Grimório
          <ArrowRight size={14} />
        </button>
        <button
          type="button"
          className="btn-arcane-ghost"
          data-magnetic="true"
          onClick={() => onNavigateStation('missoes')}
        >
          <Compass size={14} />
          Ver Missões
        </button>
        <a
          href={`mailto:${PROFILE.email}`}
          className="btn-arcane-ghost"
          data-magnetic="true"
          title={PROFILE.email}
        >
          <Mail size={14} />
          Contato
        </a>
      </div>
    </>
  );
}

/* ============================================================================
   ESTAÇÃO 01 — GRIMÓRIO (01 / 05)
   ============================================================================ */
function GrimoireView({ index, onPrev, onNext, onSelectIndex, onBackHome }) {
  const safeIdx = ((index % GRIMOIRES.length) + GRIMOIRES.length) % GRIMOIRES.length;
  const item = GRIMOIRES[safeIdx];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <span className="eyebrow">ESTAÇÃO 01 // ESTANTE DE GRIMÓRIOS</span>
        <span className="status-pill">
          <Sparkles size={11} /> GRIMÓRIO {item.roman}
        </span>
      </div>

      <div key={item.id} className="carousel-slide" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <p className="font-mono" style={{ fontSize: 10, color: item.accent, letterSpacing: '0.1em', marginBottom: 4 }}>
            {item.school.toUpperCase()}
          </p>
          <h2 className="font-display" style={{ fontSize: 22, letterSpacing: '0.05em', lineHeight: 1.2 }}>
            {item.title.toUpperCase()}
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: 8 }}>{item.summary}</p>
        </div>

        <div className="tech-tag-cloud">
          {item.skills.map((sk) => (
            <span key={sk} className="tech-tag">
              <span className="tech-tag-dot" style={{ background: item.accent }} />
              {sk}
            </span>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(216, 178, 104, 0.16)' }} />

      <div className="carousel-index-list">
        {GRIMOIRES.map((g, i) => (
          <button
            key={g.id}
            type="button"
            data-magnetic="true"
            className={`carousel-index-item ${i === safeIdx ? 'is-active' : ''}`}
            onClick={() => onSelectIndex(i)}
          >
            <span className="font-mono" style={{ fontSize: 11, color: i === safeIdx ? 'var(--accent-gold-bright)' : 'var(--text-muted)' }}>
              {pad2(i + 1)}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: i === safeIdx ? 600 : 400, flex: 1 }}>
              Grimório {g.roman} — {g.title}
            </span>
          </button>
        ))}
      </div>

      <CarouselFooter current={safeIdx + 1} total={GRIMOIRES.length} onPrev={onPrev} onNext={onNext} onBackHome={onBackHome} />
    </>
  );
}

/* ============================================================================
   ESTAÇÃO 02 — MISSÕES (01 / 04)
   ============================================================================ */
function MissionsView({ index, onPrev, onNext, onSelectIndex, onBackHome }) {
  const safeIdx = ((index % MISSIONS.length) + MISSIONS.length) % MISSIONS.length;
  const m = MISSIONS[safeIdx];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <span className="eyebrow">ESTAÇÃO 02 // MESA DE MISSÕES</span>
        <span className="status-pill" style={{ borderColor: m.rankColor, color: m.rankColor }}>
          <Award size={11} /> {m.rank}
        </span>
      </div>

      <div key={m.id} className="carousel-slide" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div>
          <h2 className="font-display" style={{ fontSize: 20, letterSpacing: '0.04em', lineHeight: 1.24 }}>
            {m.title}
          </h2>
          <p className="font-mono" style={{ fontSize: 11, color: 'var(--accent-cyan)', marginTop: 4 }}>
            {m.role} · {m.location}
          </p>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {m.highlights.map((hl, idx) => (
            <li key={idx} style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
              <span style={{ color: 'var(--accent-gold)', flexShrink: 0 }}>✦</span>
              <span>{hl}</span>
            </li>
          ))}
        </ul>

        <div className="tech-tag-cloud">
          {m.tags.map((tag) => (
            <span key={tag} className="tech-tag">
              <span className="tech-tag-dot" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="carousel-index-list">
        {MISSIONS.map((quest, i) => (
          <button
            key={quest.id}
            type="button"
            data-magnetic="true"
            className={`carousel-index-item ${i === safeIdx ? 'is-active' : ''}`}
            onClick={() => onSelectIndex(i)}
          >
            <span className="font-mono" style={{ fontSize: 11, color: i === safeIdx ? 'var(--accent-gold-bright)' : 'var(--text-muted)' }}>
              {pad2(i + 1)}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: i === safeIdx ? 600 : 400, flex: 1 }}>
              {quest.title}
            </span>
            <span className="font-mono" style={{ fontSize: 10, color: quest.rankColor }}>
              {quest.rank.replace('Missão ', '')}
            </span>
          </button>
        ))}
      </div>

      <CarouselFooter current={safeIdx + 1} total={MISSIONS.length} onPrev={onPrev} onNext={onNext} onBackHome={onBackHome} />
    </>
  );
}

/* ============================================================================
   ESTAÇÃO 03 — QUALIFICAÇÕES / ALTAR DA ACADEMIA (01 / 04)
   ============================================================================ */
function QualificationsView({ index, onPrev, onNext, onSelectIndex, onBackHome }) {
  const safeIdx = ((index % QUALIFICATIONS.length) + QUALIFICATIONS.length) % QUALIFICATIONS.length;
  const q = QUALIFICATIONS[safeIdx];

  const toneColor = {
    gold: 'var(--accent-gold-bright)',
    cyan: 'var(--accent-cyan)',
    violet: 'var(--accent-violet)',
    muted: 'var(--text-muted)',
  }[q.statusTone];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <span className="eyebrow">ESTAÇÃO 03 // ALTAR DA ACADEMIA</span>
        <span className="status-pill" style={{ color: toneColor, borderColor: toneColor }}>
          <GraduationCap size={12} /> {q.status}
        </span>
      </div>

      <div key={q.id} className="carousel-slide" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <p className="font-mono" style={{ fontSize: 11, color: toneColor, letterSpacing: '0.1em' }}>
            {q.tier.toUpperCase()}
          </p>
          <h2 className="font-display" style={{ fontSize: 21, letterSpacing: '0.04em', lineHeight: 1.24, marginTop: 4 }}>
            {q.degree}
          </h2>
          <p className="font-mono" style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            {q.institution} · {q.period}
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: 8 }}>{q.description}</p>
        </div>

        <div className="rpg-bar-row">
          <div className="rpg-bar-labels">
            <span style={{ color: 'var(--text-muted)' }}>PROGRESSO DO GRAU</span>
            <span style={{ color: toneColor }}>{q.progress}%</span>
          </div>
          <div className="rpg-bar-track-lg">
            <div className="hud-bar-fill gold" style={{ width: `${q.progress}%`, background: toneColor }} />
          </div>
        </div>
      </div>

      <div className="carousel-index-list">
        {QUALIFICATIONS.map((deg, i) => (
          <button
            key={deg.id}
            type="button"
            data-magnetic="true"
            className={`carousel-index-item ${i === safeIdx ? 'is-active' : ''}`}
            onClick={() => onSelectIndex(i)}
          >
            <span className="font-mono" style={{ fontSize: 11, color: i === safeIdx ? 'var(--accent-gold-bright)' : 'var(--text-muted)' }}>
              {pad2(i + 1)}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: i === safeIdx ? 600 : 400 }}>{deg.degree}</div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {deg.institution}
              </div>
            </div>
            <span className="font-mono" style={{ fontSize: 10, color: i === safeIdx ? 'var(--accent-gold-bright)' : 'var(--text-muted)' }}>
              {deg.status}
            </span>
          </button>
        ))}
      </div>

      <CarouselFooter current={safeIdx + 1} total={QUALIFICATIONS.length} onPrev={onPrev} onNext={onNext} onBackHome={onBackHome} />
    </>
  );
}

/* ============================================================================
   ESTAÇÃO 04 — PERGAMINHOS / CERTIFICADOS FACI WYDEN (01 / 03)
   ============================================================================ */
function ScrollsView({ index, onPrev, onNext, onSelectIndex, onBackHome }) {
  const safeIdx = ((index % SCROLLS.length) + SCROLLS.length) % SCROLLS.length;
  const sc = SCROLLS[safeIdx];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <span className="eyebrow">ESTAÇÃO 04 // ESTANTE DE PERGAMINHOS</span>
        <span className="status-pill" style={{ color: 'var(--accent-emerald)', borderColor: 'rgba(52,211,153,0.45)' }}>
          <ShieldCheck size={12} /> {TOTAL_CERTIFIED_HOURS}H VERIFICADAS
        </span>
      </div>

      <div key={sc.id} className="carousel-slide" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <p className="font-mono" style={{ fontSize: 11, color: 'var(--accent-gold-bright)' }}>
            {sc.institution.toUpperCase()} · {sc.date} · {sc.hours} HORAS
          </p>
          <h2 className="font-display" style={{ fontSize: 20, letterSpacing: '0.04em', lineHeight: 1.24, marginTop: 4 }}>
            {sc.title}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sc.disciplines.map((d) => (
            <div
              key={d.code}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                padding: '8px 11px',
                borderRadius: 9,
                background: 'rgba(17, 23, 43, 0.72)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{d.name}</div>
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  {d.code} · Período {d.period}
                </div>
              </div>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--accent-cyan)', flexShrink: 0 }}>
                {d.hours}h
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(7, 9, 18, 0.82)',
            border: '1px solid var(--border-cyan-hairline)',
          }}
        >
          <span className="font-mono" style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>
            ✓ SELO: {sc.validationCode}
          </span>
          <a
            href={sc.validationUrl}
            target="_blank"
            rel="noreferrer"
            data-magnetic="true"
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--accent-gold-bright)',
              textDecoration: 'none',
            }}
          >
            Validar na FACI <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="carousel-index-list">
        {SCROLLS.map((cert, i) => (
          <button
            key={cert.id}
            type="button"
            data-magnetic="true"
            className={`carousel-index-item ${i === safeIdx ? 'is-active' : ''}`}
            onClick={() => onSelectIndex(i)}
          >
            <ScrollText size={14} color={i === safeIdx ? '#F2D28B' : '#6E7C99'} />
            <span style={{ fontSize: 12.5, fontWeight: i === safeIdx ? 600 : 400, flex: 1 }}>{cert.title}</span>
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--accent-emerald)' }}>
              {cert.hours}h
            </span>
          </button>
        ))}
      </div>

      <CarouselFooter current={safeIdx + 1} total={SCROLLS.length} onPrev={onPrev} onNext={onNext} onBackHome={onBackHome} />
    </>
  );
}

/* ============================================================================
   CONTROLES COMPARTILHADOS DO CARROSSEL (← →, 01 / 05, ESC INÍCIO)
   ============================================================================ */
function CarouselFooter({ current, total, onPrev, onNext, onBackHome }) {
  return (
    <div className="carousel-footer">
      <div className="carousel-arrows">
        <button type="button" className="arrow-circle-btn" data-magnetic="true" onClick={onPrev} aria-label="Item anterior">
          <ChevronLeft size={16} />
        </button>
        <span className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--accent-gold-bright)' }}>
          {pad2(current)} / {pad2(total)}
        </span>
        <button type="button" className="arrow-circle-btn" data-magnetic="true" onClick={onNext} aria-label="Próximo item">
          <ChevronRight size={16} />
        </button>
      </div>

      <button
        type="button"
        data-magnetic="true"
        onClick={onBackHome}
        className="font-mono"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: 10,
          letterSpacing: '0.1em',
          cursor: 'pointer',
        }}
      >
        ← → NAVEGAR · ESC INÍCIO
      </button>
    </div>
  );
}
