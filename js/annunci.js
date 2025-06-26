document.addEventListener("DOMContentLoaded", () => {
  // Verifica login
  const utente = sessionStorage.getItem("utenteLoggato");
  if (!utente) {
    alert("Devi essere loggato per inserire un annuncio.");
    location.href = "login.html";
    return;
  }

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    sessionStorage.removeItem("utenteLoggato");
    location.href = "index.html";
  });

  // Carica categorie dinamiche
  fetch("../data/categories.json")
    .then(res => res.json())
    .then(categorie => {
      const select = document.getElementById("categoria");
      categorie.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
      });
    })
    .catch(err => {
      console.error("Errore nel caricamento delle categorie:", err);
      alert("Impossibile caricare le categorie.");
    });

  // Drag & Drop immagine
  const dropArea = document.getElementById("dropArea");
  const imgPreview = document.getElementById("anteprimaImmagine");
  let immagineBase64 = "img/default.jpg";

  ["dragenter", "dragover"].forEach(event => {
    dropArea.addEventListener(event, e => {
      e.preventDefault();
      dropArea.classList.add("highlight");
    });
  });

  ["dragleave", "drop"].forEach(event => {
    dropArea.addEventListener(event, e => {
      e.preventDefault();
      dropArea.classList.remove("highlight");
    });
  });

  dropArea.addEventListener("drop", e => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        immagineBase64 = reader.result;
        imgPreview.src = immagineBase64;
      };
      reader.readAsDataURL(file);
    }
  });

  // Submit annuncio
  document.getElementById("annuncioForm").addEventListener("submit", function (e) {
    e.preventDefault();

  const annuncio = {
    id: Date.now(), // genera un ID univoco
    titolo: document.getElementById("titolo").value,
    descrizione: document.getElementById("descrizione").value,
    prezzo: parseFloat(document.getElementById("prezzo").value),
    citta: document.getElementById("citta").value,
    categoria: document.getElementById("categoria").value,
    immagine: immagineBase64,
    data: new Date().toISOString().slice(0, 10)
  };


    const esistenti = JSON.parse(localStorage.getItem("annunciUtente") || "[]");
    esistenti.push(annuncio);
    localStorage.setItem("annunciUtente", JSON.stringify(esistenti));

    document.getElementById("conferma").textContent = "✅ Annuncio pubblicato con successo!";
    this.reset();
    imgPreview.src = "img/default.jpg";
    immagineBase64 = "img/default.jpg";
  });
});
