// Rendering for deals: cards on the deal list and a detail page for each deal.
// Discount percentages and the "is it really a deal" signal are computed from the
// sale price and the usual price, so they always add up. Nothing here is fetched.

// Escape unsafe HTML characters in user- or data-sourced text.
export function escapeHtml(s) {
  return String(s).replace(/[&<>\"']/g, (c) => '&#' + c.charCodeAt(0) + ';');
}

// Format a dollar amount.
export function usd(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

// Discount percent off the usual price, rounded.
export function percentOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

// Readable check time in UTC.
export function day(iso) {
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';
}

// Honest "is it really a deal" signal, grounded only in the observed discount
// versus the usual price (read today from the named store). No price history is
// claimed, so we never say "new low" without evidence.
export function verdict(d) {
  const off = percentOff(d);
  if (off >= 50) return 'Strong price';
  if (off >= 25) return 'Routine sale';
  return 'Modest sale';
}

// Evidence for the signal: discount, usual price, when and where the price was read.
export function evidence(d) {
  return percentOff(d) + '% below the usual ' + usd(d.was) + '; price read ' + day(d.checked) + ' from ' + d.store + ' via ' + d.source.split('(')[0].trim();
}

// One deal card shown on the list grid.
export function renderCard(d) {
  const off = percentOff(d);
  const chip = verdict(d);
  const chipClass = off >= 50 ? 'verdict-strong' : off >= 25 ? 'verdict-routine' : 'verdict-modest';
  return (
    '<article class="deal-card" data-id="' + escapeHtml(d.id) + '">' +
    '<div class="deal-thumb"></div>' +
    '<div class="deal-body">' +
    '<h3 class="deal-title">' + escapeHtml(d.title) + '</h3>' +
    '<p class="deal-meta"><span class="deal-store">' + escapeHtml(d.store) + '</span>' +
    '<span class="deal-cat">&#8226;</span>' +
    '<span class="deal-cat">' + escapeHtml(d.category) + '</span></p>' +
    '<p class="deal-price">' +
    '<span class="deal-sale">' + usd(d.price) + '</span>' +
    '<span class="deal-was">usually ' + usd(d.was) + '</span>' +
    '<span class="deal-off">-' + off + '%</span>' +
    '</p>' +
    '<p class="deal-verdict"><span class="verdict-chip ' + chipClass + '">' + escapeHtml(chip) + '</span></p>' +
    '<p class="deal-evidence">' + escapeHtml(evidence(d)) + '</p>' +
    '<p class="deal-link"><a href="' + escapeHtml(d.url) + '" rel="noopener">Find it at ' + escapeHtml(d.store) + '</a></p>' +
    '</div>' +
    '</article>'
  );
}

// Full detail view for one deal (hash route #/deal/<id>).
export function renderDetail(d) {
  const off = percentOff(d);
  const chip = verdict(d);
  const chipClass = off >= 50 ? 'verdict-strong' : off >= 25 ? 'verdict-routine' : 'verdict-modest';
  return (
    '<p class="detail-back"><a href="#/">&#8592; All deals</a></p>' +
    '<div class="detail">' +
    '<div class="detail-thumb"></div>' +
    '<div class="detail-info">' +
    '<h1>' + escapeHtml(d.title) + '</h1>' +
    '<p class="detail-meta"><strong>Store:</strong> ' + escapeHtml(d.store) + '</p>' +
    '<p class="detail-meta"><strong>Category:</strong> ' + escapeHtml(d.category) + '</p>' +
    '<p class="detail-price">' +
    '<span class="deal-sale">' + usd(d.price) + '</span> ' +
    '<span class="deal-was">usually ' + usd(d.was) + '</span> ' +
    '<span class="deal-off">-' + off + '% off</span>' +
    '</p>' +
    '<p class="detail-verdict"><span class="verdict-chip ' + chipClass + '">' + escapeHtml(chip) + '</span> ' +
    escapeHtml(evidence(d)) + '</p>' +
    '<p class="detail-link"><a href="' + escapeHtml(d.url) + '" rel="noopener">Open the product at ' + escapeHtml(d.store) + '</a></p>' +
    '<p class="detail-checked"><strong>Price checked:</strong> ' + day(d.checked) + '</p>' +
    '<p class="detail-source"><strong>Price read in:</strong> ' + escapeHtml(d.source) + '</p>' +
    '</div>' +
    '</div>'
  );
}

// Deal not found.
export function renderMissing() {
  return (
    '<p class="detail-back"><a href="#/">&#8592; All deals</a></p>' +
    '<h1>Deal not found</h1>' +
    '<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>'
  );
}
