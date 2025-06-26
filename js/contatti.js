document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formContatti").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const messaggio = document.getElementById("messaggio").value.trim();
    const conferma = document.getElementById("confermaContatto");

    if (!nome || !email || !messaggio) {
      alert("Compila tutti i campi.");
      return;
    }

    // Simulazione invio (potresti aggiungere EmailJS o simili)
    conferma.textContent = "✅ Messaggio inviato correttamente!";
    conferma.style.color = "green";
    this.reset();
  });
});
