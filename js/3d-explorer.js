/**
 * TEMER Real Estate — Authentic Video Property Tour & Explorer
 * High-definition on-site architectural tour replacing procedural 3D samples
 */

(function () {
  const tourPerspectives = {
    tower: {
      id: "tower",
      title: "TEMER Premier Tower — Facade & Architecture",
      badge: "Verified Delivery",
      video: "../assets/videos/IMG_9335.MP4",
      poster: "../assets/images/photo_2026-10-09_10-14-17.jpg",
      badgeText: "Exterior Facade & Balconies",
      level: "Ground to 17th Floor",
      beds: "2, 3 Bed & Penthouses",
      size: "108 – 285 m²",
      orientation: "Panoramic Addis Skyline",
      status: "Available / Ready",
      desc: "Direct architectural perspective showing the finished exterior facade, private panoramic balconies, high-speed elevator shafts, and distinctive green TEMER crown in Bole, Addis Ababa."
    },
    penthouse: {
      id: "penthouse",
      title: "Skyline Penthouses & High-Floor Vistas",
      badge: "Flagship Luxury",
      video: "../assets/videos/IMG_9374.mp4",
      fallbackVideo: "../assets/videos/IMG_9374.MOV",
      poster: "../assets/images/posters/poster_video2.jpg",
      badgeText: "Penthouse Rooftop Views",
      level: "Top Floors (16 & 17)",
      beds: "4 Bedrooms + Maid / 3 Beds",
      size: "230 – 285 m²",
      orientation: "360° Unhindered Horizon",
      status: "Available for Tour",
      desc: "Sweeping panoramic vistas from top penthouse elevations. Features double-height glass framing, expansive sky terraces, and premier capital views."
    },
    upper: {
      id: "upper",
      title: "Precision Engineering & Quality Finishes",
      badge: "Engineering Excellence",
      video: "../assets/videos/IMG_9306.mp4",
      fallbackVideo: "../assets/videos/IMG_9306.MOV",
      poster: "../assets/images/posters/poster_video1.jpg",
      badgeText: "Structural Integrity & Craft",
      level: "All Floors & Residences",
      beds: "2 & 3 Bedroom Units",
      size: "115 – 175 m²",
      orientation: "Optimized Daylight Angles",
      status: "Verified On-Site",
      desc: "Documented on-site craftsmanship capturing structural column reinforcement, double-glazed acoustic window installation, and premium European tile fitting."
    },
    street: {
      id: "street",
      title: "Urban Corridor & Surrounding Infrastructure",
      badge: "Prime Connectivity",
      video: "../assets/videos/IMG_9414.mp4",
      fallbackVideo: "../assets/videos/IMG_9414.MOV",
      poster: "../assets/images/posters/poster_video3.jpg",
      badgeText: "Access Roads & Boulevard",
      level: "Ground Level & Street Frontage",
      beds: "Residential & Commercial",
      size: "120 – 180 m²",
      orientation: "Main Boulevard Access",
      status: "Accessible",
      desc: "Explore surrounding asphalt boulevard connectivity, proximity to international hubs, secure perimeter gates, and convenient neighborhood amenities."
    }
  };

  let activeKey = 'tower';

  window.initPropertyTour = function () {
    const videoEl = document.getElementById('explorer-main-video');
    const playBtn = document.getElementById('hud-btn-play');
    const soundBtn = document.getElementById('hud-btn-sound');
    const fullBtn = document.getElementById('hud-btn-fullscreen');
    const progressBar = document.getElementById('hud-progress-bar');
    const progressFill = document.getElementById('hud-progress-fill');
    const timeDisplay = document.getElementById('hud-time-display');
    const badgeText = document.getElementById('video-tour-badge-text');
    const perspectiveBtns = document.querySelectorAll('.floor-btn');

    // Sidebar elements
    const sidebar = document.querySelector('.explorer-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle-btn');
    const unitBadge = document.getElementById('sidebar-unit-badge');
    const unitTitle = document.getElementById('sidebar-unit-title');
    const unitDesc = document.getElementById('sidebar-unit-desc');
    const unitSpecs = document.getElementById('sidebar-unit-specs');
    const whatsappBtn = document.getElementById('sidebar-unit-whatsapp');

    function updateDetails(key) {
      const data = tourPerspectives[key];
      if (!data) return;

      if (badgeText) badgeText.textContent = data.badgeText;
      if (unitBadge) unitBadge.textContent = data.badge;
      if (unitTitle) unitTitle.textContent = data.title;
      if (unitDesc) unitDesc.textContent = data.desc;

      if (unitSpecs) {
        unitSpecs.innerHTML = `
          <div class="unit-spec-row">
            <span class="unit-spec-label">Perspective / Level</span>
            <span class="unit-spec-val">${data.level}</span>
          </div>
          <div class="unit-spec-row">
            <span class="unit-spec-label">Unit Layouts</span>
            <span class="unit-spec-val">${data.beds}</span>
          </div>
          <div class="unit-spec-row">
            <span class="unit-spec-label">Floor Area Range</span>
            <span class="unit-spec-val">${data.size}</span>
          </div>
          <div class="unit-spec-row">
            <span class="unit-spec-label">Orientation & Light</span>
            <span class="unit-spec-val" style="color:var(--gold-primary); font-weight:600;">${data.orientation}</span>
          </div>
          <div class="unit-spec-row">
            <span class="unit-spec-label">Documentation</span>
            <span class="unit-spec-val" style="color:#2ea069;"><i class="fa-solid fa-circle-check"></i> ${data.status}</span>
          </div>
        `;
      }

      if (whatsappBtn) {
        const msg = encodeURIComponent(
          `Hello TEMER Real Estate,\n\nI am watching your Virtual Property Tour (${data.title}).\nPerspective: ${data.level}\nSize Range: ${data.size}\n\nPlease send me detailed floor plans, unit brochures, and arrange a private site visit.`
        );
        whatsappBtn.href = `https://wa.me/251941246658?text=${msg}`;
      }
    }

    function switchVideo(key) {
      if (!tourPerspectives[key] || !videoEl) return;
      activeKey = key;

      // Update button active state
      perspectiveBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-perspective') === key);
      });

      // Smooth switch
      videoEl.style.opacity = '0.3';
      setTimeout(() => {
        videoEl.src = tourPerspectives[key].video;
        videoEl.load();
        videoEl.play().catch(() => {});
        videoEl.style.opacity = '1';
      }, 200);

      updateDetails(key);
    }

    // Perspective Click Events
    perspectiveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-perspective');
        if (key && key !== activeKey) {
          switchVideo(key);
        }
      });
    });

    // Play / Pause Toggle
    if (playBtn && videoEl) {
      playBtn.addEventListener('click', () => {
        if (videoEl.paused) {
          videoEl.play();
          playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
          videoEl.pause();
          playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
      });

      videoEl.addEventListener('play', () => {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      });

      videoEl.addEventListener('pause', () => {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      });
    }

    // Audio Mute Toggle
    if (soundBtn && videoEl) {
      soundBtn.addEventListener('click', () => {
        videoEl.muted = !videoEl.muted;
        if (videoEl.muted) {
          soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
          soundBtn.title = "Unmute Audio";
        } else {
          soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
          soundBtn.title = "Mute Audio";
        }
      });
    }

    // Fullscreen Toggle
    if (fullBtn) {
      fullBtn.addEventListener('click', () => {
        const stage = document.querySelector('.explorer-canvas-area');
        if (!document.fullscreenElement) {
          if (stage.requestFullscreen) {
            stage.requestFullscreen();
          } else if (stage.webkitRequestFullscreen) {
            stage.webkitRequestFullscreen();
          }
          fullBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          fullBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
      });
    }

    // Timeline Progress Tracking
    if (videoEl && progressFill && timeDisplay) {
      videoEl.addEventListener('timeupdate', () => {
        if (videoEl.duration) {
          const percent = (videoEl.currentTime / videoEl.duration) * 100;
          progressFill.style.width = `${percent}%`;

          const curMins = Math.floor(videoEl.currentTime / 60);
          const curSecs = Math.floor(videoEl.currentTime % 60);
          const durMins = Math.floor(videoEl.duration / 60);
          const durSecs = Math.floor(videoEl.duration % 60);

          timeDisplay.textContent = `${curMins}:${curSecs < 10 ? '0' : ''}${curSecs} / ${durMins}:${durSecs < 10 ? '0' : ''}${durSecs}`;
        }
      });
    }

    // Seek on progress bar click
    if (progressBar && videoEl) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (videoEl.duration) {
          videoEl.currentTime = pos * videoEl.duration;
        }
      });
    }

    // Mobile Sidebar Drawer Toggle
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Initial populate
    updateDetails('tower');
  };

  // Backward compatibility alias
  window.init3DExplorer = window.initPropertyTour;
})();
