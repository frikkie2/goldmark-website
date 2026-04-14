/* ===== ADMIN PANEL JS - FIREBASE VERSION ===== */

const MAX_IMAGE_WIDTH = 1400;
const MAX_GALLERY_IMAGES = 100;
const JPEG_QUALITY = 0.75;

// Property24-aligned feature categories
const FEATURE_CATEGORIES = {
  'Security': [
    'Alarm System', 'Electric Fencing', 'Security Gates', 'Armed Response',
    'CCTV', 'Intercom', 'Walled', 'Gated Community', '24hr Security'
  ],
  'Exterior': [
    'Swimming Pool', 'Garden', 'Built-in Braai', 'Lapa', 'Covered Patio',
    'Balcony', 'Deck', 'Outdoor Shower', 'Borehole', 'Water Tank',
    'Solar Panels', 'Solar Geyser', 'Irrigation System', 'Boundary Wall'
  ],
  'Parking': [
    'Single Garage', 'Double Garage', 'Triple Garage', 'Carport',
    'Covered Parking', 'Off-Street Parking', 'Automated Garage Door'
  ],
  'Interior': [
    'Air Conditioning', 'Fireplace', 'Study', 'TV Room', 'Playroom',
    'Open-plan Kitchen', 'Granite Countertops', 'Built-in Cupboards',
    'Walk-in Closet', 'En-suite Bathroom', 'Guest Toilet',
    'Laundry Room', 'Pantry', 'Bar', 'Ceiling Fan'
  ],
  'Additional': [
    'Staff Quarters', 'Flatlet', 'Granny Flat', 'Home Office',
    'Separate Entrance', 'Pet Friendly', 'Wheelchair Friendly',
    'Fibre Internet', 'Prepaid Electricity', 'Backup Power / Generator'
  ],
  'Nearby': [
    'Close to Schools', 'Close to Shops', 'Close to Transport',
    'Close to Highway', 'Close to Hospital', 'Close to Parks'
  ]
};

let adminListings = [];
let currentCoverImage = null;   // base64 string
let currentGalleryImages = [];  // [{name, data}] sorted by name

// ===== FIREBASE AUTH =====

function adminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  const errorEl = document.getElementById('loginError');
  const btn = e.target.querySelector('button[type="submit"]');

  errorEl.style.display = 'none';
  btn.textContent = 'Signing in...';
  btn.disabled = true;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      // onAuthStateChanged will handle UI
    })
    .catch(err => {
      errorEl.textContent = err.code === 'auth/invalid-credential'
        ? 'Incorrect email or password.'
        : err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please wait a moment.'
        : 'Login failed: ' + err.message;
      errorEl.style.display = 'block';
      btn.textContent = 'Login';
      btn.disabled = false;
    });
}

function adminLogout() {
  firebase.auth().signOut();
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').classList.add('active');
    document.getElementById('logoutBtn').style.display = 'inline-flex';
    loadAdminListings();
  } else {
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminPanel').classList.remove('active');
    document.getElementById('logoutBtn').style.display = 'none';
  }
});

// ===== LOAD LISTINGS FROM FIRESTORE =====

async function loadAdminListings() {
  try {
    const snapshot = await db.collection('listings').orderBy('dateAdded', 'desc').get();
    adminListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderAdminTable();
  } catch (e) {
    console.error('Error loading listings:', e);
    adminListings = [];
    renderAdminTable();
  }
}

// ===== SAVE LISTING TO FIRESTORE =====

async function saveListingToFirestore(listing) {
  const id = listing.id;
  const data = { ...listing };
  delete data.id; // Firestore uses doc ID separately

  try {
    await db.collection('listings').doc(id).set(data);
    return true;
  } catch (e) {
    console.error('Error saving listing:', e);
    if (e.message && e.message.includes('exceeds the maximum')) {
      alert('Error: Listing data is too large. Try reducing the number or size of images. Tip: Use fewer gallery images or lower resolution photos.');
    } else {
      alert('Error saving listing: ' + e.message);
    }
    return false;
  }
}

// ===== RENDER TABLE =====

function renderAdminTable() {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  const total = adminListings.length;
  const active = adminListings.filter(l => l.active).length;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statActive').textContent = active;
  document.getElementById('statInactive').textContent = total - active;

  if (total === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--gray-500);">No listings yet. Click "+ Add Listing" to create one.</td></tr>';
    return;
  }

  tbody.innerHTML = adminListings.map(l => `
    <tr>
      <td><strong>${escapeHtml(l.title)}</strong>${l.property24Link ? ' <a href="' + escapeHtml(l.property24Link) + '" target="_blank" style="font-size:0.7rem;color:var(--blue);">P24</a>' : ''}</td>
      <td>${l.priceText || formatAdminPrice(l.price)}</td>
      <td>${escapeHtml(l.area)}</td>
      <td>${escapeHtml(l.type)}</td>
      <td>${l.bedrooms}</td>
      <td><span class="property-badge ${l.status === 'For Sale' ? 'for-sale' : l.status === 'To Rent' ? 'to-rent' : 'sold'}" style="display:inline-block;font-size:0.7rem;position:static;">${l.status}</span></td>
      <td>${l.active ? '<span style="color:#25D366;">Yes</span>' : '<span style="color:var(--red);">No</span>'}</td>
      <td class="actions">
        <button class="btn-edit" onclick="editListing('${l.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteListing('${l.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function formatAdminPrice(price) {
  return 'R ' + Number(price).toLocaleString('en-ZA');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function generateId() {
  return 'gm-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

// ===== FEATURES CHECKBOXES =====
function renderFeatureCheckboxes() {
  const container = document.getElementById('featuresCheckboxes');
  if (!container) return;

  let html = '';
  for (const [category, features] of Object.entries(FEATURE_CATEGORIES)) {
    html += `<div class="feature-category-title">${category}</div>`;
    features.forEach(feature => {
      const id = 'feat_' + feature.replace(/[^a-zA-Z0-9]/g, '_');
      html += `<label><input type="checkbox" name="features" value="${escapeHtml(feature)}" id="${id}"> ${escapeHtml(feature)}</label>`;
    });
  }
  container.innerHTML = html;
}

function getSelectedFeatures() {
  const checked = Array.from(document.querySelectorAll('#featuresCheckboxes input[type="checkbox"]:checked'))
    .map(cb => cb.value);
  const extra = (document.getElementById('fieldFeaturesExtra')?.value || '')
    .split(',').map(f => f.trim()).filter(f => f);
  return [...checked, ...extra];
}

function setSelectedFeatures(features) {
  document.querySelectorAll('#featuresCheckboxes input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  document.getElementById('fieldFeaturesExtra').value = '';

  const knownFeatures = new Set();
  Object.values(FEATURE_CATEGORIES).forEach(arr => arr.forEach(f => knownFeatures.add(f)));

  const extras = [];
  (features || []).forEach(f => {
    if (knownFeatures.has(f)) {
      const id = 'feat_' + f.replace(/[^a-zA-Z0-9]/g, '_');
      const cb = document.getElementById(id);
      if (cb) cb.checked = true;
    } else {
      extras.push(f);
    }
  });

  if (extras.length > 0) {
    document.getElementById('fieldFeaturesExtra').value = extras.join(', ');
  }
}

// ===== IMAGE HANDLING =====

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;

        if (w > MAX_IMAGE_WIDTH) {
          h = Math.round(h * MAX_IMAGE_WIDTH / w);
          w = MAX_IMAGE_WIDTH;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- Drag & Drop handlers ---
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove('dragover');
}

document.addEventListener('DOMContentLoaded', () => {
  const coverZone = document.getElementById('coverDropZone');
  const galleryZone = document.getElementById('galleryDropZone');

  if (coverZone) {
    coverZone.addEventListener('click', () => {
      document.getElementById('coverFileInput').click();
    });
  }
  if (galleryZone) {
    galleryZone.addEventListener('click', () => {
      document.getElementById('galleryFileInput').click();
    });
  }
});

// --- Cover Photo ---
async function handleCoverDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove('dragover');

  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
  if (files.length === 0) return;

  await setCoverImage(files[0]);
}

async function handleCoverSelect(e) {
  const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
  if (files.length === 0) return;
  await setCoverImage(files[0]);
}

async function setCoverImage(file) {
  const preview = document.getElementById('coverPreview');
  preview.innerHTML = '<p style="font-size:0.85rem;color:var(--gray-500);">Compressing image...</p>';

  try {
    currentCoverImage = await compressImage(file);
    renderCoverPreview();
  } catch (err) {
    preview.innerHTML = '<p style="color:var(--red);font-size:0.85rem;">Error processing image.</p>';
  }
}

function renderCoverPreview() {
  const preview = document.getElementById('coverPreview');
  if (!currentCoverImage) {
    preview.innerHTML = '';
    return;
  }

  preview.innerHTML = `
    <div class="preview-item">
      <img src="${currentCoverImage}" alt="Cover photo">
      <button class="preview-remove" onclick="event.stopPropagation();removeCoverImage()" title="Remove">&times;</button>
    </div>
  `;
}

function removeCoverImage() {
  currentCoverImage = null;
  renderCoverPreview();
}

// --- Gallery Photos ---
async function handleGalleryDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove('dragover');

  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
  if (files.length === 0) return;

  await addGalleryImages(files);
}

async function handleGallerySelect(e) {
  const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
  if (files.length === 0) return;
  await addGalleryImages(files);
  e.target.value = '';
}

async function addGalleryImages(files) {
  const countEl = document.getElementById('galleryCount');
  const remaining = MAX_GALLERY_IMAGES - currentGalleryImages.length;

  if (remaining <= 0) {
    alert(`Maximum ${MAX_GALLERY_IMAGES} gallery images reached.`);
    return;
  }

  const toProcess = files.slice(0, remaining);
  if (files.length > remaining) {
    alert(`Only adding ${remaining} images (${MAX_GALLERY_IMAGES} max). ${files.length - remaining} skipped.`);
  }

  countEl.textContent = `Processing ${toProcess.length} image(s)...`;

  for (let i = 0; i < toProcess.length; i++) {
    try {
      const data = await compressImage(toProcess[i]);
      currentGalleryImages.push({
        name: toProcess[i].name,
        data: data
      });
      countEl.textContent = `Processed ${i + 1} of ${toProcess.length}...`;
    } catch (err) {
      console.warn('Failed to process:', toProcess[i].name, err);
    }
  }

  currentGalleryImages.sort((a, b) => a.name.localeCompare(b.name));
  renderGalleryPreview();
}

function renderGalleryPreview() {
  const preview = document.getElementById('galleryPreview');
  const countEl = document.getElementById('galleryCount');

  countEl.textContent = currentGalleryImages.length > 0
    ? `${currentGalleryImages.length} gallery image(s) - sorted by filename`
    : '';

  if (currentGalleryImages.length === 0) {
    preview.innerHTML = '';
    return;
  }

  preview.innerHTML = currentGalleryImages.map((img, i) => `
    <div class="preview-item">
      <img src="${img.data}" alt="${escapeHtml(img.name)}">
      <span class="preview-name">${escapeHtml(img.name)}</span>
      <button class="preview-remove" onclick="event.stopPropagation();removeGalleryImage(${i})" title="Remove">&times;</button>
    </div>
  `).join('');
}

function removeGalleryImage(index) {
  currentGalleryImages.splice(index, 1);
  renderGalleryPreview();
}

// ===== MODAL =====

function clearPhotoState() {
  currentCoverImage = null;
  currentGalleryImages = [];
  const coverPreview = document.getElementById('coverPreview');
  const galleryPreview = document.getElementById('galleryPreview');
  const galleryCount = document.getElementById('galleryCount');
  if (coverPreview) coverPreview.innerHTML = '';
  if (galleryPreview) galleryPreview.innerHTML = '';
  if (galleryCount) galleryCount.textContent = '';
}

function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Add New Listing';
  document.getElementById('editId').value = '';
  document.getElementById('listingForm').reset();
  document.getElementById('fieldActive').checked = true;
  document.getElementById('fieldBedrooms').value = 3;
  document.getElementById('fieldBathrooms').value = 2;
  document.getElementById('fieldGarages').value = 1;
  document.getElementById('fieldP24Link').value = '';
  renderFeatureCheckboxes();
  setSelectedFeatures([]);
  clearPhotoState();
  document.getElementById('listingModal').classList.add('active');
}

function closeModal() {
  document.getElementById('listingModal').classList.remove('active');
}

function editListing(id) {
  const listing = adminListings.find(l => l.id === id);
  if (!listing) return;

  document.getElementById('modalTitle').textContent = 'Edit Listing';
  document.getElementById('editId').value = id;
  document.getElementById('fieldTitle').value = listing.title || '';
  document.getElementById('fieldStatus').value = listing.status || 'For Sale';
  document.getElementById('fieldPrice').value = listing.price || '';
  document.getElementById('fieldType').value = listing.type || 'House';
  document.getElementById('fieldArea').value = listing.area || '';
  document.getElementById('fieldAddress').value = listing.address || '';
  document.getElementById('fieldBedrooms').value = listing.bedrooms || 0;
  document.getElementById('fieldBathrooms').value = listing.bathrooms || 0;
  document.getElementById('fieldGarages').value = listing.garages || 0;
  document.getElementById('fieldFloorSize').value = listing.floorSize || '';
  document.getElementById('fieldErfSize').value = listing.erfSize || '';
  document.getElementById('fieldAgent').value = listing.agent || 'Johan van Niekerk';
  document.getElementById('fieldDescription').value = listing.description || '';
  renderFeatureCheckboxes();
  setSelectedFeatures(listing.features || []);
  document.getElementById('fieldP24Ref').value = listing.property24Ref || '';
  document.getElementById('fieldP24Link').value = listing.property24Link || '';
  document.getElementById('fieldActive').checked = listing.active !== false;

  // Restore photos
  clearPhotoState();

  if (listing.coverImage) {
    currentCoverImage = listing.coverImage;
    renderCoverPreview();
  } else if (listing.images && listing.images.length > 0) {
    currentCoverImage = listing.images[0];
    renderCoverPreview();
  }

  if (listing.galleryImages && listing.galleryImages.length > 0) {
    currentGalleryImages = listing.galleryImages.map(img => ({
      name: img.name || 'photo.jpg',
      data: img.data || img
    }));
    renderGalleryPreview();
  } else if (listing.images && listing.images.length > 1) {
    currentGalleryImages = listing.images.slice(1).map((url, i) => ({
      name: `photo_${String(i + 1).padStart(3, '0')}.jpg`,
      data: url
    }));
    renderGalleryPreview();
  }

  document.getElementById('listingModal').classList.add('active');
}

// ===== SAVE =====

async function saveListing(e) {
  e.preventDefault();

  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const editId = document.getElementById('editId').value;
  const price = parseInt(document.getElementById('fieldPrice').value) || 0;
  const agentName = document.getElementById('fieldAgent').value;
  const agentPhone = agentName === 'Johan van Niekerk' ? '0824445278' : '0824878587';

  // Build images array: cover first, then gallery
  const allImages = [];
  if (currentCoverImage) allImages.push(currentCoverImage);
  currentGalleryImages.forEach(img => allImages.push(img.data));

  const listing = {
    id: editId || generateId(),
    title: document.getElementById('fieldTitle').value.trim(),
    price: price,
    priceText: formatAdminPrice(price),
    type: document.getElementById('fieldType').value,
    status: document.getElementById('fieldStatus').value,
    bedrooms: parseInt(document.getElementById('fieldBedrooms').value) || 0,
    bathrooms: parseInt(document.getElementById('fieldBathrooms').value) || 0,
    garages: parseInt(document.getElementById('fieldGarages').value) || 0,
    erfSize: parseInt(document.getElementById('fieldErfSize').value) || 0,
    floorSize: parseInt(document.getElementById('fieldFloorSize').value) || 0,
    area: document.getElementById('fieldArea').value,
    address: document.getElementById('fieldAddress').value.trim() || document.getElementById('fieldArea').value + ', Pretoria',
    description: document.getElementById('fieldDescription').value.trim(),
    features: getSelectedFeatures(),
    images: allImages,
    coverImage: currentCoverImage || null,
    galleryImages: currentGalleryImages.map(img => ({ name: img.name, data: img.data })),
    agent: agentName,
    agentPhone: agentPhone,
    dateAdded: editId ? (adminListings.find(l => l.id === editId)?.dateAdded || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
    property24Ref: document.getElementById('fieldP24Ref').value.trim(),
    property24Link: document.getElementById('fieldP24Link').value.trim(),
    active: document.getElementById('fieldActive').checked
  };

  const success = await saveListingToFirestore(listing);

  btn.textContent = 'Save Listing';
  btn.disabled = false;

  if (success) {
    await loadAdminListings();
    closeModal();
  }
}

// ===== DELETE =====

async function deleteListing(id) {
  const listing = adminListings.find(l => l.id === id);
  if (!listing) return;
  if (!confirm(`Are you sure you want to delete "${listing.title}"?`)) return;

  try {
    await db.collection('listings').doc(id).delete();
    await loadAdminListings();
  } catch (e) {
    alert('Error deleting listing: ' + e.message);
  }
}

// ===== EXPORT / IMPORT =====

function exportJSON() {
  const json = JSON.stringify(adminListings, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'listings.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (!Array.isArray(imported)) {
        alert('Invalid format: JSON file must contain an array of listings.');
        return;
      }
      if (!confirm(`This will import ${imported.length} listings to Firestore. Existing listings with the same ID will be overwritten. Continue?`)) return;

      let count = 0;
      for (const listing of imported) {
        const id = listing.id || generateId();
        const data = { ...listing };
        delete data.id;
        try {
          await db.collection('listings').doc(id).set(data);
          count++;
        } catch (err) {
          console.warn('Failed to import listing:', id, err);
        }
      }

      await loadAdminListings();
      alert(`Successfully imported ${count} of ${imported.length} listings.`);
    } catch (err) {
      alert('Error reading JSON file: ' + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// --- Close modal on overlay click ---
document.getElementById('listingModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// --- Close modal on Escape ---
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});
