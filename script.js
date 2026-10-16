/**
 * MASTER JAVASCRIPT - UPSELL REUNIÃO 1 A 1 COM EDUARDO
 * Método Auto Peças no Mercado Livre
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Atualizar Ano no Rodapé
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Temporizador Regressivo de Urgência (14:59)
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
    let totalSeconds = 14 * 60 + 59;
    
    // Recupera se houver no sessionStorage para consistência na navegação
    const savedTime = sessionStorage.getItem('upsell_timer_remaining');
    if (savedTime && parseInt(savedTime, 10) > 0) {
      totalSeconds = parseInt(savedTime, 10);
    }

    const updateTimer = () => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      
      if (totalSeconds > 0) {
        totalSeconds--;
        sessionStorage.setItem('upsell_timer_remaining', totalSeconds);
      } else {
        timerDisplay.textContent = '00:00';
      }
    };

    setInterval(updateTimer, 1000);
    updateTimer();
  }

  // 3. Acordeão FAQ Moderno
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha outros itens
      accordionItems.forEach(other => other.classList.remove('active'));

      // Alterna o atual
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 5. Barra Fixa no Rodapé (Sticky Bar ao rolar)
  const stickyBar = document.getElementById('stickyBar');
  const heroSection = document.querySelector('.hero-section');
  const offerSection = document.getElementById('oferta');

  if (stickyBar && heroSection) {
    window.addEventListener('scroll', () => {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const offerRect = offerSection ? offerSection.getBoundingClientRect() : null;

      // Mostra a barra quando passar do Hero
      if (heroBottom < 0) {
        // Se estiver dentro da própria seção de oferta, esconde para não sobrepor o botão principal
        if (offerRect && offerRect.top < window.innerHeight && offerRect.bottom > 0) {
          stickyBar.classList.remove('show');
        } else {
          stickyBar.classList.add('show');
        }
      } else {
        stickyBar.classList.remove('show');
      }
    });
  }

  // 6. Repasse Automático de Parâmetros UTM e Checkout
  const currentSearch = window.location.search;
  const acceptBtn = document.getElementById('upsellAcceptBtn');
  const declineBtn = document.getElementById('upsellDeclineBtn');

  if (currentSearch) {
    const cleanParams = currentSearch.startsWith('?') ? currentSearch.substring(1) : currentSearch;
    
    [acceptBtn, declineBtn].forEach(btn => {
      if (btn) {
        const currentHref = btn.getAttribute('href');
        if (currentHref && !currentHref.startsWith('#')) {
          const glue = currentHref.includes('?') ? '&' : '?';
          btn.setAttribute('href', `${currentHref}${glue}${cleanParams}`);
        }
      }
    });
  }

  // 7. VSL Video Player Interativo com Controles Customizados
  const vslPlayerWrapper = document.getElementById('vslPlayerWrapper');
  const video = document.getElementById('upsellVideo');
  const playBtn = document.getElementById('playBtn');
  const vslOverlay = document.getElementById('vslOverlay');
  const ctrlPlayPause = document.getElementById('ctrlPlayPause');
  const ctrlPlayIcon = document.getElementById('ctrlPlayIcon');
  const ctrlProgressWrapper = document.getElementById('ctrlProgressWrapper');
  const ctrlProgressBar = document.getElementById('ctrlProgressBar');
  const ctrlProgressFill = document.getElementById('ctrlProgressFill');
  const currentTimeDisplay = document.getElementById('currentTime');
  const totalDurationDisplay = document.getElementById('totalDuration');
  const ctrlMute = document.getElementById('ctrlMute');
  const ctrlVolumeIcon = document.getElementById('ctrlVolumeIcon');
  const ctrlVolume = document.getElementById('ctrlVolume');
  const ctrlFullscreen = document.getElementById('ctrlFullscreen');
  const vslCenterIndicator = document.getElementById('vslCenterIndicator');
  const centerIndicatorIcon = document.getElementById('centerIndicatorIcon');

  if (video && vslPlayerWrapper) {
    const formatTime = (seconds) => {
      if (isNaN(seconds) || seconds < 0) return '00:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Atualiza duração total quando metadados carregarem
    const setDuration = () => {
      if (video.duration && !isNaN(video.duration)) {
        totalDurationDisplay.textContent = formatTime(video.duration);
      }
    };
    video.addEventListener('loadedmetadata', setDuration);
    video.addEventListener('durationchange', setDuration);
    if (video.readyState >= 1) setDuration();

    // Feedback visual central (Play/Pause flash)
    let indicatorTimeout = null;
    const flashCenterIndicator = (isPlay) => {
      if (!vslCenterIndicator || !centerIndicatorIcon) return;
      centerIndicatorIcon.className = isPlay ? 'fa-solid fa-play' : 'fa-solid fa-pause';
      vslCenterIndicator.classList.remove('active');
      void vslCenterIndicator.offsetWidth; // Reflow
      vslCenterIndicator.classList.add('active');
      clearTimeout(indicatorTimeout);
      indicatorTimeout = setTimeout(() => {
        vslCenterIndicator.classList.remove('active');
      }, 500);
    };

    // Alternar Play / Pause
    const togglePlay = () => {
      if (video.paused || video.ended) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              flashCenterIndicator(true);
            })
            .catch(() => {
              // Se o navegador barrar o som, inicia mutado e avisa o usuário
              video.muted = true;
              video.play().then(() => {
                showUnmuteBanner();
              });
            });
        }
      } else {
        video.pause();
        flashCenterIndicator(false);
      }
    };

    // Banner flutuante caso autoplay mutado ocorra
    const showUnmuteBanner = () => {
      if (document.querySelector('.vsl-unmute-banner')) return;
      const banner = document.createElement('div');
      banner.className = 'vsl-unmute-banner';
      banner.innerHTML = '<i class="fa-solid fa-volume-xmark text-yellow"></i> <span>Seu vídeo começou sem som. Clique aqui para ativar o áudio!</span>';
      banner.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = false;
        video.volume = 1;
        if (ctrlVolume) ctrlVolume.value = 1;
        updateVolumeIcon();
        banner.remove();
      });
      vslPlayerWrapper.appendChild(banner);
    };

    // Eventos de estado do Vídeo
    video.addEventListener('play', () => {
      vslPlayerWrapper.classList.add('is-playing');
      vslPlayerWrapper.classList.remove('is-paused');
      if (ctrlPlayIcon) {
        ctrlPlayIcon.className = 'fa-solid fa-pause';
      }
    });

    video.addEventListener('pause', () => {
      vslPlayerWrapper.classList.add('is-paused');
      if (ctrlPlayIcon) {
        ctrlPlayIcon.className = 'fa-solid fa-play';
      }
    });

    video.addEventListener('ended', () => {
      vslPlayerWrapper.classList.remove('is-playing', 'is-paused');
      if (ctrlPlayIcon) ctrlPlayIcon.className = 'fa-solid fa-rotate-right';
      if (ctrlProgressFill) ctrlProgressFill.style.width = '100%';
    });

    // Atualização de Progresso contínua
    video.addEventListener('timeupdate', () => {
      if (video.duration && !isNaN(video.duration)) {
        const percent = (video.currentTime / video.duration) * 100;
        if (ctrlProgressFill) ctrlProgressFill.style.width = `${percent}%`;
        if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(video.currentTime);
      }
    });

    // Clique no Play Inicial (Overlay)
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    if (vslOverlay) {
      vslOverlay.addEventListener('click', (e) => {
        // Se clicar em qualquer lugar do overlay inicial, inicia
        if (e.target !== playBtn && !playBtn.contains(e.target)) {
          togglePlay();
        }
      });
    }

    // Clique no botão de Play/Pause dos controles
    if (ctrlPlayPause) {
      ctrlPlayPause.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    // Clique no corpo do vídeo para pausar/reproduzir
    video.addEventListener('click', () => {
      togglePlay();
    });

    // Barra de Progresso Interativa (Scrubbing / seek)
    let isScrubbing = false;
    const seek = (e) => {
      if (!ctrlProgressBar || !video.duration) return;
      const rect = ctrlProgressBar.getBoundingClientRect();
      const clickPos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = clickPos / rect.width;
      video.currentTime = percentage * video.duration;
      if (ctrlProgressFill) ctrlProgressFill.style.width = `${percentage * 100}%`;
    };

    if (ctrlProgressWrapper) {
      ctrlProgressWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        seek(e);
      });

      ctrlProgressWrapper.addEventListener('mousedown', (e) => {
        isScrubbing = true;
        seek(e);
      });
    }

    window.addEventListener('mousemove', (e) => {
      if (isScrubbing) {
        seek(e);
      }
    });

    window.addEventListener('mouseup', () => {
      isScrubbing = false;
    });

    // Volume e Mute
    const updateVolumeIcon = () => {
      if (!ctrlVolumeIcon) return;
      if (video.muted || video.volume === 0) {
        ctrlVolumeIcon.className = 'fa-solid fa-volume-xmark text-danger';
      } else if (video.volume < 0.5) {
        ctrlVolumeIcon.className = 'fa-solid fa-volume-low';
      } else {
        ctrlVolumeIcon.className = 'fa-solid fa-volume-high';
      }
    };

    if (ctrlMute) {
      ctrlMute.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        if (!video.muted && video.volume === 0) {
          video.volume = 0.8;
          if (ctrlVolume) ctrlVolume.value = 0.8;
        }
        updateVolumeIcon();
      });
    }

    if (ctrlVolume) {
      ctrlVolume.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        video.volume = val;
        video.muted = val === 0;
        updateVolumeIcon();
      });
    }

    // Fullscreen Toggle
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        if (vslPlayerWrapper.requestFullscreen) {
          vslPlayerWrapper.requestFullscreen();
        } else if (vslPlayerWrapper.webkitRequestFullscreen) {
          vslPlayerWrapper.webkitRequestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen(); // iOS Safari
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    if (ctrlFullscreen) {
      ctrlFullscreen.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen();
      });
    }

    document.addEventListener('fullscreenchange', () => {
      if (ctrlFullscreen) {
        const icon = ctrlFullscreen.querySelector('i');
        if (icon) {
          icon.className = document.fullscreenElement ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
        }
      }
    });

    // Auto-hide dos controles após inatividade do mouse
    let controlsTimer = null;
    vslPlayerWrapper.addEventListener('mousemove', () => {
      vslPlayerWrapper.classList.add('show-controls');
      clearTimeout(controlsTimer);
      controlsTimer = setTimeout(() => {
        if (!video.paused && !isScrubbing) {
          vslPlayerWrapper.classList.remove('show-controls');
        }
      }, 2500);
    });

    vslPlayerWrapper.addEventListener('mouseleave', () => {
      if (!video.paused && !isScrubbing) {
        vslPlayerWrapper.classList.remove('show-controls');
      }
    });

    // Atalhos de teclado quando o mouse estiver sobre o player
    let isHoveringPlayer = false;
    vslPlayerWrapper.addEventListener('mouseenter', () => { isHoveringPlayer = true; });
    vslPlayerWrapper.addEventListener('mouseleave', () => { isHoveringPlayer = false; });

    document.addEventListener('keydown', (e) => {
      if (!isHoveringPlayer && document.activeElement !== video) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        video.muted = !video.muted;
        updateVolumeIcon();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        video.currentTime = Math.min(video.currentTime + 5, video.duration);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        video.currentTime = Math.max(video.currentTime - 5, 0);
      }
    });
  }

});
