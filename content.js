
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

      return fetch(url);
    }

    async function unpauseCall(callRef) {
      const task = "handleActiveCall";
      const params = JSON.stringify({ sensorId, command: "unpausecall", callRef });
      const url = `${apiUrl}?task=${task}&user=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}&params=${encodeURIComponent(params)}`;

      return fetch(url);
    }

    async function handleCardInput() {
      const activeCalls = await listActiveCalls();
      const matchedCall = activeCalls.find(call =>
        call.caller === extension || call.called === extension
      );

      if (matchedCall) {
        callRef = matchedCall.callreference;
        console.log("Matched CallRef:", callRef);
        await pauseCall(callRef);
        setTimeout(() => unpauseCall(callRef), pauseDuration * 1000);
      }
    }

    function setupDetection(fields, extension) {
  console.log("Running setupDetection...");

  function detectFields() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
    console.log("Field:", input.name);

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
