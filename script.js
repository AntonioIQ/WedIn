// ================== CONFIG ==================
const FORM_URL_BASE = "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAZ__oZGHM5UMVlCQUVCWUNFUEZORDNMVzRMMFJTV0NRVS4u";
const FORM_PREFILL_KEYS = ["nombre", "pases", "mesa", "invitacion"];

// ================== HELPERS ==================
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

function getQueryParams(){
  const out={}, usp=new URLSearchParams(location.search);
  FORM_PREFILL_KEYS.forEach(k => { if (usp.has(k)) out[k]=usp.get(k); });
  return out;
}
function mergeParams(baseUrl, paramsObj){
  if (!paramsObj || !Object.keys(paramsObj).length) return baseUrl;
  const url = new URL(baseUrl);
  Object.entries(paramsObj).forEach(([k,v]) => {
    if (v != null && String(v).trim() !== "") url.searchParams.set(k, v);
  });
  return url.toString();
}

// ================== RSVP ==================
function buildFormURL(extra = {}) { return mergeParams(FORM_URL_BASE, { ...getQueryParams(), ...extra }); }
function openRSVP(extraParams = {}){
  const url = buildFormURL(extraParams);
  const win = window.open(url, "_blank", "noopener");
  const fallback = $("#rsvpFallback");
  if (fallback) fallback.setAttribute("href", url);
  if (!win) location.href = url;
}

// ================== UI ==================
function enableSmoothScroll(){
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener("click", e=>{
      const href=a.getAttribute("href");
      if (!href || href==="#") return;
      const target=$(href); if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth"});
    });
  });
}
function enableRevealOnScroll(){
  const obs=new IntersectionObserver((entries,o)=>{
    entries.forEach(en=>{
      if (en.isIntersecting){
        en.target.style.opacity="1";
        en.target.style.transform="translateY(0)";
        o.unobserve(en.target);
      }
    });
  },{threshold:.1, rootMargin:"0px 0px -5% 0px"});
  $$(".section, .card, .calendar").forEach(el=>{
    el.style.opacity="0";
    el.style.transform="translateY(20px)";
    obs.observe(el);
  });
}
function wireRSVPButton(){
  const btn=$("#rsvpBtn"); if(!btn) return;
  btn.addEventListener("click", e=>{ e.preventDefault(); openRSVP({}); });
}

// ================== SOBRE - ANIMACIÓN SUPER SUAVE ==================
function openInvitation(){
  if (document.body.classList.contains("opened")) return;
  
  console.log("🔓 Iniciando transición suave...");
  
  const envelope = $(".envelope");
  const sealBtn = $("#openInvite");
  
  if (envelope) {
    // Pre-asegurar que las imágenes estén cargadas
    const closedImg = $(".envelope__img--closed");
    const openImg = $(".envelope__img--open");
    
    // Forzar el renderizado de ambas imágenes
    if (closedImg) closedImg.style.willChange = "opacity, transform, filter";
    if (openImg) openImg.style.willChange = "opacity, transform, filter";
    
    // Iniciar animación de apertura
    envelope.classList.add("opening");
    
    // Deshabilitar el botón inmediatamente
    if (sealBtn) {
      sealBtn.style.pointerEvents = "none";
    }
    
    // Esperar a que termine la transición suave
    setTimeout(() => {
      console.log("🎉 Transición completada, mostrando invitación...");
      
      // Agregar la clase que oculta el sobre
      document.body.classList.add("opened");
      
      // Limpiar will-change después de la animación
      if (closedImg) closedImg.style.willChange = "auto";
      if (openImg) openImg.style.willChange = "auto";
      
      // Hacer scroll al inicio suavemente
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Focus para accesibilidad
      const header = $("header"); 
      if(header){ 
        header.setAttribute("tabindex","-1"); 
        setTimeout(() => {
          header.focus();
          header.removeAttribute("tabindex");
        }, 200);
      }
    }, 1550);
  }
}

function wireEnvelope(){
  const overlay = $("#envelope-overlay");
  const sealBtn = $("#openInvite");
  const envelope = $(".envelope");
  
  if (sealBtn) {
    sealBtn.addEventListener("click", e => {
      e.stopPropagation();
      e.preventDefault();
      console.log("🎯 Sello clickeado - transición suave");
      openInvitation();
    });
    
    // También permitir abrir con Enter/Espacio cuando el sello tiene focus
    sealBtn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInvitation();
      }
    });
  }
  
  // Prevenir que clicks en el sobre (fuera del sello) abran la invitación
  if (envelope) {
    envelope.addEventListener("click", e => {
      if (e.target === sealBtn) return;
      e.stopPropagation();
    });
  }
  
  // Accesibilidad: permitir abrir con teclado desde el overlay
  if (overlay){ 
    overlay.tabIndex = 0; 
    overlay.setAttribute("role", "button");
    overlay.setAttribute("aria-label", "Abrir invitación de boda - Presiona Enter o Espacio");
    
    overlay.addEventListener("keydown", e => { 
      if(e.key === "Enter" || e.key === " "){ 
        e.preventDefault(); 
        openInvitation(); 
      }
    }); 
  }
}

// ================== HISTORIA (carga historia.txt) ==================
async function loadHistoria(){
  const el=$("#historiaContent");
  if (!el) return;
  try{
    const res = await fetch("historia.txt", { cache: "no-store" });
    if (!res.ok) throw new Error("No encontrado");
    const txt = await res.text();
    const clean = txt.trim();
    if (!clean){
      el.innerHTML = `<p class="placeholder">El archivo <strong>historia.txt</strong> está vacío.</p>`;
      return;
    }
    // Convierte saltos de línea en párrafos
    const parts = clean.split(/\n\s*\n/).map(p => p.replace(/\n/g," ").trim());
    el.innerHTML = parts.map(p => `<p>${p}</p>`).join("");
  }catch(err){
    el.innerHTML = `<p class="placeholder">Carga "<strong>historia.txt</strong>" en la raíz del sitio para mostrar su contenido aquí.</p>`;
  }
}

// ================== INIT ==================
window.addEventListener("DOMContentLoaded", ()=>{
  enableSmoothScroll();
  enableRevealOnScroll();
  wireRSVPButton();
  wireEnvelope();
  loadHistoria();
  
  // Pre-carga las imágenes del sobre para máxima suavidad
  console.log("🖼️ Pre-cargando imágenes...");
  const preloadClosed = new Image();
  preloadClosed.src = "images/envelope.jpg";
  
  const preloadOpen = new Image();
  preloadOpen.src = "images/envelope-open.jpg";
});