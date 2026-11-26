import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { arcaneParticlesVertexShader, arcaneParticlesFragmentShader } from './shaders/arcaneParticles.js';

/**
 * Sistema de partículas arcanas 100% em GPU (GLSL ShaderMaterial):
 * poeira dourada e faíscas ciano subindo organicamente pelo santuário.
 */
export default function ArcaneParticles({ count = 260 }) {
  const matRef = useRef();
  const { gl } = useThree();

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const colorMix = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribuído dentro do volume interno do santuário
      positions[i * 3 + 0] = (Math.random() - 0.5) * 4.8;
      positions[i * 3 + 1] = Math.random() * 4.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6.4;

      scales[i] = 0.55 + Math.random() * 1.45;
      speeds[i] = 0.08 + Math.random() * 0.16;
      phases[i] = Math.random() * Math.PI * 2;
      colorMix[i] = Math.random() > 0.52 ? 1.0 : 0.0; // ouro vs ciano
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aColorMix', new THREE.BufferAttribute(colorMix, 1));

    const u = {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uColorGold: { value: new THREE.Color('#f2d28b') },
      uColorCyan: { value: new THREE.Color('#38d9f5') },
    };

    return { geometry: geo, uniforms: u };
  }, [count, gl]);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += Math.min(delta, 0.05);
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={arcaneParticlesVertexShader}
        fragmentShader={arcaneParticlesFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
