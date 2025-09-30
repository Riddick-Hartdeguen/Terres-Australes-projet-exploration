document.getElementById("livre-or-form").addEventListener("submit", async function(e) {
  e.preventDefault(); // Empêche le rechargement de la page

  const nom = document.getElementById("nom").value;
  const message = document.getElementById("message").value;

  try {
    const res = await fetch("https://livre-d-or-backend.onrender.com/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: nom, text: message })
    });

    if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);

    alert("✅ Merci ! Votre message a bien été enregistré.");
    document.getElementById("livre-or-form").reset();
  } catch (err) {
    alert("⚠️ Erreur lors de l'envoi : " + err.message);
    console.error(err);
  }
});
