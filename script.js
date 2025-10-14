// ================== CONFIG ==================
const FORM_URL_BASE = "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAZ__oZGHM5UMVlCQUVCWUNFUEZORDNMVzRMMFJTV0NRVS4u"; // <-- pon tu URL real
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

// ================== SOBRE ==================
function openInvitation(){
  if (document.body.classList.contains("opened")) return;
  document.body.classList.add("opened");
  const main=$("main"); if(main){ main.setAttribute("tabindex","-1"); main.focus(); }
}
function wireEnvelope(){
  const overlay=$("#envelope-overlay"), sealBtn=$("#openInvite"), envelope=$(".envelope");
  if (sealBtn) sealBtn.addEventListener("click", openInvitation);
  if (envelope) envelope.addEventListener("click",e=>{ if(e.target===sealBtn) return; openInvitation(); });
  if (overlay){ overlay.tabIndex=0; overlay.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openInvitation(); }}); }
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
  loadHistoria(); // ← lee historia.txt
});