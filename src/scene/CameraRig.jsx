import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { STATIONS } from '../data/portfolioData.js';

/**
 * Coreografia cinematográfica de câmera (GSAP power3.inOut) combinada com
 * micro-paralaxe amortecida pelo movimento do mouse / giroscópio (lerp),
 * mantendo sensação contínua de profundidade 3D mesmo estacionado.
 */
export default function CameraRig({ activeStation, entered }) {
  const { camera } = useThree();
  const basePos = useRef(new THREE.Vector3(0.42, 1.85, 4.35));
  const baseTarget = useRef(new THREE.Vector3(0.0, 1.05, 0.78));
  const currentLook = useRef(new THREE.Vector3(0.0, 1.05, 0.78));
  const pointer = useRef({ x: 0, y: 0, smoothX: 0, smoothY: 0 });
  const tweenRef = useRef(null);

  // Rastreia mouse e orientação mobile para micro-paralaxe orgânica
  useEffect(() => {
    const onPointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.current.x = THREE.MathUtils.clamp(nx, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const onOrientation = (e) => {
      if (typeof e.gamma === 'number' && typeof e.beta === 'number') {
        pointer.current.x = THREE.MathUtils.clamp(e.gamma / 35, -1, 1);
        pointer.current.y = THREE.MathUtils.clamp((e.beta - 45) / 35, -1, 1);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('deviceorientation', onOrientation);
    };
  }, []);

  // Transição cinematográfica GSAP sempre que a estação muda ou o visitante entra no Santuário
  useEffect(() => {
    const station = STATIONS[activeStation] || STATIONS.inicio;
    const targetPos = entered
      ? station.cameraPos
      : [station.cameraPos[0] * 0.6, station.cameraPos[1] + 0.35, station.cameraPos[2] + 0.75];
    const targetLook = station.cameraTarget;

    if (tweenRef.current) tweenRef.current.kill();

    const tl = gsap.timeline();
    tl.to(
      basePos.current,
      {
        x: targetPos[0],
        y: targetPos[1],
        z: targetPos[2],
        duration: entered ? 1.55 : 1.1,
        ease: 'power3.inOut',
      },
      0
    ).to(
      baseTarget.current,
      {
        x: targetLook[0],
        y: targetLook[1],
        z: targetLook[2],
        duration: entered ? 1.55 : 1.1,
        ease: 'power3.inOut',
      },
      0
    );
    tweenRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [activeStation, entered]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const lerpFactor = 1 - Math.exp(-3.4 * dt);

    pointer.current.smoothX += (pointer.current.x - pointer.current.smoothX) * lerpFactor;
    pointer.current.smoothY += (pointer.current.y - pointer.current.smoothY) * lerpFactor;

    // Micro-paralaxe sutil estilo Immersive Garden (sem nunca sair dos limites da sala)
    const offsetX = pointer.current.smoothX * 0.14;
    const offsetY = pointer.current.smoothY * 0.08;

    camera.position.set(
      THREE.MathUtils.clamp(basePos.current.x + offsetX, -2.35, 2.35),
      THREE.MathUtils.clamp(basePos.current.y + offsetY, 0.95, 2.7),
      THREE.MathUtils.clamp(basePos.current.z, -2.6, 3.65)
    );

    currentLook.current.lerp(baseTarget.current, Math.min(1, dt * 8));
    camera.lookAt(currentLook.current);
  });

  return null;
}
