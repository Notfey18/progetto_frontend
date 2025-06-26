let categorie = [];
let annunci = [];

// Mappa immagini personalizzata
const immaginiCategorie = {
  "Elettronica": "elettronica.jpg",
  "Sport": "sports.jpg",
  "Casa e Giardino": "giardino.jpg",
  "Musica": "musica.jpg",
  "Auto e Moto": "auto.jpg",
  "Abbigliamento": "abbigliamento.jpg",
  "Immobili": "casa.jpg"
};

// Avvio al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
  const utente = sessionStorage.getItem("utenteLoggato");
  if (utente) {
    document.getElementById("loginLink")?.style.setProperty("display", "none");
    const logout = document.getElementById("logoutLink");
    logout.style.display = "inline";
    logout.addEventListener("click", () => {
      sessionStorage.removeItem("utenteLoggato");
      location.reload();
    });
  }

  // Carica categorie e annunci
  Promise.all([
    fetch("../data/categories.json").then(r => r.json()),
    fetch("../data/sales_dataset.json").then(r => r.json())
  ])
  .then(([catData, annData]) => {
    categorie = catData;
    const annunciUtente = JSON.parse(localStorage.getItem("annunciUtente") || "[]");
    annunci = [...annData, ...annunciUtente];
    mostraCategorie();
  })
  .catch(err => {
    console.error("Errore nel caricamento dati:", err);
    document.getElementById("grigliaCategorie").innerHTML = "<p>Impossibile caricare le categorie.</p>";
  });
});

// Mostra le card delle categorie
function mostraCategorie() {
  const container = document.getElementById("grigliaCategorie");
  container.innerHTML = "";

  categorie.forEach(cat => {
    const nomeFile = immaginiCategorie[cat] || "default.jpg";

    const card = document.createElement("div");
    card.className = "annuncio card-categoria";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <img src="../img/${nomeFile}" alt="${cat}" onerror="this.src='../img/Logo.jpg'">
      <h3>${cat}</h3>
      <p>Visualizza gli annunci della categoria "${cat}"</p>
    `;
    card.onclick = () => filtraAnnunci(cat);
    container.appendChild(card);
  });
}

// Mostra gli annunci filtrati per categoria
function filtraAnnunci(cat) {
  const risultati = annunci.filter(a => a.categoria === cat);

  document.getElementById("titoloAnnunci").style.display = "block";
  document.getElementById("catNome").textContent = cat;

  const container = document.getElementById("grigliaAnnunci");
  container.innerHTML = "";

  if (risultati.length === 0) {
    container.innerHTML = "<p>Nessun annuncio trovato per questa categoria.</p>";
    return;
  }

  risultati.forEach(a => {
    const card = document.createElement("div");
    card.className = "annuncio";
    card.innerHTML = `
      <a href="dettaglio.html?id=${a.id}">
      <img src="${a.immagine_principale || 'img/default.jpg'}" alt="${a.titolo}">
      <h3>${a.titolo}</h3>
      <p><strong>Prezzo:</strong> €${a.prezzo}</p>
      <p><strong>Città:</strong> ${a.citta}</p>
      <p><strong>Data:</strong> ${a.data_pubblicazione || a.data}</p>
    `;
    container.appendChild(card);
  });
}
