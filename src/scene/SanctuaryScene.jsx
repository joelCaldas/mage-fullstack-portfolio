import React, { Component, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import SanctuaryEnvironment from './SanctuaryEnvironment.jsx';
import MageCharacter from './MageCharacter.jsx';
import StationArtifacts from './StationArtifacts.jsx';
import ArcaneParticles from './ArcaneParticles.jsx';
import CameraRig from './CameraRig.jsx';
import ProceduralSanctuary from './ProceduralSanctuary.jsx';
import { assetUrl } from '../utils/assetUrl.js';

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Cena 3D full-bleed (100vw × 100vh) com:
 * - Névoa exponencial atmosférica (FogExp2 #070912)
 * - Iluminação cinematográfica equilibrada (lua fria + lanternas douradas + monitores ciano)
 * - Partículas arcanas em GPU (GLSL)
 * - Pós-processamento: Selective Bloom + Vignette + Film Grain sutil
 * - 60 FPS constantes com dpr limitado [1, 2]
 */
export default function SanctuaryScene({
  activeStation,
  arrivedStation,
  carouselIndex,
  entered,
  customEnvUrl,
  customMageUrl,
  onSelectStation,
  onPhaseChange,
  onArrived,
  onHoverInteractive,
}) {
  const envUrl = customEnvUrl || assetUrl('models/ambiente_mago_dev_joel.glb');
  const mageUrl = customMageUrl || assetUrl('models/mago_joel.glb');

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <Canvas
        dpr={[1, 2]}
        shadows="percentage"
        camera={{ fov: 44, near: 0.1, far: 45, position: [0.42, 1.85, 4.35] }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
      >
        <color attach="background" args={['#070912']} />
        <fogExp2 attach="fog" args={['#070912', 0.082]} />

        {/* Iluminação cinematográfica inspirada no cena_completa_mago_dev_joel.blend */}
        <ambientLight intensity={0.45} color="#7ea3cc" />
        <hemisphereLight args={['#527ca8', '#14101d', 0.65]} />

        {/* Feixe frio de luar vindo do arco gótico superior */}
        <directionalLight
          position={[0.4, 4.8, -1.2]}
          intensity={1.25}
          color="#a8d5ff"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0004}
        />

        {/* Lanternas quentes (dourado âmbar) esquerda e direita */}
        <pointLight position={[-1.45, 2.35, -1.45]} color="#ffbe6b" intensity={4.8} distance={7.5} decay={2} />
        <pointLight position={[1.32, 2.42, 0.95]} color="#ffb75e" intensity={5.2} distance={7.5} decay={2} />

        {/* Brilho ciano dos monitores, servidores e cristais das estantes */}
        <pointLight position={[-1.15, 1.25, -1.65]} color="#38d9f5" intensity={3.6} distance={5.8} decay={2} />
        <pointLight position={[0.92, 1.35, -1.85]} color="#38d9f5" intensity={3.2} distance={5.8} decay={2} />
        <pointLight position={[-1.85, 1.95, 1.92]} color="#38d9f5" intensity={2.4} distance={4.5} decay={2} />
        <pointLight position={[1.82, 1.88, 1.90]} color="#38d9f5" intensity={2.4} distance={4.5} decay={2} />

        {/* Brilho dourado ascendente do Círculo Rúnico no piso */}
        <pointLight position={[0.02, 0.25, 0.78]} color="#f2c46d" intensity={3.4} distance={4.2} decay={2} />

        {/* Coreografia GSAP + Micro-paralaxe de Câmera */}
        <CameraRig activeStation={activeStation} entered={entered} />

        {/* Ambiente 3D (com fallback procedural automático) */}
        <ModelErrorBoundary
          resetKey={envUrl}
          fallback={<ProceduralSanctuary onSelectStation={onSelectStation} />}
        >
          <Suspense fallback={<ProceduralSanctuary onSelectStation={onSelectStation} />}>
            <SanctuaryEnvironment
              modelUrl={envUrl}
              activeStation={activeStation}
              onSelectStation={onSelectStation}
              onHoverInteractive={onHoverInteractive}
            />
          </Suspense>
        </ModelErrorBoundary>

        {/* Personagem 3D Joel Dev com AnimationMixer (6 clipes do Blender) + Coreografia GSAP */}
        <ModelErrorBoundary resetKey={mageUrl} fallback={null}>
          <Suspense fallback={null}>
            <MageCharacter
              modelUrl={mageUrl}
              activeStation={activeStation}
              onPhaseChange={onPhaseChange}
              onArrived={onArrived}
            />
          </Suspense>
        </ModelErrorBoundary>

        {/* Artefatos 3D animados de cada estação (Grimório abrindo, Holograma, Orbes, Pergaminho desenrolando) */}
        <StationArtifacts
          activeStation={activeStation}
          arrivedStation={arrivedStation}
          carouselIndex={carouselIndex}
        />

        {/* Partículas mágicas em GPU (Shader GLSL customizado) */}
        <ArcaneParticles count={260} />

        {/* Pós-processamento cinematográfico: Selective Bloom + Vignette + Film Grain */}
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.22} intensity={0.72} />
          <Vignette offset={0.24} darkness={0.56} blendFunction={BlendFunction.NORMAL} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.18} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
