import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import gsap from 'gsap';
import { STATIONS } from '../data/portfolioData.js';
import { assetUrl, dracoDecoderPath } from '../utils/assetUrl.js';

const _tmpPos = new THREE.Vector3();
const _tmpQuat = new THREE.Quaternion();

/**
 * Personagem 3D Joel Caldas (mago_joel.glb) + Cajado Sólido Independente (staff_joel.glb).
 *
 * - Cajado sólido separado acoplado ao osso `Staff_Socket` da mão direita (zero deformação!).
 * - Mão esquerda limpa (sem bola de magia flutuante), ficando apenas o cajado sólido na mão direita.
 * - Coreografia completa de Missões:
 *   • Chegando em Missões: caminha até a cadeira → apoia o cajado sólido na lateral da mesa →
 *     executa `Sit_Down_Desk` (ajeita o manto e senta na cadeira) → entra em `Seated_Missoes`.
 *   • Saindo de Missões para qualquer outra página: executa `Stand_Up_Desk` (levanta da cadeira
 *     e pega o cajado sólido de volta na mão direita) → caminha com `Walk_Levitate` até a nova estação!
 */
export default function MageCharacter({
  modelUrl = assetUrl('models/mago_joel.glb'),
  staffUrl = assetUrl('models/staff_joel.glb'),
  activeStation,
  onPhaseChange,
  onArrived,
}) {
  const groupRef = useRef();
  const staffRef = useRef();
  const auraRingRef = useRef();
  const keyLightRef = useRef();
  const staffLightRef = useRef();

  const currentClipRef = useRef(null);
  const currentStationRef = useRef('inicio');
  const isSeatedRef = useRef(false);
  const staffModeRef = useRef('hand'); // 'hand' | 'transition' | 'desk'
  const travelTweenRef = useRef(null);
  const isFirstMount = useRef(true);
  const travellingRef = useRef(false);

  const { scene, animations } = useGLTF(modelUrl, dracoDecoderPath());
  const { scene: staffScene } = useGLTF(staffUrl, dracoDecoderPath());

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          if (child.material.emissiveMap || child.material.emissiveIntensity > 0.2) {
            child.material.emissiveIntensity = Math.max(child.material.emissiveIntensity || 1.0, 1.45);
            child.material.toneMapped = false;
          }
        }
      }
    });
    return clone;
  }, [scene]);

  const clonedStaff = useMemo(() => {
    const clone = staffScene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          if (child.material.emissiveMap || child.material.emissiveIntensity > 0.2) {
            child.material.emissiveIntensity = Math.max(child.material.emissiveIntensity || 1.1, 1.75);
            child.material.toneMapped = false;
          }
        }
      }
    });
    return clone;
  }, [staffScene]);

  // Localiza o osso `Staff_Socket` no esqueleto clonado para acoplamento rígido 1:1
  const staffSocketBone = useMemo(() => {
    return clonedScene.getObjectByName('Staff_Socket') || clonedScene.getObjectByName('HandR') || null;
  }, [clonedScene]);

  const { actions, names } = useAnimations(animations, groupRef);

  const playClip = (preferredName, { fade = 0.3, loop = THREE.LoopRepeat, speed = 1.0, forceRestart = false } = {}) => {
    if (!actions || names.length === 0) return null;

    let targetName = preferredName;
    if (!actions[targetName]) {
      const lower = preferredName.toLowerCase();
      targetName =
        names.find((n) => n.toLowerCase() === lower) ||
        (lower.includes('walk')
          ? names.find((n) => /walk|run|move|levit/i.test(n))
          : lower.includes('sit') || lower.includes('seat')
            ? names.find((n) => /sit|seat|missoes/i.test(n))
            : names.find((n) => /idle|stand/i.test(n))) ||
        names[0];
    }

    if (!targetName) return null;
    if (!forceRestart && currentClipRef.current === targetName) return actions[targetName];

    const prev = currentClipRef.current ? actions[currentClipRef.current] : null;
    const next = actions[targetName];
    if (!next) return null;

    next.reset();
    next.setLoop(loop, loop === THREE.LoopOnce ? 1 : Infinity);
    next.clampWhenFinished = loop === THREE.LoopOnce;
    next.setEffectiveTimeScale(speed);
    next.setEffectiveWeight(1);
    next.fadeIn(fade).play();

    if (prev && prev !== next) {
      prev.fadeOut(fade);
    }
    currentClipRef.current = targetName;
    return next;
  };

  // Transição suave do cajado sólido: Mão → Mesa (encostado)
  const parkStaffAtDesk = () => {
    if (!staffRef.current) return;
    const restPos = STATIONS.missoes.staffRestPos;
    const restRot = STATIONS.missoes.staffRestRot;
    staffModeRef.current = 'transition';

    gsap.killTweensOf([staffRef.current.position, staffRef.current.rotation]);
    gsap.to(staffRef.current.position, {
      x: restPos[0],
      y: restPos[1],
      z: restPos[2],
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: () => {
        staffModeRef.current = 'desk';
      },
    });
    gsap.to(staffRef.current.rotation, {
      x: restRot[0],
      y: restRot[1],
      z: restRot[2],
      duration: 0.65,
      ease: 'power2.inOut',
    });
  };

  // Transição suave do cajado sólido: Mesa → Mão Direita (Staff_Socket)
  const grabStaffFromDesk = () => {
    if (!staffRef.current || !staffSocketBone) {
      staffModeRef.current = 'hand';
      return;
    }
    staffModeRef.current = 'transition';
    staffSocketBone.updateWorldMatrix(true, false);
    staffSocketBone.getWorldPosition(_tmpPos);
    staffSocketBone.getWorldQuaternion(_tmpQuat);
    const targetEuler = new THREE.Euler().setFromQuaternion(_tmpQuat);

    gsap.killTweensOf([staffRef.current.position, staffRef.current.rotation]);
    gsap.to(staffRef.current.position, {
      x: _tmpPos.x,
      y: _tmpPos.y,
      z: _tmpPos.z,
      duration: 0.48,
      ease: 'power2.out',
      onComplete: () => {
        staffModeRef.current = 'hand';
      },
    });
    gsap.to(staffRef.current.rotation, {
      x: targetEuler.x,
      y: targetEuler.y,
      z: targetEuler.z,
      duration: 0.48,
      ease: 'power2.out',
    });
  };

  // Posição inicial no Círculo Rúnico
  useEffect(() => {
    const st = STATIONS.inicio;
    if (groupRef.current && isFirstMount.current) {
      groupRef.current.position.set(...st.magePos);
      groupRef.current.rotation.y = st.mageRotY;
    }
    playClip(STATIONS[activeStation]?.blenderClip || 'Idle_Inicio', { fade: 0.2 });
  }, [actions, names]);

  // Coreografia principal entre estações (incluindo sentar/ajeitar manto/deixar cajado e levantar/pegar cajado!)
  useEffect(() => {
    if (!groupRef.current) return;
    const dest = STATIONS[activeStation] || STATIONS.inicio;

    if (isFirstMount.current) {
      isFirstMount.current = false;
      currentStationRef.current = activeStation;
      onPhaseChange?.('idle');
      onArrived?.(activeStation);
      return;
    }

    if (travelTweenRef.current) travelTweenRef.current.kill();

    const shortestAngle = (from, to) => {
      let diff = ((to - from + Math.PI) % (Math.PI * 2)) - Math.PI;
      if (diff < -Math.PI) diff += Math.PI * 2;
      return from + diff;
    };

    const masterTl = gsap.timeline();
    travelTweenRef.current = masterTl;

    // ---------------------------------------------------------
    // PASSO A: Se estava SENTADO em Missões, LEVANTA e PEGA O CAJADO primeiro!
    // ---------------------------------------------------------
    let walkStartDelay = 0;
    if (isSeatedRef.current && activeStation !== 'missoes') {
      isSeatedRef.current = false;
      onPhaseChange?.('standing');

      masterTl.call(
        () => {
          playClip('Stand_Up_Desk', { fade: 0.25, loop: THREE.LoopOnce, speed: 1.15, forceRestart: true });
        },
        null,
        0
      );

      // Aos 1.10s (quando Joel estende a mão direita em Stand_Up_Desk), o cajado sólido volta para a mão!
      masterTl.call(() => grabStaffFromDesk(), null, 1.05);

      walkStartDelay = 1.75;
    } else if (!isSeatedRef.current) {
      // Garante cajado na mão fora de Missões
      if (staffModeRef.current === 'desk') grabStaffFromDesk();
    }

    // ---------------------------------------------------------
    // PASSO B: Caminha até o destino com ciclo real de passos IK (Walk_Levitate)
    // ---------------------------------------------------------
    const pos = groupRef.current.position;
    const dx = dest.magePos[0] - pos.x;
    const dz = dest.magePos[2] - pos.z;
    const dist = Math.hypot(dx, dz);

    if (dist > 0.08) {
      const travelHeading = Math.atan2(dx, dz);
      const turnToTravel = shortestAngle(groupRef.current.rotation.y, travelHeading);
      const turnToFinal = shortestAngle(turnToTravel, dest.mageRotY);
      const travelDur = THREE.MathUtils.clamp(0.95 + dist * 0.28, 1.05, 1.55);

      masterTl.call(
        () => {
          travellingRef.current = true;
          onPhaseChange?.('traveling');
          playClip('Walk_Levitate', { fade: 0.25, speed: 1.32 });
        },
        null,
        walkStartDelay
      );

      masterTl.to(
        groupRef.current.rotation,
        { y: turnToTravel, duration: 0.34, ease: 'power2.out' },
        walkStartDelay
      );

      masterTl.to(
        groupRef.current.position,
        {
          x: dest.magePos[0],
          y: dest.magePos[1],
          z: dest.magePos[2],
          duration: travelDur,
          ease: 'power2.inOut',
        },
        walkStartDelay + 0.1
      );

      masterTl.to(
        groupRef.current.rotation,
        { y: turnToFinal, duration: 0.45, ease: 'power2.inOut' },
        walkStartDelay + Math.max(0.45, travelDur - 0.22)
      );

      const arriveTime = walkStartDelay + travelDur + 0.14;

      // ---------------------------------------------------------
      // PASSO C: Chegada na estação!
      // ---------------------------------------------------------
      if (activeStation === 'missoes') {
        // Sequência exclusiva de Missões: deixa o cajado → ajeita o manto → senta na cadeira → Seated_Missoes!
        masterTl.call(
          () => {
            travellingRef.current = false;
            isSeatedRef.current = true;
            currentStationRef.current = 'missoes';
            onPhaseChange?.('sitting');
            playClip('Sit_Down_Desk', { fade: 0.25, loop: THREE.LoopOnce, speed: 1.05, forceRestart: true });
          },
          null,
          arriveTime
        );

        // Apoia o cajado sólido na mesa aos 0.45s de Sit_Down_Desk
        masterTl.call(() => parkStaffAtDesk(), null, arriveTime + 0.42);

        // Após terminar de ajeitar o manto e sentar na cadeira (~2.15s), inicia loop Seated_Missoes e abre o painel!
        masterTl.call(
          () => {
            playClip('Seated_Missoes', { fade: 0.35, loop: THREE.LoopRepeat, speed: 1.0 });
            onPhaseChange?.('seated');
            onArrived?.('missoes');
          },
          null,
          arriveTime + 2.15
        );
      } else {
        masterTl.call(
          () => {
            travellingRef.current = false;
            currentStationRef.current = activeStation;
            playClip(dest.blenderClip, { fade: 0.34, forceRestart: true });
            onPhaseChange?.(activeStation === 'inicio' ? 'idle' : 'casting');
            onArrived?.(activeStation);
          },
          null,
          arriveTime
        );
      }
    } else {
      // Já está na posição da estação
      masterTl.call(
        () => {
          travellingRef.current = false;
          currentStationRef.current = activeStation;
          playClip(dest.blenderClip, { fade: 0.32 });
          onPhaseChange?.(activeStation === 'inicio' ? 'idle' : activeStation === 'missoes' ? 'seated' : 'casting');
          onArrived?.(activeStation);
        },
        null,
        walkStartDelay
      );
    }

    return () => {
      masterTl.kill();
    };
  }, [activeStation]);

  // Atualiza acoplamento rígido do cajado sólido ao osso `Staff_Socket` em tempo real (60 FPS)
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (staffModeRef.current === 'hand' && staffRef.current && staffSocketBone) {
      staffSocketBone.updateWorldMatrix(true, false);
      staffSocketBone.getWorldPosition(_tmpPos);
      staffSocketBone.getWorldQuaternion(_tmpQuat);
      staffRef.current.position.copy(_tmpPos);
      staffRef.current.quaternion.copy(_tmpQuat);
    }

    if (auraRingRef.current) {
      auraRingRef.current.rotation.z = t * (travellingRef.current ? 2.2 : 0.6);
      const targetScale = travellingRef.current ? 1.12 : activeStation === 'inicio' ? 0.68 : 0.01;
      auraRingRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      auraRingRef.current.material.opacity = THREE.MathUtils.lerp(
        auraRingRef.current.material.opacity,
        travellingRef.current ? 0.65 : activeStation === 'inicio' ? 0.2 : 0.0,
        0.1
      );
    }

    if (keyLightRef.current) {
      keyLightRef.current.intensity = 2.25 + Math.sin(t * 1.8) * 0.14;
    }

    if (staffLightRef.current) {
      staffLightRef.current.intensity = 2.1 + Math.sin(t * 3.1) * 0.25;
    }
  });

  return (
    <>
      {/* Corpo rigado de Joel (sem cajado grudado e sem esfera de magia flutuando na mão!) */}
      <group ref={groupRef} name="Mage_Joel_Controller">
        <primitive object={clonedScene} />

        {/* Key-light suave acompanhando o rosto em qualquer estação */}
        <pointLight
          ref={keyLightRef}
          position={[0.0, 1.85, 0.95]}
          color="#ffe8c4"
          intensity={2.25}
          distance={4.5}
          decay={2}
        />

        {/* Anel sutil sob os passos durante a caminhada */}
        <mesh ref={auraRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.36, 0.42, 48]} />
          <meshBasicMaterial
            color="#38d9f5"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Cajado Arcano Sólido Independente (acoplado ao Staff_Socket quando na mão, ou encostado na mesa em Missões!) */}
      <group ref={staffRef} name="Mage_Staff_Solid_Prop">
        <primitive object={clonedStaff} />
        {/* Brilho ciano emanando exclusivamente do cristal no topo do cajado sólido */}
        <pointLight
          ref={staffLightRef}
          position={[0, 0.62, 0]}
          color="#38d9f5"
          intensity={2.1}
          distance={3.6}
          decay={2}
        />
      </group>
    </>
  );
}

useGLTF.preload(assetUrl('models/mago_joel.glb'), dracoDecoderPath());
useGLTF.preload(assetUrl('models/staff_joel.glb'), dracoDecoderPath());
