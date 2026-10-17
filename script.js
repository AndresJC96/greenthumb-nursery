// GreenThumb Nursery - Touchstone 4
// Favorites and the selected filter are saved in this browser only.
const products = [
  { id: "houseplants", name: "Indoor Houseplants", category: "houseplants" },
  { id: "seeds", name: "Organic Vegetable Seeds", category: "seeds" }
];
const storageKeys = { favorites: "greenthumbFavorites", filter: "greenthumbFilter" };

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.favorites) || "[]");
    return Array.isArray(saved) ? saved.filter(id => products.some(p => p.id === id)) : [];
  } catch (error) { return []; }
}
function saveFavorites(favorites) {
  localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
}
function updateFavorites() {
  const favorites = readFavorites();
  document.querySelectorAll(".favorite-button").forEach(button => {
    const selected = favorites.includes(button.dataset.product);
    button.setAttribute("aria-pressed", String(selected));
    button.textContent = selected ? "Remove from favorites" : "Save to favorites";
  });
  const names = products.filter(p => favorites.includes(p.id)).map(p => p.name);
  document.getElementById("favorite-summary").textContent = names.length
    ? "Saved favorites: " + names.join(", ")
    : "No favorites saved yet.";
}
function toggleFavorite(id) {
  const favorites = readFavorites();
  saveFavorites(favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]);
  updateFavorites();
}
function updateFilter(category) {
  const valid = ["all", ...products.map(p => p.category)];
  const chosen = valid.includes(category) ? category : "all";
  document.getElementById("category-filter").value = chosen;
  let count = 0;
  document.querySelectorAll(".product-card").forEach(card => {
    const visible = chosen === "all" || card.dataset.category === chosen;
    card.hidden = !visible;
    if (visible) count++;
  });
  document.getElementById("filter-result").textContent = `Showing ${count} product ${count === 1 ? "category" : "categories"}.`;
  localStorage.setItem(storageKeys.filter, chosen);
}
function initProducts() {
  const filter = document.getElementById("category-filter");
  if (!filter) return;
  document.querySelectorAll(".favorite-button").forEach(button => {
    button.addEventListener("click", () => toggleFavorite(button.dataset.product));
  });
  filter.addEventListener("change", () => updateFilter(filter.value));
  updateFavorites();
  updateFilter(localStorage.getItem(storageKeys.filter) || "all");
}

const formRules = {
  fullname: value => value.trim() ? "" : "Please enter your full name.",
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address.",
  phone: value => !value.trim() || /^\d{3}-\d{3}-\d{4}$/.test(value.trim()) ? "" : "Use the format 123-456-7890.",
  topic: value => value ? "" : "Please choose an inquiry type.",
  message: value => value.trim().length >= 10 ? "" : "Please write at least 10 characters."
};
function validateField(field) {
  const message = formRules[field.id](field.value);
  document.getElementById(field.id + "-error").textContent = message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
  return !message;
}
function initContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const fields = Object.keys(formRules).map(id => document.getElementById(id));
  fields.forEach(field => {
    field.addEventListener("input", () => { if (field.hasAttribute("aria-invalid")) validateField(field); });
    field.addEventListener("change", () => { if (field.hasAttribute("aria-invalid")) validateField(field); });
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const valid = fields.map(validateField).every(Boolean);
    document.getElementById("form-status").textContent = valid
      ? "Your form looks good! This is a class project, so no message was actually sent."
      : "Please correct the highlighted fields before continuing.";
    if (!valid) fields.find(field => field.hasAttribute("aria-invalid")).focus();
  });
}
document.addEventListener("DOMContentLoaded", () => { initProducts(); initContact(); });
