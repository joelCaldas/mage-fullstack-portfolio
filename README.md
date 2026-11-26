# 🧙‍♂️ Joel Caldas França — Techno-Mage 3D Interactive Portfolio

Portfólio 3D interativo cinematográfico desenvolvido com **React Three Fiber**, **Three.js**, **Shaders GLSL**, **GSAP** e pós-processamento seletivo (*Bloom*, *Vignette*, *Film Grain*), unindo a direção de arte editorial minimalista (*Immersive Garden*) ao universo **RPG Mago Arcano da Tecnologia**.

---

## ✨ Destaques Técnicos

- **Cena 3D Full-Bleed (`100vw × 100vh`)** com `FogExp2` (`#070912`), iluminação cinematográfica (luar frio + lanternas âmbar + servidores ciano) e **260 partículas mágicas em GPU** (vertex/fragment GLSL customizados).
- **Modelos Blender Otimizados com Draco + WebP (98,3% menores)**:
  - `public/models/mago_joel.glb` (`1,40 MB`) — rigado com 6 clipes NLA do Blender (`Idle_Inicio`, `Walk_Levitate`, `Cast_Grimorio`, `Cast_Missoes`, `Cast_Qualificacoes`, `Cast_Pergaminhos`).
  - `public/models/ambiente_mago_dev_joel.glb` (`0,82 MB`) — loop `Sanctuary_Ambient` com círculo rúnico contra-rotacionando, livros flutuando e lanternas em balanço.
  - Decoders Draco locais em `public/draco/` (Zero-Cost / sem dependência de CDN externo) + fallback procedural automático + upload de `.glb` local para testes rápidos.
- **Coreografia GSAP + Artefatos 3D Físicos por Estação**:
  - **Grimório (`01 / 05`)**: Joel levita até a estante esquerda e invoca um Grimório 3D articulado que sai da estante e abre suas capas luminosas.
  - **Missões (`01 / 04`)**: Joel caminha até a mesa de servidores e projeta um mapa holográfico tático 3D.
  - **Qualificações (`01 / 04`)**: Joel ativa o Altar Acadêmico elevando um astrolábio e 4 orbes dos graus (Graduação → Pós IA → Mestrado → Doutorado).
  - **Pergaminhos (`01 / 03`)**: Joel retira um pergaminho selado da estante direita que desenrola fisicamente seus rolos 3D revelando os certificados verificados da FACI Wyden (**720h**).
- **UI Editorial & Interações**:
  - Preloader cinematográfico (`0% → 100%`) desbloqueando áudio espacial procedural (Web Audio API).
  - Header HUD RPG com **HP**, **MP dinâmico** (consome ao conjurar e regenera suavemente) e **XP**.
  - Navegação completa por setas, teclado (`←` `→` `ESC`), scroll horizontal, swipe mobile, raycasting 3D e cursor rúnico magnético.
- **Manutenção Centralizada**: todos os dados em [`src/data/portfolioData.js`](src/data/portfolioData.js).

---

## 🚀 Como Executar Localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

---

## 📬 Contato

**Joel Caldas França** — Belém, PA  
📧 `joelcaldas123@gmail.com` · 🐙 [github.com/joelCaldas](https://github.com/joelCaldas)
