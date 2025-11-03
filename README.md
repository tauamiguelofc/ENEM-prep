# ENEM-prep

Site estático para preparação de matemática (ENEM / vestibular).
- Conteúdo indexado por tópicos (vídeos genéricos).
- Tema escuro persistente.
- Reclamações/sugestões salvas localmente (localStorage).
- Projeto estático, pronto para GitHub Pages.

Para testar localmente:
- HTTP rápido: `python3 -m http.server 8000`
- Abrir: "$BROWSER" http://localhost:8000

Novidades nesta versão:
- Estrutura modular: `styles/variables.css`, `styles/main.css`, `js/app.js`.
- Dados das aulas extraídos para `data/aulas.json` (fácil manutenção).
- Lazy-load do player com overlay, toasts (feedback elegante) e limite anti-spam no formulário (30s).
- Sidebar acessível e navegável por teclado; ícone de menu com `aria-expanded`.

Como desenvolver:
1. Rodar servidor local:
```bash
python3 -m http.server 8000
```
2. Abrir no navegador:
```bash
"$BROWSER" http://localhost:8000
```

Estrutura importante do repositório:
- `index.html` — ponto de entrada
- `styles/variables.css`, `styles/main.css` — estilos
- `js/app.js` — lógica principal (ES module)
- `data/aulas.json` — metadados das aulas (títulos, vídeos, descrições)
- `materiais/` — PDFs para download (opcional)

Deploy (GitHub Pages):
- Commit e push para `main`, depois ative Pages (branch `main`).
- Recomendo usar `gh` CLI para criar/revisar repo se necessário.

Deploy no GitHub Pages:
1. Commit e push para o repositório GitHub:
   git add . && git commit -m "Melhorias UI/UX e responsividade" && git push origin main
2. Ative GitHub Pages no repositório (Settings → Pages) apontando para a branch `main` (ou use `gh` CLI).

Alternativa com gh CLI (se ainda não publicou):
- gh repo create <nome> --public --source=. --remote=origin --push
- Ativar Pages via UI do GitHub (repositório → Settings → Pages).
