// "Your Record" — local-storage foundation for future progression.
//
// Nothing writes to these keys yet (there's no game to generate the data),
// so every visitor currently sees empty tiles. What's real is the read →
// render path: Phase 2.5 can start writing to these same keys from the
// game/challenge flow and this module will pick the values up with no
// changes needed here or in the markup.

const KEYS = {
  bestScore: 'lastWicketBestScore',
  xp: 'lastWicketXP',
  streak: 'lastWicketStreak',
  achievements: 'lastWicketAchievements',
};

export function getPlayerState(){
  let storage;
  try{
    storage = window.localStorage;
  }catch(err){
    // Storage can throw in locked-down/private-browsing contexts.
    storage = null;
  }

  if(!storage){
    return { bestScore: null, xp: null, streak: null, achievements: [] };
  }

  return {
    bestScore: storage.getItem(KEYS.bestScore),
    xp: storage.getItem(KEYS.xp),
    streak: storage.getItem(KEYS.streak),
    achievements: parseAchievements(storage.getItem(KEYS.achievements)),
  };
}

function parseAchievements(raw){
  if(!raw) return [];
  try{
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }catch(err){
    return [];
  }
}

export function renderPlayerState(state){
  setTile('bestScore', state.bestScore);
  setTile('xp', state.xp);
  setTile('streak', state.streak);
  setTile('achievements', state.achievements.length ? state.achievements.length : null);
}

function setTile(key, value){
  const el = document.querySelector(`[data-record="${key}"]`);
  if(!el) return;

  const isEmpty = value === null || value === undefined || value === '';
  el.textContent = isEmpty ? '—' : value;
  el.classList.toggle('lw-record-value--empty', isEmpty);
}
