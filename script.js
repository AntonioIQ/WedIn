/* ============================================================================
   INVITACIÓN DE BODA - CHRISTIAN ARELI & JOSÉ ANTONIO
   Script principal con soporte completo para móvil
   ========================================================================== */

// ==================== CONFIGURACIÓN ====================
const FORM_URL_BASE = "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAZ__oZGHM5UMVlCQUVCWUNFUEZORDNMVzRMMFJTV0NRVS4u";
const FORM_PREFILL_KEYS = ["nombre", "pases", "mesa", "invitacion"];

// Configuración de YouTube
const YOUTUBE_VIDEO_ID = "w11tnVnoYM8";
const SONG_NAME = "Música para nuestra boda";

// ==================== VARIABLES GLOBALES ====================
let youtubePlayer = null;
let isPlaying = false;
let playerReady = false;
let isTouchDevice = false;

// ==================== HELPERS ====================
// Selección rápida de elementos
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

// Detectar dispositivo táctil
function detectTouchDevice() {
  isTouchDevice = (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
  
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    console.log('📱 Dispositivo táctil detectado');
  } else {
    console.log('🖱️ Dispositivo con mouse detectado');
  }
}


/* ============================================================================
   REPRODUCTOR DE MÚSICA YOUTUBE
   ========================================================================== */

// ===== INICIALIZACIÓN DEL REPRODUCTOR =====
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

// ===== EVENTOS DEL REPRODUCTOR =====

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
    updateMusicButton(true);
    updateMusicStatus('Reproduciendo...');
    
    // En móvil, cerrar controles automáticamente después de 2s cuando empieza a reproducir
    if (isTouchDevice && playerBox) {
      setTimeout(() => {
        if (isPlaying) {
          playerBox.classList.remove('controls-open');
          console.log('🔇 Cerrando controles automáticamente');
        }
      }, 2000);
    } else if (playerBox) {
      // En desktop, cerrar la barra después de un momento
      setTimeout(() => {
        if (isPlaying && !playerBox.matches(':hover')) {
          playerBox.classList.remove('controls-open');
        }
      }, 2000);
    }

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

// ===== ACTUALIZACIÓN DE UI =====

function updateMusicButton(playing) {
  const musicBtn = $('#musicToggle');
  if (musicBtn) {
    if (playing) {
      musicBtn.classList.add('playing');
      musicBtn.classList.add('active');
      musicBtn.setAttribute('title', 'Pausar música');
      musicBtn.setAttribute('aria-label', 'Pausar música');
    } else {
      musicBtn.classList.remove('playing');
      musicBtn.classList.remove('active');
      musicBtn.setAttribute('title', 'Reproducir música');
      musicBtn.setAttribute('aria-label', 'Reproducir música');
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

// ===== CONFIGURACIÓN DE CONTROLES =====

function wireMusicPlayer() {
  const playerBox = document.querySelector('.music-player-minimal');
  const musicBtn = $('#musicToggle');
  const volumeSlider = $('#volumeSlider');
  const volumePercent = $('#volumePercent');

  if (!musicBtn) return;

  // ===== BOTÓN DE PLAY/PAUSE =====
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Solo en móvil, prevenir que se ejecute también el touchend
    if (isTouchDevice) {
      // NO ejecutar aquí, el touchend lo manejará
      return;
    }
    
    if (!playerReady || !youtubePlayer) {
      console.log('⏳ Reproductor aún no está listo');
      updateMusicStatus('Cargando reproductor...');
      return;
    }
    
    try {
      // Alternar reproducción
      if (isPlaying) {
        youtubePlayer.pauseVideo();
        console.log('⏸️ Música pausada (click)');
      } else {
        youtubePlayer.playVideo();
        console.log('▶️ Música reproduciendo (click)');
      }
      
      // En desktop, toggle de controles
      if (playerBox) {
        playerBox.classList.toggle('controls-open');
      }
      
    } catch (error) {
      console.error('❌ Error al controlar el reproductor:', error);
      updateMusicStatus('Error al reproducir');
    }
  });

  // ===== CONTROL DE VOLUMEN =====
  if (volumeSlider) {
    // Función para actualizar el slider visualmente
    function updateVolumeSlider(value) {
      const percentage = value;
      // Gradiente simple de izquierda a derecha
      // Con scale(-1, 1) + rotate(-90deg) se verá correctamente
      const gradient = `linear-gradient(to right, #7d9db5 0%, #7d9db5 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
      volumeSlider.style.background = gradient;
      
      if (volumePercent) {
        volumePercent.textContent = value + '%';
      }
      
      console.log(`🔊 Volumen ajustado a: ${value}%`);
    }
    
    // Inicializar display de porcentaje y visual
    updateVolumeSlider(parseInt(volumeSlider.value));

    // Evento de cambio de volumen
    volumeSlider.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value);
      
      // Actualizar visual del slider
      updateVolumeSlider(volume);
      
      // Actualizar volumen del player
      if (youtubePlayer && playerReady && youtubePlayer.setVolume) {
        try {
          youtubePlayer.setVolume(volume);
          console.log(`🔊 Volumen del player: ${volume}%`);
        } catch (error) {
          console.error('❌ Error al cambiar volumen:', error);
        }
      } else {
        console.log('⚠️ Player no listo para cambiar volumen');
      }
    });
    
    // También escuchar el evento 'change' para cuando se suelta
    volumeSlider.addEventListener('change', (e) => {
      const volume = parseInt(e.target.value);
      console.log(`✅ Volumen final confirmado: ${volume}%`);
      
      // Asegurar que el player tiene el volumen correcto
      if (youtubePlayer && playerReady) {
        try {
          youtubePlayer.setVolume(volume);
        } catch (error) {
          console.error('❌ Error al confirmar volumen:', error);
        }
      }
    });
    
    // En móvil, asegurar que el slider sea fácil de usar
    if (isTouchDevice) {
      volumeSlider.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        console.log('👆 Iniciando ajuste de volumen - valor:', volumeSlider.value + '%');
      });
      
      volumeSlider.addEventListener('touchmove', (e) => {
        e.stopPropagation();
        const currentVolume = parseInt(volumeSlider.value);
        console.log(`📊 Moviendo slider: ${currentVolume}%`);
      });
      
      volumeSlider.addEventListener('touchend', (e) => {
        e.stopPropagation();
        const finalVolume = parseInt(volumeSlider.value);
        console.log(`✋ Soltado en: ${finalVolume}%`);
      });
    }
  }

  // ===== MANEJO DE HOVER EN DESKTOP =====
  if (!isTouchDevice && playerBox) {
    // Mantener controles abiertos mientras hay hover
    playerBox.addEventListener('mouseenter', () => {
      if (playerReady) {
        playerBox.classList.add('controls-open');
      }
    });

    // Cerrar controles al salir del hover (solo si no está reproduciendo)
    playerBox.addEventListener('mouseleave', () => {
      if (!isPlaying) {
        playerBox.classList.remove('controls-open');
      }
    });
  }

  // ===== MANEJO TÁCTIL EN MÓVIL =====
  if (isTouchDevice && playerBox) {
    let touchTimer = null;
    let lastTap = 0;
    
    // Prevenir propagación en touchstart
    musicBtn.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      e.preventDefault();
    }, { passive: false });
    
    // Manejar el toque en touchend para mejor respuesta
    musicBtn.addEventListener('touchend', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      // Evitar doble tap accidental (menos de 300ms)
      if (tapLength < 300 && tapLength > 0) {
        console.log('⚠️ Doble tap detectado, ignorando');
        return;
      }
      lastTap = currentTime;
      
      // Controlar reproducción
      if (playerReady && youtubePlayer) {
        try {
          if (isPlaying) {
            youtubePlayer.pauseVideo();
            console.log('⏸️ Música pausada (touch)');
          } else {
            youtubePlayer.playVideo();
            console.log('▶️ Música reproduciendo (touch)');
          }
        } catch (error) {
          console.error('❌ Error al controlar reproducción:', error);
        }
      } else {
        console.log('⏳ Player no está listo');
        updateMusicStatus('Cargando...');
      }
      
      // Mostrar controles (no toggle, siempre abrir)
      playerBox.classList.add('controls-open');
      console.log('🔊 Controles abiertos');
      
      // Auto-cerrar después de 5 segundos
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        playerBox.classList.remove('controls-open');
        console.log('🔇 Controles cerrados automáticamente');
      }, 5000);
    }, { passive: false });
    
    // Toque fuera del reproductor cierra los controles
    document.addEventListener('touchstart', (e) => {
      if (!playerBox.contains(e.target)) {
        playerBox.classList.remove('controls-open');
        clearTimeout(touchTimer);
      }
    });
    
    // Mientras se usa el slider, mantener controles abiertos
    if (volumeSlider) {
      volumeSlider.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        clearTimeout(touchTimer);
        playerBox.classList.add('controls-open');
        console.log('🎚️ Ajustando volumen...');
      });
      
      volumeSlider.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      });
      
      volumeSlider.addEventListener('touchend', (e) => {
        e.stopPropagation();
        // Dar tiempo para ajustar, luego cerrar
        clearTimeout(touchTimer);
        touchTimer = setTimeout(() => {
          playerBox.classList.remove('controls-open');
          console.log('🔇 Cerrando controles después de ajustar volumen');
        }, 3000);
      });
    }
  }
  
  console.log('🎵 Reproductor de música configurado');
}


/* ============================================================================
   CONTROL DE TAMAÑO DE FUENTE
   ========================================================================== */

let currentFontSize = 100;

function setFontSize(percentage) {
  currentFontSize = Math.max(80, Math.min(200, percentage));
  document.documentElement.style.fontSize = currentFontSize + '%';
  
  const fontPercentEl = $('#fontPercent');
  if (fontPercentEl) fontPercentEl.textContent = currentFontSize + '%';
  
  console.log('🔤 Tamaño de fuente:', currentFontSize + '%');
}

function wireFontSlider() {
  const fontSlider = $('#fontSlider');
  if (!fontSlider) return;
  
  // Evento de cambio
  fontSlider.addEventListener('input', e => {
    setFontSize(parseInt(e.target.value));
  });
  
  // Inicializar
  setFontSize(100);
  
  console.log('🔤 Control de tamaño de fuente configurado');
}


/* ============================================================================
   RSVP - CONFIRMACIÓN DE ASISTENCIA
   ========================================================================== */

function buildRSVPUrl() {
  const params = new URLSearchParams(window.location.search);
  const pairs = FORM_PREFILL_KEYS.map(k => {
    const v = params.get(k);
    return v ? `${k}=${encodeURIComponent(v)}` : null;
  }).filter(Boolean);
  
  let url = FORM_URL_BASE;
  if (pairs.length) url += '&' + pairs.join('&');
  
  return url;
}

function wireRSVPButton() {
  const btn = $('#rsvpBtn');
  if (!btn) return;
  
  btn.addEventListener('click', e => {
    e.preventDefault();
    const url = buildRSVPUrl();
    console.log('📝 Abriendo formulario RSVP:', url);
    window.open(url, '_blank');
  });
  
  console.log('📝 Botón RSVP configurado');
}


/* ============================================================================
   SCROLL SUAVE Y ANIMACIONES
   ========================================================================== */

// ===== SCROLL SUAVE A ANCLAS =====
function enableSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      
      const target = $(href);
      if (!target) return;
      
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
  
  console.log('📜 Scroll suave habilitado');
}

// ===== REVELAR ELEMENTOS AL HACER SCROLL =====
function enableRevealOnScroll() {
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = "1";
        en.target.style.transform = "translateY(0)";
        o.unobserve(en.target);
      }
    });
  }, {
    threshold: .1,
    rootMargin: "0px 0px -5% 0px"
  });
  
  $$(".section, .card, .calendar").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    obs.observe(el);
  });
  
  console.log('✨ Animaciones de revelado configuradas');
}


/* ============================================================================
   SOBRE - ANIMACIÓN DE APERTURA
   ========================================================================== */

function openInvitation() {
  if (document.body.classList.contains("opened")) return;
  
  console.log("📨 Iniciando transición suave...");
  
  const envelope = $(".envelope");
  const sealBtn = $("#openInvite");
  
  if (envelope) {
    const closedImg = $(".envelope__img--closed");
    const openImg = $(".envelope__img--open");
    
    // Optimización de rendimiento
    if (closedImg) closedImg.style.willChange = "opacity, transform, filter";
    if (openImg) openImg.style.willChange = "opacity, transform, filter";
    
    // Iniciar animación
    envelope.classList.add("opening");
    if (sealBtn) sealBtn.style.pointerEvents = "none";
    
    // Completar transición
    setTimeout(() => {
      console.log("🎉 Transición completada, mostrando invitación...");
      
      document.body.classList.add("opened");
      
      // Limpiar optimizaciones
      if (closedImg) closedImg.style.willChange = "auto";
      if (openImg) openImg.style.willChange = "auto";
      
      // Scroll suave al inicio
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Enfocar el header para accesibilidad
      const header = $("header");
      if (header) {
        header.setAttribute("tabindex", "-1");
        setTimeout(() => {
          header.focus();
          header.removeAttribute("tabindex");
        }, 200);
      }
      
      // ========== 🎵 REPRODUCIR MÚSICA AUTOMÁTICAMENTE ==========
      // Después de abrir el sobre, iniciar la música
      // iOS Safari requiere intentos múltiples y tiempo extra
      setTimeout(() => {
        if (youtubePlayer && playerReady) {
          // Intento 1: inmediato
          try {
            youtubePlayer.playVideo();
            console.log('🎵 Intento 1: Reproduciendo música');
          } catch (error) {
            console.log('⚠️ Intento 1 falló');
          }
          
          // Intento 2: después de 800ms (para iOS)
          setTimeout(() => {
            if (!isPlaying && youtubePlayer) {
              try {
                youtubePlayer.playVideo();
                console.log('🎵 Intento 2: Reproduciendo música');
              } catch (error) {
                console.log('⚠️ Intento 2 falló');
              }
            }
          }, 800);
          
          // Intento 3: después de 1500ms (último intento para iOS)
          setTimeout(() => {
            if (!isPlaying && youtubePlayer) {
              try {
                youtubePlayer.playVideo();
                console.log('🎵 Intento 3: Reproduciendo música');
              } catch (error) {
                console.log('⚠️ Autoplay bloqueado - usuario debe tocar botón');
              }
            }
          }, 1500);
          
        } else {
          console.log('⏳ Reproductor aún no está listo para autoplay');
        }
      }, 500);
      // ========================================================
      
    }, 1550);
  }
}

function wireEnvelope() {
  const overlay = $("#envelope-overlay");
  const sealBtn = $("#openInvite");
  const envelope = $(".envelope");
  
  // ===== BOTÓN DEL SELLO =====
  if (sealBtn) {
    sealBtn.addEventListener("click", e => {
      e.stopPropagation();
      e.preventDefault();
      openInvitation();
    });
    
    sealBtn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInvitation();
      }
    });
  }
  
  // ===== SOBRE (prevenir propagación) =====
  if (envelope) {
    envelope.addEventListener("click", e => {
      if (e.target === sealBtn) return;
      e.stopPropagation();
    });
  }
  
  // ===== OVERLAY (accesibilidad) =====
  if (overlay) {
    overlay.tabIndex = 0;
    overlay.setAttribute("role", "button");
    overlay.setAttribute("aria-label", "Abrir invitación de boda - Presiona Enter o Espacio");
    
    overlay.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInvitation();
      }
    });
  }
  
  console.log('💌 Sobre de invitación configurado');
}


/* ============================================================================
   HISTORIA (CARGA DESDE ARCHIVO)
   ========================================================================== */

async function loadHistoria() {
  const el = $("#historiaContent");
  if (!el) return;
  
  try {
    const res = await fetch("historia.txt", { cache: "no-store" });
    
    if (!res.ok) throw new Error("No encontrado");
    
    const txt = await res.text();
    const clean = txt.trim();
    
    if (!clean) {
      el.innerHTML = `<p class="placeholder">El archivo <strong>historia.txt</strong> está vacío.</p>`;
      return;
    }
    
    // Convertir párrafos separados por líneas en blanco
    const parts = clean.split(/\n\s*\n/).map(p => p.replace(/\n/g, " ").trim());
    el.innerHTML = parts.map(p => `<p>${p}</p>`).join("");
    
    console.log('📖 Historia cargada exitosamente');
    
  } catch (err) {
    el.innerHTML = `<p class="placeholder">Carga "<strong>historia.txt</strong>" en la raíz del sitio para mostrar su contenido aquí.</p>`;
    console.log('📖 Archivo historia.txt no encontrado (opcional)');
  }
}


/* ============================================================================
   CLASE body.scrolling
   ========================================================================== */

let _scrollTimer = null;

function wireScrollClass() {
  window.addEventListener('scroll', () => {
    // Agregar clase mientras se hace scroll
    document.body.classList.add('scrolling');

    // Ocultar indicador de scroll
    const si = document.querySelector('.scroll-indicator');
    if (si) si.classList.add('hidden');
    
    // En móvil, cerrar los controles del reproductor cuando hay scroll
    if (isTouchDevice) {
      const playerBox = document.querySelector('.music-player-minimal');
      if (playerBox && playerBox.classList.contains('controls-open')) {
        playerBox.classList.remove('controls-open');
        console.log('🔇 Controles cerrados por scroll');
      }
    }

    // Quitar clase después de que termine el scroll
    clearTimeout(_scrollTimer);
    _scrollTimer = setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 800);
    
  }, { passive: true });
  
  console.log('📜 Detección de scroll configurada');
}


/* ============================================================================
   PRELOAD DE IMÁGENES
   ========================================================================== */

function preloadImages() {
  // Precargar imágenes del sobre para transición suave
  const preloadClosed = new Image();
  preloadClosed.src = "images/envelope.jpg";
  
  const preloadOpen = new Image();
  preloadOpen.src = "images/envelope-open.jpg";
  
  console.log('🖼️ Precarga de imágenes iniciada');
}


/* ============================================================================
   INICIALIZACIÓN PRINCIPAL
   ========================================================================== */

window.addEventListener("DOMContentLoaded", () => {
  console.log('🚀 Inicializando página de boda...');
  console.log('💑 Christian Areli & José Antonio');
  console.log('📅 29 de Noviembre, 2025');
  console.log('─────────────────────────────────');
  
  // Detectar tipo de dispositivo
  detectTouchDevice();
  
  // Inicializar todos los módulos
  wireFontSlider();
  wireMusicPlayer();
  wireScrollClass();
  enableSmoothScroll();
  enableRevealOnScroll();
  wireRSVPButton();
  wireEnvelope();
  loadHistoria();
  preloadImages();
  
  console.log('─────────────────────────────────');
  console.log('✅ Página lista para usar');
});


/* ============================================================================
   DEBUG Y UTILIDADES
   ========================================================================== */

// Exponer funciones útiles para debug (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.weddingDebug = {
    openInvitation,
    setFontSize,
    player: () => youtubePlayer,
    isTouchDevice: () => isTouchDevice,
    isPlaying: () => isPlaying,
    playerReady: () => playerReady
  };
  console.log('🔧 Modo debug activado. Usa window.weddingDebug para funciones de prueba.');
}