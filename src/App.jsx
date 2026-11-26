import React, { useCallback, useEffect, useRef, useState } from 'react';
import './styles/ui.css';
import SanctuaryScene from './scene/SanctuaryScene.jsx';
import Preloader from './components/Preloader.jsx';
import HeaderHUD from './components/HeaderHUD.jsx';
import StationPanel from './components/StationPanel.jsx';
import BottomBar from './components/BottomBar.jsx';
import RunicCursor from './components/RunicCursor.jsx';
import { GRIMOIRES, MISSIONS, QUALIFICATIONS, SCROLLS, STATIONS } from './data/portfolioData.js';
import { sanctuaryAudio } from './audio/sanctuaryAudio.js';

const STATION_COUNTS = {
  grimorio: GRIMOIRES.length,
  missoes: MISSIONS.length,
  qualificacoes: QUALIFICATIONS.length,
  pergaminhos: SCROLLS.length,
};

export default function App() {
  const [entered, setEntered] = useState(false);
  const [activeStation, setActiveStation] = useState('inicio');
  const [arrivedStation, setArrivedStation] = useState('inicio');
  const [panelVisible, setPanelVisible] = useState(false);
  const [magePhase, setMagePhase] = useState('idle');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentMp, setCurrentMp] = useState(98);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hovered3D, setHovered3D] = useState(false);
  const [customEnvUrl, setCustomEnvUrl] = useState(null);
  const [customMageUrl, setCustomMageUrl] = useState(null);
  const revealTimerRef = useRef(null);

  // Regeneração contínua e suave de MP de volta até 98/100
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentMp((mp) => (mp < 98 ? Math.min(98, +(mp + 0.65).toFixed(2)) : mp));
    }, 180);
    return () => clearInterval(id);
  }, []);

  // Entrada cinematográfica no Santuário
  const handleEnter = useCallback((withSound) => {
    setEntered(true);
    setSoundEnabled(withSound);
    sanctuaryAudio.setEnabled(withSound);
    if (withSound) {
      setTimeout(() => sanctuaryAudio.playNavigate(), 200);
    }
    setTimeout(() => setPanelVisible(true), 650);
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sanctuaryAudio.setEnabled(next);
      return next;
    });
  }, []);

  // Navegação coreografada:
  // 1) Recolhe painel atual + consome um pouco de MP
  // 2) Personagem gira e levita até o móvel; câmera acompanha com GSAP
  // 3) Ao chegar, abre artefato 3D (Grimório/Holograma/Orbes/Pergaminho) e revela o painel!
  const handleSelectStation = useCallback(
    (stationId) => {
      if (stationId === activeStation && arrivedStation === stationId) {
        setPanelVisible(true);
        return;
      }
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);

      const st = STATIONS[stationId];
      setPanelVisible(false);
      setCarouselIndex(0);
      setArrivedStation(null);
      setActiveStation(stationId);

      if (st?.mpCost) {
        setCurrentMp((mp) => Math.max(58, mp - st.mpCost));
      }
      sanctuaryAudio.playNavigate();
    },
    [activeStation, arrivedStation]
  );

  // Sincroniza abertura do painel logo após Joel pegar/abrir o artefato 3D
  const handleMageArrived = useCallback((stationId) => {
    setArrivedStation(stationId);
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    const delay = stationId === 'inicio' ? 180 : 520;
    revealTimerRef.current = setTimeout(() => {
      setPanelVisible(true);
    }, delay);
  }, []);

  const handleNext = useCallback(() => {
    const count = STATION_COUNTS[activeStation];
    if (!count) return;
    setCarouselIndex((i) => (i + 1) % count);
    setCurrentMp((mp) => Math.max(64, mp - 1.5));
    sanctuaryAudio.playPageTurn();
  }, [activeStation]);

  const handlePrev = useCallback(() => {
    const count = STATION_COUNTS[activeStation];
    if (!count) return;
    setCarouselIndex((i) => (i - 1 + count) % count);
    setCurrentMp((mp) => Math.max(64, mp - 1.5));
    sanctuaryAudio.playPageTurn();
  }, [activeStation]);

  const handleSelectIndex = useCallback((idx) => {
    setCarouselIndex(idx);
    sanctuaryAudio.playPageTurn();
  }, []);

  // Atalhos globais de teclado (← → ESC)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!entered) return;
      if (e.key === 'Escape') {
        handleSelectStation('inicio');
      } else if (e.key === 'ArrowRight' && activeStation !== 'inicio') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && activeStation !== 'inicio') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [entered, activeStation, handleNext, handlePrev, handleSelectStation]);

  const handleUploadGlb = useCallback((file) => {
    const url = URL.createObjectURL(file);
    const name = file.name.toLowerCase();
    if (name.includes('ambiente') || name.includes('cena') || name.includes('library')) {
      setCustomEnvUrl(url);
    } else {
      setCustomMageUrl(url);
    }
  }, []);

  const currentStation = STATIONS[activeStation] || STATIONS.inicio;
  const showChoreographyToast =
    entered && (!panelVisible || magePhase === 'traveling') && activeStation !== 'inicio';

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Cena WebGL 3D Full-Bleed */}
      <SanctuaryScene
        activeStation={activeStation}
        arrivedStation={arrivedStation}
        carouselIndex={carouselIndex}
        entered={entered}
        customEnvUrl={customEnvUrl}
        customMageUrl={customMageUrl}
        onSelectStation={handleSelectStation}
        onPhaseChange={setMagePhase}
        onArrived={handleMageArrived}
        onHoverInteractive={(over) => {
          setHovered3D(over);
          if (over) sanctuaryAudio.playHover();
        }}
      />

      {/* Vinheta atmosférica sutil preservando contraste AAA sem esconder a cena 3D */}
      <div className="vignette-overlay" data-side={currentStation.panelSide} />

      {/* Header HUD Minimalista */}
      {entered && (
        <HeaderHUD
          activeStation={activeStation}
          currentMp={currentMp}
          soundEnabled={soundEnabled}
          onSelectStation={handleSelectStation}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* Aviso elegante durante levantar/pegar cajado, caminhada, sentar e abertura do artefato 3D */}
      {showChoreographyToast && (
        <div className="travel-pill" role="status">
          <span className="status-dot" style={{ background: '#38D9F5', boxShadow: '0 0 10px #38D9F5' }} />
          <span>
            {magePhase === 'standing'
              ? 'Levantando da cadeira e pegando o cajado...'
              : magePhase === 'traveling'
                ? `Caminhando até ${currentStation.landmark}...`
                : magePhase === 'sitting'
                  ? 'Apoiando o cajado na mesa, ajeitando o manto e sentando...'
                  : `${currentStation.actionLabel}...`}
          </span>
        </div>
      )}

      {/* Painel Editorial Glassmorphism + Carrossel */}
      {entered && (
        <StationPanel
          activeStation={activeStation}
          visible={panelVisible}
          currentMp={currentMp}
          carouselIndex={carouselIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelectIndex={handleSelectIndex}
          onNavigateStation={handleSelectStation}
        />
      )}

      {/* Rodapé Discreto */}
      {entered && <BottomBar activeStation={activeStation} onUploadGlb={handleUploadGlb} />}

      {/* Preloader Cinematográfico */}
      <Preloader entered={entered} onEnter={handleEnter} />

      {/* Cursor Customizado Rúnico Magnético */}
      <RunicCursor hovered3D={hovered3D} />
    </main>
  );
}
