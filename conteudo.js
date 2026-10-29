/*
  CONTEÚDO DO PORTFÓLIO — edite só este arquivo.

  - Textos com `provisorio: true` aparecem com o selo "Texto provisório".
    Quando escrever o texto definitivo, apague o `provisorio: true` dele.
  - Quando não houver mais nada provisório, troque `marcarProvisorios` para false.
  - Campos vazios ("") simplesmente não aparecem no site.

  COMO ADICIONAR UM VÍDEO A UM PROJETO (veja também LEIA-ME-VIDEOS.md):
    Arquivo local:  video: { arquivo: "midia/videos/nome-do-arquivo.mp4" }
    YouTube/Vimeo:  video: { link: "https://www.youtube.com/watch?v=XXXX" }
    Outro site:     video: { link: "https://..." }   (abre em nova aba)
    Capa (opcional, recomendada): capa: "midia/capas/nome-da-capa.jpg"
    Formato do vídeo: formato: "horizontal" (16:9) | "vertical" (9:16) | "quadrado" (1:1)
*/
window.CONTEUDO = {
  marcarProvisorios: true,

  pessoa: {
    nome: "Gustavo Thyers",
    atuacao: "Edição de vídeo e motion",
    // Texto do adesivo sobre a foto da abertura
    etiqueta: "Editor de vídeo",
    apresentacao: {
      texto: "Corte, ritmo e movimento para vídeos de marcas e criadores. Escreva aqui, em uma ou duas frases, o que você edita e para quem.",
      provisorio: true
    },
    email: "gustavothyers@gmail.com",
    // Preencha a url para o link aparecer. Links vazios não são exibidos.
    redes: [
      { nome: "Instagram", url: "" },
      { nome: "YouTube", url: "" },
      { nome: "Behance", url: "" },
      { nome: "LinkedIn", url: "" }
    ]
  },

  fotos: {
    abertura: { arquivo: "midia/fotos/retrato-azul", larguras: [480, 928], alt: "Retrato de Gustavo Thyers sobre fundo azul, com uma faixa de luz no rosto" },
    sobre:    { arquivo: "midia/fotos/retrato-concreto", larguras: [480, 816], alt: "Gustavo Thyers de blazer escuro diante de uma parede de concreto iluminada pelo sol" },
    contato:  { arquivo: "midia/fotos/retrato-pb", larguras: [480, 816], alt: "Retrato em preto e branco de Gustavo Thyers usando óculos escuros" }
  },

  sobre: {
    texto: {
      texto: "Sou editor de vídeo há 5 anos, especialista em edição dinâmica que prende a atenção e faz marcas crescerem. Também atuo como motion designer e colorista, então cuido do vídeo do corte ao acabamento final. Já entreguei mais de 500 vídeos, de YouTube a Reels, para clientes em 4 países e nichos que vão de salão de beleza a trailer de cinema. Atualmente, o mercado imobiliário é a demanda mais frequente, mas sou versátil e faço qualquer estilo de vídeo, sempre pensando em reter o espectador até o fim."
    },
    // Trechos do texto acima que ganham um traço âmbar (precisam estar escritos igual ao texto).
    destaques: ["edição dinâmica que prende a atenção", "do corte ao acabamento final", "reter o espectador até o fim"],
    // Números em destaque abaixo do texto; contam a partir do zero quando aparecem. Lista vazia = não aparece.
    numeros: [
      { numero: "5", rotulo: "anos editando" },
      { numero: "+500", rotulo: "vídeos entregues" },
      { numero: "4", rotulo: "países atendidos" }
    ],
    // Ex.: ["Premiere Pro", "After Effects", "DaVinci Resolve"]. Lista vazia mostra um aviso de pendência.
    ferramentas: [],
    // Ex.: "Disponível para projetos remotos" ou "São Paulo, SP". Vazio = não aparece.
    disponibilidade: ""
  },

  contato: {
    chamada: "Tem um vídeo para editar?",
    texto: "Mande o briefing, o prazo e o material bruto que você já tem. Eu respondo por e-mail."
  },

  // Textos usados só na versão em cartas (cartas.html)
  cartas: {
    // linha de tipo da carta principal (a sua), entre colchetes
    tipoHeroi: "Editor de vídeo / Motion designer / Colorista"
  },

  // 4 categorias × 3 projetos. Os nomes das categorias são provisórios: renomeie à vontade.
  categorias: [
    {
      id: "redes",
      nome: "Reels e conteúdo para redes",
      descricao: { texto: "Vídeos curtos e verticais para Instagram, TikTok e Shorts.", provisorio: true },
      projetos: [
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "vertical", capa: "", video: null },
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "vertical", capa: "", video: null },
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "vertical", capa: "", video: null }
      ]
    },
    {
      id: "publicidade",
      nome: "Publicidade e campanhas",
      descricao: { texto: "Peças comerciais e vídeos de campanha para marcas.", provisorio: true },
      projetos: [
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null },
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null },
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null }
      ]
    },
    {
      id: "motion",
      nome: "Motion design",
      descricao: { texto: "Animação de tipografia, vinhetas e elementos gráficos.", provisorio: true },
      projetos: [
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null },
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null },
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null }
      ]
    },
    {
      id: "eventos",
      nome: "Eventos e aftermovies",
      descricao: { texto: "Cobertura e montagem de eventos, shows e bastidores.", provisorio: true },
      projetos: [
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null },
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null },
        { titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null }
      ]
    }
  ]
};
