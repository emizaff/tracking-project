import { api } from "../lib/api";

const registerForm = document.getElementById("registerForm") as HTMLFormElement;
const msgBox = document.getElementById("msgBox");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // UI Loading
    const btn = registerForm.querySelector("button");
    if(btn) { btn.disabled = true; btn.innerText = "⏳ Mendaftar..."; }
    if(msgBox) msgBox.classList.add("hidden");

    // Ambil Data
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData);

    // Panggil API Backend
    const res = await api.post("/auth/register", data);

    if (res.success) {
      // Sukses -> Arahkan ke Login dengan pesan sukses
      alert("Akun berhasil dibuat! Silakan login.");
      window.location.href = "/login";
    } else {
      // Gagal -> Tampilkan Error
      if(msgBox) {
          msgBox.innerText = res.message || "Gagal Mendaftar";
          msgBox.classList.remove("hidden");
      }
      if(btn) { btn.disabled = false; btn.innerText = "Daftar Sekarang"; }
    }
  });
}