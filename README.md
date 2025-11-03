# ENEM-prep

Site estático para preparação de matemática (ENEM / vestibular).
- Conteúdo indexado por tópicos (vídeos genéricos).
- Tema escuro persistente.
- Reclamações/sugestões salvas localmente (localStorage).
- Projeto estático, pronto para GitHub Pages.

Para testar localmente:
- HTTP rápido: `python3 -m http.server 8000`
- Abrir: "$BROWSER" http://localhost:8000

Deploy no GitHub Pages:
1. Commit e push para o repositório GitHub:
   git add . && git commit -m "Melhorias UI/UX e responsividade" && git push origin main
2. Ative GitHub Pages no repositório (Settings → Pages) apontando para a branch `main` (ou use `gh` CLI).

Alternativa com gh CLI (se ainda não publicou):
- gh repo create <nome> --public --source=. --remote=origin --push
- Ativar Pages via UI do GitHub (repositório → Settings → Pages).
