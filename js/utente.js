 // Reindirizza se non loggato
    const utente = sessionStorage.getItem("utenteLoggato");
    if (!utente) {
      alert("Devi accedere per vedere questa pagina.");
      location.href = "login.html";
    }

    // Messaggio di benvenuto
    document.getElementById("welcomeMsg").textContent = `Benvenuto, ${utente}!`;

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      sessionStorage.removeItem("utenteLoggato");
      location.href = "index.html";
    });

    // Mostra annunci da localStorage
    function mostraAnnunciUtente() {
      const container = document.getElementById("annunciUtente");
      const annunciJSON = localStorage.getItem("annunciUtente") || "[]";
      const annunci = JSON.parse(annunciJSON);
      
      if (annunci.length === 0) {
        container.innerHTML = "<p>Non hai ancora inserito annunci.</p>";
        return;
      }

      annunci.forEach(a => {
        const card = document.createElement("div");
        card.className = "annuncio";
        card.innerHTML = `
          <img src="${a.immagine}" alt="${a.titolo}">
          <h3>${a.titolo}</h3>
          <p><strong>Prezzo:</strong> €${a.prezzo}</p>
          <p><strong>Città:</strong> ${a.citta}</p>
          <p><strong>Data:</strong> ${a.data}</p>
        `;
        container.appendChild(card);
      });
    }

    mostraAnnunciUtente();