const API_URL = "https://livre-d-or-backend.onrender.com/messages";


async function loadMessages() {
  const res = await fetch(API_URL);
  const data = await res.json();

  // --- Mettre à jour les compteurs ---
  const pendingCount = data.filter(m => m.status === "pending").length;
  const acceptedCount = data.filter(m => m.status === "accepted").length;
  const refusedCount = data.filter(m => m.status === "refused").length;

  const counters = document.getElementById("counters");
  counters.innerHTML = `
    <div class="counter pending">⏳ En attente : ${pendingCount}</div>
    <div class="counter accepted">✅ Acceptés : ${acceptedCount}</div>
    <div class="counter refused">❌ Refusés : ${refusedCount}</div>
  `;

  // --- Afficher les messages ---
  const container = document.getElementById("messages");
  container.innerHTML = "";

  data.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.status}`;
    div.innerHTML = `
      <strong>${msg.author}</strong> : ${msg.text} <em>[${msg.status}]</em><br>
      <button onclick="updateStatus(${msg.id}, 'accepted')">Accepter</button>
      <button onclick="updateStatus(${msg.id}, 'refused')">Refuser</button>
      <button onclick="deleteMessage(${msg.id})">Supprimer</button>
    `;
    container.appendChild(div);
  });
}

async function updateStatus(id, newStatus) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });
  loadMessages();
}

async function deleteMessage(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadMessages();
}

// Charger au démarrage
loadMessages();
