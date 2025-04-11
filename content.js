
chrome.storage.sync.get(
  ["fields", "apiUrl", "user", "password", "sensorId", "extension", "pauseDuration"],
  ({ fields, apiUrl, user, password, sensorId, extension, pauseDuration }) => {
    let callRef = null;

    async function listActiveCalls() {
      const task = "listActiveCalls";
      const params = JSON.stringify({ sensorId });
      const url = `${apiUrl}?task=${task}&user=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}&params=${encodeURIComponent(params)}`;

      const response = await fetch(url);
      const data = await response.json();
      return data.rows || [];
    }

    async function pauseCall(callRef) {
      const task = "handleActiveCall";
      const params = JSON.stringify({ sensorId, command: "pausecall", callRef });
      const url = `${apiUrl}?task=${task}&user=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}&params=${encodeURIComponent(params)}`;
      console.log('Pausing current call...');
      return fetch(url);
    }

    async function unpauseCall(callRef) {
      const task = "handleActiveCall";
      const params = JSON.stringify({ sensorId, command: "unpausecall", callRef });
      const url = `${apiUrl}?task=${task}&user=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}&params=${encodeURIComponent(params)}`;
      console.log('CUnpausing current call...');
      return fetch(url);
    }

    async function handleCardInput() {
      console.log('Card Details being provided...');
      const activeCalls = await listActiveCalls();
      const matchedCall = activeCalls.find(call =>
        call.caller === extension || call.called === extension
      );

      if (matchedCall) {
        callRef = matchedCall.callreference;
        console.log("Matched CallRef:", callRef);
        await pauseCall(callRef);
        setTimeout(() => unpauseCall(callRef), pauseDuration * 1000);
      } else {
        console.log('No call found by the moment...');
      }
    }

    function getCurrentUri() {
      const currentUri = {
        href: window.location.href,
        pathname: window.location.pathname,
        host: window.location.host,
        protocol: window.location.protocol,
        search: window.location.search,
        hash: window.location.hash
      };
      console.log('Current URI:', currentUri);
      return currentUri;
    }

    function setupDetection(fields, extension) {
      console.log("Running setupDetection...");

      function detectFields() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
        console.log("Field:", input.name);

        // Add click event listener to print input name
        input.addEventListener('click', () => {
          const inputName = input.name || input.id || 'unnamed input';
          console.log('Clicked input:', inputName);
          let currentURI = getCurrentUri().href;
          console.log('Current Site:', currentURI);
          if( currentURI == 'https://www.volaris.com/payment'){
            const cardInput = document.querySelector('input[formControlName="cardNumber"]');
            //console.log('Clicked input:', cardInput.value);
            
            handleCardInput();
          }
        });

        const identifier = (input.name || "") + (input.id || "");
        if (fields.some(f => identifier.toLowerCase().includes(f.toLowerCase()))) {
          if (!input.dataset.listenerAttached) {
            console.log("Attaching input listener to:", identifier);
            input.addEventListener("input", handleCardInput, { once: true });
            input.dataset.listenerAttached = "true";
          }
        }
    });
  }

  // MutationObserver for DOM changes
  const observer = new MutationObserver(() => {
    detectFields();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Detect URL changes (SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      console.log("URL changed:", location.href);
      lastUrl = location.href;
      setTimeout(() => detectFields(), 500); // Wait for DOM to update
    }
  }).observe(document.body, { childList: true, subtree: true });

  // Initial run
  detectFields();
}

	setupDetection(fields, extension);
    //document.addEventListener("DOMContentLoaded", setupDetection);
    console.log("VoipMonitor content script loaded.");
  }
);
