document.addEventListener("DOMContentLoaded", () => {
  // --- Animation au scroll ---
  const elementsToShow = document.querySelectorAll("h1, h2, h3, p, blockquote, .fiche-scientifique");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.1 });
  elementsToShow.forEach(el => observer.observe(el));

  // --- Toggle interview (boutons "Voir l'interview") ---
  let dernierBoutonClique = null;

  document.querySelectorAll(".contenu-interview").forEach(div => {
    div.style.transition = "none";
    div.classList.remove("visible");
    requestAnimationFrame(() => {
      div.style.transition = "";
    });
  });

  document.querySelectorAll(".toggle-interview, .btn-interview").forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      const content = button.nextElementSibling;
      const isVisible = content.classList.contains("visible");

      if (!isVisible) {
        dernierBoutonClique = button;
      }

      content.classList.toggle("visible");
      button.textContent = content.classList.contains("visible")
        ? "Masquer la présentation"
        : "Voir la présentation";
    });
  });

  // --- Clic sur les images pour ouvrir l'interview et scroller ---
  document.querySelectorAll(".ancre-photo").forEach(lien => {
    lien.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = lien.getAttribute("href").replace("#", "");
      const interviewContainer = lien.closest(".fiche-scientifique").querySelector(".contenu-interview");
      const toggleButton = lien.closest(".fiche-scientifique").querySelector(".toggle-interview");

      if (!interviewContainer.classList.contains("visible")) {
        interviewContainer.classList.add("visible");
        if (toggleButton) {
          toggleButton.textContent = "Masquer la présentation";
        }
      }

      setTimeout(() => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    });
  });

  // --- Parallax (inchangé) ---
  window.addEventListener("scroll", () => {
    const section = document.querySelector(".parallax-scroll");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.top < windowHeight && rect.bottom > 0) {
      const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
      const positionY = Math.min(100, Math.max(0, scrollPercent * 100));
      section.style.backgroundPosition = `center ${positionY}%`;
    }
  });

  // --- Lightbox ---
  const lightbox = document.getElementById("lightbox-overlay");
  const lightboxImg = document.getElementById("lightbox-image");
  const photoContainers = document.querySelectorAll(
    ".lien-conteneur-photo, .masonry-grid .item, .galerie-personnel img, .galerie-personnel-speciale img, .ligne-verticales img, .grille-photos-interview .item-svt"
  );
  photoContainers.forEach(container => {
    container.addEventListener("click", () => {
      let img = container.tagName === "IMG" ? container : container.querySelector("img");
      if (!img) return;
      lightboxImg.src = img.src;
      lightbox.classList.add("show");
    });
  });

  if (lightbox && lightboxImg) {
    lightbox.addEventListener("click", () => {
      lightbox.classList.remove("show");
      lightboxImg.src = "";
    });
  }

  const allImages = Array.from(document.querySelectorAll(
    ".lien-conteneur-photo img, .masonry-grid .item img, .galerie-personnel img, .galerie-personnel-speciale img, .ligne-verticales img, .grille-photos-interview img"
  ));
  let currentIndex = -1;

  function showImage(index) {
    if (index >= 0 && index < allImages.length) {
      lightboxImg.src = allImages[index].src;
      currentIndex = index;
    }
  }

  document.getElementById("lightbox-prev").addEventListener("click", e => {
    e.stopPropagation();
    if (currentIndex > 0) showImage(currentIndex - 1);
  });

  document.getElementById("lightbox-next").addEventListener("click", e => {
    e.stopPropagation();
    if (currentIndex < allImages.length - 1) showImage(currentIndex + 1);
  });

  photoContainers.forEach(container => {
    container.addEventListener("click", () => {
      let img = container.tagName === "IMG" ? container : container.querySelector("img");
      if (!img) return;
      currentIndex = allImages.findIndex(i => i.src === img.src);
    });
  });

  // --- Bouton "Fermer l’interview" ---
  document.querySelectorAll(".fermer-interview").forEach(bouton => {
    bouton.addEventListener("click", (e) => {
      e.preventDefault();
      const parentInterview = bouton.closest(".contenu-interview");
      if (parentInterview) {
        parentInterview.classList.remove("visible");
        const toggleBtn = parentInterview.previousElementSibling;
        if (toggleBtn && toggleBtn.classList.contains("toggle-interview")) {
          toggleBtn.textContent = "Voir la présentation";
        }
        bouton.classList.add("hidden");

        if (dernierBoutonClique) {
          setTimeout(() => {
            dernierBoutonClique.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 300);
        }
      }
    });
  });

  // --- ✅ Menu Sticky (AJOUT) ---
  const menuAncrage = document.querySelector(".bloc-menu-ancrage");
  if (menuAncrage) {
    const offsetTop = menuAncrage.offsetTop;

    window.addEventListener("scroll", () => {
      if (window.scrollY >= offsetTop) {
        menuAncrage.classList.add("fixed");
      } else {
        menuAncrage.classList.remove("fixed");
      }
    });
  }
  document.querySelectorAll(".bloc-menu-ancrage a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.getAttribute("href").substring(1);
      const target = document.getElementById(id);
      const menu = document.querySelector(".bloc-menu-ancrage");

      if (target) {
        // Vérifie si le menu a la classe "fixed"
        const isSticky = menu.classList.contains("fixed");

        // Décalage selon sticky ou pas
        const offset = isSticky ? 88 : 146;

        const bodyTop = document.body.getBoundingClientRect().top;
        const elementTop = target.getBoundingClientRect().top;
        const scrollTo = elementTop - bodyTop - offset;

        window.scrollTo({
          top: scrollTo,
          behavior: "smooth"
        });
      }
    });
  });
});