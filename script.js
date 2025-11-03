// Melhorias: tema persistente, sidebar móvel, player responsivo, armazenamento local de reclamações.

(function () {
    const themeToggle = document.getElementById('themeToggle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const titulo = document.getElementById('titulo-aula');
    const descricao = document.getElementById('descricao-aula');
    const video = document.getElementById('video-aula');
    const baixar = document.getElementById('baixar-material');
    const form = document.getElementById('reclameForm');
    const listaEl = document.getElementById('listaReclamacoes');
    const playOverlay = document.getElementById('playOverlay');

    // Dados das aulas (IDs genéricos do YouTube ou links embed)
    // Dados das aulas. Vídeos opcionais — se não houver vídeo configurado, o overlay abre busca no YouTube.
    const aulas = {
        raizes: {
            titulo: 'Raízes Quadradas',
            // Exemplo de embed (pode ser substituído por data/aulas.json no futuro)
            video: 'https://www.youtube.com/embed/-X5zHFi7MIg',
            descricao: 'Revisão de raízes quadradas, propriedades, exercícios e dicas de resolução.'
        },
        equacoes: {
            titulo: 'Equações',
            // vídeo não configurado — abre busca como fallback
            video: '',
            descricao: 'Equações do 1º e 2º grau: resolução, formação e problemas aplicados.'
        },
        algebra: {
            titulo: 'Álgebra',
            video: '',
            descricao: 'Fundamentos de álgebra: expressões, identidades e manipulações algébricas.'
        },
        somas: {
            titulo: 'Somas e Sequências',
            video: '',
            descricao: 'Somas, progressões aritméticas e geométricas e aplicações em problemas.'
        }
    };

    // Tema persistente
    function applyTheme(theme) {
        if (theme === 'dark') document.documentElement.classList.add('dark-mode');
        else document.documentElement.classList.remove('dark-mode');
    }
    // Detecta preferência do sistema se o usuário ainda não tiver uma escolha salva
    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme) applyTheme(savedTheme);
    else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
    // Ajusta ícone inicial
    themeToggle.textContent = document.documentElement.classList.contains('dark-mode') ? '☀️' : '🌙';

    // Menu móvel
    menuToggle.addEventListener('click', () => {
        const open = sidebar.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Fechar sidebar com ESC (acessibilidade)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') sidebar.classList.remove('open');
    });

    // Carregar aula (função exposta globalmente para chamadas onclick)
    // Carregar aula: definimos o data-src e mostramos overlay para lazy-load do iframe.
    window.carregarAula = function (key) {
        const data = aulas[key];
        if (!data) return;
        titulo.innerText = data.titulo;
        descricao.innerText = data.descricao;
        // config de download
        baixar.href = `materiais/${key}.pdf`;
        // configurar iframe de forma lazy: guardamos a url em data-src e removemos src atual
        if (data.video) {
            video.removeAttribute('src');
            video.dataset.src = data.video + '?rel=0&modestbranding=1';
            video.title = `Player de vídeo — ${data.titulo}`;
            // mostrar overlay para o usuário clicar e ativar autoplay/iframe
            if (playOverlay) {
                playOverlay.setAttribute('aria-hidden', 'false');
                playOverlay.setAttribute('aria-pressed', 'false');
            }
        } else {
            // fallback: não há vídeo configurado — o overlay abrirá busca no YouTube
            video.removeAttribute('src');
            delete video.dataset.src;
            if (playOverlay) {
                playOverlay.setAttribute('aria-hidden', 'false');
                playOverlay.setAttribute('aria-pressed', 'false');
            }
        }
        document.querySelector('.video-wrapper').setAttribute('aria-hidden', 'false');
        // fecha sidebar em mobile
        sidebar.classList.remove('open');
    };

    // Ao clicar no overlay, definimos o src do iframe para carregar o vídeo (lazy + autoplay)
    if (playOverlay) {
        playOverlay.addEventListener('click', () => {
            const src = video.dataset.src;
            playOverlay.setAttribute('aria-pressed', 'true');
            playOverlay.setAttribute('aria-hidden', 'true');
            if (src) {
                // autoplay quando houver fonte
                video.src = src + '&autoplay=1';
            } else {
                // se não há vídeo configurado, abrir busca do YouTube para o título atual
                const q = encodeURIComponent((titulo && titulo.innerText) || 'matemática');
                window.open('https://www.youtube.com/results?search_query=' + q, '_blank', 'noopener');
            }
        });
        // permitir ativação por Enter/Space
        playOverlay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playOverlay.click();
            }
        });
    }

    // Reclamações salvas no localStorage
    const STORAGE_KEY = 'reclamacoes';
    function carregarReclamacoes() {
        const raw = localStorage.getItem(STORAGE_KEY);
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
    }
    function salvarReclamacoes(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

    function renderReclamacoes() {
        const items = carregarReclamacoes();
        if (!listaEl) return;
        if (items.length === 0) {
            listaEl.innerHTML = '<p class="muted">Nenhuma reclamação enviada ainda.</p>';
            return;
        }
        listaEl.innerHTML = items.map(i => `<div class="item"><strong>${escapeHtml(i.nome)}</strong><div class="msg">${escapeHtml(i.mensagem)}</div><small class="meta">${new Date(i.ts).toLocaleString()}</small></div>`).join('');
    }

    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

    if (form) {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            if (!nome || !mensagem) { alert('Preencha nome e mensagem.'); return; }
            const items = carregarReclamacoes();
            items.unshift({ nome, mensagem, ts: Date.now() });
            salvarReclamacoes(items.slice(0, 50)); // manter histórico curto
            form.reset();
            renderReclamacoes();
            alert('Reclamação salva localmente. Obrigado pelo feedback!');
        });
    }

    // Inicializa lista
    renderReclamacoes();

    // Expor pequenas utilidades para debugging se necessário
    window._ENEMPrep = { aulas, carregarReclamacoes, salvarReclamacoes, renderReclamacoes };
})();
