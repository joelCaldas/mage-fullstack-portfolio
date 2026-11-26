import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { STATIONS } from '../data/portfolioData.js';

/**
 * Artefatos 3D animados que o Joel Mago Dev fisicamente invoca/abre em cada página:
 * - GRIMÓRIO: Um livro arcano 3D desliza da estante até Joel e ABRE SUAS CAPAS com páginas luminosas.
 * - MISSÕES: Um mapa holográfico tático 3D se projeta sobre a mesa de servidores com anéis orbitais.
 * - QUALIFICAÇÕES: 4 orbes dourados/ciano dos graus acadêmicos + astrolábio sobem do altar.
 * - PERGAMINHOS: Um pergaminho selado sai da estante e DESENROLA OS ROLOS 3D revelando runas douradas.
 *
 * Também reage com pulso mágico sutil sempre que `carouselIndex` muda (← →).
 */
export default function StationArtifacts({ activeStation, arrivedStation, carouselIndex = 0 }) {
  return (
    <group name="Interactive_Station_Artifacts">
      <GrimoireTomeArtifact
        active={activeStation === 'grimorio' && arrivedStation === 'grimorio'}
        carouselIndex={carouselIndex}
      />
      <MissionHologramArtifact
        active={activeStation === 'missoes' && arrivedStation === 'missoes'}
        carouselIndex={carouselIndex}
      />
      <AcademicAltarArtifact
        active={activeStation === 'qualificacoes' && arrivedStation === 'qualificacoes'}
        carouselIndex={carouselIndex}
      />
      <UnrollingScrollArtifact
        active={activeStation === 'pergaminhos' && arrivedStation === 'pergaminhos'}
        carouselIndex={carouselIndex}
      />
    </group>
  );
}

/* ============================================================================
   1. GRIMÓRIO 3D — Sai da estante, levita até Joel e ABRE as duas capas
   ============================================================================ */
function GrimoireTomeArtifact({ active, carouselIndex }) {
  const rootRef = useRef();
  const leftCoverRef = useRef();
  const rightCoverRef = useRef();
  const pageGlowRef = useRef();
  const flipPageRef = useRef();
  const origin = STATIONS.grimorio.artifactOrigin;
  const target = STATIONS.grimorio.artifactPos;

  useEffect(() => {
    if (!rootRef.current || !leftCoverRef.current || !rightCoverRef.current) return;
    gsap.killTweensOf([rootRef.current.position, rootRef.current.rotation, rootRef.current.scale, leftCoverRef.current.rotation, rightCoverRef.current.rotation]);

    if (active) {
      rootRef.current.visible = true;
      rootRef.current.position.set(...origin);
      rootRef.current.scale.setScalar(0.55);
      rootRef.current.rotation.set(0.1, Math.PI / 2, 0);
      leftCoverRef.current.rotation.y = 0;
      rightCoverRef.current.rotation.y = 0;

      const tl = gsap.timeline();
      // 1) Sai da estante flutuando até a frente de Joel
      tl.to(rootRef.current.position, {
        x: target[0],
        y: target[1],
        z: target[2],
        duration: 0.72,
        ease: 'power3.out',
      }, 0)
      .to(rootRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.72,
        ease: 'power2.out',
      }, 0)
      .to(rootRef.current.rotation, {
        x: 0.28,
        y: 0.52,
        z: -0.06,
        duration: 0.72,
        ease: 'power3.out',
      }, 0)
      // 2) Abre as duas capas articuladas do Grimório revelando páginas iluminadas
      .to(leftCoverRef.current.rotation, {
        y: -1.18,
        duration: 0.65,
        ease: 'back.out(1.4)',
      }, 0.45)
      .to(rightCoverRef.current.rotation, {
        y: 1.18,
        duration: 0.65,
        ease: 'back.out(1.4)',
      }, 0.45);
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          if (rootRef.current) rootRef.current.visible = false;
        },
      });
      tl.to([leftCoverRef.current.rotation, rightCoverRef.current.rotation], {
        y: 0,
        duration: 0.32,
        ease: 'power2.in',
      }, 0)
      .to(rootRef.current.position, {
        x: origin[0],
        y: origin[1],
        z: origin[2],
        duration: 0.45,
        ease: 'power2.in',
      }, 0.15)
      .to(rootRef.current.scale, {
        x: 0.01, y: 0.01, z: 0.01,
        duration: 0.4,
        ease: 'power2.in',
      }, 0.2);
    }
  }, [active]);

  // Animação de virar página 3D quando o usuário troca de Grimório (← →)
  useEffect(() => {
    if (!active || !flipPageRef.current) return;
    gsap.fromTo(
      flipPageRef.current.rotation,
      { y: 1.05 },
      { y: -1.05, duration: 0.55, ease: 'power2.inOut' }
    );
  }, [carouselIndex, active]);

  useFrame((state) => {
    if (!active || !rootRef.current) return;
    const t = state.clock.elapsedTime;
    rootRef.current.position.y = target[1] + Math.sin(t * 2.4) * 0.032;
    if (pageGlowRef.current) {
      pageGlowRef.current.intensity = 1.6 + Math.sin(t * 3.8) * 0.35;
    }
  });

  const schoolColors = ['#38d9f5', '#a78bfa', '#34d399', '#f2d28b', '#38d9f5'];
  const glowColor = schoolColors[carouselIndex % schoolColors.length];

  return (
    <group ref={rootRef} visible={false} position={origin}>
      {/* Lombada dourada central */}
      <mesh>
        <boxGeometry args={[0.045, 0.34, 0.055]} />
        <meshStandardMaterial color="#3c2614" roughness={0.55} metalness={0.4} />
      </mesh>

      {/* Capa Esquerda articulada */}
      <group ref={leftCoverRef} position={[-0.02, 0, 0]}>
        <mesh position={[-0.125, 0, 0]}>
          <boxGeometry args={[0.24, 0.34, 0.022]} />
          <meshStandardMaterial color="#1a2138" roughness={0.45} metalness={0.55} />
        </mesh>
        {/* Filete dourado da capa */}
        <mesh position={[-0.125, 0, -0.013]}>
          <planeGeometry args={[0.20, 0.29]} />
          <meshBasicMaterial color="#d8b268" wireframe />
        </mesh>
        {/* Bloco de páginas esquerda */}
        <mesh position={[-0.118, 0, 0.018]}>
          <boxGeometry args={[0.215, 0.305, 0.022]} />
          <meshStandardMaterial
            color="#f5ecd7"
            emissive={glowColor}
            emissiveIntensity={0.65}
            roughness={0.85}
          />
        </mesh>
      </group>

      {/* Capa Direita articulada */}
      <group ref={rightCoverRef} position={[0.02, 0, 0]}>
        <mesh position={[0.125, 0, 0]}>
          <boxGeometry args={[0.24, 0.34, 0.022]} />
          <meshStandardMaterial color="#1a2138" roughness={0.45} metalness={0.55} />
        </mesh>
        <mesh position={[0.125, 0, 0.018]}>
          <boxGeometry args={[0.215, 0.305, 0.022]} />
          <meshStandardMaterial
            color="#f5ecd7"
            emissive={glowColor}
            emissiveIntensity={0.65}
            roughness={0.85}
          />
        </mesh>
      </group>

      {/* Folha mágica central que vira ao navegar no carrossel */}
      <group ref={flipPageRef} position={[0, 0, 0.025]}>
        <mesh position={[0.10, 0, 0]}>
          <planeGeometry args={[0.20, 0.29]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Símbolo rúnico flutuando acima das páginas abertas */}
      <mesh position={[0, 0.24, 0.06]} rotation={[0.2, 0, 0]}>
        <ringGeometry args={[0.07, 0.088, 6]} />
        <meshBasicMaterial color={glowColor} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <pointLight ref={pageGlowRef} position={[0, 0.12, 0.18]} color={glowColor} intensity={1.6} distance={2.8} decay={2} />
    </group>
  );
}

/* ============================================================================
   2. MISSÕES 3D — Mapa Holográfico Tático projetado sobre a Mesa de Servidores
   ============================================================================ */
function MissionHologramArtifact({ active, carouselIndex }) {
  const rootRef = useRef();
  const ringARef = useRef();
  const ringBRef = useRef();
  const coreRef = useRef();
  const origin = STATIONS.missoes.artifactOrigin;
  const target = STATIONS.missoes.artifactPos;

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.killTweensOf([rootRef.current.position, rootRef.current.scale]);

    if (active) {
      rootRef.current.visible = true;
      rootRef.current.position.set(...origin);
      rootRef.current.scale.set(0.1, 0.02, 0.1);
      gsap.to(rootRef.current.position, {
        x: target[0], y: target[1], z: target[2],
        duration: 0.78, ease: 'power3.out',
      });
      gsap.to(rootRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.78, ease: 'back.out(1.3)',
      });
    } else {
      gsap.to(rootRef.current.scale, {
        x: 0.01, y: 0.01, z: 0.01,
        duration: 0.42, ease: 'power2.in',
        onComplete: () => {
          if (rootRef.current) rootRef.current.visible = false;
        },
      });
    }
  }, [active]);

  useEffect(() => {
    if (!active || !coreRef.current) return;
    gsap.fromTo(coreRef.current.scale, { x: 1.35, y: 1.35, z: 1.35 }, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'elastic.out(1, 0.6)' });
  }, [carouselIndex, active]);

  useFrame((state) => {
    if (!active || !rootRef.current) return;
    const t = state.clock.elapsedTime;
    rootRef.current.position.y = target[1] + Math.sin(t * 2.1) * 0.025;
    if (ringARef.current) ringARef.current.rotation.z = t * 0.7;
    if (ringBRef.current) {
      ringBRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.9) * 0.18;
      ringBRef.current.rotation.y = -t * 0.9;
    }
    if (coreRef.current) coreRef.current.rotation.y = t * 0.85;
  });

  const missionColors = ['#f2d28b', '#34d399', '#38d9f5', '#a78bfa'];
  const col = missionColors[carouselIndex % missionColors.length];

  return (
    <group ref={rootRef} visible={false} position={origin}>
      {/* Cone de projeção holográfica vindo da mesa */}
      <mesh position={[0, -0.22, 0]}>
        <coneGeometry args={[0.26, 0.44, 24, 1, true]} />
        <meshBasicMaterial color="#38d9f5" transparent opacity={0.14} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* Anel orbital horizontal */}
      <mesh ref={ringARef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.24, 0.265, 48]} />
        <meshBasicMaterial color="#38d9f5" transparent opacity={0.85} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* Anel giroscópico inclinado */}
      <mesh ref={ringBRef}>
        <torusGeometry args={[0.19, 0.006, 12, 48]} />
        <meshBasicMaterial color={col} toneMapped={false} />
      </mesh>
      {/* Núcleo octaédrico wireframe de missão */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.11, 0]} />
        <meshBasicMaterial color={col} wireframe toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.05, 0]} color={col} intensity={1.7} distance={3.0} decay={2} />
    </group>
  );
}

/* ============================================================================
   3. QUALIFICAÇÕES 3D — 4 Orbes Ascendentes dos Graus + Astrolábio sobre o Altar
   ============================================================================ */
function AcademicAltarArtifact({ active, carouselIndex }) {
  const rootRef = useRef();
  const orbitRef = useRef();
  const origin = STATIONS.qualificacoes.artifactOrigin;
  const target = STATIONS.qualificacoes.artifactPos;

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.killTweensOf([rootRef.current.position, rootRef.current.scale]);
    if (active) {
      rootRef.current.visible = true;
      rootRef.current.position.set(...origin);
      rootRef.current.scale.setScalar(0.05);
      gsap.to(rootRef.current.position, {
        x: target[0], y: target[1], z: target[2],
        duration: 0.85, ease: 'power3.out',
      });
      gsap.to(rootRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.85, ease: 'back.out(1.2)',
      });
    } else {
      gsap.to(rootRef.current.scale, {
        x: 0.01, y: 0.01, z: 0.01,
        duration: 0.4, ease: 'power2.in',
        onComplete: () => {
          if (rootRef.current) rootRef.current.visible = false;
        },
      });
    }
  }, [active]);

  useFrame((state) => {
    if (!active || !orbitRef.current) return;
    const t = state.clock.elapsedTime;
    orbitRef.current.rotation.y = t * 0.65;
    rootRef.current.position.y = target[1] + Math.sin(t * 1.9) * 0.035;
  });

  const degreeColors = ['#f2d28b', '#38d9f5', '#a78bfa', '#94a3b8'];

  return (
    <group ref={rootRef} visible={false} position={origin}>
      {/* Astrolábio dourado central */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.007, 12, 48]} />
        <meshBasicMaterial color="#d8b268" toneMapped={false} />
      </mesh>
      {/* 4 Orbes representando Graduação, Pós, Mestrado e Doutorado */}
      <group ref={orbitRef}>
        {degreeColors.map((col, idx) => {
          const angle = (idx / 4) * Math.PI * 2;
          const isSelected = idx === carouselIndex % 4;
          const r = 0.24;
          return (
            <mesh
              key={idx}
              position={[Math.cos(angle) * r, idx * 0.065 - 0.09, Math.sin(angle) * r]}
              scale={isSelected ? 1.45 : 0.85}
            >
              <sphereGeometry args={[0.042, 18, 18]} />
              <meshBasicMaterial color={col} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
      <pointLight position={[0, 0.05, 0]} color="#f2d28b" intensity={1.8} distance={3.2} decay={2} />
    </group>
  );
}

/* ============================================================================
   4. PERGAMINHOS 3D — Sai da estante direita e DESENROLA seus dois rolos 3D
   ============================================================================ */
function UnrollingScrollArtifact({ active, carouselIndex }) {
  const rootRef = useRef();
  const topRollerRef = useRef();
  const botRollerRef = useRef();
  const sheetRef = useRef();
  const sealRef = useRef();
  const origin = STATIONS.pergaminhos.artifactOrigin;
  const target = STATIONS.pergaminhos.artifactPos;

  useEffect(() => {
    if (!rootRef.current || !topRollerRef.current || !botRollerRef.current || !sheetRef.current) return;
    gsap.killTweensOf([
      rootRef.current.position,
      rootRef.current.rotation,
      rootRef.current.scale,
      topRollerRef.current.position,
      botRollerRef.current.position,
      sheetRef.current.scale,
    ]);

    if (active) {
      rootRef.current.visible = true;
      rootRef.current.position.set(...origin);
      rootRef.current.scale.setScalar(0.5);
      rootRef.current.rotation.set(0, -Math.PI / 2, 0);
      topRollerRef.current.position.y = 0.02;
      botRollerRef.current.position.y = -0.02;
      sheetRef.current.scale.set(1, 0.04, 1);

      const tl = gsap.timeline();
      // 1) Desliza da estante até Joel
      tl.to(rootRef.current.position, {
        x: target[0], y: target[1], z: target[2],
        duration: 0.72, ease: 'power3.out',
      }, 0)
      .to(rootRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.72, ease: 'power2.out',
      }, 0)
      .to(rootRef.current.rotation, {
        x: 0.08, y: -0.58, z: 0.03,
        duration: 0.72, ease: 'power3.out',
      }, 0)
      // 2) Desenrola fisicamente o rolo superior e inferior esticando o pergaminho
      .to(topRollerRef.current.position, {
        y: 0.24,
        duration: 0.68,
        ease: 'back.out(1.3)',
      }, 0.48)
      .to(botRollerRef.current.position, {
        y: -0.24,
        duration: 0.68,
        ease: 'back.out(1.3)',
      }, 0.48)
      .to(sheetRef.current.scale, {
        y: 1,
        duration: 0.68,
        ease: 'power3.out',
      }, 0.48);
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          if (rootRef.current) rootRef.current.visible = false;
        },
      });
      tl.to([topRollerRef.current.position, botRollerRef.current.position], {
        y: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, 0)
      .to(sheetRef.current.scale, { y: 0.04, duration: 0.3, ease: 'power2.in' }, 0)
      .to(rootRef.current.position, {
        x: origin[0], y: origin[1], z: origin[2],
        duration: 0.42, ease: 'power2.in',
      }, 0.16)
      .to(rootRef.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.38 }, 0.2);
    }
  }, [active]);

  // Ao trocar de certificado no carrossel, faz um rápido re-desenrolar sutil
  useEffect(() => {
    if (!active || !sheetRef.current || !topRollerRef.current || !botRollerRef.current) return;
    const tl = gsap.timeline();
    tl.to(sheetRef.current.scale, { y: 0.35, duration: 0.18, ease: 'power2.in' })
      .to(topRollerRef.current.position, { y: 0.09, duration: 0.18, ease: 'power2.in' }, 0)
      .to(botRollerRef.current.position, { y: -0.09, duration: 0.18, ease: 'power2.in' }, 0)
      .to(sheetRef.current.scale, { y: 1, duration: 0.34, ease: 'back.out(1.3)' })
      .to(topRollerRef.current.position, { y: 0.24, duration: 0.34, ease: 'back.out(1.3)' }, 0.18)
      .to(botRollerRef.current.position, { y: -0.24, duration: 0.34, ease: 'back.out(1.3)' }, 0.18);
  }, [carouselIndex, active]);

  useFrame((state) => {
    if (!active || !rootRef.current) return;
    const t = state.clock.elapsedTime;
    rootRef.current.position.y = target[1] + Math.sin(t * 2.2) * 0.028;
    if (sealRef.current) sealRef.current.rotation.z = t * 0.8;
  });

  return (
    <group ref={rootRef} visible={false} position={origin}>
      {/* Rolo superior de madeira e ouro */}
      <group ref={topRollerRef} position={[0, 0.02, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.36, 16]} />
          <meshStandardMaterial color="#5c3a1e" roughness={0.5} metalness={0.35} />
        </mesh>
        <mesh position={[-0.19, 0, 0]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial color="#d8b268" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0.19, 0, 0]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial color="#d8b268" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* Folha do Pergaminho luminoso */}
      <group ref={sheetRef}>
        <mesh>
          <planeGeometry args={[0.31, 0.46]} />
          <meshStandardMaterial
            color="#f4e6c4"
            emissive="#d8b268"
            emissiveIntensity={0.55}
            roughness={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Selo rúnico de autenticação FACI Wyden */}
        <mesh ref={sealRef} position={[0, -0.14, 0.008]}>
          <ringGeometry args={[0.032, 0.044, 6]} />
          <meshBasicMaterial color="#34d399" side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>

      {/* Rolo inferior de madeira e ouro */}
      <group ref={botRollerRef} position={[0, -0.02, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.36, 16]} />
          <meshStandardMaterial color="#5c3a1e" roughness={0.5} metalness={0.35} />
        </mesh>
        <mesh position={[-0.19, 0, 0]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial color="#d8b268" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0.19, 0, 0]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial color="#d8b268" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      <pointLight position={[0, 0, 0.22]} color="#f2d28b" intensity={1.55} distance={2.8} decay={2} />
    </group>
  );
}
