document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("propertyGrid");
  const locationSearch = document.getElementById("locationSearch");
  const typeFilter = document.getElementById("typeFilter");
  const purposeFilter = document.getElementById("purposeFilter");
  const sortFilter = document.getElementById("sortFilter");
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");
  const modal = document.getElementById("propertyModal");
  const toast = document.getElementById("toast");
  let activeCategory = "all";
  let savedIds = new Set();
  let toastTimer;

  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));

  function formatPrice(price, purpose) {
    const value = Number(price) || 0;
    if (purpose === "rent") return "₹" + value.toLocaleString("en-IN");
    if (value >= 10000000) return "₹" + (value / 10000000).toFixed(2).replace(/\.?0+$/,"") + " Cr";
    if (value >= 100000) return "₹" + (value / 100000).toFixed(2).replace(/\.?0+$/,"") + " Lakh";
    return "₹" + value.toLocaleString("en-IN");
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function getFiltered() {
    const query = locationSearch.value.trim().toLowerCase();
    let list = PROPERTIES.filter(p => {
      const text = `${p.title} ${p.location} ${p.type} ${p.description}`.toLowerCase();
      return (!query || text.includes(query)) &&
        (typeFilter.value === "all" || p.type === typeFilter.value) &&
        (purposeFilter.value === "all" || p.purpose === purposeFilter.value) &&
        (activeCategory === "all" || p.type === activeCategory);
    });
    if (sortFilter.value === "low") list.sort((a,b) => a.price-b.price);
    else if (sortFilter.value === "high") list.sort((a,b) => b.price-a.price);
    return list;
  }

  function render(list = getFiltered()) {
    resultsCount.textContent = `${list.length} ${list.length === 1 ? "property" : "properties"} found`;
    emptyState.classList.toggle("hidden", list.length > 0);
    grid.classList.toggle("hidden", list.length === 0);
    grid.innerHTML = list.map(p => {
      const image = p.images && p.images.length ? p.images[0] : "";
      const isSaved = savedIds.has(p.id);
      const facts = [
        p.beds ? `${p.beds} bed${p.beds === 1 ? "" : "s"}` : "",
        p.baths ? `${p.baths} bath${p.baths === 1 ? "" : "s"}` : "",
        p.area || ""
      ].filter(Boolean);
      return `<article class="property-card">
        <div class="property-photo">
          ${image ? `<img src="${safe(image)}" alt="${safe(p.title)}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('image-placeholder')">` : ""}
          <span class="property-tag">${p.purpose === "rent" ? "FOR RENT" : "FOR SALE"}</span>
          <button class="save-btn ${isSaved ? "saved" : ""}" data-save="${p.id}" aria-label="Save property">${isSaved ? "♥" : "♡"}</button>
        </div>
        <div class="property-content">
          <div class="property-kind">${safe(p.type)} ${p.type === "Land" ? "/ PLOT" : ""}</div>
          <h3 class="property-title">${safe(p.title)}</h3>
          <div class="property-location">⌖ ${safe(p.location)}</div>
          <div class="property-features">${facts.map(f => `<span>${safe(f)}</span>`).join("")}</div>
          <div class="property-bottom"><div class="property-price">${safe(formatPrice(p.price,p.purpose))}<small>${p.purpose === "rent" ? " / month" : ""}</small></div><button class="details-btn" data-details="${p.id}">View details ↗</button></div>
        </div>
      </article>`;
    }).join("");
    document.getElementById("savedCount").textContent = savedIds.size;
  }

  function openDetails(id) {
    const p = PROPERTIES.find(item => Number(item.id) === Number(id));
    if (!p) return;
    document.getElementById("modalTitle").textContent = p.title;
    document.getElementById("modalPurpose").textContent = p.purpose === "rent" ? "FOR RENT" : "FOR SALE";
    document.getElementById("modalLocation").textContent = "⌖ " + p.location;
    document.getElementById("modalPrice").textContent = formatPrice(p.price,p.purpose) + (p.purpose === "rent" ? " / month" : "");
    document.getElementById("modalDescription").textContent = p.description || "";
    document.getElementById("modalDetails").textContent = p.details || p.description || "Contact owner for more details.";
    const facts = [p.type, p.area, p.beds ? `${p.beds} bedroom(s)` : "", p.baths ? `${p.baths} bathroom(s)` : "", ...(p.amenities || [])].filter(Boolean);
    document.getElementById("modalFacts").innerHTML = facts.map(f => `<span>${safe(f)}</span>`).join("");
    const gallery = document.getElementById("modalGallery");
    const image = p.images && p.images.length ? p.images[0] : "";
    gallery.innerHTML = image ? `<img src="${safe(image)}" alt="${safe(p.title)}" onerror="this.style.display='none'">` : "";
    const contact = document.getElementById("contactOwner");
    const phone = String(p.phone || "").replace(/\D/g, "");
    if (phone) {
      contact.href = `https://wa.me/${phone}?text=${encodeURIComponent("Hello, I am interested in " + p.title + " in " + p.location + ".")}`;
      contact.classList.remove("hidden");
    } else {
      contact.href = "#";
      contact.classList.add("hidden");
    }
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeDetails() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  document.getElementById("searchForm").addEventListener("submit", e => {
    e.preventDefault();
    render();
    document.getElementById("properties").scrollIntoView({behavior:"smooth"});
  });
  [locationSearch,typeFilter,purposeFilter,sortFilter].forEach(el => el.addEventListener(el === locationSearch ? "input" : "change", () => {
    if (el === typeFilter) {
      activeCategory = "all";
      document.querySelectorAll(".category-btn").forEach(b => b.classList.toggle("active", b.dataset.category === "all"));
    }
    render();
  }));
  document.getElementById("categoryButtons").addEventListener("click", e => {
    const button = e.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    typeFilter.value = "all";
    document.querySelectorAll(".category-btn").forEach(b => b.classList.toggle("active", b === button));
    render();
  });
  document.getElementById("clearFilters").addEventListener("click", () => {
    locationSearch.value = "";
    typeFilter.value = "all";
    purposeFilter.value = "all";
    sortFilter.value = "featured";
    activeCategory = "all";
    document.querySelectorAll(".category-btn").forEach(b => b.classList.toggle("active", b.dataset.category === "all"));
    render();
  });
  document.getElementById("resetFilters").addEventListener("click", () => document.getElementById("clearFilters").click());
  grid.addEventListener("click", e => {
    const save = e.target.closest("[data-save]");
    if (save) {
      const id = Number(save.dataset.save);
      savedIds.has(id) ? savedIds.delete(id) : savedIds.add(id);
      render();
      showToast(savedIds.has(id) ? "Added to saved properties." : "Removed from saved properties.");
      return;
    }
    const details = e.target.closest("[data-details]");
    if (details) openDetails(details.dataset.details);
  });
  document.getElementById("showSaved").addEventListener("click", () => {
    if (!savedIds.size) { showToast("Tap the ♡ icon on a property to save it."); return; }
    render(PROPERTIES.filter(p => savedIds.has(p.id)));
    document.getElementById("properties").scrollIntoView({behavior:"smooth"});
  });
  document.getElementById("closeModal").addEventListener("click", closeDetails);
  modal.addEventListener("click", e => { if (e.target === modal) closeDetails(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDetails(); });
  document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("navLinks").classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open")));
  document.getElementById("year").textContent = new Date().getFullYear();
  render();
});
