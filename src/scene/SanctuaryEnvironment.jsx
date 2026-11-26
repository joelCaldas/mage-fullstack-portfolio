import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import { STATIONS } from '../data/portfolioData.js';
import { assetUrl, dracoDecoderPath } from '../utils/assetUrl.js';

const CLICKABLE_STATIONS = ['grimorio', 'missoes', 'qualificacoes', 'pergaminhos'];

/**
 * Carrega o ambiente 3D real (ambiente_mago_dev_joel.glb), reproduz a animação
 * Sanctuary_Ambient criada no Blender (anéis rúnicos girando, grimórios flutuando,
 * lanternas balançando) e injeta zonas clicáveis com raycasting e highlight sutil.
 */
export default function SanctuaryEnvironment({
  modelUrl = assetUrl('models/ambiente_mago_dev_joel.glb'),
  activeStation,
  onSelectStation,
  onHoverInteractive,
}) {
  const groupRef = useRef();
  const [hoveredStation, setHoveredStation] = useState(null);
  const { scene, animations } = useGLTF(modelUrl, dracoDecoderPath());

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          const n = child.name.toLowerCase();
          // Realça seletivamente apenas emissores (círculo mágico, LEDs, telas, cristais e lanternas)
          if (
            n.includes('magiccircle') ||
            n.includes('led') ||
            n.includes('glow') ||
            n.includes('monitor') ||
            n.includes('crystal') ||
            n.includes('vfx')
          ) {
            child.material.emissiveIntensity = Math.max(child.material.emissiveIntensity || 1.2, 1.85);
            child.material.toneMapped = false;
          }
        }
      }
    });
    return clone;
  }, [scene]);

  const { actions } = useAnimations(animations, groupRef);

  // Inicia o loop ambiente exportado do Blender (Sanctuary_Ambient)
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action) => {
      if (action) {
        action.reset().setEffectiveTimeScale(0.65).play();
      }
    });
  }, [actions]);

  return (
    <group ref={groupRef} name="Sanctuary_Environment_Root">
      <primitive object={clonedScene} />

      {/* 4 Estações clicáveis via Raycasting 3D com highlight emissivo suave */}
      {CLICKABLE_STATIONS.map((id) => {
        const st = STATIONS[id];
        const isHovered = hoveredStation === id;
        const isActive = activeStation === id;
        return (
          <StationHotspot
            key={id}
            station={st}
            isHovered={isHovered}
            isActive={isActive}
            onHover={(over) => {
              setHoveredStation(over ? id : null);
              onHoverInteractive?.(over);
            }}
            onClick={() => onSelectStation?.(id)}
          />
        );
      })}
    </group>
  );
}

function StationHotspot({ station, isHovered, isActive, onHover, onClick }) {
  const ringRef = useRef();
  const coreRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.9;
      const s = isHovered ? 1.32 : isActive ? 1.15 : 1.0 + Math.sin(t * 2.4) * 0.08;
      ringRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.12);
    }
    if (coreRef.current) {
      coreRef.current.position.y = Math.sin(t * 2.6) * 0.04;
    }
  });

  return (
    <group position={station.hotspotPos}>
      {/* Hitbox invisível ampla para raycasting confortável no desktop e mobile */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Marcador rúnico sutil 3D */}
      <group ref={coreRef}>
        <mesh>
          <octahedronGeometry args={[0.048, 0]} />
          <meshBasicMaterial
            color={isHovered || isActive ? '#f2d28b' : station.accent}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={ringRef}>
          <ringGeometry args={[0.085, 0.105, 32]} />
          <meshBasicMaterial
            color={isHovered || isActive ? '#f2d28b' : station.accent}
            transparent
            opacity={isHovered ? 0.95 : isActive ? 0.8 : 0.45}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Rótulo editorial minimalista flutuante (visível no Início ou ao passar o mouse) */}
      {(isHovered || !isActive) && (
        <Html
          center
          distanceFactor={6.2}
          position={[0, 0.24, 0]}
          style={{ pointerEvents: 'none', transition: 'opacity 0.25s ease' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '5px 11px',
              borderRadius: 999,
              background: isHovered ? 'rgba(17, 23, 43, 0.92)' : 'rgba(10, 14, 27, 0.72)',
              border: `1px solid ${isHovered ? 'rgba(242, 210, 139, 0.75)' : 'rgba(56, 217, 245, 0.35)'}`,
              backdropFilter: 'blur(10px)',
              whiteSpace: 'nowrap',
              boxShadow: isHovered ? '0 0 18px rgba(216, 178, 104, 0.35)' : 'none',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'all 0.22s ease',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isHovered ? '#f2d28b' : station.accent,
                boxShadow: `0 0 8px ${station.accent}`,
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.1em',
                color: '#f4f1ea',
                textTransform: 'uppercase',
              }}
            >
              {station.navLabel}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload(assetUrl('models/ambiente_mago_dev_joel.glb'), dracoDecoderPath());
