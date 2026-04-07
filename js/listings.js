/* ===== LISTINGS PAGE JS ===== */

const AREAS = [
  'Silver Lakes', 'Moot', 'Queenswood', 'Kilner Park', 'Weavind Park',
  'Capital Park', 'Colbyn', 'Moregloed', 'Waverley', 'Villieria',
  'Rietondale', 'Meyerspark', 'Silverton', 'East Lynne'
];

const PROPERTY_TYPES = ['House', 'Townhouse', 'Apartment', 'Vacant Land', 'Commercial'];

function populateFilters() {
  const areaSelect = document.getElementById('filterArea');
  const typeSelect = document.getElementById('filterType');
  const searchArea = document.getElementById('searchArea');
  const searchType = document.getElementById('searchType');

  if (areaSelect) {
    AREAS.forEach(area => {
      areaSelect.add(new Option(area, area));
    });
  }
  if (searchArea) {
    AREAS.forEach(area => {
      searchArea.add(new Option(area, area));
    });
  }
  if (typeSelect) {
    PROPERTY_TYPES.forEach(type => {
      typeSelect.add(new Option(type, type));
    });
  }
  if (searchType) {
    PROPERTY_TYPES.forEach(type => {
      searchType.add(new Option(type, type));
    });
  }
}

function filterListings(listings) {
  const area = document.getElementById('filterArea')?.value || '';
  const type = document.getElementById('filterType')?.value || '';
  const minPrice = parseInt(document.getElementById('filterMinPrice')?.value) || 0;
  const maxPrice = parseInt(document.getElementById('filterMaxPrice')?.value) || Infinity;
  const beds = parseInt(document.getElementById('filterBeds')?.value) || 0;

  return listings.filter(l => {
    if (area && l.area !== area) return false;
    if (type && l.type !== type) return false;
    if (l.price < minPrice) return false;
    if (maxPrice !== Infinity && l.price > maxPrice) return false;
    if (beds && l.bedrooms < beds) return false;
    return true;
  });
}

function sortListings(listings, sortBy) {
  const sorted = [...listings];
  switch (sortBy) {
    case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'date-desc': return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    case 'date-asc': return sorted.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    default: return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }
}

function renderListings(listings) {
  const grid = document.getElementById('listingsGrid');
  const countEl = document.getElementById('listingsCount');
  if (!grid) return;

  if (listings.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1;">
        <h3>No properties found</h3>
        <p>Try adjusting your search filters or browse all our listings.</p>
      </div>
    `;
  } else {
    grid.innerHTML = listings.map(l => createPropertyCard(l)).join('');
  }

  if (countEl) {
    countEl.textContent = `${listings.length} propert${listings.length === 1 ? 'y' : 'ies'} found`;
  }
}

function applyFiltersAndRender(allListings) {
  const sortBy = document.getElementById('sortBy')?.value || 'date-desc';
  const filtered = filterListings(allListings);
  const sorted = sortListings(filtered, sortBy);
  renderListings(sorted);
}

// Featured listings (home page)
async function initFeaturedListings() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  const listings = await loadListings();
  const featured = listings
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 3);

  if (featured.length === 0) {
    grid.innerHTML = '<p class="text-center" style="grid-column:1/-1;color:var(--gray-500);">No listings available at the moment. Please check back soon.</p>';
    return;
  }

  grid.innerHTML = featured.map(l => createPropertyCard(l)).join('');
}

// Listings page
async function initListingsPage() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  populateFilters();

  const allListings = await loadListings();

  // Check URL params for pre-set filters
  const params = new URLSearchParams(window.location.search);
  if (params.get('area')) {
    const areaSelect = document.getElementById('filterArea');
    if (areaSelect) areaSelect.value = params.get('area');
  }
  if (params.get('type')) {
    const typeSelect = document.getElementById('filterType');
    if (typeSelect) typeSelect.value = params.get('type');
  }

  applyFiltersAndRender(allListings);

  // Attach filter events
  ['filterArea', 'filterType', 'filterMinPrice', 'filterMaxPrice', 'filterBeds', 'sortBy'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => applyFiltersAndRender(allListings));
  });
}

// Listing detail page
async function initListingDetail() {
  const container = document.getElementById('listingDetail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<div class="no-results"><h3>Property not found</h3><p><a href="listings.html">Browse all listings</a></p></div>';
    return;
  }

  const listings = await loadListings();
  const listing = listings.find(l => l.id === id);

  if (!listing) {
    container.innerHTML = '<div class="no-results"><h3>Property not found</h3><p><a href="listings.html">Browse all listings</a></p></div>';
    return;
  }

  // Update page title and SEO meta tags
  document.title = `${listing.title} - ${listing.priceText || formatPrice(listing.price)} | ${listing.area}, Pretoria East | Goldmark Real Estate`;

  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = `${listing.title} - ${listing.priceText || formatPrice(listing.price)}. ${listing.bedrooms} bed, ${listing.bathrooms} bath, ${listing.garages} garage in ${listing.area}, Pretoria East. ${listing.floorSize ? listing.floorSize + 'm² floor. ' : ''}Contact Goldmark Real Estate for viewings.`;

  // Update Open Graph tags
  const ogTitle = document.getElementById('og-title');
  const ogDesc = document.getElementById('og-desc');
  const ogImage = document.getElementById('og-image');
  const ogUrl = document.getElementById('og-url');
  const twTitle = document.getElementById('tw-title');
  const twDesc = document.getElementById('tw-desc');
  if (ogTitle) ogTitle.content = `${listing.title} | ${listing.priceText || formatPrice(listing.price)} | ${listing.area}`;
  if (ogDesc) ogDesc.content = `${listing.bedrooms} bed, ${listing.bathrooms} bath in ${listing.area}, Pretoria East. ${listing.description.substring(0, 150)}...`;
  if (ogImage && listing.images && listing.images[0]) ogImage.content = listing.images[0];
  if (ogUrl) ogUrl.content = window.location.href;
  if (twTitle) twTitle.content = `${listing.title} | ${listing.priceText || formatPrice(listing.price)}`;
  if (twDesc) twDesc.content = `${listing.bedrooms} bed, ${listing.bathrooms} bath in ${listing.area}. Contact Goldmark Real Estate.`;

  // Inject structured data for this property
  const ldJson = document.createElement('script');
  ldJson.type = 'application/ld+json';
  ldJson.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": listing.title,
    "description": listing.description,
    "url": window.location.href,
    "image": listing.images && listing.images.length > 0 ? listing.images[0] : '',
    "datePosted": listing.dateAdded,
    "offers": {
      "@type": "Offer",
      "price": listing.price,
      "priceCurrency": "ZAR",
      "availability": listing.status === 'Sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listing.address,
      "addressLocality": listing.area,
      "addressRegion": "Gauteng",
      "addressCountry": "ZA"
    },
    "numberOfRooms": listing.bedrooms,
    "numberOfBathroomsTotal": listing.bathrooms,
    "floorSize": listing.floorSize ? {"@type": "QuantitativeValue", "value": listing.floorSize, "unitCode": "MTK"} : undefined,
    "broker": {
      "@type": "RealEstateAgent",
      "name": "Goldmark Real Estate",
      "telephone": "+27824445278",
      "url": "https://www.goldmarkrealestate.co.za"
    }
  });
  document.head.appendChild(ldJson);

  // Gallery - 1 large cover + 2 medium side images
  _currentListingImages = listing.images || [];
  const hasImages = _currentListingImages.length > 0;
  const img0 = _currentListingImages[0] || '';
  const img1 = _currentListingImages[1] || '';
  const img2 = _currentListingImages[2] || '';
  const extraCount = Math.max(0, _currentListingImages.length - 3);

  let galleryHtml = '';
  if (hasImages) {
    galleryHtml = `<div class="gallery-hero-grid${_currentListingImages.length === 1 ? ' single' : ''}">
      <div class="gallery-hero-main" onclick="openGalleryViewer(0)">
        <img src="${img0}" alt="${listing.title}">
      </div>
      ${img1 ? `<div class="gallery-hero-side">
        <div class="gallery-hero-thumb" onclick="openGalleryViewer(1)">
          <img src="${img1}" alt="Photo 2">
        </div>
        ${img2 ? `<div class="gallery-hero-thumb" onclick="openGalleryViewer(2)">
          <img src="${img2}" alt="Photo 3">
          ${extraCount > 0 ? `<div class="gallery-more-overlay">+${extraCount} more</div>` : ''}
        </div>` : ''}
      </div>` : ''}
    </div>`;
  } else {
    galleryHtml = `<div class="gallery-hero-grid single">
      <div class="gallery-hero-main">
        <div class="placeholder-img" style="height:100%;font-size:1.2rem;">No images available</div>
      </div>
    </div>`;
  }

  // Remaining thumbnails (shown below for browsing all)
  const thumbsHtml = _currentListingImages.length > 3
    ? _currentListingImages.map((img, i) =>
        `<div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-img-index="${i}" onclick="changeGalleryImageByIndex(${i}, this)">
          <img src="${img}" alt="Photo ${i + 1}">
        </div>`
      ).join('')
    : '';

  // Features
  const featuresHtml = listing.features && listing.features.length > 0
    ? listing.features.map(f => `<div class="feature-item">${f}</div>`).join('')
    : '';

  // WhatsApp link
  const waPhone = listing.agentPhone || '0824445278';
  const waNumber = '27' + waPhone.substring(1);
  const waMessage = encodeURIComponent(`Hi, I'm interested in the property: ${listing.title} (${listing.priceText || formatPrice(listing.price)}) in ${listing.area}`);
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  container.innerHTML = `
    <div class="listing-gallery">
      ${galleryHtml}
      ${thumbsHtml ? `<div class="gallery-thumbs">${thumbsHtml}</div>` : ''}
    </div>

    <div class="listing-detail-grid">
      <div class="listing-info">
        <span class="property-badge ${listing.status === 'For Sale' ? 'for-sale' : 'to-rent'}" style="display:inline-block;margin-bottom:12px;">${listing.status}</span>
        <h1>${listing.title}</h1>
        <div class="listing-location"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${listing.address}</div>
        <div class="listing-price-tag">${listing.priceText || formatPrice(listing.price)}</div>

        <div class="listing-key-features">
          <div class="listing-key-feature"><span class="value">${listing.bedrooms}</span><span class="label">Bedrooms</span></div>
          <div class="listing-key-feature"><span class="value">${listing.bathrooms}</span><span class="label">Bathrooms</span></div>
          <div class="listing-key-feature"><span class="value">${listing.garages}</span><span class="label">Garages</span></div>
          ${listing.floorSize ? `<div class="listing-key-feature"><span class="value">${listing.floorSize}</span><span class="label">Floor m&sup2;</span></div>` : ''}
          ${listing.erfSize ? `<div class="listing-key-feature"><span class="value">${listing.erfSize}</span><span class="label">Erf m&sup2;</span></div>` : ''}
        </div>

        <div class="listing-description">
          <h3>Description</h3>
          <p>${listing.description}</p>
        </div>

        ${featuresHtml ? `
        <div class="listing-features-list">
          <h3>Property Features</h3>
          <div class="features-grid">${featuresHtml}</div>
        </div>
        ` : ''}

        ${listing.property24Link ? `
        <div style="margin-bottom:32px;">
          <a href="${listing.property24Link}" target="_blank" rel="noopener" class="btn btn-outline-dark" style="gap:8px;">
            View on Property24 &rarr;
          </a>
        </div>
        ` : ''}
      </div>

      <div class="listing-sidebar">
        <div class="sidebar-agent-card">
          <h4>${listing.agent}</h4>
          <p class="role">Principal Real Estate Agent</p>
          <div class="agent-actions">
            <a href="tel:${listing.agentPhone}" class="btn btn-secondary btn-sm">${icons.phone} Call Agent</a>
            <a href="${waLink}" target="_blank" class="btn btn-whatsapp btn-sm">${icons.whatsapp} WhatsApp</a>
            <a href="mailto:goldmarkrealestate@mweb.co.za?subject=${encodeURIComponent('Enquiry: ' + listing.title)}" class="btn btn-outline-dark btn-sm">${icons.mail} Email</a>
          </div>
        </div>

        <div class="sidebar-enquiry">
          <h4>Enquire About This Property</h4>
          <form id="enquiryForm">
            <input type="hidden" name="property" value="${listing.title} - ${listing.priceText || formatPrice(listing.price)} - ${listing.area}">
            <div class="form-group">
              <input type="text" name="name" placeholder="Your Name" required>
            </div>
            <div class="form-group">
              <input type="email" name="email" placeholder="Your Email" required>
            </div>
            <div class="form-group">
              <input type="tel" name="phone" placeholder="Your Phone">
            </div>
            <div class="form-group">
              <textarea name="message" placeholder="I'm interested in this property..." rows="4">I would like more information about the following property:

Property: ${listing.title}
Price: ${listing.priceText || formatPrice(listing.price)}
Area: ${listing.area}
Address: ${listing.address}
Type: ${listing.type}
Bedrooms: ${listing.bedrooms} | Bathrooms: ${listing.bathrooms} | Garages: ${listing.garages}${listing.floorSize ? '\nFloor Size: ' + listing.floorSize + 'm²' : ''}${listing.erfSize ? '\nErf Size: ' + listing.erfSize + 'm²' : ''}

Please contact me regarding this property.</textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Send Enquiry</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Re-init enquiry form
  initEnquiryForm();
}

// Store current listing images for gallery navigation
let _currentListingImages = [];

// Gallery image change by index (handles base64 data URLs safely)
function changeGalleryImageByIndex(index, thumbEl) {
  const main = document.getElementById('galleryMain');
  if (main && _currentListingImages[index]) {
    main.innerHTML = `<img src="${_currentListingImages[index]}" alt="Property photo">`;
  }
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

// Full-screen gallery viewer
let _galleryViewerIndex = 0;

function openGalleryViewer(index) {
  if (!_currentListingImages.length) return;
  _galleryViewerIndex = index;

  // Remove existing viewer if any
  const existing = document.getElementById('galleryViewer');
  if (existing) existing.remove();

  const viewer = document.createElement('div');
  viewer.id = 'galleryViewer';
  viewer.className = 'gallery-viewer-overlay';
  viewer.innerHTML = `
    <button class="gv-close" onclick="closeGalleryViewer()" aria-label="Close">&times;</button>
    <button class="gv-prev" onclick="galleryViewerNav(-1)" aria-label="Previous">&#8249;</button>
    <div class="gv-image-wrap">
      <img id="gvImage" src="${_currentListingImages[index]}" alt="Photo ${index + 1}">
    </div>
    <button class="gv-next" onclick="galleryViewerNav(1)" aria-label="Next">&#8250;</button>
    <div class="gv-counter">${index + 1} / ${_currentListingImages.length}</div>
  `;
  document.body.appendChild(viewer);
  document.body.style.overflow = 'hidden';

  // Close on backdrop click
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) closeGalleryViewer();
  });

  // Keyboard navigation
  document.addEventListener('keydown', galleryViewerKeyHandler);
}

function closeGalleryViewer() {
  const viewer = document.getElementById('galleryViewer');
  if (viewer) viewer.remove();
  document.body.style.overflow = '';
  document.removeEventListener('keydown', galleryViewerKeyHandler);
}

function galleryViewerNav(dir) {
  _galleryViewerIndex += dir;
  if (_galleryViewerIndex < 0) _galleryViewerIndex = _currentListingImages.length - 1;
  if (_galleryViewerIndex >= _currentListingImages.length) _galleryViewerIndex = 0;

  const img = document.getElementById('gvImage');
  const counter = document.querySelector('.gv-counter');
  if (img) img.src = _currentListingImages[_galleryViewerIndex];
  if (counter) counter.textContent = `${_galleryViewerIndex + 1} / ${_currentListingImages.length}`;
}

function galleryViewerKeyHandler(e) {
  if (e.key === 'Escape') closeGalleryViewer();
  if (e.key === 'ArrowLeft') galleryViewerNav(-1);
  if (e.key === 'ArrowRight') galleryViewerNav(1);
}

// Search bar (home page)
function initSearchBar() {
  const searchBtn = document.getElementById('searchBtn');
  if (!searchBtn) return;

  searchBtn.addEventListener('click', () => {
    const area = document.getElementById('searchArea')?.value || '';
    const type = document.getElementById('searchType')?.value || '';
    const params = new URLSearchParams();
    if (area) params.set('area', area);
    if (type) params.set('type', type);
    window.location.href = `listings.html${params.toString() ? '?' + params.toString() : ''}`;
  });
}

// Init based on page
document.addEventListener('DOMContentLoaded', () => {
  populateFilters();
  initFeaturedListings();
  initListingsPage();
  initListingDetail();
  initSearchBar();
});
