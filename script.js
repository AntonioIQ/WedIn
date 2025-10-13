// === Configura aquí el formulario de RSVP ===
// Reemplaza con tu enlace de Microsoft Forms (u otro). Ejemplo de Forms:
// https://forms.office.com/r/XXXXXXXXXX
const FORM_URL = "https://forms.office.com/r/TU_CODIGO"; // TODO: pon tu URL real


// Si vas a prellenar campos, puedes agregar query params. Ejemplo:
// const FORM_URL = "https://forms.office.com/r/TU_CODIGO?nombre={NOMBRE}&pases={PASES}";


function openRSVP() {
// Intenta abrir en nueva pestaña
const win = window.open(FORM_URL, "_blank", "noopener");
if (!win) {
// Si el navegador bloquea popups, cambia el href de fallback
const fallback = document.getElementById("rsvpFallback");
if (fallback) fallback.setAttribute("href", FORM_URL);
window.location.href = FORM_URL; // como último recurso
}
}


// Scroll suave para anclas internas
function enableSmoothScroll() {
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', (e) => {
const targetSel = anchor.getAttribute('href');
if (targetSel && targetSel !== '#') {
const target = document.querySelector(targetSel);
if (target) {
e.preventDefault();
target.scrollIntoView({ behavior: 'smooth' });
}
}
});
});
}


// Animación de entrada para secciones
function enableRevealOnScroll() {
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateY(0)';
}
});
}, { threshold: 0.1 });


document.querySelectorAll('.section, .info-box').forEach(el => {
el.style.opacity = '0';
el.style.transform = 'translateY(20px)';
observer.observe(el);
});
}


// Botón RSVP
function wireRSVPButton() {
const btn = document.getElementById('rsvpBtn');
if (btn) {
btn.addEventListener('click', (e) => {
e.preventDefault();
openRSVP();
});
}
}


// Inicialización
window.addEventListener('DOMContentLoaded', () => {
enableSmoothScroll();
enableRevealOnScroll();
wireRSVPButton();
});