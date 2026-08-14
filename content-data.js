// Content hub — Phase 2.1 ships with example category cards, not real
// per-video data (there's no YouTube integration yet). Every card links to
// the real channel so it's genuinely useful today.
//
// Phase 2.4 replaces SAMPLE_CONTENT with real video data (fetched at build
// time or via a small API) — renderContent() and the .lw-content-card
// markup it produces do not need to change.

const SAMPLE_CONTENT = [
  { category: 'Story Mode', title: 'Latest cinematic edit', meta: 'New drops regularly' },
  { category: 'Replay · EA Cricket 07', title: 'Career mode nostalgia', meta: 'PS2 classic gameplay' },
  { category: 'Gully Mode', title: 'Street cricket chaos', meta: 'Tennis-ball tales' },
  { category: 'Shorts', title: 'Quick cricket hits', meta: 'Bite-sized highlights' },
];

const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"/></svg>';

export function getContentItems(channelUrl){
  return SAMPLE_CONTENT.map((item) => ({ ...item, href: channelUrl }));
}

export function renderContent(items){
  const grid = document.querySelector('[data-content-grid]');
  if(!grid) return;

  grid.innerHTML = items.map(renderCard).join('');
}

function renderCard(item){
  return `
    <a class="lw-content-card" href="${item.href}" target="_blank" rel="noopener">
      <div class="lw-content-thumb" aria-hidden="true">${PLAY_ICON}</div>
      <div class="lw-content-body">
        <span class="lw-content-category">${item.category}</span>
        <h3 class="lw-content-title">${item.title}</h3>
        <span class="lw-content-meta">${item.meta} · Watch on YouTube</span>
      </div>
    </a>
  `;
}
