/**
 * TEMER Real Estate — Video Gallery & Project Stories
 * Built with authentic project footage from Addis Ababa developments
 * Reference: https://temerpropertiessales.com
 */

(function () {
  const TEMER_VIDEOS = [
    {
      id: "vid-ayat-tour",
      title: "Ayat Feres Bet Site — Tour & Structural Progress",
      category: "Construction",
      videoSrc: "assets/videos/IMG_9627.MP4",
      fallbackSrc: "assets/videos/IMG_9627.MP4",
      poster: "assets/images/IMG_9490.JPG",
      duration: "1:45",
      project: "Ayat Feres Bet Site",
      description: "Comprehensive on-site video inspection showcasing active construction, column casting, and modern elevation design in Ayat, Addis Ababa."
    },
    {
      id: "vid-garment-walkthrough",
      title: "Garment Site 1 & 2 — Comprehensive Site Walkthrough",
      category: "Projects",
      videoSrc: "assets/videos/IMG_9648.MP4",
      fallbackSrc: "assets/videos/IMG_9648.MP4",
      poster: "assets/images/IMG_9492.JPG",
      duration: "3:10",
      project: "Garment Developments",
      description: "In-depth video tour detailing the site surroundings, foundational works, access corridors, and neighborhood expansion."
    },
    {
      id: "vid-interior-finishes",
      title: "Interior Finishes & Architectural Craftsmanship",
      category: "Buildings",
      videoSrc: "assets/videos/IMG_8589.MP4",
      fallbackSrc: "assets/videos/IMG_8589.MP4",
      poster: "assets/images/hero-2.jpg",
      duration: "0:52",
      project: "TEMER Interior Standards",
      description: "Direct look into interior spaces, natural lighting, polished tile installation, and premium kitchen and bathroom finishing."
    },
    {
      id: "vid-hero-building",
      title: "TEMER Premier Tower — Exterior Facade & Architecture",
      category: "Buildings",
      videoSrc: "assets/videos/IMG_9335.MP4",
      fallbackSrc: "assets/videos/IMG_9335.MP4",
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
      title: "Sarbet Site Skyline Vistas & Structural Overview",
      category: "Projects",
      videoSrc: "assets/videos/IMG_9374.mp4",
      fallbackSrc: "assets/videos/IMG_9374.MOV",
      poster: "assets/images/posters/poster_video2.jpg",
      duration: "0:42",
      project: "TEMER Sarbet Site",
      description: "Panoramic overview highlighting the strategic high-elevation vistas and prime positioning near the African Union in Addis Ababa."
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
    },
    {
      id: "vid-foundation-milestone",
      title: "Foundation & Engineering Milestone Inspection",
      category: "Construction",
      videoSrc: "assets/videos/IMG_7377.MOV",
      fallbackSrc: "assets/videos/IMG_7377.MOV",
      poster: "assets/images/hero-1.jpg",
      duration: "1:20",
      project: "Ayat / Sumale Tera Works",
      description: "Rigorous quality inspection of subterranean steel reinforcement and seismic foundation engineering."
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
              <img src="${posterPath}" alt="${v.title}" class="video-thumb-img" loading="lazy" onerror="this.src='${isSubPage ? '../assets/images/hero-1.jpg' : 'assets/images/hero-1.jpg'}'">
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

      // Attach click events
      container.querySelectorAll('.video-thumbnail-box').forEach(box => {
        box.addEventListener('click', () => {
          const videoId = box.getAttribute('data-video-id');
          const videoData = TEMER_VIDEOS.find(v => v.id === videoId);
          if (videoData) {
            openVideoModal(videoData, isSubPage);
          }
        });
      });
    }

    function openVideoModal(videoData, isSub) {
      let modal = document.getElementById('global-video-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'global-video-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
          <div class="modal-container">
            <button class="modal-close-btn" id="modal-close-btn" aria-label="Close video player">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="modal-video-wrapper">
              <video id="modal-video-element" class="modal-video" controls playsinline autoplay>
                <source id="modal-video-source" src="" type="video/mp4">
                Your browser does not support HTML5 video playback.
              </video>
            </div>
            <div class="modal-info">
              <div class="video-card-category" id="modal-video-cat"></div>
              <h4 id="modal-video-title" style="margin-top:4px;"></h4>
              <p id="modal-video-desc"></p>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#modal-close-btn').addEventListener('click', closeVideoModal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeVideoModal();
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeVideoModal();
          }
        });
      }

      const videoElement = modal.querySelector('#modal-video-element');
      const videoSource = modal.querySelector('#modal-video-source');
      const vSrc = isSub ? `../${videoData.videoSrc}` : videoData.videoSrc;

      videoSource.src = vSrc;
      videoElement.load();
      videoElement.play().catch(() => {});

      modal.querySelector('#modal-video-cat').textContent = `${videoData.category} · ${videoData.project}`;
      modal.querySelector('#modal-video-title').textContent = videoData.title;
      modal.querySelector('#modal-video-desc').textContent = videoData.description;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
      const modal = document.getElementById('global-video-modal');
      if (modal) {
        const videoElement = modal.querySelector('#modal-video-element');
        if (videoElement) videoElement.pause();
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    renderFilters();
    renderVideos();
  };

  // Auto initialize if container exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.initVideoGallery());
  } else {
    window.initVideoGallery();
  }
})();
