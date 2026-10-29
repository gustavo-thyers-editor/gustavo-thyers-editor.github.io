# Como adicionar seus vídeos

São 4 categorias × 3 vídeos, todas em `site/conteudo.js`. Cada projeto tem esta forma:

```js
{ titulo: "", cliente: "", ano: "", descricao: "", formato: "horizontal", capa: "", video: null }
```

## Opção A: arquivo local (este diretório)

1. Coloque o arquivo aqui: `site/midia/videos/` (ex.: `reels-marca-x.mp4`).
2. No projeto, troque `video: null` por:
   ```js
   video: { arquivo: "midia/videos/reels-marca-x.mp4" }
   ```
3. Formato do arquivo: **MP4 (H.264 + AAC)**, que toca em qualquer navegador. Para a web: 1080p, entre 5 e 8 Mbps, idealmente até ~30 MB por vídeo.
4. Sem capa, a miniatura é o quadro do 1º segundo do vídeo.

## Opção B: YouTube ou Vimeo (recomendado para vídeos longos ou pesados)

```js
video: { link: "https://www.youtube.com/watch?v=XXXXXXXXXXX" }
video: { link: "https://youtu.be/XXXXXXXXXXX" }
video: { link: "https://www.youtube.com/shorts/XXXXXXXXXXX" }
video: { link: "https://vimeo.com/123456789" }
```
O player do YouTube/Vimeo só é carregado quando a pessoa clica em "Assistir".
Sem capa, YouTube usa a miniatura do próprio vídeo; Vimeo mostra o título como cartela.

## Opção C: outro site (Instagram, Drive, Behance…)

```js
video: { link: "https://www.instagram.com/reel/..." }
```
O card vira um link que abre o vídeo em nova aba.

## Capa (opcional, recomendada)

Coloque a imagem em `site/midia/capas/` e informe:
```js
capa: "midia/capas/reels-marca-x.jpg"
```
JPG ou WebP, com a mesma proporção do vídeo, até ~1600 px de largura e ~250 KB.

## Formato

`formato: "horizontal"` (16:9), `"vertical"` (9:16) ou `"quadrado"` (1:1).
O layout se ajusta sozinho: não é preciso mexer em HTML ou CSS.

## Exemplo completo

```js
{
  titulo: "Lançamento da coleção de verão",
  cliente: "Nome do cliente",
  ano: "2026",
  descricao: "Edição e motion para a campanha de lançamento.",
  formato: "vertical",
  capa: "midia/capas/verao.jpg",
  video: { arquivo: "midia/videos/verao.mp4" }
}
```

## Se algo der errado

- Nome do arquivo errado ou arquivo ausente: o card mostra "Vídeo indisponível" com o caminho que faltou (enquanto `marcarProvisorios: true`) e some quando as marcações estão desligadas. Nunca aparece player quebrado.
- Use só vídeos que você fez e tem direito de mostrar.
