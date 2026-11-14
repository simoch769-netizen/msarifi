/* مصاريفي · Msarifi — local-only personal finance PWA (no backend). */
(() => {
'use strict';
const KEY = 'msarifi.v1';
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today = () => new Date().toLocaleDateString('en-CA');
const ym = d => d.slice(0, 7);
const nf = new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 2 });
const fmt = n => nf.format(Math.round((+n || 0) * 100) / 100) + ' DH';
const money = (n, cls = '') => `<span class="num ${cls}" data-count="${+n || 0}">${fmt(n)}</span>`;
const pct = n => nf.format(isFinite(n) ? Math.round(n * 10) / 10 : 0) + '%';
const MONTHS = ['يناير','فبراير','مارس','أبريل','ماي','يونيو','يوليوز','غشت','شتنبر','أكتوبر','نونبر','دجنبر'];
const DAYS = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const monthLabel = m => { const [y, mo] = m.split('-'); return `${MONTHS[+mo - 1]} ${y}`; };
const addMonth = (m, k) => { const [y, mo] = m.split('-').map(Number); const d = new Date(y, mo - 1 + k, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
const vib = p => { try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(p); } catch (e) {} };

/* ---------- icons ---------- */
const P = {
  plus:'<path d="M12 5v14M5 12h14"/>',
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  pie:'<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  bank:'<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>',
  gem:'<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6 4 6z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  coffee:'<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
  cart:'<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/>',
  bolt:'<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  ticket:'<path d="M3 9a3 3 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a3 3 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
  car:'<path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 12h14M9.5 17h5"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/>',
  tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  shirt:'<path d="M20.4 6.6 16 4a4 4 0 0 1-8 0L3.6 6.6a1 1 0 0 0-.5 1.2l1 3a1 1 0 0 0 1.1.6H7v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9h1.8a1 1 0 0 0 1-.6l1-3a1 1 0 0 0-.4-1.2z"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  gift:'<rect x="3" y="8" width="18" height="4"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  wallet:'<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15v13H5a2 2 0 0 1-2-2V5"/><path d="M16 13.5h.01"/>',
  up:'<path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  down:'<path d="M22 17l-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/>',
  gold:'<path d="M3 20h8l-1.6-5H4.6zM13 20h8l-1.6-5h-4.8zM8 13h8l-1.6-5H9.6z"/>',
  crypto:'<circle cx="12" cy="12" r="9"/><path d="M9.5 8h4a2 2 0 0 1 0 4h-4zM9.5 12h4.5a2 2 0 0 1 0 4H9.5zM9.5 7v10M11 6v2M13 6v2M11 16v2M13 16v2"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  building:'<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  download:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  upload:'<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
  chevL:'<path d="M15 18l-6-6 6-6"/>',
  chevR:'<path d="M9 18l6-6-6-6"/>',
  users:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M16 3.1a4 4 0 0 1 0 7.8M22 21v-1a6 6 0 0 0-4-5.6"/>',
  alert:'<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  wrench:'<path d="M18.4 2.6a2 2 0 0 1 3 3L12 15l-3-3z"/><path d="M9 12c-2.5 0-4 1.8-4 4 0 1.4-1 2.2-2 2.4 2.4 2.3 6.4 2 8-.2 1-1.4 1-3.2 0-4.2z"/>',
  spark:'<path d="M12 3l1.9 5.8L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.2z"/>',
  plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  brain:'<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 4 3V3zM15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-4 3V3z"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  kid:'<circle cx="12" cy="6" r="3"/><path d="M8 21l1-7-3-3M16 21l-1-7 3-3M9 14h6"/>'
};
const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.tag}</svg>`;
const CAT_ICONS = ['coffee','cart','bolt','ticket','car','heart','phone','shirt','book','gift','plane','kid','home','spark','wallet','tag'];
const COLORS = ['#7c5cff','#4f8bff','#00d4b4','#2fd387','#ffb547','#ff8a5c','#ff5c7a','#ff5c9a','#c98b5a','#8d97b0'];

/* ---------- state ---------- */
const DEFAULT_CATS = [
  { id:'cafe', name:'Café', ar:'قهوة', icon:'coffee', color:'#c98b5a', kind:'exp' },
  { id:'courses', name:'Courses', ar:'المرجان / السوبرمارشي', icon:'cart', color:'#2fd387', kind:'exp' },
  { id:'factures', name:'Factures', ar:'الماء، الضو، الأنترنيت', icon:'bolt', color:'#ffb547', kind:'exp' },
  { id:'sorties', name:'Sorties', ar:'الخرجات', icon:'ticket', color:'#ff5c9a', kind:'exp' },
  { id:'transport', name:'Transport', ar:'الطاكسي، الطرام، الليصانص', icon:'car', color:'#4f8bff', kind:'exp' },
  { id:'sante', name:'Santé', ar:'الصحة', icon:'heart', color:'#ff5c7a', kind:'exp' },
  { id:'credit', name:'Crédits', ar:'الكريديات', icon:'bank', color:'#7c5cff', kind:'exp' },
  { id:'autre', name:'Autre', ar:'حوايج أخرى', icon:'tag', color:'#8d97b0', kind:'exp' },
  { id:'salaire', name:'Salaire', ar:'الصالير', icon:'wallet', color:'#2fd387', kind:'inc' },
  { id:'extra', name:'Extra', ar:'مدخول آخر', icon:'gift', color:'#00d4b4', kind:'inc' }
];
const blank = () => ({ v:2, tx:[], cats:DEFAULT_CATS.map(c => ({...c})), budgets:{}, credits:[], creances:[], assets:[], rentals:[], recurring:[], goals:[], settings:{ payday:1, lastBackup:null, backupSnooze:null } });
let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)) || blank(); } catch (e) { S = blank(); }
  const b = blank();
  for (const k of Object.keys(b)) if (S[k] == null) S[k] = b[k];
  for (const k of Object.keys(b.settings)) if (!(k in S.settings)) S.settings[k] = b.settings[k];
  for (const c of DEFAULT_CATS) if (!S.cats.find(x => x.id === c.id)) S.cats.push({...c});
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('ما قدرتش نخبي الداتا', 'alert'); } }
const cat = id => S.cats.find(c => c.id === id) || S.cats.find(c => c.id === 'autre');

/* ---------- ui state ---------- */
const TABS = [
  { id:'home', label:'الرئيسية', icon:'home' },
  { id:'tx', label:'Mouvements', icon:'list' },
  { id:'gap' },
  { id:'budget', label:'Budget', icon:'pie' },
  { id:'debts', label:'Crédits', icon:'bank' },
  { id:'wealth', label:'Actifs', icon:'gem' }
];
const U = { tab:'home', month:ym(today()), txFilter:'all', debtSeg:'credits', wealthSeg:'assets', prevTab:0, counts:{}, q:'', catF:'', persist:null };

/* ---------- animation helpers ---------- */
const easeOut = t => 1 - Math.pow(1 - t, 3);
function countUps(root) {
  $$('[data-count]', root).forEach(el => {
    const to = +el.dataset.count, key = el.dataset.key;
    const from = key && U.counts[key] != null ? U.counts[key] : 0;
    if (key) U.counts[key] = to;
    if (RM.matches || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 900;
    const step = now => { const t = Math.min(1, (now - t0) / dur); el.textContent = fmt(from + (to - from) * easeOut(t)); if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
function grow(root) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$('[data-w]', root).forEach(el => el.style.width = el.dataset.w + '%');
    $$('[data-h]', root).forEach(el => el.style.height = el.dataset.h + '%');
    $$('circle[data-dash]', root).forEach(el => el.style.strokeDasharray = el.dataset.dash);
  }));
}
function stagger(root) { $$('.stagger', root).forEach(g => [...g.children].forEach((c, i) => c.style.setProperty('--d', i))); }
function animate(root) { stagger(root); countUps(root); grow(root); bindSwipes(root); }

function ripple(e) {
  const el = e.target.closest('.btn,.fab,.cat,.icon-btn,.chip-btn,.type-toggle button,.seg button,nav.tabs button,.check');
  if (!el || RM.matches) return;
  const r = el.getBoundingClientRect(), s = Math.max(r.width, r.height);
  const sp = document.createElement('span');
  sp.className = 'ripple';
  sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(sp); setTimeout(() => sp.remove(), 650);
}
function bounce(el) { if (!el || RM.matches) return; el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); }

let toastT;
function toast(msg, icon = 'check', action, html) {
  const t = $('#toast');
  t.innerHTML = ic(icon) + `<span>${html ? msg : esc(msg)}</span>` + (action ? `<button class="btn sm primary" id="toastAct">${esc(action.label)}</button>` : '');
  if (action) $('#toastAct').onclick = () => { action.fn(); t.classList.remove('show'); };
  t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), action ? 4500 : 2200);
}

function confetti(n = 140) {
  if (RM.matches) return;
  const cv = $('#confetti'), cx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.scale(dpr, dpr);
  const cols = ['#7c5cff','#4f8bff','#00d4b4','#2fd387','#ffb547','#ff5c9a'];
  const ps = Array.from({ length:n }, () => ({ x:innerWidth / 2, y:innerHeight * .45, vx:(Math.random() - .5) * 13, vy:-Math.random() * 13 - 4, r:Math.random() * 6 + 4, c:cols[Math.random() * cols.length | 0], a:Math.random() * 6, va:(Math.random() - .5) * .4, sq:Math.random() > .5 }));
  const t0 = performance.now();
  const step = now => {
    const el = now - t0; cx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of ps) { p.vy += .35; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.a += p.va;
      cx.save(); cx.globalAlpha = Math.max(0, 1 - el / 1800); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c;
      p.sq ? cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2) : (cx.beginPath(), cx.arc(0, 0, p.r / 2.4, 0, 7), cx.fill()); cx.restore(); }
    if (el < 1800) requestAnimationFrame(step); else cx.clearRect(0, 0, innerWidth, innerHeight);
  };
  requestAnimationFrame(step);
}
function success(withConfetti = true) {
  vib([18, 40, 28]);
  const d = document.createElement('div'); d.className = 'success';
  d.innerHTML = '<div class="disc"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>';
  document.body.appendChild(d);
  if (withConfetti) confetti();
  setTimeout(() => d.classList.add('out'), RM.matches ? 500 : 950);
  setTimeout(() => d.remove(), RM.matches ? 700 : 1350);
}

let egN = 0;
const EMPTY_SVG_T = `<svg viewBox="0 0 100 100"><defs><linearGradient id="eg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#00d4b4"/></linearGradient></defs>
<ellipse cx="50" cy="92" rx="26" ry="4" fill="currentColor" opacity=".15"/><rect x="14" y="26" width="72" height="56" rx="18" fill="url(#eg)"/>
<rect x="60" y="44" width="30" height="20" rx="10" fill="#fff" opacity=".9"/><circle cx="70" cy="54" r="3.5" fill="#7c5cff"/>
<ellipse class="eye" cx="34" cy="48" rx="4" ry="5.5" fill="#fff"/><ellipse class="eye" cx="50" cy="48" rx="4" ry="5.5" fill="#fff"/>
<path d="M35 62q7 6 14 0" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M30 26l8-12 8 12" fill="#ffb547"/></svg>`;
const empty = (title, sub, btn) => { const g = 'eg' + (++egN); return `<div class="empty"><div class="blob">${EMPTY_SVG_T.replace(/id="eg"/, `id="${g}"`).replace('url(#eg)', `url(#${g})`)}</div><b>${title}</b><div>${sub}</div>${btn ? `<button class="btn primary sm" style="margin-top:12px" data-act="${btn.act}">${ic('plus')}${btn.label}</button>` : ''}</div>`; };

/* ---------- computations ---------- */
const txOf = m => S.tx.filter(t => ym(t.date) === m);
function monthTotals(m) {
  let inc = 0, exp = 0; const by = {};
  for (const t of txOf(m)) { if (t.type === 'inc') inc += +t.amount; else { exp += +t.amount; by[t.cat] = (by[t.cat] || 0) + +t.amount; } }
  return { inc, exp, by, bal:inc - exp };
}
function netWorth() {
  const assets = S.assets.reduce((s, a) => s + (+a.current || 0), 0);
  const credits = S.credits.reduce((s, c) => s + Math.max(0, +c.remaining || 0), 0);
  const creances = S.creances.filter(c => !c.paid).reduce((s, c) => s + (+c.amount || 0), 0);
  return { assets, credits, creances, net:assets - credits + creances };
}
function rentalStats(r) {
  const e = r.entries || [];
  const sum = (ty, f = () => true) => e.filter(x => x.type === ty && f(x)).reduce((s, x) => s + +x.amount, 0);
  const inc = sum('inc'), exp = sum('exp'), reno = sum('reno');
  const cutoff = new Date(); cutoff.setFullYear(cutoff.getFullYear() - 1); const c = cutoff.toLocaleDateString('en-CA');
  const inc12 = sum('inc', x => x.date >= c), exp12 = sum('exp', x => x.date >= c);
  const invest = (+r.price || 0) + reno;
  return { inc, exp, reno, net:inc - exp, margin:inc ? (inc - exp) / inc * 100 : 0, net12:inc12 - exp12, yieldPct:invest ? (inc12 - exp12) / invest * 100 : 0, invest, payback:inc - exp - reno };
}
function overBudgets(m) {
  const { by } = monthTotals(m);
  return Object.entries(S.budgets).filter(([id, b]) => +b > 0 && (by[id] || 0) > +b).map(([id, b]) => ({ c:cat(id), spent:by[id], b:+b }));
}

/* ---------- render ---------- */
function renderTabs() {
  $('#tabs').innerHTML = TABS.map(t => t.id === 'gap' ? '<button class="gap" tabindex="-1" aria-hidden="true"></button>' :
    `<button data-tab="${t.id}" class="${U.tab === t.id ? 'on' : ''}">${ic(t.icon)}<span>${t.label}</span></button>`).join('');
}
function go(tab) {
  if (tab === U.tab) { render(); return; }
  const oi = TABS.findIndex(t => t.id === U.tab), ni = TABS.findIndex(t => t.id === tab);
  U.tab = tab; vib(8);
  $$('.view').forEach(v => v.classList.remove('active', 'back'));
  const v = $('#v-' + tab); v.classList.add('active'); if (ni < oi) v.classList.add('back');
  renderTabs(); render(); scrollTo({ top:0, behavior:RM.matches ? 'auto' : 'smooth' });
}
function render() {
  const v = $('#v-' + U.tab);
  ({ home:renderHome, tx:renderTx, budget:renderBudget, debts:renderDebts, wealth:renderWealth })[U.tab](v);
  animate(v); placeThumbs(v, true);
}
const monthNav = () => `<div class="month-nav"><button class="chip-btn" data-act="mPrev" aria-label="الشهر اللي فات">${ic('chevR')}</button><b>${monthLabel(U.month)}</b><button class="chip-btn" data-act="mNext" aria-label="الشهر الجاي">${ic('chevL')}</button></div>`;
const catIc = (c, size = '') => `<div class="ic" style="background:${c.color};${size}">${ic(c.icon)}</div>`;

function txItem(t) {
  const c = cat(t.cat), inc = t.type === 'inc';
  return `<div class="item-wrap"><div class="del-bg">${ic('trash')}${ic('trash')}</div><div class="item press" data-swipe="tx:${t.id}" data-act="editTx" data-id="${t.id}">
  ${catIc(c)}<div class="meta"><b>${esc(t.note || c.name)}</b><small>${t.rec ? ic('repeat', 'i mini') + ' ' : ''}${esc(c.name)} · ${t.date.slice(8)} ${MONTHS[+t.date.slice(5, 7) - 1]}</small></div>
  <div class="amt ${inc ? 'pos' : ''}"><span class="num">${inc ? '+' : '−'}${fmt(t.amount)}</span></div></div></div>`;
}

function donut(by, total) {
  const ents = Object.entries(by).sort((a, b) => b[1] - a[1]);
  const R = 52, C = 2 * Math.PI * R; let off = 0;
  const segs = ents.map(([id, v]) => { const len = v / total * C; const gap = ents.length > 1 ? Math.min(4, len * .3) : 0;
    const s = `<circle r="${R}" cx="70" cy="70" stroke="${cat(id).color}" stroke-dasharray="0 ${C}" data-dash="${Math.max(0.01, len - gap)} ${C}" stroke-dashoffset="${-off}"/>`; off += len; return s; }).join('');
  return `<div class="donut-wrap"><div class="donut"><svg viewBox="0 0 140 140"><circle r="${R}" cx="70" cy="70" stroke="currentColor" opacity=".08"/>${segs}</svg>
  <div class="center"><div><small>Dépenses</small><b>${money(total)}</b></div></div></div>
  <div class="legend">${ents.slice(0, 6).map(([id, v]) => `<div><i style="background:${cat(id).color}"></i><span>${esc(cat(id).name)}</span><b class="num">${pct(v / total * 100)}</b></div>`).join('')}</div></div>`;
}

function renderHome(v) {
  const m = U.month, T = monthTotals(m), N = netWorth(), over = overBudgets(m);
  const spentPct = T.inc ? Math.min(100, T.exp / T.inc * 100) : 0;
  const ents = Object.entries(T.by).sort((a, b) => b[1] - a[1]);
  const maxV = ents.length ? ents[0][1] : 1;
  const months = Array.from({ length:6 }, (_, i) => addMonth(m, i - 5)).map(mm => ({ mm, ...monthTotals(mm) }));
  const mx = Math.max(1, ...months.map(x => Math.max(x.inc, x.exp)));
  const recent = [...S.tx].sort((a, b) => b.date.localeCompare(a.date) || b.ts - a.ts).slice(0, 5);
  v.innerHTML = monthNav() + `<div class="stagger">
  <div class="card hero"><div class="lbl">الباقي ليك هاد الشهر</div><div class="big">${money(T.bal).replace('data-count', 'data-key="hbal" data-count')}</div>
    <div class="bar" style="background:rgba(255,255,255,.2);margin-top:10px"><i data-w="${spentPct}" style="background:#fff"></i></div>
    <div class="lbl" style="margin-top:6px;font-size:12px">صرفتي <span class="num">${pct(spentPct)}</span> من المدخول</div>
    <div class="sub"><div class="pill"><small>Revenus · دخل</small><b>${money(T.inc)}</b></div><div class="pill"><small>Dépenses · خرج</small><b>${money(T.exp)}</b></div></div></div>
  ${over.map(o => `<div class="alert">${ic('alert')}<span>فايت الميزانية ديال ${esc(o.c.name)} بـ <span class="num">${fmt(o.spent - o.b)}</span></span></div>`).join('')}
  ${backupBanner()}${insightsCard()}
  <div class="card"><h2>فين مشا الصالير؟ <span class="tag">${monthLabel(m)}</span></h2>
    ${T.exp ? donut(T.by, T.exp) + `<div class="hbars">${ents.map(([id, val]) => `<div class="hbar"><span>${esc(cat(id).name)}</span><div class="t"><i data-w="${val / maxV * 100}" style="background:${cat(id).color}"></i></div><b class="num">${fmt(val)}</b></div>`).join('')}</div>`
      : empty('مازال ما صرفتي والو هاد الشهر', 'ضغط على + باش تزيد أول مصروف', { act:'add', label:'زيد مصروف' })}</div>
  <div class="card"><h2>Patrimoine net · شحال عندك <span class="tag green">${ic('gem')}</span></h2>
    <div style="font-size:28px;font-weight:800" class="${N.net >= 0 ? '' : 'neg'}">${money(N.net)}</div>
    <div class="grid2" style="margin-top:10px">
      <div class="stat"><small>Actifs · الممتلكات</small><b class="pos">${money(N.assets)}</b></div>
      <div class="stat"><small>Crédits · الكريديات</small><b class="neg">−${money(N.credits)}</b></div>
      <div class="stat"><small>Créances · سالك الناس</small><b>${money(N.creances)}</b></div>
      <div class="stat"><small>Biens en location</small><b>${S.rentals.length}</b></div>
    </div><div class="hint">Actifs − Crédits + Créances</div></div>
  <div class="card"><h2>آخر 6 شهور <span class="row" style="gap:10px;font-size:11px;font-weight:600"><span class="row" style="gap:4px"><i style="width:9px;height:9px;border-radius:3px;background:var(--ok)"></i>دخل</span><span class="row" style="gap:4px"><i style="width:9px;height:9px;border-radius:3px;background:var(--danger)"></i>خرج</span></span></h2>
    <div class="cols">${months.map(x => `<div class="c"><div class="pair"><i data-h="${x.inc / mx * 100}" style="background:var(--ok)"></i><i data-h="${x.exp / mx * 100}" style="background:var(--danger)"></i></div><span>${MONTHS[+x.mm.slice(5) - 1].slice(0, 4)}</span></div>`).join('')}</div></div>
  <div class="sec-title">آخر الحركات <button class="btn sm" data-act="goTx">شوف كلشي</button></div>
  <div class="list stagger">${recent.length ? recent.map(txItem).join('') : empty('والو هنا', 'أول حركة غادي تبان هنا')}</div></div>`;
}

function txMatches(t) {
  if (U.txFilter !== 'all' && t.type !== U.txFilter) return false;
  if (U.catF && t.cat !== U.catF) return false;
  const q = U.q.trim().toLowerCase(); if (!q) return true;
  const c = cat(t.cat), n = num(q);
  return (t.note || '').toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || (c.ar || '').includes(q) || (n > 0 && Math.abs(+t.amount - n) < 0.01);
}
function txListHtml() {
  const searching = !!U.q.trim();
  const base = searching ? S.tx : txOf(U.month);
  const list = base.filter(txMatches).sort((a, b) => b.date.localeCompare(a.date) || b.ts - a.ts);
  const groups = {}; list.forEach(t => (groups[t.date] = groups[t.date] || []).push(t));
  const tot = list.reduce((s, t) => s + (t.type === 'inc' ? +t.amount : -t.amount), 0);
  const head = (searching || U.catF) ? `<div class="day-h"><span>${list.length} حركة${searching ? ' فكاع الشهور' : ''}</span><span class="num">${fmt(tot)}</span></div>` : '';
  if (!list.length) return head + (searching || U.catF ? empty('ما لقيت والو', 'جرب كلمة أخرى ولا بدل الفئة') : empty('حتى حركة هاد الشهر', 'سجل المصاريف ديالك وشوف فين كيمشيو الفلوس', { act:'add', label:'زيد حركة' }));
  return head + Object.entries(groups).map(([d, ts]) => { const dt = new Date(d + 'T12:00');
    const day = ts.reduce((s, t) => s + (t.type === 'inc' ? +t.amount : -t.amount), 0);
    return `<div class="day-h"><span>${DAYS[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()]}${searching ? ' ' + dt.getFullYear() : ''}</span><span class="num">${fmt(day)}</span></div><div class="list stagger">${ts.map(txItem).join('')}</div>`; }).join('')
   + '<div class="hint">سحب الحركة لجيهة باش تمسحها · ضغط عليها باش تبدلها</div>';
}
function renderTx(v) {
  const T = monthTotals(U.month);
  v.innerHTML = monthNav() + `<div class="searchbar">${ic('search')}<input id="txSearch" class="input" type="search" placeholder="قلب: المرجان، قهوة، 150…" value="${esc(U.q)}" aria-label="قلب"></div>
  <div class="chips" id="catChips"><button class="chip ${U.catF ? '' : 'on'}" data-catf="">كلشي</button>${S.cats.filter(c => S.tx.some(t => t.cat === c.id)).map(c => `<button class="chip ${U.catF === c.id ? 'on' : ''}" data-catf="${c.id}"><i style="background:${c.color}"></i>${esc(c.name)}</button>`).join('')}</div>` +
  seg('txFilter', [['all', 'كلشي'], ['exp', 'Dépenses'], ['inc', 'Revenus']]) +
  `<div class="grid2 stagger" style="margin-bottom:6px"><div class="card stat"><small>Dépenses · ${monthLabel(U.month)}</small><b class="neg">${money(T.exp)}</b></div><div class="card stat"><small>Revenus</small><b class="pos">${money(T.inc)}</b></div></div><div id="txList">${txListHtml()}</div>`;
  const si = $('#txSearch', v);
  si.oninput = () => { U.q = si.value; const l = $('#txList', v); l.innerHTML = txListHtml(); stagger(l); bindSwipes(l); };
  $('#catChips', v).onclick = e => { const b = e.target.closest('[data-catf]'); if (!b) return; U.catF = b.dataset.catf; vib(6);
    $$('.chip', v).forEach(x => x.classList.toggle('on', x === b)); const l = $('#txList', v); l.innerHTML = txListHtml(); animate(l); };
}

function seg(key, opts) {
  return `<div class="seg" data-seg="${key}"><span class="thumb"></span>${opts.map(([val, l]) => `<button data-segval="${val}" class="${U[key] === val ? 'on' : ''}">${l}</button>`).join('')}</div>`;
}
function placeThumbs(root, instant) {
  $$('.seg', root).forEach(s => { const on = $('button.on', s), th = $('.thumb', s); if (!on) return;
    if (instant) th.style.transition = 'none';
    th.style.left = on.offsetLeft + 'px'; th.style.width = on.offsetWidth + 'px';
    if (instant) requestAnimationFrame(() => th.style.transition = ''); });
}

function renderBudget(v) {
  const T = monthTotals(U.month), cats = S.cats.filter(c => c.kind === 'exp');
  const totB = cats.reduce((s, c) => s + (+S.budgets[c.id] || 0), 0);
  const totS = cats.filter(c => +S.budgets[c.id] > 0).reduce((s, c) => s + (T.by[c.id] || 0), 0);
  const p = totB ? totS / totB * 100 : 0;
  v.innerHTML = monthNav() + `<div class="stagger">
  <div class="card"><h2>Budget du mois · الميزانية <span class="badge ${p > 100 ? 'over' : p > 80 ? 'warn' : 'ok'}">${pct(p)}</span></h2>
   <div class="row between"><div class="stat"><small>صرفتي</small><b>${money(totS)}</b></div><div class="stat" style="text-align:left"><small>الميزانية</small><b>${money(totB)}</b></div></div>
   <div class="bar ${p > 100 ? 'over' : p > 80 ? 'warn' : ''}" style="margin-top:10px"><i data-w="${Math.min(100, p)}"></i></div>
   ${totB ? `<div class="hint">${totB - totS >= 0 ? `باقي ليك <span class="num">${fmt(totB - totS)}</span> تصرفهم هاد الشهر` : `فايت الميزانية بـ <span class="num">${fmt(totS - totB)}</span>`}</div>` : '<div class="hint">ضغط على شي فئة باش تحدد ليها الميزانية</div>'}</div>
  <div class="card">${cats.map(c => { const b = +S.budgets[c.id] || 0, s = T.by[c.id] || 0, q = b ? s / b * 100 : 0;
    const st = !b ? '' : q > 100 ? 'over' : q > 80 ? 'warn' : 'ok';
    return `<div class="budget-row press" data-act="setBudget" data-id="${c.id}" style="cursor:pointer"><div class="row">${catIc(c, 'width:36px;height:36px;border-radius:12px')}
      <div style="flex:1"><div class="row between"><b style="font-size:14px">${esc(c.name)}</b>${b ? `<span class="badge ${st}">${q > 100 ? 'فايت!' : pct(q)}</span>` : `<span class="tag">${ic('plus', 'i')} حدد</span>`}</div>
      <small class="muted"><span class="num">${fmt(s)}${b ? ' / ' + fmt(b) : ''}</span></small></div></div>
      ${b ? `<div class="bar ${st}" style="margin-top:8px"><i data-w="${Math.min(100, q)}"></i></div>` : ''}</div>`; }).join('')}</div></div>`;
}

function renderDebts(v) {
  let body;
  if (U.debtSeg === 'credits') {
    const rem = S.credits.reduce((s, c) => s + (+c.remaining || 0), 0), mon = S.credits.filter(c => +c.remaining > 0).reduce((s, c) => s + (+c.monthly || 0), 0);
    body = `<div class="grid2 stagger"><div class="card stat"><small>الباقي فالكريديات</small><b class="neg">${money(rem)}</b></div><div class="card stat"><small>كتخلص فالشهر</small><b>${money(mon)}</b></div></div>
    <div class="stagger">${S.credits.length ? S.credits.map(c => { const paid = c.total ? (c.total - c.remaining) / c.total * 100 : 0, left = +c.monthly ? Math.ceil(c.remaining / c.monthly) : 0;
      return `<div class="card"><div class="row between"><div class="row">${catIc({ color:'#7c5cff', icon:'bank' })}<div><b>${esc(c.name)}</b><div class="muted" style="font-size:12px">${esc(c.bank || 'Crédit')}</div></div></div>
        <button class="icon-btn press" data-act="editCredit" data-id="${c.id}" aria-label="بدل">${ic('edit')}</button></div>
        <div class="bar" style="margin:12px 0 6px"><i data-w="${Math.max(0, Math.min(100, paid))}"></i></div>
        <div class="kv"><span>خلصتي</span><b class="num">${pct(paid)}</b></div>
        <div class="kv"><span>Total</span><b>${money(c.total)}</b></div><div class="kv"><span>Mensualité</span><b>${money(c.monthly)}</b></div>
        <div class="kv"><span>Reste · الباقي</span><b class="neg">${money(c.remaining)}</b></div><div class="kv"><span>شحال باقي من شهر</span><b class="num">${left}</b></div>
        ${+c.remaining > 0 ? `<button class="btn primary block" style="margin-top:8px" data-act="payCredit" data-id="${c.id}">${ic('check')} خلصت هاد الشهر</button>` : '<div class="tag green" style="margin-top:8px">🎉 تخلص كامل</div>'}</div>`; }).join('')
      : empty('ما عندك حتى كريدي', 'إلا عندك كريدي، زيدو هنا وتبع شحال باقي', { act:'addCredit', label:'زيد كريدي' })}</div>
    ${S.credits.length ? `<button class="btn block" data-act="addCredit">${ic('plus')} زيد كريدي</button>` : ''}`;
  } else {
    const open = S.creances.filter(c => !c.paid), done = S.creances.filter(c => c.paid);
    const tot = open.reduce((s, c) => s + +c.amount, 0);
    const it = c => `<div class="item-wrap"><div class="del-bg">${ic('trash')}${ic('trash')}</div><div class="item ${c.paid ? 'paid' : ''}" data-swipe="creance:${c.id}">
      <div class="ic" style="background:#00d4b4">${ic('users')}</div><div class="meta press" data-act="editCreance" data-id="${c.id}"><b>${esc(c.person)}</b><small>${esc(c.note || '')} ${c.date ? '· ' + c.date : ''}</small></div>
      <div class="amt"><span class="num">${fmt(c.amount)}</span></div><button class="check ${c.paid ? 'on' : ''}" data-act="togglePaid" data-id="${c.id}" aria-label="خلصني">${ic('check')}</button></div></div>`;
    body = `<div class="card hero stagger"><div class="lbl">الناس سالينك</div><div class="big">${money(tot)}</div><div class="lbl">${open.length} ديال الناس مازال ما خلصوش</div></div>
    ${S.creances.length ? `<div class="list stagger">${open.map(it).join('')}</div>${done.length ? `<div class="sec-title">خلصوني ✓</div><div class="list stagger">${done.map(it).join('')}</div>` : ''}<div class="hint">ضغط على ✓ ملي يخلصك</div>`
      : empty('حتى واحد ما سالك', 'سجل الفلوس اللي سلفتي باش ما تنساهمش', { act:'addCreance', label:'زيد واحد سالك' })}
    ${S.creances.length ? `<button class="btn block" style="margin-top:12px" data-act="addCreance">${ic('plus')} زيد واحد سالك</button>` : ''}`;
  }
  v.innerHTML = seg('debtSeg', [['credits', 'Crédits · الكريديات'], ['creances', 'Créances · سالك']]) + body;
}

const ASSET_T = { house:['الدار / Appartement', 'home', '#4f8bff'], car:['الطوموبيل', 'car', '#ff8a5c'], gold:['الذهب', 'gold', '#ffb547'], crypto:['Crypto', 'crypto', '#7c5cff'], other:['حاجة أخرى', 'box', '#8d97b0'] };
function renderWealth(v) {
  let body;
  if (U.wealthSeg === 'goals') body = goalsHtml();
  else if (U.wealthSeg === 'assets') {
    const cur = S.assets.reduce((s, a) => s + +a.current, 0), buy = S.assets.reduce((s, a) => s + +a.buy, 0), g = cur - buy;
    body = `<div class="card hero stagger"><div class="lbl">Actifs · القيمة دابا</div><div class="big">${money(cur)}</div>
      <div class="sub"><div class="pill"><small>شريتهم بـ</small><b>${money(buy)}</b></div><div class="pill"><small>${g >= 0 ? 'ربحتي' : 'خسرتي'}</small><b><span class="num">${g >= 0 ? '+' : '−'}</span>${money(Math.abs(g))} <span class="num" style="font-size:12px">(${pct(buy ? g / buy * 100 : 0)})</span></b></div></div></div>
    <div class="list stagger">${S.assets.length ? S.assets.map(a => { const t = ASSET_T[a.type] || ASSET_T.other, d = a.current - a.buy, dp = a.buy ? d / a.buy * 100 : 0;
      return `<div class="item-wrap"><div class="del-bg">${ic('trash')}${ic('trash')}</div><div class="item press" data-swipe="asset:${a.id}" data-act="editAsset" data-id="${a.id}">${catIc({ color:t[2], icon:t[1] })}
      <div class="meta"><b>${esc(a.name || t[0])}</b><small>${t[0]} · شريتها بـ <span class="num">${fmt(a.buy)}</span></small></div>
      <div class="amt" style="text-align:left"><span class="num">${fmt(a.current)}</span><br><small class="${d >= 0 ? 'pos' : 'neg'} num" style="font-size:12px">${d >= 0 ? '▲ +' : '▼ −'}${fmt(Math.abs(d))} (${pct(dp)})</small></div></div></div>`; }).join('')
      : empty('مازال ما زدتي حتى حاجة', 'الدار، الطوموبيل، الذهب، الكريبتو… شوف شحال ربحتي فيهم', { act:'addAsset', label:'زيد حاجة' })}</div>
    ${S.assets.length ? `<button class="btn block" style="margin-top:12px" data-act="addAsset">${ic('plus')} زيد حاجة</button>` : ''}`;
  } else {
    body = `<div class="stagger">${S.rentals.length ? S.rentals.map(r => { const st = rentalStats(r);
      const ent = [...(r.entries || [])].sort((a, b) => b.date.localeCompare(a.date));
      return `<div class="card"><div class="row between"><div class="row">${catIc({ color:r.kind === 'airbnb' ? '#ff5c9a' : '#4f8bff', icon:'building' })}<div><b>${esc(r.name)}</b><div><span class="tag">${r.kind === 'airbnb' ? 'Airbnb · كرا بالليلة' : 'كرا عادي · Location longue'}</span></div></div></div>
        <button class="icon-btn press" data-act="editRental" data-id="${r.id}" aria-label="بدل">${ic('edit')}</button></div>
        <div class="grid2" style="margin-top:12px">
         <div class="stat"><small>Revenus · دخل</small><b class="pos">${money(st.inc)}</b></div><div class="stat"><small>Charges · مصاريف</small><b class="neg">${money(st.exp)}</b></div>
         <div class="stat"><small>Net · الصافي</small><b class="${st.net >= 0 ? 'pos' : 'neg'}">${money(st.net)}</b></div><div class="stat"><small>Marge nette</small><b class="num">${pct(st.margin)}</b></div>
         <div class="stat"><small>Rendement / عام</small><b class="num ${st.yieldPct >= 0 ? 'pos' : 'neg'}">${pct(st.yieldPct)}</b></div><div class="stat"><small>Rénovation · الإصلاح</small><b>${money(st.reno)}</b></div>
        </div>
        <div class="kv" style="margin-top:8px"><span>الاستثمار (الثمن + الإصلاح)</span><b>${money(st.invest)}</b></div>
        <div class="kv"><span>رجعو ليك من الإصلاح</span><b class="num">${pct(st.reno ? Math.max(0, st.net) / st.reno * 100 : 0)}</b></div>
        <div class="bar" style="margin:4px 0 10px"><i data-w="${st.reno ? Math.min(100, Math.max(0, st.net) / st.reno * 100) : 0}"></i></div>
        <div class="row" style="gap:6px"><button class="btn sm primary" style="flex:1" data-act="rentEntry" data-id="${r.id}" data-type="inc">${ic('up')} دخل</button>
        <button class="btn sm" style="flex:1" data-act="rentEntry" data-id="${r.id}" data-type="exp">${ic('down')} مصروف</button>
        <button class="btn sm" style="flex:1" data-act="rentEntry" data-id="${r.id}" data-type="reno">${ic('wrench')} إصلاح</button></div>
        ${ent.length ? `<details style="margin-top:10px"><summary class="muted" style="cursor:pointer;font-size:13px">الحركات (${ent.length})</summary><div class="list" style="margin-top:8px">${ent.map(e => `<div class="item-wrap"><div class="del-bg">${ic('trash')}${ic('trash')}</div><div class="item" data-swipe="rent:${r.id}:${e.id}" style="padding:9px">
          <div class="meta"><b>${esc(e.note || ({ inc:'دخل', exp:'مصروف', reno:'إصلاح' })[e.type])}</b><small>${({ inc:'Revenu', exp:'Charge', reno:'Rénovation' })[e.type]} · ${e.date}</small></div><div class="amt ${e.type === 'inc' ? 'pos' : 'neg'}"><span class="num">${e.type === 'inc' ? '+' : '−'}${fmt(e.amount)}</span></div></div></div>`).join('')}</div></details>` : ''}
      </div>`; }).join('') : empty('ما عندك حتى ملك كتكريه', 'زيد شقة ديال Airbnb ولا كرا عادي وحسب الربح الصافي', { act:'addRental', label:'زيد ملك' })}</div>
    ${S.rentals.length ? `<button class="btn block" data-act="addRental">${ic('plus')} زيد ملك</button>` : ''}`;
  }
  v.innerHTML = seg('wealthSeg', [['assets', 'Actifs'], ['rentals', 'Location'], ['goals', 'Objectifs']]) + body;
}

/* ---------- swipe to delete ---------- */
function bindSwipes(root) {
  $$('[data-swipe]', root).forEach(el => {
    if (el._sw) return; el._sw = 1;
    let x0, y0, dx = 0, on = false, locked = null;
    el.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; dx = 0; on = true; locked = null; });
    el.addEventListener('pointermove', e => {
      if (!on) return; const mx = e.clientX - x0, my = e.clientY - y0;
      if (locked === null && (Math.abs(mx) > 8 || Math.abs(my) > 8)) { locked = Math.abs(mx) > Math.abs(my); if (locked) { el.classList.add('dragging'); try { el.setPointerCapture(e.pointerId); } catch (_) {} } }
      if (locked) { dx = mx; el.style.transform = `translateX(${dx}px)`; }
    });
    const end = () => { if (!on) return; on = false; el.classList.remove('dragging');
      if (locked && Math.abs(dx) > el.offsetWidth * .35) { el._swiped = true; vib(25); el.style.transform = `translateX(${dx > 0 ? 110 : -110}%)`; el.style.opacity = '0'; setTimeout(() => removeBySwipe(el.dataset.swipe), 260); }
      else { el.style.transform = ''; if (locked) el._swiped = true; setTimeout(() => el._swiped = false, 50); } };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  });
}
function removeBySwipe(key) {
  const snap = JSON.stringify(S); const [k, id, sub] = key.split(':');
  if (k === 'tx') { skipRec(S.tx.find(t => t.id === id)); S.tx = S.tx.filter(t => t.id !== id); }
  if (k === 'creance') S.creances = S.creances.filter(t => t.id !== id);
  if (k === 'asset') S.assets = S.assets.filter(t => t.id !== id);
  if (k === 'rent') { const r = S.rentals.find(x => x.id === id); if (r) r.entries = r.entries.filter(e => e.id !== sub); }
  save(); render();
  toast('تمسحات', 'trash', { label:'رجعها', fn:() => { S = JSON.parse(snap); save(); render(); } });
}

/* ---------- sheet ---------- */
let sheetOnClose = null;
function openSheet(html, mount) {
  $('#sheetBody').innerHTML = html; const sh = $('#sheet');
  $('#backdrop').classList.add('show'); sh.classList.add('show'); sh.scrollTop = 0; $('#fab').classList.add('open');
  vib(10); mount && mount(sh);
}
function closeSheet() { $('#sheet').classList.remove('show'); $('#backdrop').classList.remove('show'); $('#fab').classList.remove('open'); $('#sheet').style.transform = ''; sheetOnClose && sheetOnClose(); sheetOnClose = null; }
function sheetDrag() {
  const sh = $('#sheet'); let y0 = null, dy = 0;
  sh.addEventListener('touchstart', e => { if (sh.scrollTop > 0 || e.target.closest('input,textarea,select,.cats')) { y0 = null; return; } y0 = e.touches[0].clientY; dy = 0; }, { passive:true });
  sh.addEventListener('touchmove', e => { if (y0 == null) return; dy = e.touches[0].clientY - y0; if (dy > 0) { sh.classList.add('dragging'); sh.style.transform = `translateY(${dy}px)`; } }, { passive:true });
  sh.addEventListener('touchend', () => { if (y0 == null) return; sh.classList.remove('dragging'); if (dy > 110) closeSheet(); else sh.style.transform = ''; y0 = null; });
}
const field = (label, inner) => `<div class="field"><label>${label}</label>${inner}</div>`;
const inp = (name, val = '', type = 'text', extra = '') => `<input class="input" name="${name}" type="${type}" value="${esc(val)}" ${type === 'number' ? 'inputmode="decimal" step="any" min="0"' : ''} ${extra}>`;
const head = (t, delAct, id) => `<h3>${t}<span class="row">${delAct ? `<button class="icon-btn press" data-act="${delAct}" data-id="${id}" aria-label="مسح" style="color:var(--danger)">${ic('trash')}</button>` : ''}<button class="icon-btn press" data-act="close" aria-label="سد">${ic('x')}</button></span></h3>`;
const formVals = f => Object.fromEntries(new FormData(f).entries());
const num = v => { const n = parseFloat(String(v).replace(',', '.').replace(/\s/g, '')); return isFinite(n) ? n : 0; };
function invalid(el) { el.animate && !RM.matches && el.animate([{ transform:'translateX(0)' }, { transform:'translateX(-8px)' }, { transform:'translateX(8px)' }, { transform:'translateX(0)' }], { duration:300 }); el.focus(); vib([30, 30, 30]); }

function presets(type) {
  const since = isoD(new Date(Date.now() - 120 * DAY)), m = {};
  S.tx.filter(t => t.type === type && t.date >= since && !t.rec).forEach(t => { const k = t.cat + '|' + (t.note || '').trim().toLowerCase() + '|' + t.amount;
    (m[k] = m[k] || { cat:t.cat, note:(t.note || '').trim(), amount:+t.amount, n:0, last:0 }); m[k].n++; m[k].last = Math.max(m[k].last, t.ts || 0); });
  return Object.values(m).filter(x => x.n >= 2).sort((a, b) => b.n - a.n || b.last - a.last).slice(0, 6);
}
function txSheet(t, pre = {}) {
  const ed = !!t; t = t || { type:pre.type || 'exp', amount:pre.amount || '', cat:pre.cat || '', note:pre.note || '', date:today() };
  let type = t.type, sel = t.cat, manualCat = !!t.cat;
  const cats = () => S.cats.filter(c => c.kind === type);
  const catsHtml = () => cats().map(c => `<button type="button" class="cat ${c.id === sel ? 'on' : ''}" data-cat="${c.id}">${catIc(c)}<span>${esc(c.name)}</span></button>`).join('') + `<button type="button" class="cat" data-newcat="1"><div class="ic" style="background:var(--card);color:var(--text);border:1.5px dashed var(--muted)">${ic('plus')}</div><span>جديدة</span></button>`;
  const presHtml = () => { const p = presets(type); return p.length ? p.map((x, i) => `<button type="button" class="chip preset" data-pi="${i}"><i style="background:${cat(x.cat).color}"></i>${esc(x.note || cat(x.cat).name)} · <span class="num">${fmt(x.amount)}</span></button>`).join('') : ''; };
  const rule = t.rec && S.recurring.find(r => r.id === t.rec);
  openSheet(head(ed ? 'بدل الحركة' : 'زيد حركة', ed && 'delTx', t.id) + `<form id="txForm" autocomplete="off">
    <div class="type-toggle"><button type="button" class="exp ${type === 'exp' ? 'on' : ''}" data-type="exp">${ic('down')} Dépense · خرج</button><button type="button" class="inc ${type === 'inc' ? 'on' : ''}" data-type="inc">${ic('up')} Revenu · دخل</button></div>
    ${ed ? '' : `<div class="chips presets" id="presets">${presHtml()}</div>`}
    <div class="amount-box"><input class="input amount-in" name="amount" type="text" inputmode="decimal" placeholder="0" value="${esc(t.amount)}" aria-label="المبلغ"><div class="cur">DH · درهم</div></div>
    <div class="cats" id="catGrid">${catsHtml()}</div>
    ${field('Note · ملاحظة', inp('note', t.note, 'text', 'placeholder="مثلا: المرجان، قهوة مع صحابي…" maxlength="80" list="noteList"'))}
    <datalist id="noteList">${[...new Set(S.tx.map(x => (x.note || '').trim()).filter(Boolean))].slice(-40).map(n => `<option value="${esc(n)}">`).join('')}</datalist>
    ${field('التاريخ', inp('date', t.date, 'date'))}
    ${ed ? (rule ? `<div class="hint" style="margin:-4px 0 12px">${ic('repeat', 'i mini')} هادي حركة كتعاود كل شهر (نهار ${rule.day}). التبديل هنا كيمس غير هاد الشهر · <a href="#" data-act="editRec" data-id="${rule.id}">بدل القاعدة</a></div>` : '')
      : `<label class="switch-row"><input type="checkbox" name="repeat" ${pre.repeat ? 'checked' : ''}><span class="sw"></span><span>${ic('repeat', 'i mini')} كتعاود كل شهر <small class="muted">(الصالير، الكرا، الأنترنيت…)</small></span></label>`}
    <button class="btn primary block" type="submit" style="padding:16px;font-size:16px">${ic('check')} ${ed ? 'سجل التبديل' : 'سجل'}</button></form>`, sh => {
    const f = $('#txForm', sh), grid = $('#catGrid', sh), a = f.amount;
    if (!ed) setTimeout(() => a.focus(), RM.matches ? 0 : 380);
    const pick = id => { sel = id; $$('.cat', grid).forEach(x => x.classList.toggle('on', x.dataset.cat === id)); };
    $$('.type-toggle button', sh).forEach(b => b.onclick = () => { type = b.dataset.type; sel = ''; manualCat = false; $$('.type-toggle button', sh).forEach(x => x.classList.toggle('on', x === b)); grid.innerHTML = catsHtml(); stagIn(grid); const pr = $('#presets', sh); if (pr) { pr.innerHTML = presHtml(); stagIn(pr); } vib(8); });
    const pr = $('#presets', sh);
    if (pr) pr.onclick = e => { const b = e.target.closest('[data-pi]'); if (!b) return; const x = presets(type)[+b.dataset.pi];
      a.value = x.amount; f.note.value = x.note; pick(x.cat); manualCat = true; bounce(b); vib(10); $$('.preset', pr).forEach(c => c.classList.toggle('on', c === b)); };
    f.note.oninput = () => { if (manualCat) return; const n = f.note.value.trim().toLowerCase(); if (n.length < 2) return;
      const hit = [...S.tx].reverse().find(x => x.type === type && (x.note || '').trim().toLowerCase() === n); if (hit && hit.cat !== sel) { pick(hit.cat); const b = $(`[data-cat="${hit.cat}"]`, grid); bounce(b); } };
    grid.onclick = e => { const b = e.target.closest('.cat'); if (!b) return;
      if (b.dataset.newcat) { const keep = { type, amount:a.value, note:f.note.value }; catSheet(type, id => txSheet(ed ? { ...t, ...keep, cat:id } : null, { ...keep, cat:id })); return; }
      pick(b.dataset.cat); manualCat = true; vib(8); };
    f.onsubmit = e => { e.preventDefault(); const amt = num(a.value);
      if (!(amt > 0)) return invalid(a);
      if (!sel) { sel = type === 'exp' ? 'autre' : 'extra'; }
      const date = f.date.value || today();
      const rec = { ...(ed ? t : {}), id:ed ? t.id : uid(), ts:ed ? t.ts : Date.now(), type, amount:amt, cat:sel, note:f.note.value.trim(), date };
      if (!ed && f.repeat && f.repeat.checked) { const r = { id:'r_' + uid(), type, amount:amt, cat:sel, note:rec.note, day:+date.slice(8), start:ym(date), end:'', active:true, skip:[] }; S.recurring.push(r); rec.rec = r.id; }
      if (ed) S.tx = S.tx.map(x => x.id === t.id ? rec : x); else S.tx.push(rec);
      save(); askPersist(); closeSheet(); U.month = ym(rec.date); success(!ed); render();
      const ob = overBudgets(U.month).find(o => o.c.id === rec.cat && rec.type === 'exp');
      setTimeout(() => ob ? (toast(`ردّ البال! فايت الميزانية ديال ${ob.c.name}`, 'alert'), vib([60, 50, 60])) : toast(ed ? 'تبدلات' : `تسجلات <span class="num">${fmt(amt)}</span>${rec.rec ? ' · كتعاود كل شهر' : ''}`, 'check', null, true), 700); };
  });
}
function stagIn(el) { [...el.children].forEach((c, i) => { c.style.animation = `rise .4s var(--ease) both ${i * 25}ms`; }); }

function catSheet(kind, done) {
  let color = COLORS[0], icon = 'tag';
  openSheet(head('فئة جديدة') + `<form id="catForm">${field('السمية', inp('name', '', 'text', 'required maxlength="20" placeholder="مثلا: Gym، الدراري…"'))}
    ${field('اللون', `<div class="colors">${COLORS.map((c, i) => `<button type="button" data-c="${c}" class="${i ? '' : 'on'}" style="background:${c}"></button>`).join('')}</div>`)}
    ${field('الأيقونة', `<div class="iconpick">${CAT_ICONS.map(n => `<button type="button" data-i="${n}" class="${n === icon ? 'on' : ''}">${ic(n)}</button>`).join('')}</div>`)}
    <button class="btn primary block" type="submit">${ic('check')} زيد الفئة</button></form>`, sh => {
    const f = $('#catForm', sh); setTimeout(() => f.name.focus(), 350);
    $$('.colors button', sh).forEach(b => b.onclick = () => { color = b.dataset.c; $$('.colors button', sh).forEach(x => x.classList.toggle('on', x === b)); bounce(b); });
    $$('.iconpick button', sh).forEach(b => b.onclick = () => { icon = b.dataset.i; $$('.iconpick button', sh).forEach(x => x.classList.toggle('on', x === b)); bounce(b); });
    f.onsubmit = e => { e.preventDefault(); const name = f.name.value.trim(); if (!name) return invalid(f.name);
      const c = { id:'c_' + uid(), name, ar:name, icon, color, kind, custom:true }; S.cats.push(c); save(); vib(15); done(c.id); };
  });
}

function budgetSheet(id) {
  const c = cat(id), T = monthTotals(U.month);
  openSheet(head('Budget · ' + esc(c.name)) + `<form id="bf"><div class="row" style="margin-bottom:12px">${catIc(c)}<div><b>${esc(c.name)}</b><div class="muted" style="font-size:12px">صرفتي هاد الشهر: <span class="num">${fmt(T.by[id] || 0)}</span></div></div></div>
    ${field('الميزانية ديال الشهر (DH)', inp('b', S.budgets[id] || '', 'number', 'placeholder="مثلا 1500"'))}
    <button class="btn primary block" type="submit">${ic('check')} سجل</button>${S.budgets[id] ? `<button type="button" class="btn danger block" style="margin-top:8px" data-act="clearBudget" data-id="${id}">حيد الميزانية</button>` : ''}</form>`, sh => {
    const f = $('#bf', sh); setTimeout(() => f.b.focus(), 350);
    f.onsubmit = e => { e.preventDefault(); const b = num(f.b.value); if (!(b > 0)) return invalid(f.b); S.budgets[id] = b; save(); closeSheet(); success(false); render(); toast('تسجلات الميزانية'); };
  });
}

function creditSheet(c) {
  const ed = !!c; c = c || { name:'', bank:'', total:'', monthly:'', remaining:'' };
  openSheet(head(ed ? 'بدل الكريدي' : 'كريدي جديد', ed && 'delCredit', c.id) + `<form id="cf">${field('السمية', inp('name', c.name, 'text', 'required placeholder="مثلا: كريدي الطوموبيل"'))}${field('البنك (اختياري)', inp('bank', c.bank, 'text', 'placeholder="CIH, Attijari, Wafasalaf…"'))}
    <div class="grid2">${field('Total (DH)', inp('total', c.total, 'number'))}${field('Mensualité (DH)', inp('monthly', c.monthly, 'number'))}</div>${field('Reste · الباقي (DH)', inp('remaining', c.remaining, 'number', 'placeholder="إلا خليتيها خاوية = Total"'))}
    <button class="btn primary block" type="submit">${ic('check')} سجل</button></form>`, sh => {
    const f = $('#cf', sh);
    f.onsubmit = e => { e.preventDefault(); const v = formVals(f); if (!v.name.trim()) return invalid(f.name); if (!(num(v.total) > 0)) return invalid(f.total);
      const rec = { id:ed ? c.id : uid(), name:v.name.trim(), bank:v.bank.trim(), total:num(v.total), monthly:num(v.monthly), remaining:v.remaining === '' ? num(v.total) : Math.min(num(v.remaining), num(v.total)) };
      if (ed) S.credits = S.credits.map(x => x.id === c.id ? rec : x); else S.credits.push(rec); save(); closeSheet(); success(false); render(); };
  });
}
function creanceSheet(c) {
  const ed = !!c; c = c || { person:'', amount:'', note:'', date:today() };
  openSheet(head(ed ? 'بدل' : 'شكون سالك؟', ed && 'delCreance', c.id) + `<form id="crf">${field('السمية', inp('person', c.person, 'text', 'required placeholder="مثلا: يوسف"'))}${field('شحال (DH)', inp('amount', c.amount, 'number'))}
    ${field('ملاحظة', inp('note', c.note, 'text', 'placeholder="علاش سلفتيه؟"'))}${field('التاريخ', inp('date', c.date, 'date'))}<button class="btn primary block" type="submit">${ic('check')} سجل</button></form>`, sh => {
    const f = $('#crf', sh); if (!ed) setTimeout(() => f.person.focus(), 350);
    f.onsubmit = e => { e.preventDefault(); const v = formVals(f); if (!v.person.trim()) return invalid(f.person); if (!(num(v.amount) > 0)) return invalid(f.amount);
      const rec = { id:ed ? c.id : uid(), person:v.person.trim(), amount:num(v.amount), note:v.note.trim(), date:v.date, paid:ed ? c.paid : false };
      if (ed) S.creances = S.creances.map(x => x.id === c.id ? rec : x); else S.creances.push(rec); save(); closeSheet(); success(false); render(); };
  });
}
function assetSheet(a) {
  const ed = !!a; a = a || { type:'house', name:'', buy:'', current:'' };
  openSheet(head(ed ? 'بدل' : 'زيد حاجة كتملكها', ed && 'delAsset', a.id) + `<form id="af"><div class="cats" style="grid-template-columns:repeat(5,1fr)">${Object.entries(ASSET_T).map(([k, t]) => `<button type="button" class="cat ${a.type === k ? 'on' : ''}" data-at="${k}">${catIc({ color:t[2], icon:t[1] })}<span>${t[0].split(' ')[0]}</span></button>`).join('')}</div>
    ${field('السمية', inp('name', a.name, 'text', 'placeholder="مثلا: Dacia Logan 2019"'))}<div class="grid2">${field('شريتها بـ (DH)', inp('buy', a.buy, 'number'))}${field('كتسوا دابا (DH)', inp('current', a.current, 'number'))}</div>
    <button class="btn primary block" type="submit">${ic('check')} سجل</button></form>`, sh => {
    const f = $('#af', sh); let type = a.type;
    $$('[data-at]', sh).forEach(b => b.onclick = () => { type = b.dataset.at; $$('[data-at]', sh).forEach(x => x.classList.toggle('on', x === b)); vib(8); });
    f.onsubmit = e => { e.preventDefault(); const v = formVals(f); if (!(num(v.buy) > 0)) return invalid(f.buy);
      const rec = { id:ed ? a.id : uid(), type, name:v.name.trim(), buy:num(v.buy), current:v.current === '' ? num(v.buy) : num(v.current) };
      if (ed) S.assets = S.assets.map(x => x.id === a.id ? rec : x); else S.assets.push(rec); save(); closeSheet(); success(false); render(); };
  });
}
function rentalSheet(r) {
  const ed = !!r; r = r || { name:'', kind:'airbnb', price:'' };
  openSheet(head(ed ? 'بدل الملك' : 'ملك جديد للكرا', ed && 'delRental', r.id) + `<form id="rf">${field('السمية', inp('name', r.name, 'text', 'required placeholder="مثلا: شقة مرتيل"'))}
    <div class="type-toggle"><button type="button" class="inc ${r.kind === 'airbnb' ? 'on' : ''}" data-k="airbnb">Airbnb</button><button type="button" class="inc ${r.kind === 'long' ? 'on' : ''}" data-k="long">كرا عادي</button></div>
    ${field('ثمن الشرا (DH) · باش نحسب الرونديمو', inp('price', r.price, 'number', 'placeholder="0 إلا كتكري ملك ديال الغير"'))}<button class="btn primary block" type="submit">${ic('check')} سجل</button></form>`, sh => {
    const f = $('#rf', sh); let kind = r.kind;
    $$('[data-k]', sh).forEach(b => b.onclick = () => { kind = b.dataset.k; $$('[data-k]', sh).forEach(x => x.classList.toggle('on', x === b)); vib(8); });
    f.onsubmit = e => { e.preventDefault(); const v = formVals(f); if (!v.name.trim()) return invalid(f.name);
      const rec = { ...(ed ? r : { id:uid(), entries:[] }), name:v.name.trim(), kind, price:num(v.price) };
      if (ed) S.rentals = S.rentals.map(x => x.id === r.id ? rec : x); else S.rentals.push(rec); save(); closeSheet(); success(false); render(); };
  });
}
function rentEntrySheet(id, type) {
  const r = S.rentals.find(x => x.id === id), L = { inc:['دخل · Revenu', 'مثلا: 3 ليالي Airbnb'], exp:['مصروف · Charge', 'مثلا: الضو، التنقية، Syndic'], reno:['إصلاح · Rénovation', 'مثلا: الصباغة، الكوزينة'] }[type];
  openSheet(head(L[0] + ' · ' + esc(r.name)) + `<form id="ref"><div class="amount-box"><input class="input amount-in" name="amount" inputmode="decimal" placeholder="0"><div class="cur">DH</div></div>
    ${field('ملاحظة', inp('note', '', 'text', `placeholder="${L[1]}"`))}${field('التاريخ', inp('date', today(), 'date'))}<button class="btn primary block" type="submit">${ic('check')} سجل</button></form>`, sh => {
    const f = $('#ref', sh); setTimeout(() => f.amount.focus(), 350);
    f.onsubmit = e => { e.preventDefault(); const a = num(f.amount.value); if (!(a > 0)) return invalid(f.amount);
      r.entries.push({ id:uid(), type, amount:a, note:f.note.value.trim(), date:f.date.value || today() }); save(); closeSheet(); success(type === 'inc'); render(); };
  });
}

function settingsSheet() {
  const pin = pinData(), lb = S.settings.lastBackup;
  openSheet(head('Paramètres · الإعدادات') + `
    <div class="card"><h2>${ic('calendar')} نهار الصالير</h2><div class="muted" style="font-size:13px;margin-bottom:8px">باش نحسب شحال تقدر تصرف فالنهار حتى للصالير الجاي.</div>
      <select class="input" id="paydaySel">${Array.from({ length:31 }, (_, i) => `<option value="${i + 1}" ${+S.settings.payday === i + 1 ? 'selected' : ''}>نهار ${i + 1} فالشهر</option>`).join('')}</select></div>
    <div class="card"><h2>${ic('repeat')} Récurrents · اللي كيتعاود</h2>
      ${S.recurring.length ? `<div class="list">${S.recurring.map(r => `<div class="item press" data-act="editRec" data-id="${r.id}" style="padding:10px">${catIc(cat(r.cat))}<div class="meta"><b>${esc(r.note || cat(r.cat).name)}</b><small>نهار ${r.day} كل شهر${r.end ? ' · حتى ' + monthLabel(r.end) : ''}${r.active ? '' : ' · موقوفة'}</small></div><div class="amt ${r.type === 'inc' ? 'pos' : ''}"><span class="num">${r.type === 'inc' ? '+' : '−'}${fmt(r.amount)}</span></div></div>`).join('')}</div>`
        : '<div class="muted" style="font-size:13px">حتى حاجة. ملي تزيد حركة، كوش على «كتعاود كل شهر» (الصالير، الكرا، Inwi…) وغادي تتزاد بوحدها.</div>'}
      <button class="btn sm" style="margin-top:10px" data-act="addRec">${ic('plus')} زيد وحدة</button></div>
    <div class="card"><h2>${ic('shield')} Sauvegarde · نسخة احتياطية</h2>
      <div class="muted" style="font-size:13px;margin-bottom:6px">الداتا ديالك كتبقى غير فهاد التيليفون. إلا مسحتي التطبيق ولا المتصفح، كتمشي. دير نسخة وخبيها فـWhatsApp ولا Drive.</div>
      <div class="kv"><span>آخر نسخة</span><b>${lb ? esc(lb) : 'عمرك ما درتي'}</b></div>
      <div class="kv"><span>حماية من المسح التلقائي</span><b>${U.persist === true ? '✓ مفعلة' : U.persist === false ? 'ما تقبلاتش' : '…'}</b></div>
      ${U.persist === false ? '<div class="hint" style="text-align:start">المتصفح ما عطاش الحماية. فالآيفون حط التطبيق فالشاشة الرئيسية، ودير نسخة من وقت لوقت.</div>' : ''}
      <div class="grid2" style="margin-top:10px"><button class="btn" data-act="export">${ic('download')} Export</button><button class="btn" data-act="import">${ic('upload')} Import</button></div></div>
    <div class="card"><h2>${ic('lock')} Code PIN</h2><div class="muted" style="font-size:13px;margin-bottom:10px">${pin ? 'التطبيق مسدود بالرمز. كيتسد بوحدو إلا خرجتي منو كثر من دقيقة.' : 'حط رمز ديال 4 أرقام باش حتى واحد ما يشوف الفلوس ديالك إلا شد التيليفون.'} الرمز كيسد الشاشة، ولكن ما كيشفرش الداتا.</div>
      ${pin ? `<div class="grid2"><button class="btn" data-act="setPin">بدل الرمز</button><button class="btn danger" data-act="removePin">حيد الرمز</button></div>` : `<button class="btn primary block" data-act="setPin">${ic('lock')} حط رمز</button>`}</div>
    <div class="card"><h2>${ic('phone')} Back Tap (iPhone)</h2><div class="muted" style="font-size:13px;line-height:1.8">1. Raccourcis → + → «Ouvrir l'URL» → <code style="direction:ltr;unicode-bidi:isolate">${esc(location.origin + location.pathname)}?add=1</code><br>2. Réglages → Accessibilité → Toucher → Toucher le dos → Toucher deux fois → اختار الراكورسي.</div>
    <button class="btn sm" style="margin-top:8px" data-act="copyLink">نسخ الرابط</button></div>
    <div class="card"><h2>${ic('spark')} Démo</h2><div class="grid2"><button class="btn" data-act="demo">زيد داتا تجربة</button><button class="btn danger" data-act="reset">${ic('trash')} مسح كلشي</button></div></div>
    <div class="hint">مصاريفي v2 · بلا حساب، بلا سيرفر، بلا إشهار · الداتا ديالك عندك</div>`, sh => {
    $('#paydaySel', sh).onchange = e => { S.settings.payday = +e.target.value; save(); vib(8); toast('تسجل نهار الصالير'); render(); };
  });
}

/* ---------- actions ---------- */
async function exportData() {
  const json = JSON.stringify({ app:'msarifi', exported:new Date().toISOString(), data:S }, null, 2), name = `msarifi-backup-${today()}.json`;
  const done = () => { S.settings.lastBackup = today(); S.settings.backupSnooze = null; save(); render(); toast('تصاوبات النسخة · خبيها مزيان'); };
  try { const file = new File([json], name, { type:'application/json' });
    if (navigator.canShare && navigator.canShare({ files:[file] })) { await navigator.share({ files:[file], title:'Msarifi backup' }); return done(); } } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type:'application/json' })); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000); done();
}
function importData(file) {
  const rd = new FileReader();
  rd.onload = () => { try { const j = JSON.parse(rd.result), d = j.data || j; if (!Array.isArray(d.tx)) throw 0;
      if (!confirm('غادي تبدل الداتا اللي كاينة بهاد النسخة. متأكد؟')) return;
      localStorage.setItem(KEY, JSON.stringify(d)); load(); runRecurring(); closeSheet(); render(); success(); toast('رجعات الداتا'); } catch (e) { toast('الملف ماشي صحيح', 'alert'); } };
  rd.readAsText(file);
}
function demo() {
  const m0 = ym(today()), d = (m, day) => `${m}-${String(day).padStart(2, '0')}`;
  const maxDay = +today().slice(8);
  for (let k = 5; k >= 0; k--) {
    const m = addMonth(m0, -k), lim = k ? 28 : Math.max(1, maxDay);
    const add = (type, cat, amount, note, day) => S.tx.push({ id:uid(), ts:Date.now() + Math.random(), type, cat, amount, note, date:d(m, Math.min(lim, day)) });
    if (k % 2) add('inc', 'extra', 800 + k * 100, 'خدمة إضافية', 15);
    add('exp', 'factures', 420 + k * 15, 'Lydec', 3); 
    add('exp', 'courses', 150, 'المرجان', 2); add('exp', 'courses', 640 + k * 30, 'Marjane', 9); add('exp', 'courses', 380, 'BIM', Math.min(lim, 18));
    add('exp', 'cafe', 25, 'قهوة', 5); add('exp', 'cafe', 40, 'قهوة مع صحابي', 12);
    add('exp', 'sorties', 260 + k * 20, 'عشا', 11); add('exp', 'transport', 300, 'Tram + Taxi', 6); add('exp', 'credit', 1850, 'Crédit voiture', 5);
    if (k === 2) add('exp', 'sante', 350, 'Pharmacie', 20);
  }
  const start = addMonth(m0, -5);
  S.recurring.push({ id:'r_' + uid(), type:'inc', amount:9000, cat:'salaire', note:'الصالير', day:1, start, end:'', active:true, skip:[] },
    { id:'r_' + uid(), type:'exp', amount:199, cat:'factures', note:'Inwi Fibre', day:4, start, end:'', active:true, skip:[] },
    { id:'r_' + uid(), type:'exp', amount:99, cat:'sorties', note:'Netflix', day:27, start, end:'', active:true, skip:[] });
  runRecurring();
  S.goals.push({ id:uid(), name:'عطلة فالصيف', target:8000, saved:3200, deadline:addMonth(m0, 7) }, { id:uid(), name:'Fonds d\'urgence · احتياط', target:27000, saved:9500, deadline:'' });
  S.budgets = { cafe:200, courses:1200, factures:700, sorties:300, transport:400 };
  S.credits.push({ id:uid(), name:'كريدي الطوموبيل', bank:'Wafasalaf', total:85000, monthly:1850, remaining:52300 });
  S.creances.push({ id:uid(), person:'يوسف', amount:500, note:'سلفة', date:d(m0, 1), paid:false }, { id:uid(), person:'كريم', amount:1200, note:'تيليفون', date:d(addMonth(m0, -1), 20), paid:false }, { id:uid(), person:'سعاد', amount:300, note:'', date:d(addMonth(m0, -2), 8), paid:true });
  S.assets.push({ id:uid(), type:'house', name:'شقة الدار البيضاء', buy:650000, current:720000 }, { id:uid(), type:'car', name:'Dacia Logan', buy:120000, current:95000 }, { id:uid(), type:'gold', name:'الذهب', buy:18000, current:24500 }, { id:uid(), type:'crypto', name:'Bitcoin', buy:5000, current:6200 });
  const r = { id:uid(), name:'شقة مرتيل', kind:'airbnb', price:480000, entries:[] };
  r.entries.push({ id:uid(), type:'reno', amount:35000, note:'الصباغة والكوزينة', date:d(addMonth(m0, -5), 2) });
  for (let k = 4; k >= 0; k--) { const m = addMonth(m0, -k); r.entries.push({ id:uid(), type:'inc', amount:4200 + (k === 2 ? 3000 : 0), note:'Airbnb', date:d(m, 10) }, { id:uid(), type:'exp', amount:650, note:'التنقية + الضو', date:d(m, 12) }); }
  S.rentals.push(r, { id:uid(), name:'Studio Maarif', kind:'long', price:0, entries:[{ id:uid(), type:'inc', amount:3500, note:'الكرا', date:d(m0, 1) }, { id:uid(), type:'exp', amount:200, note:'Syndic', date:d(m0, 3) }] });
  save(); closeSheet(); U.month = m0; render(); success(); toast('تزادت داتا ديال التجربة');
}

const ACT = {
  add:() => txSheet(), close:closeSheet, goTx:() => go('tx'),
  mPrev:() => { U.month = addMonth(U.month, -1); vib(6); render(); }, mNext:() => { U.month = addMonth(U.month, 1); vib(6); render(); },
  editTx:(el) => { if (el._swiped) return; txSheet(S.tx.find(t => t.id === el.dataset.id)); },
  delTx:(el) => { const snap = JSON.stringify(S); skipRec(S.tx.find(t => t.id === el.dataset.id)); S.tx = S.tx.filter(t => t.id !== el.dataset.id); save(); closeSheet(); render(); toast('تمسحات', 'trash', { label:'رجعها', fn:() => { S = JSON.parse(snap); save(); render(); } }); },
  setBudget:(el) => budgetSheet(el.dataset.id), clearBudget:(el) => { delete S.budgets[el.dataset.id]; save(); closeSheet(); render(); },
  addCredit:() => creditSheet(), editCredit:(el) => creditSheet(S.credits.find(c => c.id === el.dataset.id)),
  delCredit:(el) => { if (!confirm('نمسحو هاد الكريدي؟')) return; S.credits = S.credits.filter(c => c.id !== el.dataset.id); save(); closeSheet(); render(); },
  payCredit:(el) => { const c = S.credits.find(x => x.id === el.dataset.id); const p = Math.min(c.monthly || c.remaining, c.remaining);
    c.remaining = Math.max(0, Math.round((c.remaining - p) * 100) / 100);
    S.tx.push({ id:uid(), ts:Date.now(), type:'exp', cat:'credit', amount:p, note:'Mensualité · ' + c.name, date:today() });
    save(); success(c.remaining === 0); render(); toast(c.remaining === 0 ? 'مبروك! سالا الكريدي 🎉' : `تسجلات المونسياليتي <span class="num">${fmt(p)}</span>`, 'check', null, true); },
  addCreance:() => creanceSheet(), editCreance:(el) => creanceSheet(S.creances.find(c => c.id === el.dataset.id)),
  delCreance:(el) => { S.creances = S.creances.filter(c => c.id !== el.dataset.id); save(); closeSheet(); render(); },
  togglePaid:(el) => { const c = S.creances.find(x => x.id === el.dataset.id); c.paid = !c.paid; save(); bounce(el); el.classList.toggle('on', c.paid);
    if (c.paid) { success(true); toast(`${esc(c.person)} خلصك <span class="num">${fmt(c.amount)}</span>`, 'check', null, true); } else vib(10); setTimeout(render, 450); },
  addAsset:() => assetSheet(), editAsset:(el) => { if (el._swiped) return; assetSheet(S.assets.find(a => a.id === el.dataset.id)); },
  delAsset:(el) => { S.assets = S.assets.filter(a => a.id !== el.dataset.id); save(); closeSheet(); render(); },
  addRental:() => rentalSheet(), editRental:(el) => rentalSheet(S.rentals.find(r => r.id === el.dataset.id)),
  delRental:(el) => { if (!confirm('نمسحو هاد الملك وكاع الحركات ديالو؟')) return; S.rentals = S.rentals.filter(r => r.id !== el.dataset.id); save(); closeSheet(); render(); },
  rentEntry:(el) => rentEntrySheet(el.dataset.id, el.dataset.type),
  addRec:() => txSheet(null, { repeat:true }), editRec:(el) => { recSheet(S.recurring.find(r => r.id === el.dataset.id)); },
  setPin:() => { closeSheet(); setTimeout(() => showLock('set'), 250); }, removePin:() => { if (!confirm('نحيدو الرمز؟')) return; localStorage.removeItem(PINK); closeSheet(); toast('تحيد الرمز'); },
  addGoal:() => goalSheet(), editGoal:(el) => goalSheet(S.goals.find(g => g.id === el.dataset.id)), fundGoal:(el) => fundSheet(el.dataset.id),
  delGoal:(el) => { if (!confirm('نمسحو هاد الهدف؟')) return; S.goals = S.goals.filter(g => g.id !== el.dataset.id); save(); closeSheet(); render(); },
  allInsights:() => insightsSheet(), backupNow:() => exportData(),
  snoozeBackup:() => { S.settings.backupSnooze = isoD(new Date(Date.now() + 7 * DAY)); save(); render(); },
  export:exportData, import:() => $('#importFile').click(), demo,
  reset:() => { if (!confirm('غادي تمسح كاع الداتا. متأكد؟')) return; S = blank(); U.counts = {}; save(); closeSheet(); render(); toast('تمسح كلشي', 'trash'); },
  copyLink:() => { const u = location.origin + location.pathname + '?add=1'; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => toast('تنسخ الرابط'), () => prompt('نسخ هاد الرابط:', u)); }
};

function setPriv(on, anim) {
  const d = document.documentElement; if (on) d.dataset.priv = '1'; else delete d.dataset.priv;
  try { localStorage.setItem('msarifi.priv', on ? '1' : '0'); } catch (e) {}
  const b = $('#privBtn'); b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'بين الأرقام' : 'خبي الأرقام');
  if (anim) { bounce(b); vib(10); toast(on ? 'الأرقام مخبية 🙈' : 'الأرقام باينة 👀', on ? 'x' : 'check'); }
}
function setTheme(t) {
  document.documentElement.dataset.theme = t; localStorage.setItem('msarifi.theme', t);
  $('#themeBtn').innerHTML = ic(t === 'light' ? 'moon' : 'sun'); $('#themeColor').content = t === 'light' ? '#f3f5fb' : '#0b0f1a';
}

/* ---------- dates ---------- */
const DAY = 864e5;
const parseD = s => new Date(s + 'T12:00');
const isoD = d => d.toLocaleDateString('en-CA');
const daysIn = m => { const [y, mo] = m.split('-').map(Number); return new Date(y, mo, 0).getDate(); };
const dateIn = (m, day) => `${m}-${String(Math.min(day, daysIn(m))).padStart(2, '0')}`;
const dayLabel = s => { const d = parseD(s); return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; };
const diffDays = (a, b) => Math.round((parseD(b) - parseD(a)) / DAY);
const addDays = (s, n) => isoD(new Date(parseD(s).getTime() + n * DAY));
const M = n => `<span class="num">${fmt(n)}</span>`;
const PC = n => `<span class="num">${pct(n)}</span>`;
const sumA = arr => arr.reduce((s, x) => s + (+x.amount || 0), 0);

/* ---------- recurring ---------- */
function runRecurring() {
  const t = today(), tm = ym(t); let added = 0;
  for (const r of S.recurring || []) {
    if (!r.active) continue;
    for (let m = r.start; m <= tm && (!r.end || m <= r.end); m = addMonth(m, 1)) {
      const d = dateIn(m, r.day);
      if (d > t || (r.skip || []).includes(m) || S.tx.some(x => x.rec === r.id && ym(x.date) === m)) continue;
      S.tx.push({ id:uid(), ts:parseD(d).getTime(), type:r.type, amount:r.amount, cat:r.cat, note:r.note, date:d, rec:r.id, auto:true }); added++;
    }
  }
  if (added) save();
  return added;
}
function skipRec(t) { if (!t || !t.rec) return; const r = S.recurring.find(x => x.id === t.rec); if (r) { r.skip = r.skip || []; if (!r.skip.includes(ym(t.date))) r.skip.push(ym(t.date)); } }
function recSheet(r) {
  if (!r) return;
  openSheet(head('حركة كتعاود', 'delRec', r.id) + `<form id="recf"><div class="row" style="margin-bottom:12px">${catIc(cat(r.cat))}<div><b>${esc(r.note || cat(r.cat).name)}</b><div class="muted" style="font-size:12px">${r.type === 'inc' ? 'Revenu' : 'Dépense'} · ${esc(cat(r.cat).name)} · من ${monthLabel(r.start)}</div></div></div>
    <div class="grid2">${field('المبلغ (DH)', inp('amount', r.amount, 'number'))}${field('النهار فالشهر', inp('day', r.day, 'number', 'min="1" max="31"'))}</div>
    ${field('حتى لشهر (اختياري)', inp('end', r.end || '', 'month'))}
    <label class="switch-row"><input type="checkbox" name="active" ${r.active ? 'checked' : ''}><span class="sw"></span><span>خدامة</span></label>
    <div class="hint" style="margin:0 0 10px">التبديل كيمس غير الشهور الجاية، الحركات اللي تزادو قبل كيبقاو كيف هوما.</div>
    <button class="btn primary block" type="submit">${ic('check')} سجل</button></form>`, sh => {
    const f = $('#recf', sh);
    f.onsubmit = e => { e.preventDefault(); const a = num(f.amount.value), d = Math.round(num(f.day.value));
      if (!(a > 0)) return invalid(f.amount); if (!(d >= 1 && d <= 31)) return invalid(f.day);
      Object.assign(r, { amount:a, day:d, end:f.end.value || '', active:f.active.checked }); save(); runRecurring(); closeSheet(); success(false); render(); toast('تبدلات القاعدة'); };
  });
}
ACT.delRec = el => { if (!confirm('نوقفو هاد القاعدة؟ الحركات اللي تزادو غادي يبقاو.')) return; S.recurring = S.recurring.filter(r => r.id !== el.dataset.id); save(); closeSheet(); render(); };

/* ---------- smart insights (computed only from the user's data) ---------- */
function payPeriod() {
  const t = today(), P = +S.settings.payday || 1, m = ym(t);
  let start = dateIn(m, P); if (start > t) start = dateIn(addMonth(m, -1), P);
  const next = dateIn(addMonth(ym(start), 1), P);
  return { start, next, t, elapsed:diffDays(start, t) + 1, left:Math.max(1, diffDays(t, next)) };
}
function upcomingRec(from, to, type = 'exp') {
  const out = [];
  for (const r of S.recurring || []) {
    if (!r.active || r.type !== type) continue;
    for (const m of [...new Set([ym(from), ym(to), addMonth(ym(from), 1)])]) {
      const d = dateIn(m, r.day);
      if (d > from && d < to && m >= r.start && (!r.end || m <= r.end) && !(r.skip || []).includes(m) && !S.tx.some(x => x.rec === r.id && ym(x.date) === m)) out.push({ r, date:d });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}
function insights() {
  const t = today(), m = ym(t), dom = +t.slice(8), dim = daysIn(m), lm = addMonth(m, -1);
  const exp = S.tx.filter(x => x.type === 'exp'), inc = S.tx.filter(x => x.type === 'inc');
  const out = [];
  if (S.tx.length < 5) return { thin:true, safe:null, list:out };
  /* 1. safe to spend per day until next payday */
  const pp = payPeriod(), inP = x => x.date >= pp.start && x.date <= t;
  const pInc = sumA(inc.filter(inP)), pExp = sumA(exp.filter(inP)), ups = upcomingRec(t, pp.next), upSum = ups.reduce((s, u) => s + +u.r.amount, 0);
  let safe = null;
  if (pInc > 0) {
    const avail = pInc - pExp - upSum;
    safe = { avail, perDay:avail / pp.left, left:pp.left, next:pp.next, upSum, pInc, pExp, nUp:ups.length };
    const vx = exp.filter(x => inP(x) && !x.rec && x.cat !== 'credit'), vs = sumA(vx);
    if (pp.elapsed >= 4 && vx.length >= 3 && vs > 0) {
      const avg = vs / pp.elapsed;
      if (avail <= 0) out.push({ tone:'bad', icon:'alert', html:`صرفتي كثر من المدخول ديال هاد الفترة بـ ${M(-avail)} (حاسبين حتى الفواتير الجاية). باقي ${pp.left} يوم للصالير.` });
      else { const dz = Math.floor(avail / avg);
        if (dz < pp.left) out.push({ tone:'bad', icon:'down', html:`بهاد الريتم (${M(avg)} فالنهار) غادي يسالي الصالير <b>${dayLabel(addDays(t, dz))}</b>، يعني ${pp.left - dz} يوم قبل الصالير الجاي.` });
        else out.push({ tone:'good', icon:'up', html:`بهاد الريتم (${M(avg)} فالنهار) غادي يبقى ليك تقريبا ${M(avail - avg * pp.left)} ملي يجي الصالير ${dayLabel(pp.next)}.` }); }
    }
  }
  /* 2. top category share this month */
  const mExp = exp.filter(x => ym(x.date) === m), mTot = sumA(mExp), by = {};
  mExp.forEach(x => by[x.cat] = (by[x.cat] || 0) + +x.amount);
  if (mExp.length >= 5 && mTot > 0) { const [id, v] = Object.entries(by).sort((a, b) => b[1] - a[1])[0];
    out.push({ tone:'info', icon:'pie', html:`<b>${esc(cat(id).name)}</b> كلات ليك ${PC(v / mTot * 100)} من المصاريف هاد الشهر (${M(v)}).` }); }
  /* 3. vs last month at the same day */
  const lmTo = exp.filter(x => ym(x.date) === lm && +x.date.slice(8) <= dom), lmSum = sumA(lmTo);
  if (lmSum > 0 && mExp.length >= 3) { const ch = (mTot - lmSum) / lmSum * 100;
    out.push(Math.abs(ch) < 5 ? { tone:'info', icon:'calendar', html:`حتى لـ ${dom} ${MONTHS[+m.slice(5) - 1]} صرفتي ${M(mTot)}، تقريبا بحال نفس الوقت فالشهر اللي فات (${M(lmSum)}).` }
      : { tone:ch > 0 ? 'warn' : 'good', icon:ch > 0 ? 'up' : 'down', html:`حتى لـ ${dom} ${MONTHS[+m.slice(5) - 1]} صرفتي ${M(mTot)}، ${ch > 0 ? 'كثر' : 'قل'} بـ ${PC(Math.abs(ch))} من نفس الوقت فالشهر اللي فات (${M(lmSum)}).` }); }
  /* 4. biggest increase per category */
  if (lmTo.length) { const pby = {}; lmTo.forEach(x => pby[x.cat] = (pby[x.cat] || 0) + +x.amount);
    const best = Object.keys(by).map(id => ({ id, cur:by[id], prev:pby[id] || 0, d:by[id] - (pby[id] || 0) })).filter(x => x.d >= 100 && (!x.prev || x.d / x.prev >= .3)).sort((a, b) => b.d - a.d)[0];
    if (best) out.push({ tone:'warn', icon:'up', html:`أكبر زيادة: <b>${esc(cat(best.id).name)}</b> ${M(best.cur)} هاد الشهر مقابل ${M(best.prev)} فنفس الوقت ديال الشهر اللي فات (+${M(best.d)}).` }); }
  /* 5. small frequent spends */
  const cnt = {}; mExp.forEach(x => { if (!x.rec) { cnt[x.cat] = cnt[x.cat] || { n:0, s:0 }; cnt[x.cat].n++; cnt[x.cat].s += +x.amount; } });
  const small = Object.entries(cnt).filter(([, v]) => v.n >= 6 && v.s / v.n <= 60).sort((a, b) => b[1].n - a[1].n)[0];
  if (small) { const [id, v] = small; out.push({ tone:'info', icon:'spark', html:`${v.n} مرات <b>${esc(cat(id).name)}</b> هاد الشهر = ${M(v.s)}. إلا نقصتي النص، توفر تقريبا ${M(v.s / dom * dim / 2)} فالشهر.` }); }
  /* 6. budget pace */
  const ep = dom / dim * 100;
  Object.entries(S.budgets).map(([id, b]) => ({ id, b:+b, sp:by[id] || 0, q:(by[id] || 0) / b * 100 })).filter(x => x.b > 0 && x.q < 100 && x.q >= 50 && x.q >= ep + 25).sort((a, b) => b.q - a.q).slice(0, 2).forEach(({ id, b, sp, q }) => {
    out.push({ tone:'warn', icon:'alert', html:`<b>${esc(cat(id).name)}</b>: مشا ${PC(q)} من الميزانية وباقي ${dim - dom} يوم فالشهر. باش ما تفوتهاش: ماشي كثر من ${M((b - sp) / (dim - dom + 1))} فالنهار.` }); });
  /* 7. savings rate last month */
  const lInc = sumA(inc.filter(x => ym(x.date) === lm)), lExp = sumA(exp.filter(x => ym(x.date) === lm));
  if (lInc > 0) { const r = (lInc - lExp) / lInc * 100;
    out.push(r >= 0 ? { tone:r >= 10 ? 'good' : 'info', icon:'target', html:`${MONTHS[+lm.slice(5) - 1]} وفرتي ${PC(r)} من المدخول (${M(lInc - lExp)}).${r < 10 ? ' حاول توصل 10% على الأقل.' : ''}` }
      : { tone:'bad', icon:'alert', html:`${MONTHS[+lm.slice(5) - 1]} صرفتي كثر من المدخول بـ ${M(lExp - lInc)}.` }); }
  /* 8. upcoming bills in 7 days */
  const soon = upcomingRec(t, addDays(t, 8));
  if (soon.length) out.push({ tone:'info', icon:'calendar', html:`جايين هاد 7 يام: ${soon.slice(0, 3).map(u => `${esc(u.r.note || cat(u.r.cat).name)} ${M(u.r.amount)} (${dayLabel(u.date)})`).join('، ')}.` });
  /* 9. old créances */
  S.creances.filter(c => !c.paid && c.date && diffDays(c.date, t) >= 30).slice(0, 2).forEach(c => out.push({ tone:'info', icon:'users', html:`<b>${esc(c.person)}</b> سالك ${M(c.amount)} هادي ${diffDays(c.date, t)} يوم. فكرو بلطف؟` }));
  const order = { bad:0, warn:1, good:2, info:3 };
  out.sort((a, b) => order[a.tone] - order[b.tone]);
  return { thin:false, safe, list:out, pp };
}
const insRow = x => `<div class="ins ${x.tone}">${ic(x.icon)}<div>${x.html}</div></div>`;
function safeBox(I) {
  if (!I.safe) return `<div class="ins info">${ic('wallet')}<div>سجل الصالير ولا المدخول ديال هاد الفترة (من ${dayLabel(I.pp.start)}) باش نحسب ليك شحال تقدر تصرف فالنهار.</div></div>`;
  const s = I.safe, neg = s.perDay < 0;
  return `<div class="safe ${neg ? 'neg' : ''}"><small>تقدر تصرف فالنهار</small><b>${money(Math.max(0, s.perDay)).replace('data-count', 'data-key="safe" data-count')}</b>
    <span>حتى للصالير ${dayLabel(s.next)} · باقي ${s.left} يوم</span>
    <div class="safe-calc">${M(s.pInc)} دخل − ${M(s.pExp)} صرفتي${s.upSum ? ` − ${M(s.upSum)} فواتير جاية (${s.nUp})` : ''} = ${M(s.avail)}</div></div>`;
}
function insightsCard() {
  const I = insights();
  if (I.thin) return `<div class="card"><h2>${ic('spark')} مصاريفي كيقول ليك</h2>${empty('مازال الداتا قليلة', 'سجل شي 5 حركات (والصالير) ونبدا نعطيك ملاحظات حقيقية من الأرقام ديالك')}</div>`;
  return `<div class="card" id="insCard"><h2>${ic('spark')} مصاريفي كيقول ليك ${I.list.length > 3 ? `<button class="btn sm" data-act="allInsights">كلشي (${I.list.length})</button>` : ''}</h2>${safeBox(I)}
    <div class="ins-list">${I.list.slice(0, 3).map(insRow).join('') || '<div class="muted" style="font-size:13px">زيد حركات أكثر باش تبان ليك ملاحظات.</div>'}</div></div>`;
}
function insightsSheet() {
  const I = insights();
  openSheet(head(`${ic('spark')} الملاحظات ديالك`) + safeBox(I) + `<div class="ins-list stagger">${I.list.map(insRow).join('')}</div><div class="hint">كلشي محسوب من الحركات اللي سجلتي، بلا أرقام مخترعة.</div>`, sh => animate(sh));
}
function backupBanner() {
  const s = S.settings, t = today();
  if (S.tx.length < 10 || (s.backupSnooze && s.backupSnooze > t)) return '';
  if (s.lastBackup && diffDays(s.lastBackup, t) < 14) return '';
  return `<div class="card backup">${ic('shield')}<div style="flex:1"><b>${s.lastBackup ? `آخر نسخة احتياطية هادي ${diffDays(s.lastBackup, t)} يوم` : 'عمرك ما درتي نسخة احتياطية'}</b><div class="muted" style="font-size:12px">إلا تمسح التطبيق ولا المتصفح، الداتا كتمشي. صيفط النسخة لراسك فـWhatsApp ولا Drive.</div>
    <div class="row" style="margin-top:8px"><button class="btn sm primary" data-act="backupNow">${ic('download')} دير نسخة دابا</button><button class="btn sm" data-act="snoozeBackup">من بعد</button></div></div></div>`;
}

/* ---------- savings goals ---------- */
function goalsHtml() {
  const tot = S.goals.reduce((s, g) => s + +g.saved, 0), tar = S.goals.reduce((s, g) => s + +g.target, 0);
  return `<div class="card hero stagger"><div class="lbl">Objectifs · الأهداف ديالك</div><div class="big">${money(tot)}</div><div class="lbl">من ${M(tar)}</div></div>
  <div class="stagger">${S.goals.length ? S.goals.map(g => { const p = g.target ? Math.min(100, g.saved / g.target * 100) : 0, rest = Math.max(0, g.target - g.saved);
    const ml = g.deadline ? Math.max(1, (+g.deadline.slice(0, 4) - +today().slice(0, 4)) * 12 + (+g.deadline.slice(5) - +today().slice(5, 7))) : 0;
    return `<div class="card"><div class="row between"><div class="row">${catIc({ color:p >= 100 ? '#2fd387' : '#7c5cff', icon:'target' })}<div><b>${esc(g.name)}</b><div class="muted" style="font-size:12px">${g.deadline ? 'قبل ' + monthLabel(g.deadline) : 'بلا تاريخ'}</div></div></div>
      <button class="icon-btn press" data-act="editGoal" data-id="${g.id}" aria-label="بدل">${ic('edit')}</button></div>
      <div class="bar" style="margin:12px 0 6px"><i data-w="${p}"></i></div>
      <div class="kv"><span>جمعتي</span><b><span class="num">${fmt(g.saved)} / ${fmt(g.target)} · ${pct(p)}</span></b></div>
      ${rest > 0 ? `<div class="kv"><span>باقي</span><b>${M(rest)}</b></div>${ml ? `<div class="kv"><span>خاصك تحط فالشهر</span><b>${M(rest / ml)}</b></div>` : ''}
      <button class="btn primary block" style="margin-top:8px" data-act="fundGoal" data-id="${g.id}">${ic('plus')} زيد فلوس</button>` : '<div class="tag green" style="margin-top:8px">🎉 وصلتي للهدف</div>'}</div>`; }).join('')
    : empty('حتى هدف مازال', 'عطلة، طوموبيل، احتياط… حط هدف وتبع شحال جمعتي', { act:'addGoal', label:'زيد هدف' })}</div>
  ${S.goals.length ? `<button class="btn block" data-act="addGoal">${ic('plus')} زيد هدف</button>` : ''}`;
}
function goalSheet(g) {
  const ed = !!g; g = g || { name:'', target:'', saved:'', deadline:'' };
  openSheet(head(ed ? 'بدل الهدف' : 'هدف جديد', ed && 'delGoal', g.id) + `<form id="gf">${field('السمية', inp('name', g.name, 'text', 'required placeholder="مثلا: عطلة، احتياط، طوموبيل"'))}
    <div class="grid2">${field('الهدف (DH)', inp('target', g.target, 'number'))}${field('عندك دابا (DH)', inp('saved', g.saved, 'number', 'placeholder="0"'))}</div>
    ${field('قبل شمن شهر (اختياري)', inp('deadline', g.deadline, 'month'))}<button class="btn primary block" type="submit">${ic('check')} سجل</button></form>`, sh => {
    const f = $('#gf', sh);
    f.onsubmit = e => { e.preventDefault(); const v = formVals(f); if (!v.name.trim()) return invalid(f.name); if (!(num(v.target) > 0)) return invalid(f.target);
      const rec = { id:ed ? g.id : uid(), name:v.name.trim(), target:num(v.target), saved:num(v.saved), deadline:v.deadline || '' };
      if (ed) S.goals = S.goals.map(x => x.id === g.id ? rec : x); else S.goals.push(rec); save(); closeSheet(); success(false); render(); };
  });
}
function fundSheet(id) {
  const g = S.goals.find(x => x.id === id);
  openSheet(head('زيد للهدف · ' + esc(g.name)) + `<form id="ff"><div class="amount-box"><input class="input amount-in" name="amount" inputmode="decimal" placeholder="0"><div class="cur">DH</div></div>
    <label class="switch-row"><input type="checkbox" name="astx" checked><span class="sw"></span><span>سجلها حتى كمصروف «Épargne» باش تنقص من الباقي ديال الشهر</span></label>
    <button class="btn primary block" type="submit">${ic('check')} زيد</button></form>`, sh => {
    const f = $('#ff', sh); setTimeout(() => f.amount.focus(), 350);
    f.onsubmit = e => { e.preventDefault(); const a = num(f.amount.value); if (!(a > 0)) return invalid(f.amount);
      const was = g.saved < g.target; g.saved = Math.round((+g.saved + a) * 100) / 100;
      if (f.astx.checked) { if (!S.cats.find(c => c.id === 'epargne')) S.cats.push({ id:'epargne', name:'Épargne', ar:'التوفير', icon:'target', color:'#00d4b4', kind:'exp' });
        S.tx.push({ id:uid(), ts:Date.now(), type:'exp', cat:'epargne', amount:a, note:'هدف · ' + g.name, date:today() }); }
      save(); closeSheet(); const reached = was && g.saved >= g.target; success(true); render();
      toast(reached ? `🎉 وصلتي للهدف ${esc(g.name)}!` : `تزادو <span class="num">${fmt(a)}</span> لـ ${esc(g.name)}`, 'check', null, true); };
  });
}

/* ---------- storage protection ---------- */
function initPersist() {
  if (!navigator.storage || !navigator.storage.persisted) { U.persist = false; return; }
  navigator.storage.persisted().then(p => { U.persist = p; if (!p && S.tx.length) askPersist(); }).catch(() => {});
}
function askPersist() {
  if (U.persist || !navigator.storage || !navigator.storage.persist) return;
  navigator.storage.persist().then(r => { U.persist = r; }).catch(() => { U.persist = false; });
}

/* ---------- PIN lock ---------- */
const PINK = 'msarifi.pin';
function pinData() { try { return JSON.parse(localStorage.getItem(PINK)); } catch (e) { return null; } }
async function hashPin(pin, salt) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pin));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
let unlockQ = [];
function afterUnlock(fn) { if ($('#lock')) unlockQ.push(fn); else fn(); }
function showLock(mode) {
  if ($('#lock')) return;
  let entry = '', first = null;
  const el = document.createElement('div'); el.id = 'lock'; el.className = 'lock';
  const title = () => mode === 'unlock' ? 'دخل الرمز ديالك' : first == null ? 'اختار رمز ديال 4 أرقام' : 'عاود الرمز';
  el.innerHTML = `<div class="logo">م</div><h3 id="lockT">${title()}</h3><div class="dots" id="dots">${'<i></i>'.repeat(4)}</div>
    <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-k="${n}">${n}</button>`).join('')}<button data-k="x" class="sm">${mode === 'unlock' ? 'نسيت؟' : 'لغي'}</button><button data-k="0">0</button><button data-k="b" aria-label="مسح">${ic('chevR')}</button></div>`;
  document.body.appendChild(el);
  const dots = () => $$('#dots i', el).forEach((d, i) => d.classList.toggle('on', i < entry.length));
  const fail = msg => { const d = $('#dots', el); d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); vib([40, 40, 40]); entry = ''; setTimeout(dots, 250); if (msg) $('#lockT', el).textContent = msg; };
  const close = () => { el.classList.add('out'); document.removeEventListener('keydown', kd); setTimeout(() => { el.remove(); const q = unlockQ; unlockQ = []; q.forEach(f => f()); }, 300); };
  const full = async () => {
    if (mode === 'unlock') { const p = pinData(); if (p && await hashPin(entry, p.salt) === p.hash) { vib(15); close(); } else fail('الرمز غالط، عاود'); return; }
    if (first == null) { first = entry; entry = ''; dots(); $('#lockT', el).textContent = title(); return; }
    if (entry !== first) { first = null; fail('ما تشابهوش، عاود من اللول'); return; }
    const salt = [...crypto.getRandomValues(new Uint8Array(12))].map(x => x.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(PINK, JSON.stringify({ salt, hash:await hashPin(entry, salt) })); close(); success(false); toast('تحط الرمز 🔒');
  };
  const key = k => {
    if (k === 'x') { if (mode !== 'unlock') return close();
      if (confirm('نسيتي الرمز؟ الطريقة الوحيدة هي تمسح كاع الداتا من هاد التيليفون (إلا عندك نسخة احتياطية تقدر ترجعها من بعد). نمسحو؟')) { localStorage.removeItem(KEY); localStorage.removeItem(PINK); location.reload(); } return; }
    if (k === 'b') { entry = entry.slice(0, -1); dots(); return; }
    if (entry.length >= 4) return; entry += k; vib(6); dots(); if (entry.length === 4) setTimeout(full, 120);
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) { bounce(b); key(b.dataset.k); } });
  const kd = e => { if (/^[0-9]$/.test(e.key)) key(e.key); else if (e.key === 'Backspace') key('b'); };
  document.addEventListener('keydown', kd);
}

/* ---------- boot ---------- */
function boot() {
  load(); runRecurring();
  $('#fab').innerHTML = ic('plus');
  $('#privBtn').innerHTML = '<svg class="i eye-ic" viewBox="0 0 24 24" aria-hidden="true"><g class="eyeball"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle class="pupil" cx="12" cy="12" r="3"/></g><path class="slash" d="M3 3l18 18"/></svg>';
  setPriv(document.documentElement.dataset.priv === '1');
  $('#privBtn').onclick = () => setPriv(document.documentElement.dataset.priv !== '1', true); $('#settingsBtn').innerHTML = ic('settings');
  setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const h = new Date().getHours(); $('#hello').textContent = h < 12 ? 'صباح الخير 👋 فين كيمشي الصالير؟' : h < 18 ? 'مساء الخير 👋 فين كيمشي الصالير؟' : 'مساء النور 🌙 فين كيمشي الصالير؟';
  document.addEventListener('pointerdown', ripple, { passive:true });
  document.addEventListener('click', e => {
    const tb = e.target.closest('[data-tab]'); if (tb) return go(tb.dataset.tab);
    const sb = e.target.closest('[data-segval]'); if (sb) { const s = sb.closest('[data-seg]'); U[s.dataset.seg] = sb.dataset.segval; vib(6);
      $$('button', s).forEach(x => x.classList.toggle('on', x === sb)); placeThumbs(s.parentElement); setTimeout(render, 160); return; }
    const a = e.target.closest('[data-act]'); if (a && ACT[a.dataset.act]) { ACT[a.dataset.act](a); }
  });
  $('#fab').onclick = () => { bounce($('#fab')); if ($('#sheet').classList.contains('show')) closeSheet(); else txSheet(); };
  $('#backdrop').onclick = closeSheet;
  $('#themeBtn').onclick = () => { setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'); bounce($('#themeBtn')); vib(8); render(); };
  $('#settingsBtn').onclick = settingsSheet;
  $('#importFile').onchange = e => { const f = e.target.files[0]; if (f) importData(f); e.target.value = ''; };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  sheetDrag();
  addEventListener('resize', () => placeThumbs(document, true));
  renderTabs(); $('#v-home').classList.add('active'); render();
  initPersist();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { U.hiddenAt = Date.now(); return; }
    if (pinData() && U.hiddenAt && Date.now() - U.hiddenAt > 60000) showLock('unlock');
    if (runRecurring()) render();
  });
  const locked = !!pinData(); if (locked) showLock('unlock');
  const q = new URLSearchParams(location.search);
  if (q.has('add')) { afterUnlock(() => txSheet(null, { amount:q.get('amount') || '', cat:q.get('cat') || '', note:q.get('note') || '', type:q.get('type') === 'inc' ? 'inc' : 'exp' })); history.replaceState(null, '', location.pathname); }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js').catch(() => {});
  window.__msarifi = { get state() { return S; } };
}
boot();
})();
