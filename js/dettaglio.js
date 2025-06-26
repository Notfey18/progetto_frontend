let annunci = [];

document.addEventListener("DOMContentLoaded", () => {
  const utente = sessionStorage.getItem("utenteLoggato");
  if (utente) {
    document.getElementById("loginLink").style.display = "none";
    document.getElementById("logoutLink").style.display = "inline";
    document.getElementById("logoutLink").addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("utenteLoggato");
      location.reload();
    });
  }

  Promise.all([
    fetch("../data/sales_dataset.json").then(r => r.json())
  ])
    .then(([dataAnnunci]) => {
      const annunciUtente = JSON.parse(localStorage.getItem("annunciUtente") || "[]");
      annunci = [...dataAnnunci, ...annunciUtente].map((a, i) => ({
        id: a.id || `ann-${Date.now()}-${i}`,
        ...a
      }));
      mostraDettaglio();
    })
    .catch(err => {
      console.error("Errore caricamento dati:", err);
      document.getElementById("dettaglioContainer").innerHTML = "<p>Errore nel caricamento dei dati.</p>";
    });
});

function mostraDettaglio() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const ann = annunci.find(a => a.id == id);
  const container = document.getElementById("dettaglioContainer");
  container.innerHTML = "";

  if (!ann) {
    container.innerHTML = "<p>Annuncio non trovato.</p>";
    return;
  }

  const imgSrc = ann.immagine_principale || ann.galleria_immagini?.[0] || 'img/default.jpg';

  const galleriaHtml = (ann.galleria_immagini || [])
    .map(url => `<img src="${url}" class="galleria-thumb" alt="Miniatura"
      style="width: 80px; height: 80px; object-fit: cover; margin-right: 10px; border-radius: 5px; cursor: pointer;">`)
    .join("");

  const card = document.createElement("div");
  card.className = "dettaglio-card";
  card.innerHTML = `
    <div class="dettaglio-image">
      <img src="${imgSrc}" alt="${ann.titolo}" id="imgPrincipale"
        style="width: 300px; height: auto; max-width: 100%; border-radius: 8px; display: block; margin: 0 auto; object-fit: cover;">
      <div class="galleria-wrapper" style="display: flex; overflow-x: auto; gap: 10px; padding: 10px 0; margin-top: 10px; scrollbar-width: thin;">
        ${galleriaHtml}
      </div>
    </div>
    <div class="dettaglio-info">
      <h2>${ann.titolo}</h2>
      <p><strong>Prezzo:</strong> €${ann.prezzo}</p>
      <p><strong>Città:</strong> ${ann.citta}</p>
      <p><strong>Data:</strong> ${ann.data_pubblicazione || ann.data}</p>
      <p>${ann.descrizione_breve || ann.descrizione || "Nessuna descrizione disponibile."}</p>
      <button id="btnPreferiti" class="btn-preferiti">Aggiungi ai preferiti</button>
    </div>
  `;
  container.appendChild(card);

  // Cambia immagine principale al click su miniatura
  document.querySelectorAll(".galleria-thumb").forEach(img => {
    img.addEventListener("click", () => {
      document.getElementById("imgPrincipale").src = img.src;
    });
  });

  // Preferiti
  const btnFav = document.getElementById("btnPreferiti");
  const pref = JSON.parse(localStorage.getItem("preferiti") || "[]");
  const index = pref.findIndex(p => p.id == id);
  if (index >= 0) {
    btnFav.textContent = "Rimuovi dai preferiti";
    btnFav.classList.add("added");
  }

  btnFav.addEventListener("click", () => {
    let cur = JSON.parse(localStorage.getItem("preferiti") || "[]");
    const exists = cur.find(p => p.id == id);

    if (exists) {
      cur = cur.filter(p => p.id != id);
      btnFav.textContent = "Aggiungi ai preferiti";
      btnFav.classList.remove("added");
    } else {
      cur.push(ann);
      btnFav.textContent = "Rimuovi dai preferiti";
      btnFav.classList.add("added");
    }

    localStorage.setItem("preferiti", JSON.stringify(cur));
  });
}
