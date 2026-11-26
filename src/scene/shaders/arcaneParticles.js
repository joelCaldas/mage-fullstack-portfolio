/**
 * Shaders GLSL customizados para partículas arcanas em GPU:
 * poeira dourada e faíscas ciano subindo suavemente pelo santuário.
 */

export const arcaneParticlesVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aColorMix;

  varying float vAlpha;
  varying float vColorMix;

  void main() {
    vec3 pos = position;

    // Loop vertical contínuo de y = 0.05 até y = 4.25
    float cycle = mod(pos.y + uTime * aSpeed, 4.2);
    pos.y = cycle + 0.05;

    // Deriva orgânica senoidal em X e Z
    pos.x += sin(uTime * 0.45 + aPhase + cycle * 1.1) * 0.14;
    pos.z += cos(uTime * 0.38 + aPhase * 1.3 + cycle * 0.9) * 0.14;

    // Fade suave na base e no topo da coluna de ar
    float fadeIn = smoothstep(0.05, 0.65, pos.y);
    float fadeOut = 1.0 - smoothstep(3.2, 4.2, pos.y);
    float twinkle = 0.62 + 0.38 * sin(uTime * 2.2 + aPhase * 4.0);
    vAlpha = fadeIn * fadeOut * twinkle;
    vColorMix = aColorMix;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aScale * uPixelRatio * (115.0 / max(1.0, -mvPosition.z));
  }
`;

export const arcaneParticlesFragmentShader = /* glsl */ `
  uniform vec3 uColorGold;
  uniform vec3 uColorCyan;

  varying float vAlpha;
  varying float vColorMix;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Halo radial suave com núcleo luminoso para Bloom seletivo
    float core = exp(-dist * dist * 26.0);
    float halo = smoothstep(0.5, 0.0, dist) * 0.55;
    float intensity = core * 1.8 + halo;

    vec3 color = mix(uColorGold, uColorCyan, vColorMix);
    gl_FragColor = vec4(color * 1.6, intensity * vAlpha * 0.85);
  }
`;
