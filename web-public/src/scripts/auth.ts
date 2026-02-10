// client/src/scripts/auth.ts
import { api } from "../lib/api";

const loginForm = document.getElementById("loginForm") as HTMLFormElement;
const msgBox = document.getElementById("msgBox");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // UI Loading State
    const btn = loginForm.querySelector("button");
    if(btn) { btn.disabled = true; btn.innerText = "⏳ Loading..."; }
    if(msgBox) msgBox.classList.add("hidden");

    // Ambil Data Form
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);

    // Panggil API
    const res = await api.post("/auth/login", data);

    if (res.success) {
      window.location.href = "/"; // Redirect ke Dashboard
    } else {
      // Show Error
      if(msgBox) {
          msgBox.innerText = res.message || "Login Gagal";
          msgBox.classList.remove("hidden");
      }
      if(btn) { btn.disabled = false; btn.innerText = "Masuk"; }
    }
  });
}