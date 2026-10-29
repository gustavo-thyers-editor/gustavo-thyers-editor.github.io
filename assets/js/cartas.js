/* Versão em cartas: monta o portfólio a partir de window.CONTEUDO (conteudo.js). Sem dependências. */
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
  var anima = !reduzMovimento.matches;

  // cada categoria ganha uma moldura, em ordem (todas dentro do vermelho, preto e dourado)
  var MOLDURAS = ["rubi", "onix", "ouro", "carmim"];
  var FORMATOS = { horizontal: "16:9", vertical: "9:16", quadrado: "1:1" };
  var CORES_FAISCA = ["#FFE08A", "#F5B935", "#FF5566", "#FFF4EC"];

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

  function texto(v) { return v == null ? "" : (typeof v === "string" ? v : v.texto || ""); }
  function ehProvisorio(v) { return !!(v && typeof v === "object" && v.provisorio); }
  function selo(rotulo) { return el("span", { class: "selo", text: rotulo || "Texto provisório" }); }

  function preencher(alvo, v) {
    if (!alvo) return;
    alvo.textContent = texto(v);
    if (marcar && ehProvisorio(v)) { alvo.appendChild(document.createTextNode(" ")); alvo.appendChild(selo()); }
  }

  function destacar(alvo, frases) {
    (frases || []).forEach(function (f) {
      if (!f) return;
      for (var n = alvo.firstChild; n; n = n.nextSibling) {
        if (n.nodeType !== 3) continue;
        var pos = n.data.indexOf(f);
        if (pos < 0) continue;
        var trecho = n.splitText(pos); trecho.splitText(f.length);
        alvo.replaceChild(el("strong", { text: f }), trecho);
        break;
      }
    });
  }

  function foto(f, sizes, eager) {
    if (!f || !f.arquivo) return null;
    var ls = f.larguras || [];
    return el("img", {
      src: f.arquivo + "-" + ls[ls.length - 1] + ".webp",
      srcset: ls.map(function (w) { return f.arquivo + "-" + w + ".webp " + w + "w"; }).join(", "),
      sizes: sizes, alt: f.alt || "", loading: eager ? "eager" : "lazy", decoding: "async"
    });
  }

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

  // Divide um texto em letras que entram em cascata; o leitor de tela lê o texto inteiro
  function emLetras(alvo) {
    var frase = alvo.textContent.trim();
    alvo.setAttribute("aria-label", frase);
    alvo.textContent = "";
    frase.split("").forEach(function (l, i) {
      var s = el("span", { class: "letra-titulo", "aria-hidden": "true", text: l });
      s.style.setProperty("--i", i);
      alvo.appendChild(s);
    });
  }

  /* ---------- faíscas (cliques e invocações) ---------- */

  var telaFaiscas = $("#faiscas"), fctx = null, faiscas = [], soltando = false;

  function ajustarCanvas(canvas, ctx) {
    var dpr = Math.min(2, window.devicePixelRatio || 1), r = canvas.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return r;
  }

  function prepararFaiscas() {
    if (!anima || !telaFaiscas.getContext) return false;
    if (!fctx) {
      fctx = telaFaiscas.getContext("2d");
      ajustarCanvas(telaFaiscas, fctx);
      addEventListener("resize", function () { ajustarCanvas(telaFaiscas, fctx); });
    }
    return true;
  }

  function soltar() { if (!soltando) { soltando = true; requestAnimationFrame(passoFaiscas); } }

  function explodir(x, y, quantas, forca) {
    if (!prepararFaiscas()) return;
    for (var i = 0; i < quantas; i++) {
      var a = Math.random() * Math.PI * 2, v = (.35 + Math.random()) * forca;
      faiscas.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - forca * .25, vida: 0, max: 36 + Math.random() * 30,
        cor: CORES_FAISCA[i % CORES_FAISCA.length], tam: 1.2 + Math.random() * 2.2 });
    }
    soltar();
  }

  // rastro do cursor: uma faísca pequena e lenta
  function rastro(x, y) {
    if (!prepararFaiscas()) return;
    faiscas.push({ x: x, y: y, vx: (Math.random() - .5) * 1.4, vy: (Math.random() - .5) * 1.4, vida: 0, max: 20 + Math.random() * 14,
      cor: CORES_FAISCA[Math.floor(Math.random() * CORES_FAISCA.length)], tam: .9 + Math.random() * 1.5 });
    soltar();
  }

  function passoFaiscas() {
    fctx.clearRect(0, 0, innerWidth, innerHeight);
    faiscas = faiscas.filter(function (f) { return f.vida < f.max; });
    fctx.lineCap = "round";
    faiscas.forEach(function (f) {
      f.vida++; f.x += f.vx; f.y += f.vy; f.vx *= .95; f.vy = f.vy * .95 + .2;
      fctx.globalAlpha = 1 - f.vida / f.max;
      fctx.strokeStyle = f.cor; fctx.lineWidth = f.tam;
      fctx.beginPath(); fctx.moveTo(f.x, f.y); fctx.lineTo(f.x - f.vx * 2.2, f.y - f.vy * 2.2); fctx.stroke();
    });
    fctx.globalAlpha = 1;
    if (faiscas.length) requestAnimationFrame(passoFaiscas);
    else { soltando = false; fctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  function centro(n) { var r = n.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }

  /* ---------- a carta ---------- */

  function verso() {
    return el("div", { class: "carta__verso", "aria-hidden": "true" }, [
      el("span", { class: "verso__anel" }),
      el("span", { class: "verso__emblema", text: "GT" })
    ]);
  }

  // o: { moldura, nome, nomeTag, nomeId, linha, arte, tipo, efeito, stats: [[rótulo, valor]], codigo, raridade }
  function carta(o) {
    var frente = el("div", { class: "carta__frente" }, [
      el("div", { class: "carta__nome" }, [
        el(o.nomeTag || "p", { class: "carta__titulo", id: o.nomeId, text: o.nome }),
        el("span", { class: "carta__atributo", "aria-hidden": "true" })
      ]),
      o.linha ? el("div", { class: "carta__linha" }, [o.linha]) : null,
      el("div", { class: "carta__arte" }, [o.arte]),
      el("p", { class: "carta__codigo", "aria-hidden": "true", text: o.codigo }),
      el("div", { class: "carta__texto" }, [
        o.tipo ? el("p", { class: "carta__tipo", text: o.tipo }) : null,
        o.efeito || null,
        o.stats && o.stats.length ? el("p", { class: "carta__stats" }, o.stats.map(function (s) {
          return el("span", null, [el("span", { class: "carta__rotulo", text: s[0] }), el("span", { class: "carta__valor", text: s[1] })]);
        })) : null
      ]),
      el("span", { class: "carta__brilho", "aria-hidden": "true" })
    ]);
    return el("div", { class: "carta carta--" + o.moldura + (o.raridade ? " carta--" + o.raridade : "") + (o.nome.length > 16 ? " carta--nome-longo" : "") }, [
      el("div", { class: "carta__miolo" }, [frente, verso()])
    ]);
  }

  function cartaVirada() {
    return el("div", { class: "carta carta--virada", "aria-hidden": "true" }, [el("div", { class: "carta__miolo" }, [verso()])]);
  }

  function cartela(titulo) {
    return el("span", { class: "cartela", "aria-hidden": "true" }, [el("span", { text: titulo })]);
  }

  /* ---------- slots do deck ---------- */

  function slotPendente(p, rotulo, detalhe) {
    return el("li", { class: "slot slot--pendente" }, [
      cartaVirada(),
      el("p", { class: "slot__legenda" }, [el("span", { class: "slot__estado", text: rotulo || "Vídeo pendente" }), " ", el("span", { text: detalhe || p.titulo || "Projeto a cadastrar" })])
    ]);
  }

  function slotVideo(p, cat, v, moldura, codigo) {
    var titulo = p.titulo || cat.nome;
    var arte;
    if (p.capa) {
      arte = el("img", { src: p.capa, alt: "", loading: "lazy", decoding: "async" });
      arte.addEventListener("error", function () { arte.replaceWith(cartela(titulo)); });
    } else if (v.tipo === "local") {
      arte = el("video", { src: v.src + "#t=1", muted: "", playsinline: "", preload: "metadata", "aria-hidden": "true", tabindex: "-1" });
      arte.muted = true;
      arte.addEventListener("error", function () { erro("Arquivo não encontrado: " + v.src); });
    } else if (v.miniatura) {
      arte = el("img", { src: v.miniatura, alt: "", loading: "lazy", decoding: "async" });
      arte.addEventListener("error", function () { arte.replaceWith(cartela(titulo)); });
    } else {
      arte = cartela(titulo);
    }

    var stats = [];
    if (p.ano) stats.push(["Ano", p.ano]);
    stats.push(["Formato", FORMATOS[p.formato] || FORMATOS.horizontal]);

    var c = carta({
      moldura: moldura, nome: titulo, linha: "[ " + cat.nome + " ]", arte: arte,
      tipo: p.cliente, efeito: p.descricao ? el("p", { class: "carta__efeito", text: p.descricao }) : null,
      stats: stats, codigo: codigo
    });

    var rotulo = "Assistir: " + titulo + (v.tipo === "externo" ? " (abre em nova aba)" : "");
    var abrir = v.tipo === "externo"
      ? el("a", { class: "slot__abrir", href: v.link, target: "_blank", rel: "noopener", "aria-label": rotulo }, [c])
      : el("button", { class: "slot__abrir", type: "button", "aria-label": rotulo }, [c]);
    if (v.tipo !== "externo") abrir.addEventListener("click", function () {
      if (!anima) return abrirPlayer(p, cat, v, abrir);
      // invocação: a carta brilha, solta faíscas e então o vídeo abre
      c.classList.remove("carta--invocada"); void c.offsetWidth; c.classList.add("carta--invocada");
      var xy = centro(c); explodir(xy[0], xy[1], 60, 9);
      setTimeout(function () { abrirPlayer(p, cat, v, abrir); }, 320);
    });

    var li = el("li", { class: "slot" }, [abrir, el("p", { class: "slot__legenda" }, [
      el("span", { class: "slot__estado slot__estado--ok", text: v.tipo === "externo" ? "Abre no site externo" : "Clique para assistir" })
    ])]);

    function erro(msg) {
      var novo = slotPendente(p, "Vídeo indisponível", marcar ? msg : titulo);
      novo.classList.add("slot--erro");
      if (!marcar) novo.hidden = true;
      li.replaceWith(novo);
    }
    if (v.tipo === "local" && p.capa && location.protocol !== "file:") {
      fetch(v.src, { method: "HEAD" }).then(function (r) { if (!r.ok) erro("Arquivo não encontrado: " + v.src); }).catch(function () {});
    }
    return li;
  }

  /* ---------- player ---------- */

  var player = $("#player"), playerTela = $("#player-tela"), playerInfo = $("#player-info");
  var origemFoco = null;

  function abrirPlayer(p, cat, v, origem) {
    if (player.open) return;
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
      if (anima) { var t = vid.play(); if (t && t.catch) t.catch(function () {}); }
    } else {
      playerTela.appendChild(el("iframe", {
        src: v.embed, title: "Vídeo: " + (p.titulo || cat.nome),
        allow: "autoplay; fullscreen; picture-in-picture; encrypted-media", allowfullscreen: "", loading: "eager"
      }));
    }
    playerInfo.innerHTML = "";
    playerInfo.appendChild(el("p", { class: "player__meta", text: [cat.nome, p.cliente, p.ano].filter(Boolean).join(", ") }));
    if (p.descricao) playerInfo.appendChild(el("p", { class: "player__descricao", text: p.descricao }));
    if (v.link) playerInfo.appendChild(el("a", { class: "player__link", href: v.link, target: "_blank", rel: "noopener", text: "Abrir no " + (v.tipo === "vimeo" ? "Vimeo" : "YouTube") + " (nova aba)" }));
    player.showModal();
    document.documentElement.classList.add("com-player");
  }

  player.addEventListener("close", function () {
    playerTela.innerHTML = "";
    document.documentElement.classList.remove("com-player");
    if (origemFoco) origemFoco.focus();
  });
  $("#player-fechar").addEventListener("click", function () { player.close(); });
  player.addEventListener("click", function (e) { if (e.target === player) player.close(); });

  /* ---------- montagem ---------- */

  document.querySelectorAll("[data-c]").forEach(function (n) { preencher(n, caminho(C, n.getAttribute("data-c"))); });

  var pessoa = C.pessoa || {}, sobre = C.sobre || {}, extras = C.cartas || {};

  // nome da abertura: cada palavra entra com impacto
  var nomeAbertura = $("#arena-nome");
  (pessoa.nome || "").split(/\s+/).forEach(function (palavra, i) {
    if (i) nomeAbertura.appendChild(document.createTextNode(" "));
    var s = el("span", { class: "palavra", "data-texto": palavra, text: palavra });
    s.style.setProperty("--i", i);
    nomeAbertura.appendChild(s);
  });
  preencher($("#arena-apresentacao"), pessoa.apresentacao);

  var ferramentas = $("#arena-ferramentas");
  (sobre.ferramentas || []).forEach(function (f) { ferramentas.appendChild(el("li", { text: f })); });
  if (!ferramentas.children.length) {
    if (marcar) ferramentas.appendChild(el("li", { class: "arena__pendente" }, ["Ferramentas ", selo("Pendente")]));
    else ferramentas.remove();
  }

  // Carta principal: a própria pessoa. Nível = primeiro número do "Sobre"; estatísticas = os números do "Sobre".
  var numeros = (sobre.numeros || []).filter(function (n) { return n.numero; });
  var nivel = numeros.length ? Math.min(12, parseInt(numeros[0].numero.replace(/\D/g, ""), 10) || 0) : 0;
  var estrelas = null;
  if (nivel) {
    estrelas = el("span", { class: "carta__estrelas", role: "img", "aria-label": "Nível " + nivel + " (" + numeros[0].numero + " " + numeros[0].rotulo + ")" });
    for (var i = 0; i < nivel; i++) estrelas.appendChild(el("span", { class: "estrela", "aria-hidden": "true" }));
  }
  var efeito = el("p", { class: "carta__efeito" });
  preencher(efeito, sobre.texto);
  destacar(efeito, sobre.destaques);
  var heroi = carta({
    moldura: "heroi", raridade: "ultra", nome: pessoa.nome || "", linha: estrelas,
    arte: foto(C.fotos && C.fotos.abertura, "(max-width: 900px) 88vw, 390px", true),
    tipo: extras.tipoHeroi, efeito: efeito,
    stats: numeros.map(function (n) { return [(n.rotulo || "").split(/\s+/)[0], n.numero]; }),
    codigo: "GT-001"
  });
  heroi.setAttribute("aria-label", "Carta de " + (pessoa.nome || ""));
  heroi.setAttribute("role", "group");
  $("#carta-heroi").appendChild(heroi);

  // Deck: uma zona por categoria
  emLetras($("#deck-titulo"));
  var zonas = $("#zonas"), nZona = 0, pendentes = 0;
  (C.categorias || []).forEach(function (cat) {
    var moldura = MOLDURAS[nZona % MOLDURAS.length];
    var sigla = (cat.id || "cat").slice(0, 3).toUpperCase();
    var slots = (cat.projetos || []).map(function (p, i) {
      var v = infoVideo(p.video);
      var codigo = "GT-" + sigla + "-" + (i < 9 ? "0" : "") + (i + 1);
      if (v) return slotVideo(p, cat, v, moldura, codigo);
      if (!marcar) return null;
      pendentes++;
      return slotPendente(p);
    }).filter(Boolean);
    if (!slots.length) return;

    nZona++;
    var prontos = (cat.projetos || []).filter(function (p) { return infoVideo(p.video); }).length;
    var total = (cat.projetos || []).length;
    var desc = el("p", { class: "zona__descricao" });
    preencher(desc, cat.descricao);
    slots.forEach(function (s, i) { s.style.setProperty("--i", i); });
    zonas.appendChild(el("section", { class: "zona zona--" + moldura, id: "cat-" + cat.id, "aria-labelledby": "cat-" + cat.id + "-titulo", "data-revelar": "" }, [
      el("header", { class: "zona__cabeca" }, [
        el("span", { class: "zona__num", "aria-hidden": "true", text: "#" + (nZona < 10 ? "0" : "") + nZona }),
        el("div", null, [el("h3", { class: "zona__nome", id: "cat-" + cat.id + "-titulo", text: cat.nome }), desc]),
        el("span", { class: "zona__conta", text: marcar ? prontos + " de " + total + " cartas reveladas" : prontos + (prontos === 1 ? " carta" : " cartas") })
      ]),
      el("ul", { class: "mao" }, slots)
    ]));
  });
  if (!zonas.children.length) {
    var vazio = el("p", { class: "deck__vazio" }, ["O deck está sendo montado. "]);
    if (pessoa.email) vazio.appendChild(el("a", { href: "mailto:" + pessoa.email, text: "Peça exemplos por e-mail" }));
    zonas.appendChild(vazio);
  }
  if (pendentes) $("#deck-legenda").textContent = "Cartas viradas para baixo são vídeos que ainda vão entrar no deck.";
  else $("#deck-legenda").remove();

  // Contato: carta preta com o retrato P&B
  var contato = C.contato || {};
  $("#contato-carta").appendChild(carta({
    moldura: "onix", nome: texto(contato.chamada) || "Contato", nomeTag: "h2", nomeId: "contato-titulo",
    linha: "[ Carta de contato ]",
    arte: foto(C.fotos && C.fotos.contato, "(max-width: 900px) 80vw, 340px"),
    efeito: el("p", { class: "carta__efeito", text: texto(contato.texto) }),
    codigo: "GT-999"
  }));

  var email = $("#contato-email");
  if (pessoa.email) {
    email.href = "mailto:" + pessoa.email;
    email.setAttribute("aria-label", pessoa.email);
    // letra a letra, para ondular ao passar o mouse; quebra só antes do @
    var partes = pessoa.email.split("@"), nLetra = 0;
    [partes[0], "@" + partes[1]].forEach(function (parte, i) {
      if (i) email.appendChild(el("wbr"));
      var bloco = el("span", { class: "contato__email-parte", "aria-hidden": "true" });
      parte.split("").forEach(function (l) {
        var s = el("span", { class: "letra-email", text: l });
        s.style.setProperty("--i", nLetra++);
        bloco.appendChild(s);
      });
      email.appendChild(bloco);
    });
  } else {
    email.remove(); $("#copiar-email").remove();
  }

  var listaRedes = $("#contato-redes");
  (pessoa.redes || []).filter(function (r) { return r.url; }).forEach(function (r) {
    listaRedes.appendChild(el("li", null, [el("a", { href: r.url, target: "_blank", rel: "noopener", text: r.nome })]));
  });
  if (!listaRedes.children.length) {
    if (marcar) listaRedes.appendChild(el("li", { class: "contato__pendente" }, ["Links de redes sociais ", selo("Pendente")]));
    else listaRedes.remove();
  }

  var aviso = $("#copiar-aviso"), timer;
  $("#copiar-email") && $("#copiar-email").addEventListener("click", function () {
    var ok = function () {
      aviso.textContent = "E-mail copiado"; clearTimeout(timer); timer = setTimeout(function () { aviso.textContent = ""; }, 2600);
      var xy = centro($("#copiar-email")); explodir(xy[0], xy[1], 90, 12);
    };
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

  // faixas diagonais
  function encherFita(alvo, itens) {
    var frase = itens.filter(Boolean).join("  •  ") + "  •  ";
    // duas metades iguais, cada uma mais larga que a tela, para o laço não ter emenda
    for (var metade = 0; metade < 2; metade++) alvo.appendChild(el("span", { text: new Array(5).join(frase) }));
  }
  encherFita($("#fita-1"), [pessoa.atuacao].concat((C.categorias || []).map(function (c) { return c.nome; })));
  encherFita($("#fita-2"), [texto(contato.chamada), pessoa.email]);

  $("#rodape-nome").textContent = "© " + new Date().getFullYear() + " " + (pessoa.nome || "");

  /* ---------- movimento ---------- */

  var html = document.documentElement, topo = $("#topo"), barra = $("#topo-barra"), agendado = false, ultimoY = window.scrollY;
  var mesa = $(".arena__mesa"), textoArena = $(".arena__texto"), velocidade = $("#velocidade");
  function aoRolar() {
    agendado = false;
    var y = window.scrollY, max = html.scrollHeight - innerHeight;
    topo.classList.toggle("topo--rolado", y > 40);
    barra.style.setProperty("--p", max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    // profundidade: a carta sobe mais rápido que o texto (só com as colunas lado a lado)
    if (anima && innerWidth > 900 && y < innerHeight * 1.4) {
      mesa.style.transform = "translateY(" + (y * -.14).toFixed(1) + "px)";
      textoArena.style.transform = "translateY(" + (y * .1).toFixed(1) + "px)";
    }
    if (anima) acelerarFitas(y - ultimoY);
    ultimoY = y;
  }
  addEventListener("scroll", function () { if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); } }, { passive: true });

  // as faixas aceleram com a rolagem e voltam devagar ao ritmo normal
  var fitas = null, impulso = 0, freando = false;
  function acelerarFitas(dy) {
    if (!dy) return;
    if (!fitas) {
      fitas = [];
      document.querySelectorAll(".fita__trilho").forEach(function (f) { if (f.getAnimations) fitas = fitas.concat(f.getAnimations()); });
    }
    if (!fitas.length) return;
    impulso = Math.min(8, impulso + Math.abs(dy) * 0.035);
    if (!freando) { freando = true; requestAnimationFrame(frear); }
  }
  function frear() {
    impulso = impulso < 0.02 ? 0 : impulso * 0.93;
    fitas.forEach(function (a) { a.playbackRate = 1 + impulso; });
    // rolagem rápida: linhas de velocidade nas bordas, como num quadro de anime
    velocidade.style.opacity = Math.min(.3, Math.max(0, impulso - .6) * .06).toFixed(3);
    if (impulso) requestAnimationFrame(frear); else freando = false;
  }
  aoRolar();

  // zonas e contato entram ao rolar (o conteúdo já está visível; só desliza para o lugar)
  if (anima && "IntersectionObserver" in window) {
    html.classList.add("revela");
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel"); obs.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll("[data-revelar]").forEach(function (n) { obs.observe(n); });
  }

  // brasas subindo e raios elétricos em volta da carta (pausam fora da tela e com a aba escondida)
  var brasas = $("#brasas"), trovejar = function () {};
  if (anima && brasas.getContext) {
    var bctx = brasas.getContext("2d"), lista = [], larg = 0, alt = 0, naTela = true, pedindo = false;
    var raios = [], proximoRaio = performance.now() + 3000;
    // caminho em zigue-zague entre dois pontos (deslocamento do ponto médio)
    var zigue = function (x1, y1, x2, y2, desvio) {
      var pts = [[x1, y1], [x2, y2]];
      for (var n = 0; n < 5; n++, desvio /= 2) {
        var novo = [pts[0]];
        for (var j = 0; j < pts.length - 1; j++) {
          var a = pts[j], b = pts[j + 1];
          novo.push([(a[0] + b[0]) / 2 + (Math.random() - .5) * desvio, (a[1] + b[1]) / 2 + (Math.random() - .5) * desvio], b);
        }
        pts = novo;
      }
      return pts;
    };
    // do anel até a borda da carta (forte) ou de um ponto do anel a outro
    var criarRaio = function (forte) {
      var hr = heroi.getBoundingClientRect(), br = brasas.getBoundingClientRect();
      var cx = hr.left + hr.width / 2 - br.left, cy = hr.top + hr.height / 2 - br.top, R = hr.height * .62;
      var a = Math.random() * 6.283, b = a + (Math.random() > .5 ? 1 : -1) * (.7 + Math.random() * 1.3);
      var x2 = forte ? cx + Math.cos(a) * hr.width * .35 : cx + Math.cos(b) * R;
      var y2 = forte ? cy + Math.sin(a) * hr.height * .35 : cy + Math.sin(b) * R;
      raios.push({ pts: zigue(cx + Math.cos(a) * R, cy + Math.sin(a) * R, x2, y2, R * .4), vida: 0, max: 12 + Math.random() * 10 });
    };
    trovejar = function () { for (var t = 0; t < 5; t++) criarRaio(true); };
    var desenharRaios = function (agora) {
      if (agora > proximoRaio) {
        criarRaio(false); if (Math.random() > .5) criarRaio(false);
        proximoRaio = agora + 2200 + Math.random() * 2800;
      }
      raios = raios.filter(function (r) { return r.vida < r.max; });
      bctx.lineJoin = "round"; bctx.lineCap = "round";
      raios.forEach(function (r) {
        r.vida++;
        var forca = (1 - r.vida / r.max) * (Math.random() > .25 ? 1 : .3); // pisca
        [[11, .14, "#FF8A3D"], [4.5, .5, "#FFE08A"], [1.8, 1, "#FFFFFF"]].forEach(function (camada) {
          bctx.globalAlpha = forca * camada[1]; bctx.strokeStyle = camada[2]; bctx.lineWidth = camada[0];
          bctx.beginPath();
          r.pts.forEach(function (p, k) { if (k) bctx.lineTo(p[0], p[1]); else bctx.moveTo(p[0], p[1]); });
          bctx.stroke();
        });
      });
    };
    var medirBrasas = function () { var r = ajustarCanvas(brasas, bctx); larg = r.width; alt = r.height; };
    var nova = function (espalhar) {
      return { x: Math.random() * larg, y: espalhar ? Math.random() * alt : alt + 10, v: .35 + Math.random() * 1.1,
        fase: Math.random() * 6.28, tam: .8 + Math.random() * 2.4, cor: CORES_FAISCA[Math.floor(Math.random() * CORES_FAISCA.length)] };
    };
    var quadroBrasas = function (agora) {
      if (!naTela || document.hidden) { pedindo = false; return; }
      bctx.clearRect(0, 0, larg, alt);
      bctx.globalCompositeOperation = "lighter";
      lista.forEach(function (b, k) {
        b.y -= b.v; b.fase += .03; b.x += Math.sin(b.fase) * .45;
        if (b.y < -12) lista[k] = nova(false);
        bctx.globalAlpha = .3 + .55 * Math.abs(Math.sin(b.fase * 1.7));
        bctx.fillStyle = b.cor; bctx.beginPath(); bctx.arc(b.x, b.y, b.tam, 0, 6.283); bctx.fill();
      });
      desenharRaios(agora);
      bctx.globalAlpha = 1;
      requestAnimationFrame(quadroBrasas);
    };
    var acender = function () { if (!pedindo && naTela && !document.hidden) { pedindo = true; requestAnimationFrame(quadroBrasas); } };
    medirBrasas();
    for (var k = 0; k < (innerWidth < 720 ? 30 : 64); k++) lista.push(nova(true));
    addEventListener("resize", medirBrasas);
    document.addEventListener("visibilitychange", acender);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { naTela = es[0].isIntersecting; acender(); }).observe($("#inicio"));
    acender();
  }

  // números da carta principal contam a partir do zero quando ela aterrissa (o valor final já está no HTML)
  function contar(raiz) {
    raiz.querySelectorAll(".carta__valor").forEach(function (v, i) {
      var final = v.textContent, m = final.match(/\d+/);
      if (!m) return;
      var alvo = +m[0], inicio = 0;
      function passo(t) {
        if (!inicio) inicio = t;
        var bruto = Math.min(1, Math.max(0, (t - inicio - i * 140) / 1200));
        v.textContent = final.replace(m[0], Math.round(alvo * (1 - Math.pow(1 - bruto, 3))));
        if (bruto < 1) requestAnimationFrame(passo);
      }
      requestAnimationFrame(passo);
    });
  }
  if (anima) {
    // a carta aterrissa por volta de 1,6 s (ver cartas.css): faíscas + contagem
    setTimeout(function () { var xy = centro(heroi); explodir(xy[0], xy[1], 80, 11); trovejar(); contar(heroi); }, 1620);

    document.addEventListener("click", function (e) {
      if (!e.target.closest) return;
      // faíscas em botões e links do menu
      var alvo = e.target.closest(".botao, .topo__nav a");
      if (alvo) { var xy = e.detail ? [e.clientX, e.clientY] : centro(alvo); explodir(xy[0], xy[1], 28, 6); }
      // carta virada: treme e solta faíscas ("ainda não!")
      var virada = e.target.closest(".slot--pendente .carta");
      if (virada) {
        virada.classList.remove("carta--sacode"); void virada.offsetWidth; virada.classList.add("carta--sacode");
        explodir(e.clientX, e.clientY, 22, 5);
      }
    });
  }

  // cursor: anel dourado que segue o mouse com atraso, deixando um rastro de faíscas
  if (anima && ponteiroFino.matches) {
    var mira = el("div", { class: "mira mira--fora", "aria-hidden": "true" });
    document.body.appendChild(mira);
    var miraX = -100, miraY = -100, posX = -100, posY = -100, ultimoRastro = 0, seguindo = false;
    var seguir = function () {
      posX += (miraX - posX) * .22; posY += (miraY - posY) * .22;
      mira.style.transform = "translate3d(" + posX.toFixed(1) + "px," + posY.toFixed(1) + "px,0)";
      if (Math.abs(miraX - posX) + Math.abs(miraY - posY) > .4) requestAnimationFrame(seguir); else seguindo = false;
    };
    addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      miraX = e.clientX; miraY = e.clientY;
      mira.classList.remove("mira--fora");
      mira.classList.toggle("mira--alvo", !!(e.target.closest && e.target.closest("a, button, .carta")));
      if (!seguindo) { seguindo = true; requestAnimationFrame(seguir); }
      if (e.timeStamp - ultimoRastro > 45) { ultimoRastro = e.timeStamp; rastro(miraX, miraY); }
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { mira.classList.add("mira--fora"); });
  }

  // cartas inclinam e o brilho holográfico segue o mouse
  if (anima && ponteiroFino.matches) {
    document.querySelectorAll(".carta").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty("--rx", ((.5 - y) * 16).toFixed(2) + "deg");
        c.style.setProperty("--ry", ((x - .5) * 20).toFixed(2) + "deg");
        c.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        c.style.setProperty("--my", (y * 100).toFixed(1) + "%");
        c.classList.add("carta--mira");
      });
      c.addEventListener("pointerleave", function () {
        c.style.removeProperty("--rx"); c.style.removeProperty("--ry");
        c.classList.remove("carta--mira");
      });
    });
  }

  html.classList.add("pronto");
})();
