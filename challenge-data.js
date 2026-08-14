// Today's Challenge — Phase 2.1 uses one static demo challenge.
//
// Phase 2.3 replaces getTodaysChallenge() with a real daily-rotating source
// (a generated JSON file, a small API, or a client-side generator keyed off
// the date). renderChallenge() and the markup it targets do not need to
// change when that happens — only this data source does.

const DEMO_CHALLENGE = {
  id: 'demo-001',
  targetRuns: 8,
  balls: 6,
  wickets: 1,
  status: 'preview', // 'preview' | 'live'
};

export function getTodaysChallenge(){
  return DEMO_CHALLENGE;
}

export function renderChallenge(challenge){
  setValue('runs', challenge.targetRuns);
  setValue('balls', challenge.balls);
  setValue('wickets', challenge.wickets);
}

function setValue(key, value){
  const el = document.querySelector(`[data-challenge="${key}"]`);
  if(el) el.textContent = value;
}
