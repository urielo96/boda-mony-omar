/* ============================================================
   COUNTDOWN
   ============================================================ */
function updateCountdown() {
  const wedding = new Date('2026-10-24T15:30:00-06:00');
  const now     = new Date();
  const diff    = wedding - now;

  if (diff <= 0) {
    const el = document.getElementById('countdown');
    if (el) el.innerHTML = '<p style="font-family:var(--font-serif);font-size:1.4rem;opacity:.9">¡El gran día ha llegado! 🌹</p>';
    return;
  }

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val).padStart(2, '0');
  };

  set('cd-days', days);
  set('cd-hours', hours);
  set('cd-mins', minutes);
  set('cd-secs', seconds);
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ============================================================
   HERO BG ZOOM IN
   ============================================================ */
window.addEventListener('load', () => {
  const bg = document.querySelector('.hero__bg');
  if (bg) setTimeout(() => bg.classList.add('loaded'), 100);
});

/* ============================================================
   FADE IN ON SCROLL
   ============================================================ */
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ============================================================
   COPY TO CLIPBOARD
   ============================================================ */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.textContent = '✓';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = '⧉';
      }, 2000);
    });
  });
});

/* ============================================================
   SIGNOS ZODIACALES DINÁMICOS POR NÚMERO DE PASES
   ============================================================ */
const ZODIACOS = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];

function buildCompanionFields(numPases) {
  const container = document.getElementById('companions-container');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 1; i < numPases; i++) {
    const label = numPases > 2 ? `Signo zodiacal del acompañante ${i}` : 'Signo zodiacal de tu acompañante';
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <label class="form-label" for="signoInvitado${i}">${label} (opcional)</label>
      <select class="form-control" id="signoInvitado${i}" name="signoInvitado${i}">
        <option value="">— Seleccionar —</option>
        ${ZODIACOS.map(z => `<option>${z}</option>`).join('')}
      </select>`;
    container.appendChild(div);
  }
}

const pasesSelect = document.getElementById('pases');
if (pasesSelect) {
  pasesSelect.addEventListener('change', () => buildCompanionFields(parseInt(pasesSelect.value)));
  buildCompanionFields(parseInt(pasesSelect.value));
}

/* ============================================================
   RSVP — Google Sheets via Apps Script
   Instrucciones de configuración:
   1. Crea un Google Sheet: "RSVP – Boda Mony & Omar"
   2. Encabezados: Fecha | Nombre | Asistencia | Pases | Signo | Signo Invitado | Mensaje
   3. Extensiones > Apps Script — pega el código de rsvp-script.gs
   4. Implementar > Nueva implementación > Aplicación web
      - Ejecutar como: Yo mismo
      - Quién tiene acceso: Cualquier persona
   5. Copia la URL y reemplaza APPS_SCRIPT_URL abajo
   ============================================================ */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzmiODNoNXJQ6FIuNf_yyhzi_X1piQnOpVJV8KHnS8WnkAP9V9VUT0UDe74_V79UiVCoA/exec';

const form = document.getElementById('rsvp-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const numPases = parseInt(form.pases.value);
    const signos = [];
    for (let i = 1; i < numPases; i++) {
      const el = form[`signoInvitado${i}`];
      signos.push(el?.value || '');
    }

    const data = {
      version:         form.version.value,
      nombre:          form.nombre.value.trim(),
      asistencia:      form.asistencia.value,
      pases:           form.pases.value,
      signo:           form.signo.value,
      signosInvitados: signos.join(' | '),
      mensaje:         form.mensaje.value.trim(),
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      form.style.display = 'none';
      document.getElementById('rsvp-success').style.display = 'block';
    } catch {
      btn.disabled = false;
      btn.textContent = 'Confirmar Asistencia';
      alert('Hubo un error. Por favor intenta de nuevo.');
    }
  });
}
