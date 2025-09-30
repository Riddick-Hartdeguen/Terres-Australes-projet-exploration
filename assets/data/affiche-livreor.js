async function chargerMessages() {
  try {
    const res = await fetch("https://livre-d-or-backend.onrender.com/messages/accepted");
    if (!res.ok) throw new Error("Erreur serveur : " + res.status);

    const messages = await res.json();
    const container = document.getElementById("livre-or");

    container.innerHTML = "";
    messages.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message";
      div.innerHTML = `<p><strong>${msg.author}</strong> : ${msg.text}</p>`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Erreur chargement messages :", err);
  }
}

// Charger les messages dès l’ouverture de la page
chargerMessages();
