// LAST Wicket Cricket — Phase 2.1
// Entry point. Keeps game-specific logic out of general site logic by
// deferring to small, single-purpose modules (see js/modules/).

import { initNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { getTodaysChallenge, renderChallenge } from './modules/challenge-data.js';
import { getContentItems, renderContent } from './modules/content-data.js';
import { getPlayerState, renderPlayerState } from './modules/player-state.js';
import { initSupport } from './modules/support.js';
import { initContactForm } from './modules/contact-form.js';

// ---- Site configuration — edit these before sharing/deploying ----
const CONFIG = {
  youtubeUrl: 'https://www.youtube.com/@deepanshu_2809',
  upiVpa: 'solankideepanshu2809@oksbi',
  upiPayeeName: 'Last Wicket Cricket',
};

// Signal that JS is running, so CSS can stop relying on the no-js fallback
// (see .no-js rules in css/base.css).
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // Each feature initializes independently — one unexpected failure
  // (a blocked script, an unsupported API, etc.) should never prevent the
  // rest of the page from working.
  safely('navigation', initNav);
  safely('scroll reveal', initReveal);
  safely('today\u2019s challenge', () => renderChallenge(getTodaysChallenge()));
  safely('content hub', () => renderContent(getContentItems(CONFIG.youtubeUrl)));
  safely('player record', () => renderPlayerState(getPlayerState()));
  safely('support widget', () => initSupport(CONFIG));
  safely('contact form', initContactForm);
});

function safely(label, fn){
  try{
    fn();
  }catch(err){
    console.error(`[LAST Wicket] "${label}" failed to initialize:`, err);
  }
}
