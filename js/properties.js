/**
 * TEMER Real Estate — Property Listings & Filter Engine
 * High-performance search, multi-token brand index, URL query support, and WhatsApp lead generator
 * Brand: TEMER Real Estate / TEMER Properties | Addis Ababa, Ethiopia
 * Contact: +251 941 246 658 | Telegram: @Nati2378 | WhatsApp: +251 941 246 658
 */

(function () {
  let allProperties = typeof TEMER_PROPERTIES !== 'undefined' ? TEMER_PROPERTIES : [];
  let filteredProperties = [...allProperties];

  /**
   * Build comprehensive searchable token string for each property
   * Includes English, Amharic, brand keywords, room counts, locations, and specs
   */
  function buildSearchIndex(prop) {
    const amharicTerms = [];
    const loc = (prop.location || '').toLowerCase();
    const sub = (prop.subcity || '').toLowerCase();
    const type = (prop.propertyType || '').toLowerCase();

    if (loc.includes('ayat') || sub.includes('ayat')) amharicTerms.push('አያት ፈረስ ቤት አያት ፈረስቤት');
    if (loc.includes('bole') || sub.includes('bole')) amharicTerms.push('ቦሌ አትላስ ቦሌ');
    if (loc.includes('sarbet') || sub.includes('sarbet')) amharicTerms.push('ሳርቤት ሳር ቤት ሳር');
    if (loc.includes('garment') || sub.includes('garment')) amharicTerms.push('ጋርመንት ገርመንት');
    if (loc.includes('sumale') || sub.includes('sumale') || (prop.title || '').toLowerCase().includes('sumale')) {
      amharicTerms.push('ሱማሌ ተራ ሱማሌ');
    }
    if (type.includes('apartment')) amharicTerms.push('አፓርታማ ኮንዶሚኒየም ቤት');
    if (type.includes('penthouse') || type.includes('villa')) amharicTerms.push('ፔንትሃውስ ፔንት ሃውስ ቪላ');
    if (type.includes('commercial')) amharicTerms.push('ንግድ ሱቅ የንግድ');

    const bedTokens = [];
    if (prop.bedrooms) {
      bedTokens.push(
        `${prop.bedrooms} bed`,
        `${prop.bedrooms} beds`,
        `${prop.bedrooms} bedroom`,
        `${prop.bedrooms} bedrooms`,
        `${prop.bedrooms}br`,
        `${prop.bedrooms} ክፍል`
      );
    }

    const bathTokens = [];
    if (prop.bathrooms) {
      bathTokens.push(
        `${prop.bathrooms} bath`,
        `${prop.bathrooms} baths`,
        `${prop.bathrooms} bathroom`,
        `${prop.bathrooms} bathrooms`
      );
    }

    const areaTokens = [];
    if (prop.area) {
      areaTokens.push(
        `${prop.area} m2`,
        `${prop.area} sqm`,
        `${prop.area} sq m`,
        `${prop.area} ካሬ`,
        `${prop.area} ካሬ ሜትር`,
        `${prop.area} square meters`
      );
    }

    return [
      'temer',
      'temer real estate',
      'temer properties',
      'temer property sales',
      'temer sales',
      'ቴመር',
      'ቴመር ሪል እስቴት',
      'ቴመር ፕሮፐርቲስ',
      prop.id || '',
      prop.title || '',
      prop.location || '',
      prop.subcity || '',
      prop.city || 'Addis Ababa',
      prop.propertyType || '',
      prop.status || '',
      prop.badge || '',
      prop.verifiedProject || '',
      prop.completionStatus || '',
      prop.description || '',
      ...(prop.features || []),
      ...(prop.paymentPlans || []),
      ...amharicTerms,
      ...bedTokens,
      ...bathTokens,
      ...areaTokens,
      'nati',
      '@nati2378',
      '0941246658',
      '+251941246658',
      'direct developer sales'
    ].join(' ').toLowerCase();
  }

  // Pre-calculate search index for quick filtering
  const propertyIndices = new WeakMap();
  function getIndex(prop) {
    if (!propertyIndices.has(prop)) {
      propertyIndices.set(prop, buildSearchIndex(prop));
    }
    return propertyIndices.get(prop);
  }

  /**
   * Evaluates if a property matches a freeform user query
   */
  function propertyMatchesQuery(prop, query) {
    if (!query) return true;
    const q = query.toLowerCase().trim();
    if (!q) return true;

    // Direct brand match: All properties in portfolio are TEMER properties!
    const brandQueries = [
      'temer',
      'temer real estate',
      'temer properties',
      'temer property',
      'temer sales',
      'temerpropertiessales',
      'ቴመር',
      'ቴመር ሪል እስቴት',
      'ቴመር ፕሮፐርቲስ',
      'real estate',
      'realestate'
    ];
    if (brandQueries.includes(q)) {
      return true;
    }

    const index = getIndex(prop);
    const tokens = q.split(/\s+/).filter(Boolean);

    // Multi-token AND search (e.g. "temer ayat" -> both "temer" and "ayat" must match)
    return tokens.every(token => index.includes(token));
  }

  /**
   * Filter properties by criteria
   */
  function filterPropertyList(list, criteria = {}) {
    const {
      query = '',
      type = 'all',
      location = 'all',
      bedrooms = 'all',
      sort = 'default'
    } = criteria;

    let results = list.filter(prop => {
      // Freeform query match
      if (!propertyMatchesQuery(prop, query)) {
        return false;
      }

      // Property Type match
      if (type && type !== 'all') {
        const pType = (prop.propertyType || '').toLowerCase();
        const targetType = type.toLowerCase();
        if (targetType === 'penthouse') {
          if (!pType.includes('penthouse') && !pType.includes('villa')) return false;
        } else if (!pType.includes(targetType)) {
          return false;
        }
      }

      // Location match
      if (location && location !== 'all') {
        const pLoc = (prop.location || '').toLowerCase();
        const pSub = (prop.subcity || '').toLowerCase();
        const targetLoc = location.toLowerCase();
        if (!pLoc.includes(targetLoc) && !pSub.includes(targetLoc)) {
          return false;
        }
      }

      // Bedrooms match
      if (bedrooms && bedrooms !== 'all') {
        if (bedrooms === '4+' || bedrooms === '4') {
          if (prop.bedrooms < 4) return false;
        } else {
          if (prop.bedrooms !== parseInt(bedrooms, 10)) return false;
        }
      }

      return true;
    });

    // Sorting
    if (sort === 'price-asc') {
      results.sort((a, b) => parseInt((a.price || '0').replace(/\D/g, ''), 10) - parseInt((b.price || '0').replace(/\D/g, ''), 10));
    } else if (sort === 'price-desc') {
      results.sort((a, b) => parseInt((b.price || '0').replace(/\D/g, ''), 10) - parseInt((a.price || '0').replace(/\D/g, ''), 10));
    } else if (sort === 'area-desc') {
      results.sort((a, b) => (b.area || 0) - (a.area || 0));
    }

    return results;
  }

  /**
   * Get search suggestions / autocomplete items
   */
  function getSuggestions(query, maxCount = 6) {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();

    const matches = allProperties.filter(p => propertyMatchesQuery(p, q));
    return matches.slice(0, maxCount).map(p => ({
      id: p.id,
      title: p.title,
      location: p.location,
      price: p.price,
      bedrooms: p.bedrooms,
      area: p.area,
      image: p.image,
      type: p.propertyType
    }));
  }

  /**
   * Export global TEMER_SEARCH API
   */
  window.TEMER_SEARCH = {
    getAllProperties: () => allProperties,
    search: (criteria) => filterPropertyList(allProperties, criteria),
    getSuggestions: getSuggestions,
    matches: propertyMatchesQuery
  };

  /**
   * Main Property Listings Initializer
   */
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

    // Parse URL Query Params on load if available
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('search') || urlParams.get('q') || '';
    const initialLoc = urlParams.get('location') || urlParams.get('loc') || '';
    const initialType = urlParams.get('type') || '';
    const initialBeds = urlParams.get('bedrooms') || urlParams.get('beds') || '';

    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }
    if (locationSelect && initialLoc && initialLoc !== 'all') {
      // Find matching option
      for (let i = 0; i < locationSelect.options.length; i++) {
        if (locationSelect.options[i].value.toLowerCase() === initialLoc.toLowerCase()) {
          locationSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (typeSelect && initialType && initialType !== 'all') {
      for (let i = 0; i < typeSelect.options.length; i++) {
        if (typeSelect.options[i].value.toLowerCase() === initialType.toLowerCase()) {
          typeSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (bedroomsSelect && initialBeds && initialBeds !== 'all') {
      for (let i = 0; i < bedroomsSelect.options.length; i++) {
        if (bedroomsSelect.options[i].value === initialBeds) {
          bedroomsSelect.selectedIndex = i;
          break;
        }
      }
    }

    function applyFilters() {
      const query = (searchInput?.value || '').trim();
      const type = typeSelect?.value || 'all';
      const loc = locationSelect?.value || 'all';
      const beds = bedroomsSelect?.value || 'all';
      const sort = sortSelect?.value || 'default';

      filteredProperties = filterPropertyList(allProperties, {
        query,
        type,
        location: loc,
        bedrooms: beds,
        sort
      });

      render();
    }

    function render() {
      let list = isFeaturedOnly ? allProperties.slice(0, limit || 3) : filteredProperties;
      if (limit > 0 && !isFeaturedOnly) {
        list = list.slice(0, limit);
      }

      const resultsCountEl = document.getElementById('results-count');
      if (resultsCountEl) {
        const queryVal = (searchInput?.value || '').trim();
        let countText = `${list.length} verified propert${list.length === 1 ? 'y' : 'ies'} found`;
        if (queryVal) {
          countText += ` for "${queryVal}"`;
        }
        resultsCountEl.textContent = countText;
      }

      if (list.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--card, #ffffff); border-radius: var(--radius-lg, 16px); border: 1px dashed var(--border, #e2e8f0); box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            <div style="font-size: 2.8rem; color: var(--primary, #3a7d44); margin-bottom: 14px;">🏙️</div>
            <h3 style="margin-bottom: 8px; font-size:1.4rem; color:var(--foreground, #1e293b);">No matching properties found</h3>
            <p style="margin-bottom: 24px; color: var(--text-muted, #64748b); max-width: 520px; margin-left:auto; margin-right:auto;">
              We couldn't find a property matching your exact filters. Try adjusting keywords (e.g. "Ayat", "Bole", "3 bed") or speak with our sales manager directly on Telegram or Phone.
            </p>
            <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm" id="btn-reset-filters">
                <i class="fa-solid fa-rotate-left"></i> Reset All Filters
              </button>
              <a href="https://t.me/Nati2378" target="_blank" rel="noopener noreferrer" class="btn btn-telegram btn-sm">
                <i class="fa-brands fa-telegram"></i> Telegram @Nati2378
              </a>
              <a href="tel:+251941246658" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-phone"></i> Call 0941246658
              </a>
            </div>
          </div>
        `;
        document.getElementById('btn-reset-filters')?.addEventListener('click', resetFilters);
        return;
      }

      // Check current page nesting depth for correct relative paths
      const isSubPage = window.location.pathname.includes('/pages/');
      const basePath = isSubPage ? '' : 'pages/';

      container.innerHTML = list.map(prop => {
        // WhatsApp prefilled message
        const waMsg = encodeURIComponent(
          `Hello TEMER Real Estate,\n\nI am interested in:\n${prop.title} (${prop.location})\nPrice: ${prop.price} (${prop.priceUsd})\nArea: ${prop.area} m²\n\nPlease send me availability, payment schedule, and site inspection details.`
        );
        const waUrl = `https://wa.me/${prop.contact.whatsappNumber || '251941246658'}?text=${waMsg}`;
        const detailUrl = `${basePath}property-details.html?id=${prop.id}`;

        // Format image path properly
        let imgSrc = prop.image;
        if (!isSubPage && imgSrc.startsWith('../')) {
          imgSrc = imgSrc.replace('../', '');
        }

        return `
          <article class="property-card" data-id="${prop.id}">
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
                <a href="${detailUrl}" class="btn btn-outline btn-sm">
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

    // Initial render with potential URL parameters applied
    applyFilters();
  };
})();
