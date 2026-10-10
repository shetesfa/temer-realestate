/**
 * TEMER Real Estate — Video Gallery & Project Stories
 * Built with authentic project footage from Addis Ababa developments
 */

(function () {
  const TEMER_VIDEOS = [
    {
      id: "vid-hero-building",
      title: "TEMER Premier Tower — Exterior Facade & Architecture",
      category: "Buildings",
      videoSrc: "assets/videos/IMG_9335.MP4",
      poster: "assets/images/photo_2026-10-09_10-14-17.jpg",
      duration: "0:16",
      project: "TEMER Premier Tower (Bole)",
      description: "Direct architectural perspective showing the finished exterior facade, balconies, and distinctive green TEMER crown in Bole, Addis Ababa."
    },
    {
      id: "vid-site-tour",
      title: "Active Construction & Finishing Milestone",
      category: "Construction",
      videoSrc: "assets/videos/IMG_9306.mp4",
      fallbackSrc: "assets/videos/IMG_9306.MOV",
      poster: "assets/images/posters/poster_video1.jpg",
      duration: "1:03",
      project: "TEMER Kazanchis Heights",
      description: "On-site footage documenting the precision engineering, structural reinforcement, and quality finishing applied across TEMER developments."
    },
    {
      id: "vid-penthouse-views",
      title: "Skyline Vistas & Structural Overview",
      category: "Projects",
      videoSrc: "assets/videos/IMG_9374.mp4",
      fallbackSrc: "assets/videos/IMG_9374.MOV",
      poster: "assets/images/posters/poster_video2.jpg",
      duration: "0:42",
      project: "TEMER Sarbet Development",
      description: "Panoramic overview highlighting the strategic high-elevation vistas and prime positioning of TEMER properties in Addis Ababa."
    },
    {
      id: "vid-street-access",
      title: "Urban Connectivity & Surrounding Boulevards",
      category: "Site Visits",
      videoSrc: "assets/videos/IMG_9414.mp4",
      fallbackSrc: "assets/videos/IMG_9414.MOV",
      poster: "assets/images/posters/poster_video3.jpg",
      duration: "0:25",
      project: "TEMER CMC Corridor",
      description: "Walkthrough of surrounding street connectivity, access boulevards, and community infrastructure."
    }
  ];

  window.initVideoGallery = function (options = {}) {
    const container = document.getElementById(options.containerId || 'video-grid-container');
    const filterContainer = document.getElementById(options.filterContainerId || 'video-filter-container');
    if (!container) return;

    let activeCategory = 'All';

    // Check nesting depth
    const isSubPage = window.location.pathname.includes('/pages/');

    function renderFilters() {
      if (!filterContainer) return;
      const categories = ['All', 'Projects', 'Buildings', 'Construction', 'Site Visits'];

      filterContainer.innerHTML = categories.map(cat => `
        <button class="gallery-filter-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">
          ${cat}
        </button>
      `).join('');

      filterContainer.querySelectorAll('.gallery-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.getAttribute('data-cat');
          renderFilters();
          renderVideos();
        });
      });
    }

    function renderVideos() {
      const filtered = activeCategory === 'All'
        ? TEMER_VIDEOS
        : TEMER_VIDEOS.filter(v => v.category.toLowerCase() === activeCategory.toLowerCase());

      container.innerHTML = filtered.map(v => {
        const posterPath = isSubPage ? `../${v.poster}` : v.poster;
        return `
          <div class="video-card">
            <div class="video-thumbnail-box" data-video-id="${v.id}">
              <img src="${posterPath}" alt="${v.title}" class="video-thumb-img" loading="lazy">
              <div class="video-play-btn" aria-label="Play ${v.title}">
                <i class="fa-solid fa-play"></i>
              </div>
              <span class="video-duration">${v.duration}</span>
            </div>
            <div class="video-card-body">
              <div class="video-card-category">${v.category} · ${v.project}</div>
              <h4 class="video-card-title">${v.title}</h4>
              <p class="video-card-desc">${v.description}</p>
            </div>
          </div>
        `;
      }).join('');

      // Add click listeners to thumbnail boxes
      container.querySelectorAll('.video-thumbnail-box').forEach(box => {
        box.addEventListener('click', () => {
          const vidId = box.getAttribute('data-video-id');
          const videoObj = TEMER_VIDEOS.find(x => x.id === vidId);
          if (videoObj) openVideoModal(videoObj);
        });
      });
    }

    function openVideoModal(video) {
      let modal = document.getElementById('video-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'video-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
          <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-vid-title">
            <button class="modal-close-btn" id="modal-vid-close" aria-label="Close video player">&times;</button>
            <div class="modal-video-wrapper">
              <video id="modal-video-player" class="modal-video" controls playsinline>
                Your browser does not support HTML5 video.
              </video>
            </div>
            <div class="modal-info">
              <div class="badge-tag" style="margin-bottom:6px;" id="modal-vid-cat"></div>
              <h4 id="modal-vid-title"></h4>
              <p id="modal-vid-desc"></p>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        // Close handlers
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeVideoModal();
        });
        document.getElementById('modal-vid-close')?.addEventListener('click', closeVideoModal);

        // Keyboard accessibility (ESC to close, Space to play/pause)
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeVideoModal();
          }
        });
      }

      const player = document.getElementById('modal-video-player');
      const title = document.getElementById('modal-vid-title');
      const cat = document.getElementById('modal-vid-cat');
      const desc = document.getElementById('modal-vid-desc');

      const vidSrc = isSubPage ? `../${video.videoSrc}` : video.videoSrc;
      const posterSrc = isSubPage ? `../${video.poster}` : video.poster;

      player.src = vidSrc;
      player.poster = posterSrc;
      title.textContent = video.title;
      cat.textContent = `${video.category} · ${video.project}`;
      desc.textContent = video.description;

      modal.classList.add('open');
      player.play().catch(err => console.log('Autoplay prevented by browser:', err));
    }

    function closeVideoModal() {
      const modal = document.getElementById('video-modal');
      const player = document.getElementById('modal-video-player');
      if (modal) {
        modal.classList.remove('open');
      }
      if (player) {
        player.pause();
        player.src = '';
      }
    }

    renderFilters();
    renderVideos();
  };
})();
