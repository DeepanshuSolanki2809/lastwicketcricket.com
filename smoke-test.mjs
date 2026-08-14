import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');

const dom = new JSDOM(html, {
  url: 'https://deepanshusolanki2809.github.io/lastwicketcricket.com/',
  pretendToBeVisual: true,
});

// ---- Minimal browser API polyfills jsdom does not ship with ----
dom.window.matchMedia = dom.window.matchMedia || function (query) {
  return { matches: false, media: query, addEventListener(){}, removeEventListener(){} };
};
if (!('IntersectionObserver' in dom.window)) {
  dom.window.IntersectionObserver = class {
    observe(){} unobserve(){} disconnect(){}
  };
}

// Real browsers expose IntersectionObserver, matchMedia, Event, etc. as
// BOTH `window.X` and bare `X` (they're the same global scope). jsdom does
// not collapse those two the way Node's `global` does, so we mirror the
// handful of identifiers the site's source files reference as bare names.
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.IntersectionObserver = dom.window.IntersectionObserver;
global.matchMedia = dom.window.matchMedia;
global.Event = dom.window.Event;
global.MouseEvent = dom.window.MouseEvent;
global.fetch = async () => ({ ok: false });

let failures = 0;
const check = (label, condition) => {
  if (condition) {
    console.log(`  PASS  ${label}`);
  } else {
    console.log(`  FAIL  ${label}`);
    failures++;
  }
};

console.log('Loading js/main.js into jsdom document...');
await import(pathToFileURL(path.join(root, 'js/main.js')).href);

// main.js only wires things up inside a DOMContentLoaded listener.
// jsdom already finished parsing before we attached that listener via
// dynamic import, so dispatch it manually — same as a real late script.
document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true, cancelable: true }));

// Give any microtasks (async fetch handlers etc.) a tick to settle.
await new Promise((resolve) => setTimeout(resolve, 20));

console.log('\nStructural checks:');
check('exactly one <h1>', document.querySelectorAll('h1').length === 1);
check('nav has 6 desktop links', document.querySelectorAll('.lw-nav-links a').length === 6);
check('mobile menu has 6 links + 1 CTA', document.querySelectorAll('.lw-mobile-menu a').length === 7);
check('all 10 top-level sections present', document.querySelectorAll('main > section[id]').length === 10);
check('skip link points to #main', document.querySelector('.lw-skip-link')?.getAttribute('href') === '#main');
check('main has id="main"', document.getElementById('main') !== null);

console.log('\nJS-driven rendering checks:');
check('no-js class removed from <html>', !document.documentElement.classList.contains('no-js'));
check('js class added to <html>', document.documentElement.classList.contains('js'));
check('challenge runs rendered', document.querySelector('[data-challenge="runs"]').textContent === '8');
check('challenge balls rendered', document.querySelector('[data-challenge="balls"]').textContent === '6');
check('challenge wickets rendered', document.querySelector('[data-challenge="wickets"]').textContent === '1');
check('content grid populated (4 cards)', document.querySelectorAll('[data-content-grid] .lw-content-card').length === 4);
check('content cards link to real channel', [...document.querySelectorAll('[data-content-grid] .lw-content-card')].every(a => a.href.includes('youtube.com/@deepanshu_2809')));
check('record tiles default to em dash', document.querySelector('[data-record="bestScore"]').textContent === '—');
check('record tiles marked empty', document.querySelector('[data-record="bestScore"]').classList.contains('lw-record-value--empty'));

console.log('\nLink integrity checks:');
const internalAnchors = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href'));
let brokenAnchors = 0;
internalAnchors.forEach((href) => {
  const id = href.slice(1);
  if (id && !document.getElementById(id)) {
    console.log(`  FAIL  anchor ${href} has no matching id`);
    brokenAnchors++;
  }
});
check('all in-page anchor links resolve to a real id', brokenAnchors === 0);

console.log('\nInteraction checks:');
const toggle = document.querySelector('.lw-nav-toggle');
const mobileMenu = document.querySelector('.lw-mobile-menu');
toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
check('mobile menu opens on toggle click', mobileMenu.classList.contains('is-open') && toggle.getAttribute('aria-expanded') === 'true');
toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
check('mobile menu closes on second toggle click', !mobileMenu.classList.contains('is-open') && toggle.getAttribute('aria-expanded') === 'false');

const boundaryChip = document.querySelector('.lw-chip[data-amount="101"]');
const upiBtn = document.getElementById('lwUpiBtn');
boundaryChip.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
check('tip chip click updates UPI amount', upiBtn.href.includes('am=101'));
check('tip chip click updates button label', upiBtn.textContent.includes('101'));

const customChip = document.querySelector('.lw-chip[data-amount="custom"]');
const customInput = document.getElementById('lwCustomAmount');
customChip.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
check('custom amount field reveals on custom chip', !customInput.hidden);

console.log('\nContact form checks:');
const form = document.getElementById('lwForm');
check('form has a real action endpoint', form.getAttribute('action')?.includes('formspree.io'));
document.getElementById('lwMsg').value = '';
form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
await new Promise((resolve) => setTimeout(resolve, 10));
check('empty message blocks submission with a status message', document.getElementById('lwStatus').textContent.length > 0);

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
