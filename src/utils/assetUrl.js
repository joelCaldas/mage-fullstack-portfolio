/**
 * Resolve caminhos de assets em /public tanto em localhost quanto no subdiretório
 * do GitHub Pages (https://joelcaldas.github.io/mage-fullstack-portfolio/).
 */
export function assetUrl(relativePath) {
  const base = import.meta.env.BASE_URL || './';
  const clean = relativePath.replace(/^\/+/, '');
  return `${base}${clean}`;
}

/**
 * Caminho absoluto para os decoders WASM locais do Draco (exigido pelo Web Worker do DRACOLoader).
 */
export function dracoDecoderPath() {
  if (typeof window === 'undefined') return '/draco/';
  return new URL(assetUrl('draco/'), window.location.href).href;
}
