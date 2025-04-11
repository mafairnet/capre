
document.getElementById("save").addEventListener("click", () => {
  const settings = {
    url: document.getElementById("url").value.trim(),
    fields: document.getElementById("fields").value.trim().split(",").map(f => f.trim()),
    apiUrl: document.getElementById("apiUrl").value.trim(),
    user: document.getElementById("user").value.trim(),
    password: document.getElementById("password").value.trim(),
    sensorId: document.getElementById("sensorId").value.trim(),
    extension: document.getElementById("extension").value.trim(),
    pauseDuration: parseInt(document.getElementById("pauseDuration").value.trim(), 10)
  };

  chrome.storage.sync.set(settings, () => {
    alert("Settings saved!");
  });
});

chrome.storage.sync.get(
  ["url", "fields", "apiUrl", "user", "password", "sensorId", "extension", "pauseDuration"],
  (data) => {
    document.getElementById("url").value = data.url || "";
    document.getElementById("fields").value = (data.fields || []).join(", ");
    document.getElementById("apiUrl").value = data.apiUrl || "";
    document.getElementById("user").value = data.user || "";
    document.getElementById("password").value = data.password || "";
    document.getElementById("sensorId").value = data.sensorId || "";
    document.getElementById("extension").value = data.extension || "";
    document.getElementById("pauseDuration").value = data.pauseDuration || 10;
  }
);
