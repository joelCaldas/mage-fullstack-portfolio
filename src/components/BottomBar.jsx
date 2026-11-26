import React from 'react';
import { Upload } from 'lucide-react';
import { PROFILE, STATIONS } from '../data/portfolioData.js';

/**
 * Rodapé editorial discreto com coordenadas da estação atual, contato
 * e botão sutil de upload de .glb local para testes rápidos de novos modelos.
 */
export default function BottomBar({ activeStation, onUploadGlb }) {
  const st = STATIONS[activeStation] || STATIONS.inicio;

  return (
    <footer className="hud-bottom-bar">
      <span>
        {st.code} // {st.landmark.toUpperCase()} · CLIP BLENDER: {st.blenderClip}
      </span>

      <div className="hud-bottom-right">
        <a href={`mailto:${PROFILE.email}`} className="hud-bottom-link" data-magnetic="true">
          {PROFILE.email}
        </a>
        <label className="glb-upload-pill" data-magnetic="true" title="Carregar .glb local para teste rápido">
          <Upload size={11} />
          <span>TESTAR .GLB LOCAL</span>
          <input
            type="file"
            accept=".glb,.gltf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadGlb(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </footer>
  );
}
