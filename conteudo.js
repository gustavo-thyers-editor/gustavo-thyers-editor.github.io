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

  // Uma categoria por pasta em midia/videos/ (gerado por ferramentas/montar-categorias.py).
  // Pode editar títulos, clientes, anos e descrições aqui: rodar o script de novo mantém o que você escreveu.
  categorias: [
    {
      "id": "esportes",
      "nome": "Esportes",
      "descricao": "",
      "projetos": [
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "horizontal",
          "duracao": 37.9,
          "capa": "midia/videos/web/esportes/video-pronto-1.jpg",
          "video": {
            "arquivo": "midia/videos/web/esportes/video-pronto-1.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "horizontal",
          "duracao": 51.7,
          "capa": "midia/videos/web/esportes/video-pronto.jpg",
          "video": {
            "arquivo": "midia/videos/web/esportes/video-pronto.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 47.1,
          "capa": "midia/videos/web/esportes/video-pronto-hybrid-v2.jpg",
          "video": {
            "arquivo": "midia/videos/web/esportes/video-pronto-hybrid-v2.mp4"
          }
        }
      ]
    },
    {
      "id": "imobiliario",
      "nome": "Imobiliário",
      "descricao": "",
      "projetos": [
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 98.8,
          "capa": "midia/videos/web/imobiliario/video-bruno.jpg",
          "video": {
            "arquivo": "midia/videos/web/imobiliario/video-bruno.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 64.8,
          "capa": "midia/videos/web/imobiliario/video-pronto-1-erincheira.jpg",
          "video": {
            "arquivo": "midia/videos/web/imobiliario/video-pronto-1-erincheira.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "horizontal",
          "duracao": 68.2,
          "capa": "midia/videos/web/imobiliario/video-pronto-3.jpg",
          "video": {
            "arquivo": "midia/videos/web/imobiliario/video-pronto-3.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 60.9,
          "capa": "midia/videos/web/imobiliario/video-pronto.jpg",
          "video": {
            "arquivo": "midia/videos/web/imobiliario/video-pronto.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "horizontal",
          "duracao": 101.7,
          "capa": "midia/videos/web/imobiliario/video-pronto2.jpg",
          "video": {
            "arquivo": "midia/videos/web/imobiliario/video-pronto2.mp4"
          }
        }
      ]
    },
    {
      "id": "restaurantes",
      "nome": "Restaurantes",
      "descricao": "",
      "projetos": [
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 24.0,
          "capa": "midia/videos/web/restaurantes/saveinta-com-aqmskep81pbubuvt-cy4-kqu6vdmb0hvibi.jpg",
          "video": {
            "arquivo": "midia/videos/web/restaurantes/saveinta-com-aqmskep81pbubuvt-cy4-kqu6vdmb0hvibi.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 17.7,
          "capa": "midia/videos/web/restaurantes/saveinta-com-aqnlwawj37knkb5j-ubzalpevolhlt0f82z.jpg",
          "video": {
            "arquivo": "midia/videos/web/restaurantes/saveinta-com-aqnlwawj37knkb5j-ubzalpevolhlt0f82z.mp4"
          }
        }
      ]
    },
    {
      "id": "salao-e-barbearia",
      "nome": "Salão e barbearia",
      "descricao": "",
      "projetos": [
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "horizontal",
          "duracao": 60.6,
          "capa": "midia/videos/web/salao-e-barbearia/video-pronto-salao-2.jpg",
          "video": {
            "arquivo": "midia/videos/web/salao-e-barbearia/video-pronto-salao-2.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "horizontal",
          "duracao": 60.8,
          "capa": "midia/videos/web/salao-e-barbearia/video-pronto-salao-3.jpg",
          "video": {
            "arquivo": "midia/videos/web/salao-e-barbearia/video-pronto-salao-3.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "horizontal",
          "duracao": 64.9,
          "capa": "midia/videos/web/salao-e-barbearia/video-pronto-salao.jpg",
          "video": {
            "arquivo": "midia/videos/web/salao-e-barbearia/video-pronto-salao.mp4"
          }
        }
      ]
    },
    {
      "id": "talk-head",
      "nome": "Talk Head",
      "descricao": "",
      "projetos": [
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 24.2,
          "capa": "midia/videos/web/talk-head/criativo-3.jpg",
          "video": {
            "arquivo": "midia/videos/web/talk-head/criativo-3.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 23.1,
          "capa": "midia/videos/web/talk-head/criativo-pronto-2.jpg",
          "video": {
            "arquivo": "midia/videos/web/talk-head/criativo-pronto-2.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 45.0,
          "capa": "midia/videos/web/talk-head/criativo-pronto-4.jpg",
          "video": {
            "arquivo": "midia/videos/web/talk-head/criativo-pronto-4.mp4"
          }
        },
        {
          "titulo": "",
          "cliente": "",
          "ano": "",
          "descricao": "",
          "formato": "vertical",
          "duracao": 35.2,
          "capa": "midia/videos/web/talk-head/criativo-pronto-5.jpg",
          "video": {
            "arquivo": "midia/videos/web/talk-head/criativo-pronto-5.mp4"
          }
        }
      ]
    }
  ]
};
