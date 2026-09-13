/**
 * SNC Network — GetKey Frontend Logic
 * Ganti WORKER_URL dengan URL Worker Cloudflare kamu
 */

const WORKER_URL = "https://snc-getkey-api.YOUR_SUBDOMAIN.workers.dev";

// ─── State ───────────────────────────────────────────────────────────────────

let isLoading = false;

// ─── UI Helpers ──────────────────────────────────────────────────────────────

function setStatus(message, type = "info") {
  const box = document.getElementById("status-box");
  box.textContent = message;
  box.className = `status-box ${type}`;
  box.classList.remove("hidden");
}

function clearStatus() {
  const box = document.getElementById("status-box");
  box.classList.add("hidden");
}

function setLoading(state) {
  isLoading = state;
  const btn = document.getElementById("btn-getkey");
  const btnText = document.getElementById("btn-text");
  const spinner = document.getElementById("btn-spinner");

  btn.disabled = state;

  if (state) {
    btnText.classList.add("hidden");
    spinner.classList.remove("hidden");
  } else {
    btnText.classList.remove("hidden");
    spinner.classList.add("hidden");
  }
}

// ─── Main Function ────────────────────────────────────────────────────────────

async function startGetKey() {
  if (isLoading) return;

  clearStatus();
  setLoading(true);

  try {
    const res = await fetch(`${WORKER_URL}/api/getkey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!data.success) {
      setStatus(`❌ ${data.error || "Terjadi kesalahan. Coba lagi."}`, "error");
      setLoading(false);
      return;
    }

    // Simpan task_id di sessionStorage sebagai backup
    // (success.html ambil dari URL param, ini hanya cadangan)
    sessionStorage.setItem("snc_task_id", data.task_id);

    setStatus("⏳ Mengarahkan ke halaman verifikasi...", "info");

    // Redirect ke Linkvertise
    setTimeout(() => {
      window.location.href = data.link;
    }, 800);

  } catch (err) {
    setStatus("❌ Tidak bisa terhubung ke server. Periksa koneksi internet kamu.", "error");
    setLoading(false);
  }
}

