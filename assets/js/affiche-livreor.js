async function chargerMessages() {
  try {
    const res = await fetch("https://livre-d-or-backend.onrender.com/messages/accepted");
    if (!res.ok) throw new Error("Erreur serveur : " + res.status);

    const messages = await res.json();
    const container = document.getElementById("livre-or");
    if (!container) return;

    container.replaceChildren();
    messages.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message";

      const paragraph = document.createElement("p");
      const author = document.createElement("strong");
      author.textContent = msg.author || "Anonyme";

      paragraph.append(author, " : ", document.createTextNode(msg.text || ""));
      div.appendChild(paragraph);
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Erreur chargement messages :", err);
  }
}

// Charger les messages dès l’ouverture de la page
chargerMessages();
