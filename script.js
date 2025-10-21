// ================== CONFIG ==================
const FORM_URL_BASE = "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAZ__oZGHM5UMVlCQUVCWUNFUEZORDNMVzRMMFJTV0NRVS4u";
const FORM_PREFILL_KEYS = ["nombre", "pases", "mesa", "invitacion"];

// ================== MÚSICA DE YOUTUBE ==================
const YOUTUBE_VIDEO_ID = "a6lhnqQRDhg";
const SONG_NAME = "Música para nuestra boda";

let youtubePlayer = null;
let isPlaying = false;
let playerReady = false;

// Helpers cortos
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

// API YouTube lista
window.onYouTubeIframeAPIReady = function() {
  console.log('🎵 Inicializando reproductor de YouTube...');
  youtubePlayer = new YT.Player('youtubePlayer', {
    height: '0',
    width: '0',
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'showinfo': 0,
      'modestbranding': 1,
      'loop': 1,
      'playlist': YOUTUBE_VIDEO_ID,
      'fs': 0,
      'cc_load_policy': 0,
      'iv_load_policy': 3,
      'autohide': 1,
      'rel': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
};

function onPlayerReady(event) {
  console.log('✅ Reproductor de YouTube listo');
  playerReady = true;
  event.target.setVolume(30);
  updateMusicStatus('Listo para reproducir');
  updateSongName();
}

function onPlayerStateChange(event) {
  console.log('🔄 Estado del reproductor:', event.data);
  const playerBox = document.querySelector('.music-player-minimal');

  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;

    // Cierra la barra de volumen para que el bloque pueda desaparecer en reposo
    if (playerBox) playerBox.classList.remove('controls-open');

    updateMusicButton(true);
    updateMusicStatus('Reproduciendo...');

  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    updateMusicButton(false);
    updateMusicStatus('Pausado');

  } else if (event.data === YT.PlayerState.ENDED) {
    youtubePlayer.playVideo(); // loop

  } else if (event.data === YT.PlayerState.BUFFERING) {
    updateMusicStatus('Cargando...');
  }
}

function onPlayerError(event) {
  console.error('❌ Error en el reproductor:', event.data);
  updateMusicStatus('Error al cargar');
  playerReady = false;
}

function updateMusicButton(playing) {
  const musicBtn = $('#musicToggle');
  if (musicBtn) {
    if (playing) {
      musicBtn.classList.add('playing');
      musicBtn.classList.add('active');
      musicBtn.setAttribute('title', 'Pausar música');
    } else {
      musicBtn.classList.remove('playing');
      musicBtn.classList.remove('active');
      musicBtn.setAttribute('title', 'Reproducir música');
    }
  }
}

function updateMusicStatus(status) {
  const statusEl = $('#musicStatus');
  if (statusEl) statusEl.textContent = status;
}

function updateSongName() {
  const titleEl = $('#musicTitle');
  if (titleEl) titleEl.textContent = SONG_NAME;
}

function wireMusicPlayer() {
  const playerBox    = document.querySelector('.music-player-minimal');
  const musicBtn     = $('#musicToggle');
  const volumeSlider = $('#volumeSlider');
  const volumePercent = $('#volumePercent'); // opcional

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (!playerReady || !youtubePlayer) {
        console.log('⏳ Reproductor aún no está listo');
        updateMusicStatus('Cargando reproductor...');
        return;
      }
      try {
        // Alternar reproducción
        if (isPlaying) {
          youtubePlayer.pauseVideo();
        } else {
          youtubePlayer.playVideo();
        }
        // Abrir/cerrar controles (muestra volumen opaco mientras estén abiertos)
        if (playerBox) playerBox.classList.toggle('controls-open');
      } catch (error) {
        console.error('❌ Error al controlar el reproductor:', error);
        updateMusicStatus('Error al reproducir');
      }
    });
  }
  
  if (volumeSlider) {
    if (volumePercent) volumePercent.textContent = volumeSlider.value + '%';

    volumeSlider.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value);
      if (youtubePlayer && playerReady && youtubePlayer.setVolume) {
        try { youtubePlayer.setVolume(volume); }
        catch (error) { console.error('❌ Error al cambiar volumen:', error); }
      }
      if (volumePercent) volumePercent.textContent = volume + '%';
    });
  }
}

// ================== CONTROL DE TAMAÑO DE FUENTE ==================
let currentFontSize = 100;

function setFontSize(percentage) {
  currentFontSize = Math.max(80, Math.min(200, percentage));
  document.documentElement.style.fontSize = currentFontSize + '%';
  
  const percentDisplay = $('#fontPercent');
  if (percentDisplay) percentDisplay.textContent = currentFontSize + '%';
  
  const slider = $('#fontSlider');
  if (slider && parseInt(slider.value) !== currentFontSize) slider.value = currentFontSize;
  
  console.log('🔍 Tamaño de fuente: ' + currentFontSize + '%');
}

function wireFontSlider() {
  const slider = $('#fontSlider');
  const percentDisplay = $('#fontPercent');
  if (!slider) return;
  slider.addEventListener('input', (e) => setFontSize(parseInt(e.target.value)));
  if (percentDisplay) percentDisplay.textContent = slider.value + '%';
}

// ================== RSVP Y UTILIDADES ==================
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
function buildFormURL(extra = {}) { return mergeParams(FORM_URL_BASE, { ...getQueryParams(), ...extra }); }
function openRSVP(extraParams = {}){
  const url = buildFormURL(extraParams);
  const win = window.open(url, "_blank", "noopener");
  const fallback = $("#rsvpFallback");
  if (fallback) fallback.setAttribute("href", url);
  if (!win) location.href = url;
}

// Scroll suave y revelar al hacer scroll (decorativo)
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

// ================== SOBRE - ANIMACIÓN ==================
function openInvitation(){
  if (document.body.classList.contains("opened")) return;
  console.log("📨 Iniciando transición suave...");
  const envelope = $(".envelope");
  const sealBtn = $("#openInvite");
  if (envelope) {
    const closedImg = $(".envelope__img--closed");
    const openImg = $(".envelope__img--open");
    if (closedImg) closedImg.style.willChange = "opacity, transform, filter";
    if (openImg) openImg.style.willChange = "opacity, transform, filter";
    envelope.classList.add("opening");
    if (sealBtn) sealBtn.style.pointerEvents = "none";
    setTimeout(() => {
      console.log("🎉 Transición completada, mostrando invitación...");
      document.body.classList.add("opened");
      if (closedImg) closedImg.style.willChange = "auto";
      if (openImg) openImg.style.willChange = "auto";
      window.scrollTo({ top: 0, behavior: "smooth" });
      const header = $("header"); 
      if(header){ 
        header.setAttribute("tabindex","-1"); 
        setTimeout(() => { header.focus(); header.removeAttribute("tabindex"); }, 200);
      }
    }, 1550);
  }
}
function wireEnvelope(){
  const overlay = $("#envelope-overlay");
  const sealBtn = $("#openInvite");
  const envelope = $(".envelope");
  if (sealBtn) {
    sealBtn.addEventListener("click", e => { e.stopPropagation(); e.preventDefault(); openInvitation(); });
    sealBtn.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvitation(); } });
  }
  if (envelope) {
    envelope.addEventListener("click", e => { if (e.target === sealBtn) return; e.stopPropagation(); });
  }
  if (overlay){ 
    overlay.tabIndex = 0; overlay.setAttribute("role", "button");
    overlay.setAttribute("aria-label", "Abrir invitación de boda - Presiona Enter o Espacio");
    overlay.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openInvitation(); } });
  }
}

// ================== HISTORIA ==================
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
    const parts = clean.split(/\n\s*\n/).map(p => p.replace(/\n/g," ").trim());
    el.innerHTML = parts.map(p => `<p>${p}</p>`).join("");
  }catch(err){
    el.innerHTML = `<p class="placeholder">Carga "<strong>historia.txt</strong>" en la raíz del sitio para mostrar su contenido aquí.</p>`;
  }
}

// ================== CLASE body.scrolling ==================
let _scrollTimer = null;
function wireScrollClass(){
  window.addEventListener('scroll', () => {
    document.body.classList.add('scrolling');

    // Si tienes indicador, ocultarlo al primer scroll
    const si = document.querySelector('.scroll-indicator');
    if (si) si.classList.add('hidden');

    clearTimeout(_scrollTimer);
    _scrollTimer = setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 800); // debe coincidir con tu intención de "tenue mientras se mueve"
  }, { passive: true });
}

// ================== INIT ==================
window.addEventListener("DOMContentLoaded", ()=>{
  console.log('🚀 Inicializando página...');
  wireFontSlider();
  wireMusicPlayer();
  wireScrollClass();      // controla body.scrolling
  enableSmoothScroll();
  enableRevealOnScroll();
  wireRSVPButton();
  wireEnvelope();
  loadHistoria();

  // Preload imágenes del sobre
  const preloadClosed = new Image(); preloadClosed.src = "images/envelope.jpg";
  const preloadOpen   = new Image(); preloadOpen.src   = "images/envelope-open.jpg";

  console.log('✅ Página lista');
});
