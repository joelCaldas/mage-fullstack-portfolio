/**
 * Dados centralizados do Portfólio 3D Interativo — Joel Caldas França
 * Arquimago Full-Stack & Arquiteto de Sistemas (Techno-Mage)
 *
 * Mantém todo o conteúdo editorial, coordenadas 3D das estações e nomes
 * dos clipes de animação exportados do Blender em um único ponto de manutenção.
 */

export const PROFILE = {
  name: 'Joel Caldas França',
  shortName: 'Joel Caldas',
  title: 'Arquimago Full-Stack & Arquiteto de Sistemas',
  archetype: 'Techno-Mage · Engenharia Full-Stack, IA Local & IoT',
  location: 'Belém, PA — Brasil',
  email: 'joelcaldas123@gmail.com',
  github: 'https://github.com/joelCaldas',
  repo: 'https://github.com/joelCaldas/mage-fullstack-portfolio',
  bio: 'Sistemas sob medida em Node.js, Python e Mobile, IA local em GPU/Vulkan (Ollama & Gemma 4), infraestrutura resiliente Zero-Cost e hardware IoT — unindo arquitetura de sistemas à magia do código.',
  level: 25,
  stats: {
    hp: {
      code: 'HP',
      label: 'Disponibilidade',
      detail: 'Disposição Máxima',
      current: 100,
      max: 100,
      color: 'ruby',
    },
    mp: {
      code: 'MP',
      label: 'Mana de IA & Código',
      detail: 'Full-Stack & IA Local',
      current: 98,
      max: 100,
      color: 'cyan',
    },
    xp: {
      code: 'XP',
      label: 'Jornada & Formação',
      detail: 'Nv. 25 · 78%',
      level: 25,
      percent: 78,
      color: 'gold',
      milestones: [
        { id: 'cursos', label: 'Cursos 720h', status: 'done' },
        { id: 'bacharelado', label: 'Bacharelado', status: 'active' },
        { id: 'pos', label: 'Pós IA', status: 'active' },
        { id: 'mestrado-doutorado', label: 'Mest. / Dout.', status: 'future' },
      ],
    },
  },
};

/**
 * Estações 3D do Santuário — coordenadas calibradas em espaço Three.js (Y-up)
 * diretamente a partir de cena_completa_mago_dev_joel.blend (Blender Z-up → glTF Y-up: x'=x, y'=z, z'=-y).
 *
 * Cada estação define:
 * - cameraPos / cameraTarget: enquadramento cinematográfico GSAP (Regra dos Terços)
 * - magePos / mageRotY: destino para onde o personagem gira e levita/caminha
 * - blenderClip: clipe NLA exportado pelo Blender dentro de mago_joel.glb
 * - hotspotPos: posição 3D do marcador clicável com raycasting
 */
export const STATIONS = {
  inicio: {
    id: 'inicio',
    code: 'SEC 00',
    navLabel: 'Início',
    landmark: 'Círculo Rúnico Central',
    panelSide: 'left',
    accent: '#d8b268',
    cameraPos: [0.35, 1.52, 3.65],
    cameraTarget: [-0.32, 1.02, 0.78],
    magePos: [0.02, 0.0, 0.78],
    mageRotY: 0,
    blenderClip: 'Idle_Inicio',
    hotspotPos: [0.02, 1.95, 0.78],
    mpCost: 0,
  },
  grimorio: {
    id: 'grimorio',
    code: 'SEC 01',
    navLabel: 'Grimório',
    landmark: 'Estante de Grimórios',
    panelSide: 'right',
    accent: '#38d9f5',
    cameraPos: [0.55, 1.54, 3.15],
    cameraTarget: [-0.65, 1.15, 0.65],
    magePos: [-1.05, 0.0, 1.15],
    mageRotY: 0.75,
    blenderClip: 'Cast_Grimorio',
    hotspotPos: [-1.92, 1.38, 1.95],
    mpCost: 6,
  },
  missoes: {
    id: 'missoes',
    code: 'SEC 02',
    navLabel: 'Missões',
    landmark: 'Mesa de Missões & Servidores',
    panelSide: 'right',
    accent: '#38d9f5',
    cameraPos: [0.55, 1.56, 1.45],
    cameraTarget: [-0.32, 1.10, -1.65],
    magePos: [-0.72, 0.0, -0.82],
    mageRotY: 2.55,
    blenderClip: 'Cast_Missoes',
    hotspotPos: [-1.15, 1.25, -1.82],
    mpCost: 7,
  },
  qualificacoes: {
    id: 'qualificacoes',
    code: 'SEC 03',
    navLabel: 'Qualificações',
    landmark: 'Altar da Academia',
    panelSide: 'right',
    accent: '#f2d28b',
    cameraPos: [-0.65, 1.62, 1.55],
    cameraTarget: [0.85, 1.12, -1.95],
    magePos: [0.52, 0.0, -1.05],
    mageRotY: -2.45,
    blenderClip: 'Cast_Qualificacoes',
    hotspotPos: [0.94, 1.38, -2.18],
    mpCost: 5,
  },
  pergaminhos: {
    id: 'pergaminhos',
    code: 'SEC 04',
    navLabel: 'Pergaminhos',
    landmark: 'Estante de Pergaminhos',
    panelSide: 'right',
    accent: '#f2d28b',
    cameraPos: [-0.75, 1.48, 3.05],
    cameraTarget: [0.78, 1.15, 0.52],
    magePos: [1.05, 0.0, 1.05],
    mageRotY: -0.78,
    blenderClip: 'Cast_Pergaminhos',
    hotspotPos: [1.85, 1.45, 1.65],
    mpCost: 5,
  },
};

export const NAV_ORDER = ['inicio', 'grimorio', 'missoes', 'qualificacoes', 'pergaminhos'];

export const GRIMOIRES = [
  {
    id: 'grimorio-1',
    roman: 'I',
    title: 'Full-Stack & Mobile',
    school: 'Escola da Arquitetura Web & Mobile',
    mastery: 96,
    accent: '#38d9f5',
    summary:
      'Construção ponta a ponta de plataformas web responsivas, APIs robustas em Node.js e Python e aplicativos móveis Android nativos e React Native (Expo) em produção.',
    skills: [
      'JavaScript (ES6+)',
      'Node.js',
      'Python',
      'React Native (Expo)',
      'HTML5',
      'CSS3',
      'PHP',
      'Java (POO)',
      'Android',
    ],
  },
  {
    id: 'grimorio-2',
    roman: 'II',
    title: 'IA Local & Automações',
    school: 'Escola da Conjuração Neural Local',
    mastery: 94,
    accent: '#a78bfa',
    summary:
      'Orquestração de LLMs locais com aceleração Vulkan/GPU sem custos de API externa, integrados a bots conversacionais e fluxos autônomos no WhatsApp.',
    skills: ['Ollama', 'Gemma 2', 'Gemma 4 (Vulkan)', 'Bots WhatsApp com Baileys', 'Pipelines IA Locais'],
  },
  {
    id: 'grimorio-3',
    roman: 'III',
    title: 'Escudos, Infra & Segurança',
    school: 'Escola das Barreiras & Cidadelas',
    mastery: 92,
    accent: '#34d399',
    summary:
      'Administração de servidores Windows e Linux, proteção de perímetro com Cloudflare WAF/Tunnels, autenticação blindada e governança alinhada à Tríade CIA e LGPD.',
    skills: [
      'Windows Server 2025 (AD DS, DNS)',
      'Linux (Mint XFCE, Lubuntu)',
      'Cloudflare (Tunnels, WAF, IP/ASN)',
      'JWT HTTP-only',
      'Device Fingerprinting',
      'Tríade CIA',
      'LGPD',
    ],
  },
  {
    id: 'grimorio-4',
    roman: 'IV',
    title: 'Forja Hardware & IoT',
    school: 'Escola dos Artefatos Físicos & Telemetria',
    mastery: 90,
    accent: '#f2d28b',
    summary:
      'Prototipagem eletrônica e sistemas embarcados autônomos com microcontroladores ESP32, biometria, sensores ópticos/de carga, energia solar e fabricação por impressão 3D.',
    skills: [
      'ESP32 / ESP32-S3',
      'Sensor Biométrico R307',
      'Células de Carga HX711',
      'ToF VL53L0X',
      'Câmera OV2640',
      'Energia Solar / LiFePO4',
      'Impressão 3D',
    ],
  },
  {
    id: 'grimorio-5',
    roman: 'V',
    title: 'Oráculo de Dados & Big Data',
    school: 'Escola da Modelagem & Inteligência Territorial',
    mastery: 91,
    accent: '#38d9f5',
    summary:
      'Modelagem relacional e NoSQL, engenharia analítica em Python e cruzamento de grandes bases públicas georreferenciadas para tomada de decisão estratégica.',
    skills: ['MySQL', 'MongoDB', 'Firebase', 'UML', 'Big Data em Python', 'Bases Georreferenciadas (TSE/IBGE)'],
  },
];

export const MISSIONS = [
  {
    id: 'missao-1',
    rank: 'Missão Lendária',
    rankColor: '#f2d28b',
    title: 'Instituto Raimundo Farah (IRF / Farahzinhos)',
    location: 'Belém, PA',
    role: 'Desenvolvedor Líder, Admin de Sistemas e Diretor de Projetos',
    summary:
      'Liderança técnica e operacional de todo o ecossistema digital, infraestrutura corporativa e programas de inclusão tecnológica do instituto.',
    highlights: [
      'Ecossistema Node.js / MySQL e portal institucional "O Farahzinho"',
      'App Android em React Native / Expo (com.instituto.farahzinhosapp)',
      'Atendimento inteligente via WhatsApp Baileys + Gemma 4 / Ollama local',
      'Emissão de credenciais físicas com impressoras Entrust SD260 / PX30',
      'Análise territorial com bigdata_tse_ibge e programa Impulso Digital',
      'Infraestrutura Windows Server 2025 (AD DS) protegida com Cloudflare WAF',
    ],
    tags: [
      'Node.js',
      'MySQL',
      'React Native (Expo)',
      'WhatsApp Baileys',
      'Gemma 4 / Ollama',
      'Entrust SD260/PX30',
      'bigdata_tse_ibge',
      'Win Server 2025 AD DS',
      'Cloudflare WAF',
    ],
  },
  {
    id: 'missao-2',
    rank: 'Missão Lendária',
    rankColor: '#f2d28b',
    title: 'Instituto ISTI',
    location: 'Belém, PA',
    role: 'Fundador e Diretor-Presidente',
    summary:
      'Iniciativa de inovação socioambiental e tecnologia urbana combinando software próprio, hardware embarcado solar e monitoramento de infraestrutura pública.',
    highlights: [
      'Portal institucional e sistema administrativo sob medida (ISTIADMINs.html / ServerISTI.js)',
      'Totem Eco-Blindado: lixeira inteligente autônoma com energia solar e telemetria',
      'Projetos de redes de proteção de canais urbanos',
      'Sensores urbanos inteligentes para alerta e prevenção anti-alagamento',
    ],
    tags: ['ServerISTI.js', 'ISTIADMINs.html', 'Totem Eco-Blindado', 'Energia Solar', 'ESP32 IoT', 'Sensores Anti-Alagamento'],
  },
  {
    id: 'missao-3',
    rank: 'Missão Épica',
    rankColor: '#38d9f5',
    title: 'GENI DIGITAL SUPPORT & AR Modulados',
    location: 'Belém, PA',
    role: 'Fundador & Consultor de Engenharia',
    summary:
      'Consultoria especializada em sistemas sob medida, chatbots com IA, IoT e experiências Google 360 — com entrega completa de transformação digital na AR Modulados.',
    highlights: [
      'ERP customizado e e-commerce integrados sob medida para a AR Modulados',
      'Assistente comercial no WhatsApp com IA integrada ao catálogo e atendimento',
      'Checkout automatizado via Mercado Pago',
      'Sistema de ponto eletrônico biométrico próprio (ESP32 + R307)',
      'Projetos comerciais de tour virtual Google 360 e automações sob demanda',
    ],
    tags: ['ERP Customizado', 'E-commerce', 'IA WhatsApp', 'Mercado Pago', 'ESP32 + R307', 'Google 360'],
  },
  {
    id: 'missao-4',
    rank: 'Missão Passiva',
    rankColor: '#34d399',
    title: 'Arquitetura Zero-Cost & Open-Source',
    location: 'Infraestrutura Autônoma',
    role: 'Arquiteto de Sistemas & Soberania Tecnológica',
    summary:
      'Filosofia contínua de engenharia focada em eliminar custos recorrentes de APIs proprietárias por meio de alternativas abertas, rápidas e auto-hospedadas.',
    highlights: [
      'Substituição de APIs comerciais de mapas e CEP por OpenStreetMap e ViaCEP',
      'Exposição segura e proteção DDoS/WAF via Cloudflare Tunnels sem IP público exposto',
      'Clusters e servidores locais multi-CPU com inferência IA local e controle total de dados',
      'Redução drástica de OPEX mantendo alta disponibilidade e conformidade LGPD',
    ],
    tags: ['OpenStreetMap', 'ViaCEP', 'Cloudflare Tunnels', 'Self-Hosted Multi-CPU', 'Open-Source', 'Zero-Cost'],
  },
];

export const QUALIFICATIONS = [
  {
    id: 'qual-1',
    tier: '01 · Graduação',
    degree: 'Bacharelado em Sistemas de Informação',
    institution: 'FACI Wyden — Belém, PA',
    period: 'Conclusão prevista: 2026',
    status: 'Em Conclusão',
    statusTone: 'gold',
    progress: 92,
    description:
      'Formação superior em engenharia de software, banco de dados, redes, segurança da informação, matemática computacional e gestão de sistemas corporativos — com 3 certificações intermediárias já conquistadas (720h).',
  },
  {
    id: 'qual-2',
    tier: '02 · Pós-Graduação',
    degree: 'Especialização em Engenharia de IA Aplicada',
    institution: 'UNIPDS',
    period: '2026',
    status: 'Em Andamento',
    statusTone: 'cyan',
    progress: 55,
    description:
      'Aprofundamento prático em arquiteturas de LLMs, agentes autônomos, RAG, inferência local otimizada, visão computacional e implantação de soluções de IA em produção.',
  },
  {
    id: 'qual-3',
    tier: '03 · Mestrado',
    degree: 'Trilha de Pesquisa em IA & Sistemas Distribuídos',
    institution: 'Próxima Etapa Acadêmica',
    period: 'Planejado',
    status: 'Próxima Jornada',
    statusTone: 'violet',
    progress: 18,
    description:
      'Linha de pesquisa voltada a modelos de linguagem eficientes em borda (Edge AI), sistemas distribuídos resilientes de baixo custo e telemetria urbana inteligente.',
  },
  {
    id: 'qual-4',
    tier: '04 · Doutorado',
    degree: 'Grão-Mestre em Computação Aplicada',
    institution: 'Horizonte Científico',
    period: 'Visão de Longo Prazo',
    status: 'Trilha Futura',
    statusTone: 'muted',
    progress: 6,
    description:
      'Consolidação científica e liderança em pesquisa aplicada unindo Inteligência Artificial, arquitetura de sistemas soberanos e impacto socioambiental.',
  },
];

export const SCROLLS = [
  {
    id: 'pergaminho-1',
    title: 'Programação para Dispositivos Móveis',
    institution: 'FACI Wyden',
    date: '05/07/2026',
    hours: 240,
    validationCode: 'bdec07c8a469cf2c77faee7',
    validationUrl: 'https://certificado.facieducacional.com.br/bdec07c8a469cf2c77faee7',
    disciplines: [
      { code: 'ARA0062', name: 'Desenvolvimento Web em HTML5, CSS, JavaScript, PHP', period: '2024.1', hours: 80 },
      { code: 'ARA0075', name: 'Programação Orientada a Objetos em Java', period: '2025.2', hours: 80 },
      { code: 'ARA0089', name: 'Programação para Dispositivos Móveis em Android', period: '2026.1', hours: 80 },
    ],
  },
  {
    id: 'pergaminho-2',
    title: 'Desenvolvimento de Soluções de Big Data Analytics',
    institution: 'FACI Wyden',
    date: '05/07/2026',
    hours: 240,
    validationCode: '9097f00764546867c16482b',
    validationUrl: 'https://certificado.facieducacional.com.br/9097f00764546867c16482b',
    disciplines: [
      { code: 'ARA0087', name: 'Métodos Quantitativos', period: '2025.1', hours: 80 },
      { code: 'ARA0105', name: 'Matemática e Lógica', period: '2026.1', hours: 80 },
      { code: 'ARA0168', name: 'Tópicos de Big Data em Python', period: '2024.2', hours: 80 },
    ],
  },
  {
    id: 'pergaminho-3',
    title: 'Programação para Internet',
    institution: 'FACI Wyden',
    date: '29/06/2024',
    hours: 240,
    validationCode: 'aa8ed2d265792deab186bf9',
    validationUrl: 'https://certificado.facieducacional.com.br/aa8ed2d265792deab186bf9',
    disciplines: [
      { code: 'ARA0017', name: 'Introdução à Programação de Computadores', period: '2023.1', hours: 80 },
      { code: 'ARA0062', name: 'Desenvolvimento Web em HTML5, CSS, JavaScript, PHP', period: '2024.1', hours: 80 },
      { code: 'ARA0066', name: 'Paradigmas de Linguagens de Programação em Python', period: '2023.2', hours: 80 },
    ],
  },
];

export const TOTAL_CERTIFIED_HOURS = SCROLLS.reduce((acc, s) => acc + s.hours, 0);
