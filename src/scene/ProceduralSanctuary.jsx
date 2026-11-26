import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Fallback 3D procedural de alta qualidade caso algum .glb esteja ausente ou falhe.
 * Mantém exatamente as 4 estações físicas, círculo rúnico emissivo, servidores ciano e mago estilizado.
 */
export default function ProceduralSanctuary({ onSelectStation }) {
  const ringRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.22;
    if (innerRef.current) innerRef.current.rotation.z = -t * 0.35;
  });

  return (
    <group name="Procedural_Sanctuary_Fallback">
      {/* Piso de pedra obsidiana */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#0b101e" roughness={0.75} metalness={0.2} />
      </mesh>

      {/* Círculo rúnico central emissivo */}
      <group position={[0.02, 0.015, 0.78]}>
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.92, 1.04, 64]} />
          <meshBasicMaterial color="#f2d28b" side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <mesh ref={innerRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.58, 0.64, 48]} />
          <meshBasicMaterial color="#38d9f5" side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>

      {/* Estante de Grimórios (Esquerda) */}
      <mesh position={[-2.2, 1.6, 1.8]} onClick={() => onSelectStation?.('grimorio')}>
        <boxGeometry args={[0.55, 3.2, 2.6]} />
        <meshStandardMaterial color="#181c2e" roughness={0.8} />
      </mesh>

      {/* Mesa de Missões + Servidores (Fundo Esquerda) */}
      <group position={[-1.15, 0, -1.85]} onClick={() => onSelectStation?.('missoes')}>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[1.4, 0.84, 0.85]} />
          <meshStandardMaterial color="#211b19" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.08, -0.15]}>
          <boxGeometry args={[0.95, 0.42, 0.04]} />
          <meshBasicMaterial color="#38d9f5" toneMapped={false} />
        </mesh>
      </group>

      {/* Racks de Servidores com LEDs ciano */}
      {[0.36, 1.48].map((sx, idx) => (
        <group key={idx} position={[sx, 1.05, -2.3]}>
          <mesh>
            <boxGeometry args={[0.72, 2.1, 0.72]} />
            <meshStandardMaterial color="#0e1424" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.15, 0.37]}>
            <planeGeometry args={[0.5, 1.5]} />
            <meshBasicMaterial color="#38d9f5" wireframe toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Altar Acadêmico (Fundo Direita) */}
      <mesh position={[0.94, 0.58, -2.2]} onClick={() => onSelectStation?.('qualificacoes')}>
        <boxGeometry args={[0.68, 1.16, 0.58]} />
        <meshStandardMaterial color="#2a1e18" roughness={0.65} />
      </mesh>

      {/* Estante de Pergaminhos (Direita) */}
      <mesh position={[2.2, 1.6, 1.5]} onClick={() => onSelectStation?.('pergaminhos')}>
        <boxGeometry args={[0.55, 3.2, 2.6]} />
        <meshStandardMaterial color="#181c2e" roughness={0.8} />
      </mesh>
    </group>
  );
}
