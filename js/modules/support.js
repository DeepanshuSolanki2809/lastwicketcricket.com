// "Tip the Twelfth Man" support widget. Builds a UPI deep link + QR code
// for the selected amount. The HTML ships with a working default (₹51) so
// the button and QR code are already correct before this script runs —
// this module only makes the amount chips interactive.

export function initSupport(config){
  const chips = document.querySelectorAll('.lw-chip');
  const customInput = document.getElementById('lwCustomAmount');
  const upiBtn = document.getElementById('lwUpiBtn');
  const qrImg = document.getElementById('lwQr');

  if(!(upiBtn && qrImg && customInput && chips.length)) return;

  let currentAmount = 51;

  const buildUpiLink = (amount) => {
    const params = new URLSearchParams();
    params.set('pa', config.upiVpa);
    params.set('pn', config.upiPayeeName);
    params.set('cu', 'INR');
    if(amount) params.set('am', amount);
    params.set('tn', 'Tip for Last Wicket Cricket');
    return 'upi://pay?' + params.toString();
  };

  const refreshUpi = () => {
    const link = buildUpiLink(currentAmount);
    upiBtn.href = link;
    upiBtn.textContent = currentAmount ? `🏏 ₹${currentAmount} via UPI app` : '🏏 Pay via UPI app';
    qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=176x176&data=' + encodeURIComponent(link);
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      if(chip.dataset.amount === 'custom'){
        customInput.hidden = false;
        customInput.focus();
        currentAmount = parseInt(customInput.value, 10) || 0;
      }else{
        customInput.hidden = true;
        currentAmount = parseInt(chip.dataset.amount, 10);
      }
      refreshUpi();
    });
  });

  customInput.addEventListener('input', () => {
    currentAmount = parseInt(customInput.value, 10) || 0;
    refreshUpi();
  });
}
