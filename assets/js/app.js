/* Monta o portfólio a partir de window.CONTEUDO (conteudo.js). Sem dependências. */
(function () {
  "use strict";

  var C = window.CONTEUDO;
  if (!C) {
    document.body.insertAdjacentHTML("afterbegin",
      '<p class="sem-js">Não foi possível ler conteudo.js. Verifique se o arquivo existe e não tem erro de digitação (vírgulas, aspas).</p>');
    return;
  }

  var marcar = !!C.marcarProvisorios;
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ponteiroFino = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---------- utilitários ---------- */

  function $(sel) { return document.querySelector(sel); }

  function el(tag, attrs, filhos) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (filhos || []).forEach(function (f) { if (f) n.appendChild(typeof f === "string" ? document.createTextNode(f) : f); });
    return n;
  }

  function caminho(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }

  // Aceita "texto" ou { texto, provisorio }
  function texto(v) { return v == null ? "" : (typeof v === "string" ? v : v.texto || ""); }
  function ehProvisorio(v) { return !!(v && typeof v === "object" && v.provisorio); }

  function selo(rotulo) {
    return el("span", { class: "selo", text: rotulo || "Texto provisório" });
  }

  // Preenche um elemento com texto + selo de provisório, se for o caso
  function preencher(alvo, v) {
    if (!alvo) return;
    alvo.textContent = texto(v);
    if (marcar && ehProvisorio(v)) { alvo.appendChild(document.createTextNode(" ")); alvo.appendChild(selo()); }
  }

  // Envolve trechos exatos do texto em <mark> (o traço âmbar é desenhado pelo CSS)
  function destacar(alvo, frases) {
    if (!alvo) return;
    (frases || []).forEach(function (f, i) {
      if (!f) return;
      for (var n = alvo.firstChild; n; n = n.nextSibling) {
        if (n.nodeType !== 3) continue;
        var pos = n.data.indexOf(f);
        if (pos < 0) continue;
        var trecho = n.splitText(pos); trecho.splitText(f.length);
        var m = el("mark", { class: "destaque", text: f });
        m.style.setProperty("--i", i);
        alvo.replaceChild(m, trecho);
        break;
      }
    });
  }

  function foto(f, sizes, eager) {
    if (!f || !f.arquivo) return null;
    var ls = f.larguras || [];
    var maior = ls[ls.length - 1];
    var img = el("img", {
      src: f.arquivo + "-" + maior + ".webp",
      srcset: ls.map(function (w) { return f.arquivo + "-" + w + ".webp " + w + "w"; }).join(", "),
      sizes: sizes,
      alt: f.alt || "",
      loading: eager ? "eager" : "lazy",
      decoding: "async",
      fetchpriority: eager ? "high" : null
    });
    img.addEventListener("error", function () { img.closest("[data-foto]") && img.closest("[data-foto]").classList.add("sem-foto"); img.remove(); });
    return img;
  }

  /* ---------- vídeos ---------- */

  // Descobre o tipo do vídeo a partir do cadastro
  function infoVideo(v) {
    if (!v) return null;
    if (v.arquivo) return { tipo: "local", src: v.arquivo };
    if (!v.link) return null;
    var m = v.link.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return { tipo: "youtube", id: m[1], link: v.link,
      embed: "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0",
      miniatura: "https://i.ytimg.com/vi/" + m[1] + "/hqdefault.jpg" };
    m = v.link.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return { tipo: "vimeo", id: m[1], link: v.link, embed: "https://player.vimeo.com/video/" + m[1] + "?autoplay=1" };
    return { tipo: "externo", link: v.link };
  }

  function cartelaTitulo(p, cat) {
    return el("span", { class: "cartela", "aria-hidden": "true" }, [
      el("span", { class: "cartela__titulo", text: p.titulo || cat.nome })
    ]);
  }

  function marcarErro(li, msg) {
    li.classList.add("card--erro");
    var acao = li.querySelector(".card__acao"); if (acao) acao.remove();
    var abrir = li.querySelector(".card__abrir");
    if (abrir) {
      // Troca o botão por um bloco inerte: nada de controle que não funciona
      var tela = el("div", { class: "card__tela card__tela--pendente" }, [
        el("span", { class: "pendente__texto", text: "Vídeo indisponível" }),
        marcar ? el("span", { class: "pendente__detalhe", text: msg }) : null
      ]);
      abrir.replaceWith(el("div", { class: "card__abrir card__abrir--inerte" }, [tela, abrir.querySelector(".card__legenda")]));
    }
    if (!marcar) li.hidden = true;
  }

  function cardPendente(p, cat, i) {
    var titulo = p.titulo || "Projeto a cadastrar";
    return el("li", { class: "card card--" + (p.formato || "horizontal") + " card--pendente" }, [
      el("div", { class: "card__abrir card__abrir--inerte" }, [
        el("div", { class: "card__tela card__tela--pendente" }, [
          el("span", { class: "pendente__texto", text: "Vídeo pendente" })
        ]),
        el("div", { class: "card__legenda" }, [
          el("h4", { class: "card__titulo", text: titulo }),
          meta(p)
        ])
      ])
    ]);
  }

  function meta(p) {
    var partes = [p.cliente, p.ano].filter(Boolean);
    return partes.length ? el("p", { class: "card__meta", text: partes.join(", ") }) : null;
  }

  function cardVideo(p, cat, v) {
    var li = el("li", { class: "card card--" + (p.formato || "horizontal") });
    var tela = el("span", { class: "card__tela" });
    var titulo = p.titulo || cat.nome;

    if (p.capa) {
      var img = el("img", { src: p.capa, alt: "", loading: "lazy", decoding: "async" });
      img.addEventListener("error", function () { img.replaceWith(cartelaTitulo(p, cat)); });
      tela.appendChild(img);
    } else if (v.tipo === "local") {
      var vid = el("video", { src: v.src + "#t=1", muted: "", playsinline: "", preload: "metadata", "aria-hidden": "true", tabindex: "-1" });
      vid.muted = true;
      vid.addEventListener("error", function () { marcarErro(li, "Arquivo não encontrado: " + v.src); });
      tela.appendChild(vid);
    } else if (v.miniatura) {
      var mini = el("img", { src: v.miniatura, alt: "", loading: "lazy", decoding: "async" });
      mini.addEventListener("error", function () { mini.replaceWith(cartelaTitulo(p, cat)); });
      tela.appendChild(mini);
    } else {
      tela.appendChild(cartelaTitulo(p, cat));
    }
    tela.appendChild(el("span", { class: "card__play", "aria-hidden": "true" }));

    var legenda = el("span", { class: "card__legenda" }, [
      el("span", { class: "card__titulo", text: titulo }),
      meta(p),
      el("span", { class: "card__acao", text: v.tipo === "externo" ? "Assistir no site externo (nova aba)" : "Assistir" })
    ]);

    var abrir;
    if (v.tipo === "externo") {
      abrir = el("a", { class: "card__abrir", href: v.link, target: "_blank", rel: "noopener" }, [tela, legenda]);
    } else {
      abrir = el("button", { class: "card__abrir", type: "button" }, [tela, legenda]);
      abrir.addEventListener("click", function () { abrirPlayer(p, cat, v, abrir); });
    }
    li.appendChild(abrir);

    // Prévia muda ao passar o mouse (só vídeo local, só se o usuário aceita movimento)
    if (v.tipo === "local") {
      var previa;
      abrir.addEventListener("pointerenter", function () {
        if (reduzMovimento.matches || !ponteiroFino.matches) return;
        if (!previa) {
          previa = tela.querySelector("video") || el("video", { src: v.src, muted: "", playsinline: "", loop: "", preload: "none", "aria-hidden": "true", class: "card__previa" });
          previa.muted = true; previa.loop = true;
          if (!previa.parentNode) tela.insertBefore(previa, tela.firstChild.nextSibling);
        }
        previa.classList.add("tocando");
        var t = previa.play(); if (t && t.catch) t.catch(function () {});
      });
      abrir.addEventListener("pointerleave", function () {
        if (!previa) return;
        previa.pause(); previa.classList.remove("tocando");
      });
    }

    // Vídeo local com capa: confere se o arquivo existe sem baixá-lo inteiro
    if (v.tipo === "local" && p.capa && location.protocol !== "file:") {
      fetch(v.src, { method: "HEAD" }).then(function (r) { if (!r.ok) marcarErro(li, "Arquivo não encontrado: " + v.src); }).catch(function () {});
    }
    return li;
  }

  /* ---------- player ---------- */

  var player = $("#player"), playerTela = $("#player-tela"), playerInfo = $("#player-info");
  var origemFoco = null;

  function abrirPlayer(p, cat, v, origem) {
    origemFoco = origem;
    $("#player-titulo").textContent = p.titulo || cat.nome;
    playerTela.innerHTML = "";
    playerTela.className = "player__tela player__tela--" + (p.formato || "horizontal");

    if (v.tipo === "local") {
      var vid = el("video", { src: v.src, controls: "", playsinline: "", preload: "metadata", poster: p.capa || null });
      vid.addEventListener("error", function () {
        playerTela.innerHTML = "";
        playerTela.appendChild(el("p", { class: "player__erro", text: "Não foi possível carregar o vídeo (" + v.src + "). Confira o nome do arquivo em conteudo.js." }));
      });
      playerTela.appendChild(vid);
      if (!reduzMovimento.matches) { var t = vid.play(); if (t && t.catch) t.catch(function () {}); }
    } else {
      playerTela.appendChild(el("iframe", {
        src: v.embed, title: "Vídeo: " + (p.titulo || cat.nome),
        allow: "autoplay; fullscreen; picture-in-picture; encrypted-media", allowfullscreen: "", loading: "eager"
      }));
    }

    playerInfo.innerHTML = "";
    var partes = [cat.nome, p.cliente, p.ano].filter(Boolean).join(", ");
    playerInfo.appendChild(el("p", { class: "player__meta", text: partes }));
    if (p.descricao) playerInfo.appendChild(el("p", { class: "player__descricao", text: p.descricao }));
    if (v.link) playerInfo.appendChild(el("a", { class: "player__link", href: v.link, target: "_blank", rel: "noopener", text: "Abrir no " + (v.tipo === "vimeo" ? "Vimeo" : "YouTube") + " (nova aba)" }));

    player.showModal();
    document.documentElement.classList.add("com-player");
  }

  function fecharPlayer() { if (player.open) player.close(); }

  player.addEventListener("close", function () {
    playerTela.innerHTML = ""; // interrompe a reprodução
    document.documentElement.classList.remove("com-player");
    if (origemFoco) origemFoco.focus();
  });
  $("#player-fechar").addEventListener("click", fecharPlayer);
  player.addEventListener("click", function (e) { if (e.target === player) fecharPlayer(); });

  /* ---------- montagem ---------- */

  // Textos simples ligados por data-c="caminho.no.conteudo"
  document.querySelectorAll("[data-c]").forEach(function (n) { preencher(n, caminho(C, n.getAttribute("data-c"))); });

  var pessoa = C.pessoa || {};

  // Títulos ultra-largos divididos em letras para entrarem em cascata; o leitor de tela lê o título inteiro
  document.querySelectorAll(".titulo-largo").forEach(function (t) {
    var frase = t.textContent.trim(), n = 0;
    t.setAttribute("aria-label", frase);
    t.textContent = "";
    frase.split(/\s+/).forEach(function (palavra, i) {
      if (i) t.appendChild(document.createTextNode(" "));
      var bloco = el("span", { class: "titulo-largo__palavra", "aria-hidden": "true" });
      palavra.split("").forEach(function (l) {
        var s = el("span", { class: "letra-titulo", text: l });
        s.style.setProperty("--i", n++);
        bloco.appendChild(s);
      });
      t.appendChild(bloco);
    });
  });

  // Abertura
  var nome = $("#abertura-nome"), nLetra = 0;
  nome.setAttribute("aria-label", pessoa.nome || "");
  (pessoa.nome || "").split(/\s+/).forEach(function (palavra) {
    var linha = el("span", { class: "abertura__linha", "aria-hidden": "true" });
    palavra.split("").forEach(function (l) {
      var s = el("span", { class: "letra", text: l });
      s.style.setProperty("--i", nLetra++);
      linha.appendChild(s);
    });
    nome.appendChild(linha);
  });
  $("#abertura-etiqueta").textContent = pessoa.etiqueta || "";
  $("#sobre-etiqueta").textContent = pessoa.nome || "";

  // selo giratório: o texto ocupa a volta inteira do círculo
  var seloGiro = $("#selo-texto");
  seloGiro.textContent = [pessoa.atuacao, "Portfólio " + new Date().getFullYear(), ""].join(" ✦ ");
  seloGiro.setAttribute("textLength", "462");
  seloGiro.setAttribute("lengthAdjust", "spacing");
  preencher($("#abertura-apresentacao"), pessoa.apresentacao);
  var fotoAbertura = foto(C.fotos && C.fotos.abertura, "(max-width: 720px) 100vw, 55vw", true);
  if (fotoAbertura) $("#abertura-foto").insertBefore(fotoAbertura, $("#abertura-foto").firstChild);

  // Trabalhos
  var indice = $("#indice"), categorias = $("#categorias"), nCat = 0;
  (C.categorias || []).forEach(function (cat) {
    var cards = (cat.projetos || []).map(function (p, i) {
      var v = infoVideo(p.video);
      if (v) return cardVideo(p, cat, v);
      return marcar ? cardPendente(p, cat, i) : null;
    }).filter(Boolean);
    if (!cards.length) return; // categoria vazia some quando não há marcações

    var prontos = (cat.projetos || []).filter(function (p) { return infoVideo(p.video); }).length;
    var total = (cat.projetos || []).length;
    var contagem = marcar ? prontos + " de " + total + " vídeos" : prontos + (prontos === 1 ? " vídeo" : " vídeos");

    indice.appendChild(el("li", null, [
      el("a", { href: "#cat-" + cat.id }, [el("span", { text: cat.nome }), el("span", { class: "indice__conta", text: contagem })])
    ]));

    var desc = el("p", { class: "categoria__descricao" });
    preencher(desc, cat.descricao);
    cards.forEach(function (c, i) { c.style.setProperty("--i", i); });
    nCat++;
    categorias.appendChild(el("section", {
      class: "categoria categoria--" + (nCat % 2 ? "cobalto" : "feixe"),
      id: "cat-" + cat.id, "aria-labelledby": "cat-" + cat.id + "-titulo", "data-revelar": ""
    }, [
      el("header", { class: "categoria__faixa" }, [
        el("span", { class: "categoria__num", "aria-hidden": "true", text: "#" + (nCat < 10 ? "0" : "") + nCat }),
        el("div", null, [el("h3", { class: "categoria__nome", id: "cat-" + cat.id + "-titulo", text: cat.nome }), desc]),
        el("span", { class: "categoria__conta", text: contagem })
      ]),
      el("div", { class: "categoria__painel" }, [
        el("ul", { class: "grade" + (cards.every(function (c) { return c.classList.contains("card--vertical"); }) ? " grade--verticais" : "") }, cards)
      ])
    ]));
  });

  // Nenhum vídeo publicado e marcações desligadas: orienta em vez de deixar a seção vazia
  if (!categorias.children.length) {
    indice.closest(".indice").remove();
    var vazio = el("p", { class: "trabalhos__vazio" }, ["A seleção de vídeos está sendo atualizada. "]);
    if (pessoa.email) vazio.appendChild(el("a", { href: "mailto:" + pessoa.email, text: "Peça exemplos por e-mail" }));
    categorias.appendChild(vazio);
  }

  // Sobre
  var fotoSobre = foto(C.fotos && C.fotos.sobre, "(max-width: 720px) 100vw, 45vw");
  if (fotoSobre) $("#sobre-foto").insertBefore(fotoSobre, $("#sobre-foto").firstChild);
  var sobre = C.sobre || {};
  preencher($("#sobre-bio"), sobre.texto);
  destacar($("#sobre-bio"), sobre.destaques);

  var listaNumeros = $("#sobre-numeros");
  (sobre.numeros || []).forEach(function (n, i) {
    if (!n.numero) return;
    var valor = el("span", { class: "numero__valor", "aria-hidden": "true", text: n.numero });
    valor.style.setProperty("--i", i);
    listaNumeros.appendChild(el("li", null, [
      valor,
      el("span", { class: "so-leitor", text: n.numero + " " }),
      el("span", { class: "numero__rotulo", text: n.rotulo || "" })
    ]));
  });
  if (!listaNumeros.children.length) listaNumeros.remove();

  var ficha = $("#sobre-ficha");
  var ferramentas = sobre.ferramentas || [];
  if (ferramentas.length) {
    ficha.appendChild(el("h3", { class: "ficha__titulo", text: "Ferramentas" }));
    ficha.appendChild(el("ul", { class: "ficha__lista" }, ferramentas.map(function (f) { return el("li", { text: f }); })));
  } else if (marcar) {
    ficha.appendChild(el("h3", { class: "ficha__titulo", text: "Ferramentas" }));
    ficha.appendChild(el("p", { class: "ficha__pendente" }, ["Liste os programas que você usa em conteudo.js ", selo("Pendente")]));
  }
  if (sobre.disponibilidade) ficha.appendChild(el("p", { class: "ficha__disponibilidade", text: sobre.disponibilidade }));

  // Contato
  var fotoContato = foto(C.fotos && C.fotos.contato, "(max-width: 720px) 60vw, 30vw");
  if (fotoContato) $("#contato-foto").appendChild(fotoContato);
  var email = $("#contato-email");
  if (pessoa.email) {
    email.href = "mailto:" + pessoa.email;
    email.textContent = pessoa.email;
    // Quebra o e-mail antes do @ em telas estreitas
    email.innerHTML = "";
    var partes = pessoa.email.split("@");
    email.appendChild(el("span", { text: partes[0] }));
    email.appendChild(el("wbr"));
    email.appendChild(el("span", { text: "@" + partes[1] }));
  } else {
    email.remove(); $("#copiar-email").remove();
  }

  var redes = (pessoa.redes || []).filter(function (r) { return r.url; });
  var listaRedes = $("#contato-redes");
  redes.forEach(function (r) {
    listaRedes.appendChild(el("li", null, [el("a", { href: r.url, target: "_blank", rel: "noopener", text: r.nome })]));
  });
  if (!redes.length) {
    if (marcar) listaRedes.appendChild(el("li", { class: "contato__redes-pendente" }, ["Links de redes sociais ", selo("Pendente")]));
    else listaRedes.remove();
  }

  var aviso = $("#copiar-aviso"), timer;
  $("#copiar-email") && $("#copiar-email").addEventListener("click", function () {
    var ok = function () { aviso.textContent = "E-mail copiado"; clearTimeout(timer); timer = setTimeout(function () { aviso.textContent = ""; }, 2600); };
    var falha = function () {
      var t = el("textarea", { readonly: "" }); t.value = pessoa.email; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      var deu = false; try { deu = document.execCommand("copy"); } catch (e) {}
      t.remove();
      if (deu) ok(); else aviso.textContent = "Não deu para copiar. Selecione o e-mail acima.";
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(pessoa.email).then(ok, falha);
    else falha();
  });

  $("#rodape-nome").textContent = "© " + new Date().getFullYear() + " " + (pessoa.nome || "");

  /* ---------- fitas ---------- */

  function encherFita(alvo, itens) {
    if (!alvo) return;
    var frase = itens.filter(Boolean).join("  ✦  ") + "  ✦  ";
    // duas metades iguais, cada uma mais larga que a tela, para o laço não ter emenda
    for (var metade = 0; metade < 2; metade++) alvo.appendChild(el("span", { text: new Array(5).join(frase) }));
  }
  encherFita($("#fita-trilho"), [pessoa.atuacao].concat((C.categorias || []).map(function (c) { return c.nome; })));
  encherFita($("#fita-contato"), [texto((C.contato || {}).chamada), pessoa.email]);

  // a fita da abertura acompanha a inclinação exata do corte diagonal
  var abertura = $("#inicio");
  function ajustarFita() {
    var corte = parseFloat(getComputedStyle(abertura, "::after").height) || 0;
    abertura.style.setProperty("--angulo", (-Math.atan2(corte, abertura.offsetWidth) * 180 / Math.PI).toFixed(3) + "deg");
  }
  ajustarFita();
  addEventListener("resize", ajustarFita);

  /* ---------- movimento ---------- */

  var html = document.documentElement;
  var anima = !reduzMovimento.matches;

  function p2(n) { return (n < 10 ? "0" : "") + n; }
  function timecode(quadros) { // 24 quadros por segundo
    var s = Math.floor(quadros / 24);
    return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, quadros % 24].map(p2).join(":");
  }

  // topo: ganha fundo ao rolar; linha do tempo e timecode acompanham a rolagem
  var topo = $("#topo"), progresso = $("#topo-progresso"), tcTopo = $("#topo-tc"), fotoAb = $("#abertura-foto img"), agendado = false;
  function aoRolar() {
    agendado = false;
    var y = window.scrollY, max = html.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, y / max) : 0;
    topo.classList.toggle("topo--rolado", y > 40);
    progresso.style.transform = "scaleX(" + p.toFixed(4) + ")";
    tcTopo.textContent = timecode(Math.round(p * 24 * 90)); // a página inteira "dura" 1min30
    if (anima && fotoAb && y < innerHeight * 1.2) fotoAb.style.setProperty("--desloc", (y * 0.18).toFixed(1) + "px");
    if (anima) acelerarFitas(y - ultimoY);
    ultimoY = y;
  }

  // as fitas aceleram com a rolagem e voltam devagar ao ritmo normal
  var fitas = null, ultimoY = window.scrollY, impulso = 0, freando = false;
  function acelerarFitas(dy) {
    if (!dy) return;
    if (!fitas) {
      fitas = [];
      document.querySelectorAll(".fita__trilho").forEach(function (f) { if (f.getAnimations) fitas = fitas.concat(f.getAnimations()); });
    }
    if (!fitas.length) return;
    impulso = Math.min(7, impulso + Math.abs(dy) * 0.03);
    if (!freando) { freando = true; requestAnimationFrame(frear); }
  }
  function frear() {
    impulso = impulso < 0.02 ? 0 : impulso * 0.93;
    fitas.forEach(function (a) { a.playbackRate = 1 + impulso; });
    if (impulso) requestAnimationFrame(frear); else freando = false;
  }
  addEventListener("scroll", function () { if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  aoRolar();

  // timecode do visor corre enquanto a abertura está na tela
  var visorTc = $("#visor-tc"), inicioTc = 0, rodando = false;
  function quadro(t) {
    if (!rodando) return;
    if (!inicioTc) inicioTc = t;
    visorTc.textContent = timecode(Math.floor((t - inicioTc) / 1000 * 24));
    requestAnimationFrame(quadro);
  }
  if (anima && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      var antes = rodando; rodando = es[0].isIntersecting;
      if (rodando && !antes) requestAnimationFrame(quadro);
    }).observe(abertura);
  }

  // revelar seções ao rolar
  if (anima && "IntersectionObserver" in window) {
    html.classList.add("revela");
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel"); obs.unobserve(e.target);
        if (e.target.id === "sobre-numeros") contar(e.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    document.querySelectorAll("[data-revelar]").forEach(function (n) { obs.observe(n); });
  }

  // números do "Sobre" contam a partir do zero (o valor final já está no HTML desde o início)
  function contar(lista) {
    lista.querySelectorAll(".numero__valor").forEach(function (v, i) {
      var final = v.textContent, m = final.match(/\d+/);
      if (!m) return;
      var alvo = +m[0], inicio = 0;
      function passo(t) {
        if (!inicio) inicio = t;
        var bruto = Math.min(1, Math.max(0, (t - inicio - i * 140) / 1400));
        v.textContent = final.replace(m[0], Math.round(alvo * (1 - Math.pow(1 - bruto, 3))));
        if (bruto < 1) requestAnimationFrame(passo);
      }
      requestAnimationFrame(passo);
    });
  }

  if (anima && ponteiroFino.matches) {
    // cards inclinam e refletem a luz seguindo o mouse
    document.querySelectorAll(".card__abrir").forEach(function (a) {
      var tela = a.querySelector(".card__tela");
      if (!tela) return;
      a.addEventListener("pointermove", function (e) {
        var r = tela.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        tela.style.setProperty("--rx", ((.5 - y) * 7).toFixed(2) + "deg");
        tela.style.setProperty("--ry", ((x - .5) * 9).toFixed(2) + "deg");
        tela.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        tela.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      a.addEventListener("pointerleave", function () { tela.style.removeProperty("--rx"); tela.style.removeProperty("--ry"); });
    });

    // botões são atraídos de leve pelo cursor
    document.querySelectorAll(".botao").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty("--ima-x", ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + "px");
        b.style.setProperty("--ima-y", ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + "px");
      });
      b.addEventListener("pointerleave", function () { b.style.removeProperty("--ima-x"); b.style.removeProperty("--ima-y"); });
    });
  }

  // corte: uma faixa de luz atravessa a tela ao pular para outra seção
  var corte = $("#corte");
  if (anima && corte) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.classList.contains("pular") || a.getAttribute("href").length < 2) return;
      corte.classList.remove("corte--ativo"); void corte.offsetWidth; corte.classList.add("corte--ativo");
    });
    corte.addEventListener("animationend", function () { corte.classList.remove("corte--ativo"); });
  }

  document.documentElement.classList.add("pronto");
})();
