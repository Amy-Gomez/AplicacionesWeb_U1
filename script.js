/* MENÚ HAMBURGUESA */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

function toggleMenu(abrir) {
  navLinks.classList.toggle('abierto', abrir);
  navToggle.classList.toggle('abierto', abrir);
  navToggle.setAttribute('aria-expanded', String(abrir));
  navToggle.setAttribute('aria-label', abrir ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  if (abrir) navLinks.querySelector('a').focus();
}

navToggle.addEventListener('click', () => toggleMenu(!navLinks.classList.contains('abierto')));
navLinks.addEventListener('keydown', e => { if (e.key === 'Escape') { toggleMenu(false); navToggle.focus(); } });
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('focusin', e => { if (!navLinks.contains(e.target) && e.target !== navToggle) toggleMenu(false); });

/*  FILTRO DE MODALIDAD  */
const filtroBtn      = document.getElementById('filtro-btn');
const filtroDropdown = document.getElementById('filtro-dropdown');
const filtroLabel    = document.getElementById('filtro-label');
const opciones       = filtroDropdown.querySelectorAll('.filtro-opcion');
const grid           = document.getElementById('servicios-grid');
const cards          = grid.querySelectorAll('.card-materia');

const cerrarFiltro = () => { filtroDropdown.classList.remove('abierto'); filtroBtn.setAttribute('aria-expanded', 'false'); };

filtroBtn.addEventListener('click', e => {
  e.stopPropagation();
  const abierto = filtroDropdown.classList.toggle('abierto');
  filtroBtn.setAttribute('aria-expanded', String(abierto));
});

filtroDropdown.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', cerrarFiltro);

opciones.forEach(o => o.addEventListener('click', () => {
  const val = o.dataset.valor;
  opciones.forEach(x => { x.classList.remove('activa'); x.setAttribute('aria-selected', 'false'); });
  o.classList.add('activa');
  o.setAttribute('aria-selected', 'true');
  filtroLabel.textContent = o.textContent;
  cerrarFiltro();
  grid.classList.toggle('filtro-todas', val === 'todas');
  cards.forEach(c => c.classList.toggle('oculta', val !== 'todas' && c.dataset.modalidad !== val));
}));

/*  VALIDACIÓN DE FORMULARIO  */
const form      = document.getElementById('form-agendar');
const formExito = document.getElementById('form-exito');

function setError(el, span, hasError) {
  hasError ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid');
  span.classList.toggle('visible', hasError);
}

const reglas = [
  { id: 'nombre',     ok: v => { const p = v.trim().split(/\s+/); return p.length >= 2 && p.every(w => w.length >= 2); } },
  { id: 'correo',     ok: v => /^[^\s@]+@[^\s@]+\.edu(\.[a-z]{2,})?$/i.test(v.trim()) },
  { id: 'materia',    ok: v => v !== '' },
  { id: 'fecha-dia',  ok: v => { if (!v) return false; const [y,m,d]=v.split('-').map(Number),h=new Date(); h.setHours(0,0,0,0); return new Date(y,m-1,d)>=h; } },
  { id: 'fecha-hora', ok: v => v !== '' },
];

document.getElementById('fecha-dia').min = new Date().toISOString().split('T')[0];

reglas.forEach(({ id, ok }) => {
  const el   = document.getElementById(id);
  const span = document.getElementById(id + '-error');
  el.addEventListener('blur',  () => setError(el, span, !ok(el.value)));
  el.addEventListener('input', () => { if (el.hasAttribute('aria-invalid') && ok(el.value)) setError(el, span, false); });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  let primero = null;
  reglas.forEach(({ id, ok }) => {
    const el   = document.getElementById(id);
    const span = document.getElementById(id + '-error');
    const err  = !ok(el.value);
    setError(el, span, err);
    if (err && !primero) primero = el;
  });
  if (primero) { primero.focus(); return; }
  formExito.classList.add('visible');
  form.style.display = 'none';
  formExito.focus();
});
