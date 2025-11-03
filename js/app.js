// app.js — módulo principal
// Importante: carregado como type="module" no HTML

const THEME_KEY = 'site-theme';
const STORAGE_KEY = 'reclamacoes';
const SUBMIT_THROTTLE_KEY = 'lastSubmitTs'; // sessionStorage
const aulaDataPath = 'data/aulas.json';

// DOM
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
const aulasList = document.getElementById('aulasList');
const toastContainer = document.getElementById('toastContainer');

let aulas = {};

// UTILIDADES
function escapeHtml(s){ return String(s).replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function showToast(message, type = 'info', ms = 3800){
  if (!toastContainer) return;
  const t = document.createElement('div');
  t.className = 'toast ' + (type === 'success' ? 'success' : type === 'error' ? 'error' : '');
  t.textContent = message;
  toastContainer.appendChild(t);
  setTimeout(()=> t.classList.add('hide'), ms - 300);
  setTimeout(()=> t.remove(), ms);
}

async function fetchAulas(){
  try {
    const res = await fetch(aulaDataPath, {cache: 'no-cache'});
    if (!res.ok) throw new Error('Não foi possível carregar dados');
    aulas = await res.json();
  } catch (err) {
    console.warn('Erro ao carregar aulas:', err);
    aulas = {};
  }
}

function buildSidebar(){
  if (!aulasList) return;
  aulasList.innerHTML = '';
  Object.keys(aulas).forEach((key) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = aulas[key].titulo || key;
    btn.dataset.key = key;
    btn.setAttribute('role','menuitem');
    btn.tabIndex = 0;
    btn.addEventListener('click', () => carregarAula(key));
    // keyboard: Enter
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btn.click();
    });
    li.appendChild(btn);
    aulasList.appendChild(li);
  });
}

// Carregar aula (lazy: set data-src, show overlay)
function carregarAula(key){
  const data = aulas[key];
  if (!data) return;
  titulo.innerText = data.titulo;
  descricao.innerText = data.descricao;
  baixar.href = `materiais/${key}.pdf`;
  // configurar lazy-src
  if (data.video) {
    video.removeAttribute('src');
    video.dataset.src = data.video + '?rel=0&modestbranding=1';
    video.title = `Player de vídeo — ${data.titulo}`;
    playOverlay && playOverlay.setAttribute('aria-hidden','false');
  } else {
    video.removeAttribute('src');
    delete video.dataset.src;
    playOverlay && playOverlay.setAttribute('aria-hidden','false');
  }
  document.querySelector('.video-wrapper').setAttribute('aria-hidden','false');
  sidebar.classList.remove('open');
  // checar material
  checkMaterialExists(key).then(exists => {
    if (!exists) {
      baixar.classList.add('disabled');
      baixar.setAttribute('aria-disabled','true');
      baixar.href = '#';
    } else {
      baixar.classList.remove('disabled');
      baixar.removeAttribute('aria-disabled');
    }
  });
}

async function checkMaterialExists(key){
  try {
    const url = `materiais/${key}.pdf`;
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch (e){
    return false;
  }
}

// overlay play
if (playOverlay){
  playOverlay.addEventListener('click', () => {
    const src = video.dataset.src;
    playOverlay.setAttribute('aria-pressed','true');
    playOverlay.setAttribute('aria-hidden','true');
    if (src) {
      video.src = src + '&autoplay=1';
    } else {
      const q = encodeURIComponent((titulo && titulo.innerText) || 'matemática');
      window.open('https://www.youtube.com/results?search_query=' + q, '_blank', 'noopener');
    }
  });
  playOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playOverlay.click();
    }
  });
}

// THEME
function applyTheme(theme){
  if (theme === 'dark') document.documentElement.classList.add('dark-mode');
  else document.documentElement.classList.remove('dark-mode');
}
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) applyTheme(saved);
  else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
  themeToggle && (themeToggle.textContent = document.documentElement.classList.contains('dark-mode') ? '☀️' : '🌙');
  themeToggle && themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    showToast('Tema atualizado', 'success', 1200);
  });
}

// SIDEBAR behavior
function initSidebar(){
  if (!menuToggle || !sidebar) return;
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      // focus first item
      const firstBtn = sidebar.querySelector('button[role="menuitem"]');
      firstBtn && firstBtn.focus();
    }
  });
  // close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') sidebar.classList.remove('open');
  });
  // click outside to close (mobile)
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
    }
  });
  // keyboard navigation inside sidebar (arrows)
  if (aulasList){
    aulasList.addEventListener('keydown', (e) => {
      const focusable = Array.from(aulasList.querySelectorAll('button[role="menuitem"]'));
      if (!focusable.length) return;
      const idx = focusable.indexOf(document.activeElement);
      if (e.key === 'ArrowDown'){
        e.preventDefault();
        const next = focusable[(idx + 1) % focusable.length];
        next.focus();
      } else if (e.key === 'ArrowUp'){
        e.preventDefault();
        const prev = focusable[(idx - 1 + focusable.length) % focusable.length];
        prev.focus();
      }
    });
  }
}

// RECLAMAÇÕES localStorage + anti-spam (30s)
function carregarReclamacoes(){
  const raw = localStorage.getItem(STORAGE_KEY);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function salvarReclamacoes(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
function renderReclamacoes(){
  const items = carregarReclamacoes();
  if (!listaEl) return;
  if (items.length === 0){
    listaEl.innerHTML = '<p class="muted">Nenhuma reclamação enviada ainda.</p>';
    return;
  }
  listaEl.innerHTML = items.map(i => `<div class="item"><strong>${escapeHtml(i.nome)}</strong><div class="msg">${escapeHtml(i.mensagem)}</div><small class="meta">${new Date(i.ts).toLocaleString()}</small></div>`).join('');
}

if (form){
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    if (!nome || !mensagem){ showToast('Preencha nome e mensagem.', 'error'); return; }
    const lastTs = Number(sessionStorage.getItem(SUBMIT_THROTTLE_KEY) || 0);
    const now = Date.now();
    const diff = now - lastTs;
    const THROTTLE = 30 * 1000;
    if (diff < THROTTLE){
      const wait = Math.ceil((THROTTLE - diff)/1000);
      showToast(`Aguarde ${wait}s antes de enviar outra reclamação.`, 'error');
      return;
    }
    const items = carregarReclamacoes();
    items.unshift({ nome, mensagem, ts: now });
    salvarReclamacoes(items.slice(0, 50));
    form.reset();
    sessionStorage.setItem(SUBMIT_THROTTLE_KEY, String(now));
    renderReclamacoes();
    showToast('Reclamação salva localmente. Obrigado!', 'success');
  });
}

// Init
async function init(){
  initTheme();
  await fetchAulas();
  buildSidebar();
  initSidebar();
  renderReclamacoes();
}

init();

// Expor funções para debugging (opcional)
window._ENEM = { carregarAula, carregarReclamacoes, salvarReclamacoes, renderReclamacoes };
