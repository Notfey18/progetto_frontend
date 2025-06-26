
let annunci = [];
let cities = [];
let categories = [];

// Caricamento dei file JSON
Promise.all([
  fetch('../data/sales_dataset.json').then(res => res.json()),
  fetch('../data/cities.json').then(res => res.json()),
  fetch('../data/categories.json').then(res => res.json())
])
.then(([dataAnnunci, dataCities, dataCats]) => {
  annunci = dataAnnunci;
  cities = dataCities;
  categories = dataCats;

  popolaSelectCategorie();
  popolaSelectCitta();
  caricaAnnunciTotali();
})
.catch(err => {
  console.error("Errore nel caricamento dei dati JSON:", err);
});

// Popola il menu a tendina delle categorie
function popolaSelectCategorie() {
  const sel = document.getElementById("filtroCategoria");
  if (!sel) return;
  sel.innerHTML = `<option value="">Tutte le categorie</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    sel.appendChild(option);
  });
}

// Popola il menu a tendina delle città
function popolaSelectCitta() {
  const sel = document.getElementById("filtroCitta");
  if (!sel) return;
  sel.innerHTML = `<option value="">Tutte le città</option>`;
  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    sel.appendChild(option);
  });
}

// Unisce gli annunci JSON con quelli inseriti dall’utente
function caricaAnnunciTotali() {
  const annunciUtente = JSON.parse(localStorage.getItem("annunciUtente") || "[]");
  const tutti = [...annunci, ...annunciUtente];
  mostraAnnunci(tutti);
}

// Mostra una lista di annunci
function mostraAnnunci(lista) {
  const griglia = document.getElementById("grigliaAnnunci");
  if (!griglia) return;

  griglia.innerHTML = "";

  if (lista.length === 0) {
    griglia.innerHTML = "<p>Nessun annuncio trovato.</p>";
    return;
  }

  lista.forEach(a => {
    const card = document.createElement("div");
    card.className = "annuncio";
    card.innerHTML = `
      <a href="dettaglio.html?id=${a.id}">
      <img src="${a.immagine_principale || '../img/Logo.jpg'}" alt="${a.titolo}">
      <h3>${a.titolo}</h3>
      <p><strong>Prezzo:</strong> €${a.prezzo}</p>
      <p><strong>Città:</strong> ${a.citta}</p>
      <p><strong>Data:</strong> ${a.data_pubblicazione || a.data}</p>
    `;
    griglia.appendChild(card);
  });
}

// Applica i filtri e aggiorna la griglia
function filtraAnnunci() {
  const testo = document.getElementById("searchInput").value.toLowerCase();
  const categoria = document.getElementById("filtroCategoria").value;
  const citta = document.getElementById("filtroCitta").value;
  const ordinamento = document.getElementById("filtroOrdinamento").value;

  const annunciUtente = JSON.parse(localStorage.getItem("annunciUtente") || "[]");
  const tutti = [...annunci, ...annunciUtente];

  let filtrati = tutti.filter(a => {
    return (
      (!categoria || a.categoria === categoria) &&
      (!citta || a.citta === citta) &&
      (!testo || a.titolo.toLowerCase().includes(testo) || a.descrizione_breve?.toLowerCase().includes(testo))
    );
  });

  switch (ordinamento) {
    case "data_desc":
      filtrati.sort((a, b) => b.data_pubblicazione.localeCompare(a.data_pubblicazione));
      break;
    case "data_asc":
      filtrati.sort((a, b) => a.data_pubblicazione.localeCompare(b.data_pubblicazione));
      break;
    case "prezzo_asc":
      filtrati.sort((a, b) => a.prezzo - b.prezzo);
      break;
    case "prezzo_desc":
      filtrati.sort((a, b) => b.prezzo - a.prezzo);
      break;
    case "titolo_az":
      filtrati.sort((a, b) => a.titolo.localeCompare(b.titolo));
      break;
    case "titolo_za":
      filtrati.sort((a, b) => b.titolo.localeCompare(a.titolo));
      break;
  }

  mostraAnnunci(filtrati);
}


// Simulazione newsletter
function iscriviNewsletter() {
  const email = document.getElementById("newsletterEmail").value;
  if (email && email.includes("@")) {
    alert("Grazie per l'iscrizione: " + email);
    document.getElementById("newsletterEmail").value = "";
  } else {
    alert("Inserisci un'email valida.");
  }
}

// Login / logout dinamico
window.addEventListener("DOMContentLoaded", () => {
  const utente = sessionStorage.getItem("utenteLoggato");

  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");
  const userPageLink = document.getElementById("userPageLink");

  if (utente) {
    if (loginLink) loginLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "inline";
    if (userPageLink) userPageLink.style.display = "inline";

    if (logoutLink) {
      logoutLink.addEventListener("click", () => {
        sessionStorage.removeItem("utenteLoggato");
        location.reload();
      });
    }
  }
});
