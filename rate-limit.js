const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;
const key = "3dprintmaxxing-form-submissions";

function tooManySubmissions() {
  const now = Date.now();
  let entries = [];
  try { entries = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
  entries = entries.filter((time) => now - time < WINDOW_MS);
  const limited = entries.length >= LIMIT;
  if (!limited) {
    entries.push(now);
    localStorage.setItem(key, JSON.stringify(entries));
  }
  return limited;
}

document.querySelectorAll("form[data-print-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (tooManySubmissions()) {
      event.preventDefault();
      const next = form.dataset.rateLimited || "rate-limited.html";
      window.location.assign(new URL(next, window.location.href).href);
      return;
    }
    const next = form.dataset.thanks;
    if (next) {
      let redirect = form.querySelector('input[name="_next"]');
      if (!redirect) {
        redirect = document.createElement("input");
        redirect.type = "hidden";
        redirect.name = "_next";
        form.appendChild(redirect);
      }
      redirect.value = new URL(next, window.location.href).href;
    }
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector("[data-status]");
    if (button) button.disabled = true;
    if (status) status.textContent = "Sending…";
  });
});
