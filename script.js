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

    // Dados das aulas (IDs genéricos do YouTube ou links embed)
    const aulas = {
        raizes: {
            titulo: 'Raízes Quadradas',
            video: 'https://www.youtube.com/embed/-X5zHFi7MIg',
            descricao: 'Revisão de raízes quadradas, propriedades, exercícios e dicas de resolução.'
        },
        equacoes: {
            titulo: 'Equações',
            video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            descricao: 'Equações do 1º e 2º grau: resolução, formação e problemas aplicados.'
        },
        algebra: {
            titulo: 'Álgebra',
            video: 'https://www.youtube.com/embed/3GwjfUFyY6M',
            descricao: 'Fundamentos de álgebra: expressões, identidades e manipulações algébricas.'
        },
        somas: {
            titulo: 'Somas e Sequências',
            video: 'https://www.youtube.com/embed/oHg5SJYRHA0',
            descricao: 'Somas, progressões aritméticas e geométricas e aplicações em problemas.'
        }
    };

    // Tema persistente
    function applyTheme(theme) {
        if (theme === 'dark') document.documentElement.classList.add('dark-mode');
        else document.documentElement.classList.remove('dark-mode');
    }
    const savedTheme = localStorage.getItem('site-theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
    // Ajusta ícone inicial
    themeToggle.textContent = document.documentElement.classList.contains('dark-mode') ? '☀️' : '🌙';

    // Menu móvel
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Carregar aula (função exposta globalmente para chamadas onclick)
    window.carregarAula = function (key) {
        const data = aulas[key];
        if (!data) return;
        titulo.innerText = data.titulo;
        descricao.innerText = data.descricao;
        // usa sempre link embed
        video.src = data.video + '?rel=0&modestbranding=1';
        document.querySelector('.video-wrapper').setAttribute('aria-hidden', 'false');
        baixar.href = `materiais/${key}.pdf`;
        // fecha sidebar em mobile
        sidebar.classList.remove('open');
    };

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
