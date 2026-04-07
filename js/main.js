/* ===== GOLDMARK REAL ESTATE - MAIN JS ===== */

// --- SVG Icons ---
const icons = {
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v11"/><path d="M21 7v11"/><path d="M3 18h18"/><path d="M3 11h18"/><path d="M3 7h18v4H3z"/><path d="M6 7V4h4v3"/></svg>',
  bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/><path d="M6 12V5a2 2 0 0 1 2-2h3v2.25"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><path d="M3 17h18v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  size: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
};

// --- Listings Data ---
let listingsData = [];

async function loadListings() {
  // Check localStorage first (syncs with admin panel edits)
  const stored = localStorage.getItem('goldmark_listings');
  if (stored) {
    try {
      listingsData = JSON.parse(stored);
      return listingsData.filter(l => l.active);
    } catch (e) { /* fall through to JSON file */ }
  }

  // Fall back to static JSON file
  try {
    const response = await fetch('data/listings.json');
    if (!response.ok) throw new Error('Failed to load');
    listingsData = await response.json();
    return listingsData.filter(l => l.active);
  } catch (e) {
    console.warn('Could not load listings:', e);
    return [];
  }
}

// --- Format Price ---
function formatPrice(price) {
  return 'R ' + price.toLocaleString('en-ZA');
}

// --- Create Property Card HTML ---
function createPropertyCard(listing) {
  const badgeClass = listing.status === 'For Sale' ? 'for-sale' :
                     listing.status === 'To Rent' ? 'to-rent' : 'sold';

  const imageHtml = listing.images && listing.images.length > 0
    ? `<img src="${listing.images[0]}" alt="${listing.title} - ${listing.type} for sale in ${listing.area}, Pretoria East" loading="lazy">`
    : `<div class="placeholder-img">${icons.home} No Image</div>`;

  return `
    <a href="listing.html?id=${listing.id}" class="property-card">
      <div class="property-card-image">
        ${imageHtml}
        <span class="property-badge ${badgeClass}">${listing.status}</span>
      </div>
      <div class="property-card-body">
        <div class="property-price">${listing.priceText || formatPrice(listing.price)}</div>
        <h3 class="property-title">${listing.title}</h3>
        <div class="property-address">${icons.mapPin} ${listing.address}</div>
        <div class="property-features">
          <div class="property-feature">${icons.bed} ${listing.bedrooms} Bed${listing.bedrooms !== 1 ? 's' : ''}</div>
          <div class="property-feature">${icons.bath} ${listing.bathrooms} Bath${listing.bathrooms !== 1 ? 's' : ''}</div>
          <div class="property-feature">${icons.car} ${listing.garages} Garage${listing.garages !== 1 ? 's' : ''}</div>
          ${listing.floorSize ? `<div class="property-feature">${icons.size} ${listing.floorSize}m&sup2;</div>` : ''}
        </div>
      </div>
    </a>
  `;
}

// --- Navigation ---
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// --- Contact Form (mailto fallback) ---
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const message = form.querySelector('[name="message"]').value;
    const subjectField = form.querySelector('[name="subject"]');
    const subjectText = subjectField ? subjectField.value : 'Website Enquiry';

    const subject = encodeURIComponent(`${subjectText} from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    );

    // Send email to Johan
    window.location.href = `mailto:goldmarkrealestate@mweb.co.za?subject=${subject}&body=${body}`;

    // Also open WhatsApp to Johan
    const waMessage = encodeURIComponent(`Website Enquiry from ${name}\nPhone: ${phone}\nEmail: ${email}\n\n${message}`);
    setTimeout(() => {
      window.open(`https://wa.me/27824445278?text=${waMessage}`, '_blank');
    }, 1000);

    // Show confirmation
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Opening email & WhatsApp...';
    setTimeout(() => { btn.textContent = original; }, 3000);
  });
}

// --- Enquiry Form (listing page) ---
function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const message = form.querySelector('[name="message"]').value;
    const property = form.querySelector('[name="property"]')?.value || '';

    const subject = encodeURIComponent(`Property Enquiry: ${property}`);
    const body = encodeURIComponent(
      `Property: ${property}\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    );

    // Send to Johan's email
    window.location.href = `mailto:goldmarkrealestate@mweb.co.za?subject=${subject}&body=${body}`;

    // Also send to Johan's WhatsApp
    const waMessage = encodeURIComponent(`Property Enquiry: ${property}\nFrom: ${name}\nPhone: ${phone}\nEmail: ${email}\n\n${message}`);
    setTimeout(() => {
      window.open(`https://wa.me/27824445278?text=${waMessage}`, '_blank');
    }, 1000);
  });
}

// --- WhatsApp Chat Widget ---
function initWhatsAppWidget() {
  // Don't show on admin page
  if (window.location.pathname.includes('admin')) return;

  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  const widget = document.createElement('div');
  widget.className = 'wa-chat-widget';
  widget.innerHTML = `
    <div class="wa-chat-popup" id="waChatPopup">
      <div class="wa-chat-header">
        <div class="wa-chat-avatar">
          <img src="johan-profile.jpg" alt="Johan" onerror="this.parentElement.innerHTML='JN'">
        </div>
        <div class="wa-chat-header-info">
          <h4>Johan van Niekerk</h4>
          <p>Goldmark Real Estate</p>
        </div>
        <button class="wa-chat-close" onclick="toggleWaChat()" aria-label="Close">&times;</button>
      </div>
      <div class="wa-chat-body">
        <div class="wa-chat-bubble">
          Hi there! 👋 Welcome to Goldmark Real Estate. How can I help you today? Whether you're looking to buy, sell, or just need advice — I'm here to help!
          <span class="time">${timeStr}</span>
        </div>
      </div>
      <div class="wa-chat-footer">
        <div class="wa-chat-input-row">
          <input type="text" class="wa-chat-input" id="waChatInput" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendWaChat()">
          <button class="wa-chat-send" onclick="sendWaChat()" aria-label="Send">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
    <button class="wa-chat-btn" onclick="toggleWaChat()" aria-label="Chat with us on WhatsApp">
      <span class="badge-dot"></span>
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
    </button>
  `;
  document.body.appendChild(widget);
}

function toggleWaChat() {
  const popup = document.getElementById('waChatPopup');
  if (popup) {
    popup.classList.toggle('open');
    if (popup.classList.contains('open')) {
      // Hide the badge dot once opened
      const dot = document.querySelector('.wa-chat-btn .badge-dot');
      if (dot) dot.style.display = 'none';
      // Focus input
      setTimeout(() => document.getElementById('waChatInput')?.focus(), 300);
    }
  }
}

function sendWaChat() {
  const input = document.getElementById('waChatInput');
  const message = input?.value?.trim();
  if (!message) return;

  // Open WhatsApp with the typed message
  const waUrl = `https://wa.me/27824445278?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');

  // Clear input
  input.value = '';
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initContactForm();
  initEnquiryForm();
  initWhatsAppWidget();
});
