# Como adicionar vídeos

**Cada pasta aqui é uma categoria do site**, com o nome da pasta. Os vídeos dentro dela viram os cards.

1. Crie uma pasta com o nome da categoria (ou use uma existente) e coloque os vídeos (`.mov`, `.mp4`…).
2. A partir da pasta `03-projeto/`, rode:
   ```
   python ferramentas/converter-videos.py     (converte só os vídeos novos para a web + gera as capas)
   python ferramentas/montar-categorias.py    (atualiza as categorias no conteudo.js)
   ```
3. Publique: `cd site`, `git add -A`, `git commit -m "Novos vídeos"`, `git push`.

Os **originais ficam só no computador** (o `.gitignore` impede que subam). Vão para o site as versões
convertidas em `web/`: MP4 H.264, até 1080p, no máximo ~50 MB cada (o GitHub recusa arquivos acima de 100 MB).

## Títulos, clientes e descrições

Edite em `site/conteudo.js`, em cada projeto (`titulo`, `cliente`, `ano`, `descricao`).
Rodar `montar-categorias.py` de novo **mantém** o que você escreveu. Sem título, o card mostra
a categoria, o formato e a duração do vídeo.

## Grafia dos nomes

Para o site mostrar um nome diferente do nome da pasta (acentos, maiúsculas), edite `NOMES` no
início de `ferramentas/montar-categorias.py`.

## Links do YouTube/Vimeo (opcional)

Em vez de arquivo, um projeto pode usar `video: { link: "https://youtu.be/..." }` no `conteudo.js`.
Use só vídeos que você fez e tem direito de mostrar.
