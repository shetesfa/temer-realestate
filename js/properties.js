/**
 * TEMER Real Estate — Property Listings & Filter Engine
 * Dynamic filtering, live search, and prefilled WhatsApp inquiry generator
 */

(function () {
  let allProperties = typeof TEMER_PROPERTIES !== 'undefined' ? TEMER_PROPERTIES : [];
  let filteredProperties = [...allProperties];

  window.initPropertyListings = function (options = {}) {
    const isFeaturedOnly = options.featuredOnly || false;
    const limit = options.limit || 0;
    const container = document.getElementById(options.containerId || 'properties-grid-container');

    if (!container) return;

    // Filter controls
    const searchInput = document.getElementById('filter-search');
    const typeSelect = document.getElementById('filter-type');
    const locationSelect = document.getElementById('filter-location');
    const bedroomsSelect = document.getElementById('filter-bedrooms');
    const sortSelect = document.getElementById('filter-sort');
    const clearBtn = document.getElementById('filter-clear');

    function applyFilters() {
      const query = (searchInput?.value || '').toLowerCase().trim();
      const type = typeSelect?.value || 'all';
      const loc = locationSelect?.value || 'all';
      const beds = bedroomsSelect?.value || 'all';
      const sort = sortSelect?.value || 'default';

      filteredProperties = allProperties.filter(prop => {
        // Query match
        const matchesQuery = !query || 
          prop.title.toLowerCase().includes(query) ||
          prop.location.toLowerCase().includes(query) ||
          prop.subcity.toLowerCase().includes(query);

        // Type match
        const matchesType = (type === 'all') || (prop.propertyType === type);

        // Location match
        const matchesLoc = (loc === 'all') || (prop.location.toLowerCase() === loc.toLowerCase());

        // Bedrooms match
        let matchesBeds = true;
        if (beds !== 'all') {
          if (beds === '4+') {
            matchesBeds = prop.bedrooms >= 4;
          } else {
            matchesBeds = prop.bedrooms === parseInt(beds, 10);
          }
        }

        return matchesQuery && matchesType && matchesLoc && matchesBeds;
      });

      // Sorting
      if (sort === 'price-asc') {
        filteredProperties.sort((a, b) => parseInt(a.price.replace(/\D/g, ''), 10) - parseInt(b.price.replace(/\D/g, ''), 10));
      } else if (sort === 'price-desc') {
        filteredProperties.sort((a, b) => parseInt(b.price.replace(/\D/g, ''), 10) - parseInt(a.price.replace(/\D/g, ''), 10));
      } else if (sort === 'area-desc') {
        filteredProperties.sort((a, b) => b.area - a.area);
      }

      render();
    }

    function render() {
      let list = isFeaturedOnly ? allProperties.slice(0, limit || 3) : filteredProperties;
      if (limit > 0 && !isFeaturedOnly) {
        list = list.slice(0, limit);
      }

      const resultsCountEl = document.getElementById('results-count');
      if (resultsCountEl) {
        resultsCountEl.textContent = `${list.length} propert${list.length === 1 ? 'y' : 'ies'} found`;
      }

      if (list.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-medium);">
            <div style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 14px;">🏙️</div>
            <h3 style="margin-bottom: 8px;">No matching properties found</h3>
            <p style="margin-bottom: 24px; color: var(--text-secondary);">Try adjusting your search criteria or contact our Addis Ababa sales team directly.</p>
            <button class="btn btn-outline-gold btn-sm" id="btn-reset-filters">Reset All Filters</button>
          </div>
        `;
        document.getElementById('btn-reset-filters')?.addEventListener('click', resetFilters);
        return;
      }

      // Check current page nesting depth for correct relative paths
      const isSubPage = window.location.pathname.includes('/pages/');
      const basePath = isSubPage ? '' : 'pages/';
      const imgPrefix = isSubPage ? '' : '';

      container.innerHTML = list.map(prop => {
        // WhatsApp prefilled message
        const waMsg = encodeURIComponent(
          `Hello TEMER Real Estate,\n\nI am interested in:\n${prop.title} (${prop.location})\nPrice: ${prop.price} (${prop.priceUsd})\nArea: ${prop.area} m²\n\nPlease send me availability and floor details.`
        );
        const waUrl = `https://wa.me/${prop.contact.whatsappNumber}?text=${waMsg}`;
        const detailUrl = `${basePath}property-details.html?id=${prop.id}`;

        // Format image path properly
        let imgSrc = prop.image;
        if (!isSubPage && imgSrc.startsWith('../')) {
          imgSrc = imgSrc.replace('../', '');
        }

        return `
          <article class="property-card">
            <div class="card-media">
              <img src="${imgSrc}" alt="${prop.title}" class="card-img" loading="lazy" onerror="this.src='${isSubPage ? '../' : ''}assets/images/photo_2026-10-09_10-14-17.jpg'">
              <span class="card-badge-status">${prop.status}</span>
              <span class="card-badge-verified">
                <i class="fa-solid fa-circle-check"></i> TEMER Verified
              </span>
              <div class="card-price-overlay">
                <div>
                  <div class="price-main">${prop.price}</div>
                  <div class="price-usd">${prop.priceUsd} Guide</div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="card-location">
                <i class="fa-solid fa-location-dot"></i> ${prop.location}, Addis Ababa
              </div>
              <h3 class="card-title">
                <a href="${detailUrl}">${prop.title}</a>
              </h3>
              <p class="card-description">${prop.description}</p>
              
              <div class="card-specs">
                <div class="spec-item" title="Bedrooms">
                  <i class="fa-solid fa-bed"></i> ${prop.bedrooms} Beds
                </div>
                <div class="spec-item" title="Bathrooms">
                  <i class="fa-solid fa-bath"></i> ${prop.bathrooms} Baths
                </div>
                <div class="spec-item" title="Total Floor Area">
                  <i class="fa-solid fa-ruler-combined"></i> ${prop.area} m²
                </div>
              </div>

              <div class="card-actions">
                <a href="${detailUrl}" class="btn btn-secondary btn-sm">
                  View Details
                </a>
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" title="Chat directly with TEMER sales on WhatsApp">
                  <i class="fa-brands fa-whatsapp"></i> Inquire
                </a>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    function resetFilters() {
      if (searchInput) searchInput.value = '';
      if (typeSelect) typeSelect.value = 'all';
      if (locationSelect) locationSelect.value = 'all';
      if (bedroomsSelect) bedroomsSelect.value = 'all';
      if (sortSelect) sortSelect.value = 'default';
      applyFilters();
    }

    // Attach listeners
    searchInput?.addEventListener('input', applyFilters);
    typeSelect?.addEventListener('change', applyFilters);
    locationSelect?.addEventListener('change', applyFilters);
    bedroomsSelect?.addEventListener('change', applyFilters);
    sortSelect?.addEventListener('change', applyFilters);
    clearBtn?.addEventListener('click', resetFilters);

    // Initial render
    render();
  };
})();
