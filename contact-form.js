// "Say something" contact form. The endpoint lives in the form's own
// `action` attribute (single source of truth, and a real fallback if
// JavaScript never runs) — this module just upgrades it to an in-page
// fetch submission with status messaging.

export function initContactForm(){
  const form = document.getElementById('lwForm');
  const statusEl = document.getElementById('lwStatus');
  const submitBtn = document.getElementById('lwSubmit');
  if(!form || !statusEl || !submitBtn) return;

  const endpoint = form.getAttribute('action') || '';

  const setStatus = (text, state) => {
    statusEl.textContent = text;
    if(state) statusEl.setAttribute('data-state', state);
    else statusEl.removeAttribute('data-state');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = document.getElementById('lwMsg').value.trim();
    if(!message){
      setStatus("Type something first — an empty delivery doesn't count.", 'error');
      return;
    }
    if(!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1){
      setStatus("This form isn't connected yet — add a Formspree endpoint in the code.", 'error');
      return;
    }

    submitBtn.disabled = true;
    setStatus('Sending it down…');

    try{
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if(res.ok){
        setStatus('Delivery received. Thanks for reaching out.', 'success');
        form.reset();
      }else{
        setStatus("That didn't land — try again in a moment.", 'error');
      }
    }catch(err){
      setStatus("That didn't land — check your connection and try again.", 'error');
    }

    submitBtn.disabled = false;
  });
}
