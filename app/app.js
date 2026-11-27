// The deal finder app: hash routing, live search, category/store/discount filters,
// sorting, and the deal list page. All filtering happens in the browser over the
// deal data in deals.js - nothing is fetched over the network.

import { deals } from './deals.js';
import { renderCard, renderDetail, renderMissing, percentOff } from './deal.js';

const app = document.getElementById('app');

// Filter and sort option lists are derived from the deal data itself.
const categories = [...new Set(deals.map((d) => d.category))].sort();
const stores = [...new Set(deals.map((d) => d.store))].sort();

const discountFilters = [
  { label: 'Any discount', value: '' },
  { label: '50% off or more', value: '50' },
  { label: '25% off or more', value: '25' },
  { label: '10% off or more', value: '10' },
];

const sorts = [
  { label: 'Biggest discount first', value: 'discount' },
  { label: 'Lowest price first', value: 'price-asc' },
  { label: 'Highest price first', value: 'price-desc' },
  { label: 'Name A to Z', value: 'name' },
];

let state = { q: '', category: '', store: '', discount: '', sort: 'discount' };

// Apply search + the three filters, then sort. Returns the deals to show.
function filteredDeals() {
  const q = state.q.toLowerCase();
  let list = deals.filter((d) => {
    if (q && !(d.title + ' ' + d.store + ' ' + d.category).toLowerCase().includes(q)) return false;
    if (state.category && d.category !== state.category) return false;
    if (state.store && d.store !== state.store) return false;
    if (state.discount && percentOff(d) < Number(state.discount)) return false;
    return true;
  });
  list.sort((a, b) => {
    if (state.sort === 'discount') return percentOff(b) - percentOff(a) || a.price - b.price;
    if (state.sort === 'price-asc') return a.price - b.price;
    if (state.sort === 'price-desc') return b.price - a.price;
    return a.title.localeCompare(b.title);
  });
  return list;
}

function option(value, label, selected) {
  return '<option value="' + escapeAttr(value) + '"' + (selected ? ' selected' : '') + '>' + escapeText(label) + '</option>';
}

function escapeAttr(s) { return String(s).replace(/"/g, '&quot;'); }
function escapeText(s) { return String(s).replace(/[&<>]/g, (c) => '&#' + c.charCodeAt(0) + ';'); }

// Build the deal list page.
function renderList() {
  const list = filteredDeals();
  const cards = list.map((d) => renderCard(d)).join('');
  const catOptions = categories.map((c) => option(c, c, c === state.category)).join('');
  const storeOptions = stores.map((s) => option(s, s, s === state.store)).join('');
  const discOptions = discountFilters.map((f) => option(f.value, f.label, f.value === state.discount)).join('');
  const sortOptions = sorts.map((s) => option(s.value, s.label, s.value === state.sort)).join('');
  return (
    '<p class="list-intro">' + list.length + ' Black Friday &amp; Cyber Monday deals' +
    (state.q ? ' matching your search' : '') + '</p>' +
    '<div class="toolbar">' +
    '<label>Search <input type="search" id="search-input" placeholder="Search products, stores, categories"></label>' +
    '<label>Category <select id="filter-category"><option value="">All categories</option>' + catOptions + '</select></label>' +
    '<label>Store <select id="filter-store"><option value="">All stores</option>' + storeOptions + '</select></label>' +
    '<label>Discount <select id="filter-discount">' + discOptions + '</select></label>' +
    '<label>Sort <select id="sort">' + sortOptions + '</select></label>' +
    '</div>' +
    '<ul class="deal-grid">' + cards + '</ul>'
  );
}

function bindList() {
  const search = document.getElementById('search-input');
  const cat = document.getElementById('filter-category');
  const store = document.getElementById('filter-store');
  const disc = document.getElementById('filter-discount');
  const sort = document.getElementById('sort');
  const onChange = () => {
    state.q = search.value;
    state.category = cat.value;
    state.store = store.value;
    state.discount = disc.value;
    state.sort = sort.value;
    render();
  };
  search.addEventListener('input', onChange);
  cat.addEventListener('change', onChange);
  store.addEventListener('change', onChange);
  disc.addEventListener('change', onChange);
  sort.addEventListener('change', onChange);
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = (found ? found.title : 'Not found') + ' | Friday Finder';
    app.innerHTML = found ? renderDetail(found) : renderMissing();
  } else {
    document.title = 'Friday Finder - Black Friday & Cyber Monday Deal Finder';
    state = { q: '', category: '', store: '', discount: '', sort: 'discount' };
    app.innerHTML = renderList();
    bindList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
