import React, { useEffect, useRef, useState } from 'react';

/**
 * Cursor rúnico customizado estilo Immersive Garden com inércia suave (lerp)
 * e efeito magnético ao passar sobre botões, links ou objetos 3D clicáveis.
 */
export default function RunicCursor({ hovered3D }) {
  const outerRef = useRef(null);
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [magnetic, setMagnetic] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;

    setEnabled(true);
    document.body.classList.add('custom-cursor-active');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ox = mx;
    let oy = my;
    let rafId = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target;
      const isMag = Boolean(target?.closest?.('[data-magnetic="true"], button, a, label'));
      setMagnetic(isMag);
    };

    const tick = () => {
      ox += (mx - ox) * 0.16;
      oy += (my - oy) * 0.16;
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!enabled) return null;

  const isExpanded = magnetic || hovered3D;

  return (
    <>
      <div ref={outerRef} className={`runic-cursor-outer ${isExpanded ? 'is-magnetic' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 44 44" fill="none" style={{ width: '100%', height: '100%' }}>
          <circle
            cx="22"
            cy="22"
            r="19"
            stroke={hovered3D ? '#38D9F5' : '#D8B268'}
            strokeWidth="1.2"
            strokeDasharray={isExpanded ? 'none' : '4 3'}
            strokeOpacity={isExpanded ? '0.95' : '0.72'}
          />
          <path d="M22 1v5M22 38v5M1 22h5M38 22h5" stroke="#D8B268" strokeWidth="1" strokeOpacity="0.65" />
        </svg>
      </div>
      <div ref={dotRef} className="runic-cursor-dot" aria-hidden="true" />
    </>
  );
}
