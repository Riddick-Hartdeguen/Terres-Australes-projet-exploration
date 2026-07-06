// ============================================================================
// Point d'entree du script
// ============================================================================
// DOMContentLoaded attend que le HTML soit completement chargé avant de chercher
// des elements avec querySelector. Sans cela, JavaScript pourrait chercher un
// bouton ou une image qui n'existe pas encore dans la page.
document.addEventListener("DOMContentLoaded", () => {
  initialiserMenuBurger();
  initialiserAnimationsAuScroll();
  initialiserInterviews();
  initialiserAncresPhotos();
  initialiserParallax();
  initialiserLightbox();
  initialiserMenuAncrageSticky();
});

// ============================================================================
// Menu burger responsive
// ============================================================================
function initialiserMenuBurger() {
  const navigations = document.querySelectorAll("nav");

  navigations.forEach((nav) => {
    // Le projet utilise un <div> dans la navigation pour regrouper les liens.
    // On le recupere pour pouvoir lui ajouter une classe CSS dediee au menu.
    const menuLinks = Array.from(nav.children).find((child) => child.tagName === "DIV");

    // Si la navigation n'a pas de conteneur de liens, ou si le bouton existe
    // deja, on ne fait rien. Cela evite de creer deux menus burger.
    if (!menuLinks || nav.querySelector(".menu-burger")) {
      return;
    }

    nav.classList.add("nav-responsive-ready");
    menuLinks.classList.add("nav-liens");

    const burgerButton = creerBoutonBurger();
    nav.insertBefore(burgerButton, menuLinks);

    burgerButton.addEventListener("click", () => {
      basculerMenuBurger(nav, burgerButton);
    });

    fermerMenuAuClicSurUnLien(menuLinks, nav, burgerButton);
  });
}

function creerBoutonBurger() {
  const burgerButton = document.createElement("button");

  // type="button" evite qu'un bouton place dans un formulaire declenche un submit.
  burgerButton.type = "button";
  burgerButton.className = "menu-burger";

  // Ces attributs aident les lecteurs d'ecran a comprendre l'etat du menu.
  burgerButton.setAttribute("aria-label", "Ouvrir le menu principal");
  burgerButton.setAttribute("aria-expanded", "false");

  // Les trois spans representent les trois barres visuelles du burger.
  burgerButton.innerHTML = "<span></span><span></span><span></span>";

  return burgerButton;
}

function basculerMenuBurger(nav, burgerButton) {
  const isOpen = nav.classList.toggle("menu-ouvert");

  burgerButton.setAttribute("aria-expanded", String(isOpen));
  burgerButton.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu principal" : "Ouvrir le menu principal"
  );
}

function fermerMenuAuClicSurUnLien(menuLinks, nav, burgerButton) {
  const links = menuLinks.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("menu-ouvert");
      burgerButton.setAttribute("aria-expanded", "false");
      burgerButton.setAttribute("aria-label", "Ouvrir le menu principal");
    });
  });
}

// ============================================================================
// Animations au scroll
// ============================================================================
function initialiserAnimationsAuScroll() {
  const elementsToShow = document.querySelectorAll(
    "h1, h2, h3, p, blockquote, .fiche-scientifique"
  );

  // IntersectionObserver observe les elements sans ecouter chaque pixel de
  // scroll. C'est plus propre et plus performant qu'un gros evenement scroll.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.1 }
  );

  elementsToShow.forEach((element) => {
    observer.observe(element);
  });
}

// ============================================================================
// Interviews : ouverture et fermeture des presentations
// ============================================================================
let dernierBoutonInterviewClique = null;

function initialiserInterviews() {
  masquerInterviewsAuChargement();
  initialiserBoutonsInterview();
  initialiserBoutonsFermerInterview();
}

function masquerInterviewsAuChargement() {
  const interviewContents = document.querySelectorAll(".contenu-interview");

  interviewContents.forEach((content) => {
    // On coupe temporairement la transition pour eviter une animation au chargement.
    content.style.transition = "none";
    content.classList.remove("visible");

    requestAnimationFrame(() => {
      content.style.transition = "";
    });
  });
}

function initialiserBoutonsInterview() {
  const interviewButtons = document.querySelectorAll(".toggle-interview, .btn-interview");

  interviewButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const content = button.nextElementSibling;

      // Si le HTML change et qu'il n'y a pas de bloc apres le bouton, on sort
      // simplement au lieu de provoquer une erreur JavaScript.
      if (!content) {
        return;
      }

      const isVisible = content.classList.contains("visible");

      if (!isVisible) {
        dernierBoutonInterviewClique = button;
      }

      content.classList.toggle("visible");
      mettreAJourTexteBoutonInterview(button, content);
    });
  });
}

function mettreAJourTexteBoutonInterview(button, content) {
  button.textContent = content.classList.contains("visible")
    ? "Masquer la présentation"
    : "Voir la présentation";
}

function initialiserBoutonsFermerInterview() {
  const closeButtons = document.querySelectorAll(".fermer-interview");

  closeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const parentInterview = button.closest(".contenu-interview");

      if (!parentInterview) {
        return;
      }

      parentInterview.classList.remove("visible");
      mettreAJourBoutonApresFermetureInterview(parentInterview);
      button.classList.add("hidden");
      revenirAuDernierBoutonInterview();
    });
  });
}

function mettreAJourBoutonApresFermetureInterview(parentInterview) {
  const toggleButton = parentInterview.previousElementSibling;

  if (toggleButton && toggleButton.classList.contains("toggle-interview")) {
    toggleButton.textContent = "Voir la présentation";
  }
}

function revenirAuDernierBoutonInterview() {
  if (!dernierBoutonInterviewClique) {
    return;
  }

  setTimeout(() => {
    dernierBoutonInterviewClique.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 300);
}

// ============================================================================
// Photos cliquables : ouvrir l'interview puis aller au bon paragraphe
// ============================================================================
function initialiserAncresPhotos() {
  const photoLinks = document.querySelectorAll(".ancre-photo");

  photoLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const targetId = link.getAttribute("href").replace("#", "");
      const scientificCard = link.closest(".fiche-scientifique");

      if (!scientificCard) {
        return;
      }

      ouvrirInterviewDepuisPhoto(scientificCard);
      scrollerVersElementApresOuverture(targetId);
    });
  });
}

function ouvrirInterviewDepuisPhoto(scientificCard) {
  const interviewContainer = scientificCard.querySelector(".contenu-interview");
  const toggleButton = scientificCard.querySelector(".toggle-interview");

  if (!interviewContainer) {
    return;
  }

  if (!interviewContainer.classList.contains("visible")) {
    interviewContainer.classList.add("visible");
  }

  if (toggleButton) {
    toggleButton.textContent = "Masquer la présentation";
  }
}

function scrollerVersElementApresOuverture(targetId) {
  // Le delai laisse le temps a l'interview de s'ouvrir avant de calculer le scroll.
  setTimeout(() => {
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 300);
}

// ============================================================================
// Effet parallax
// ============================================================================
function initialiserParallax() {
  const section = document.querySelector(".parallax-scroll");

  if (!section) {
    return;
  }

  window.addEventListener("scroll", () => {
    mettreAJourPositionParallax(section);
  });
}

function mettreAJourPositionParallax(section) {
  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const sectionIsVisible = rect.top < windowHeight && rect.bottom > 0;

  if (!sectionIsVisible) {
    return;
  }

  const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
  const positionY = Math.min(100, Math.max(0, scrollPercent * 100));

  section.style.backgroundPosition = `center ${positionY}%`;
}

// ============================================================================
// Lightbox : agrandir les images et naviguer entre elles
// ============================================================================
function initialiserLightbox() {
  const lightbox = document.getElementById("lightbox-overlay");
  const lightboxImage = document.getElementById("lightbox-image");

  if (!lightbox || !lightboxImage) {
    return;
  }

  const lightboxState = {
    images: recupererImagesLightbox(),
    currentIndex: -1,
  };

  initialiserOuvertureLightbox(lightbox, lightboxImage, lightboxState);
  initialiserFermetureLightbox(lightbox, lightboxImage);
  initialiserNavigationLightbox(lightboxImage, lightboxState);
}

function recupererConteneursPhotosLightbox() {
  return document.querySelectorAll(
    ".lien-conteneur-photo, .masonry-grid .item, .galerie-personnel img, .galerie-personnel-speciale img, .ligne-verticales img, .grille-photos-interview .item-svt"
  );
}

function recupererImagesLightbox() {
  return Array.from(
    document.querySelectorAll(
      ".lien-conteneur-photo img, .masonry-grid .item img, .galerie-personnel img, .galerie-personnel-speciale img, .ligne-verticales img, .grille-photos-interview img"
    )
  );
}

function initialiserOuvertureLightbox(lightbox, lightboxImage, lightboxState) {
  const photoContainers = recupererConteneursPhotosLightbox();

  photoContainers.forEach((container) => {
    container.addEventListener("click", () => {
      const clickedImage = trouverImageDansConteneur(container);

      if (!clickedImage) {
        return;
      }

      lightboxState.currentIndex = lightboxState.images.findIndex((image) => {
        return image.src === clickedImage.src;
      });

      lightboxImage.src = clickedImage.src;
      lightbox.classList.add("show");
    });
  });
}

function trouverImageDansConteneur(container) {
  // Certains selecteurs ciblent directement une image, d'autres ciblent un bloc
  // qui contient une image. Cette fonction gere les deux cas.
  if (container.tagName === "IMG") {
    return container;
  }

  return container.querySelector("img");
}

function initialiserFermetureLightbox(lightbox, lightboxImage) {
  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("show");
    lightboxImage.src = "";
  });
}

function initialiserNavigationLightbox(lightboxImage, lightboxState) {
  const previousButton = document.getElementById("lightbox-prev");
  const nextButton = document.getElementById("lightbox-next");

  if (previousButton) {
    previousButton.addEventListener("click", (event) => {
      event.stopPropagation();
      afficherImageLightbox(lightboxImage, lightboxState, lightboxState.currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", (event) => {
      event.stopPropagation();
      afficherImageLightbox(lightboxImage, lightboxState, lightboxState.currentIndex + 1);
    });
  }
}

function afficherImageLightbox(lightboxImage, lightboxState, index) {
  const indexExiste = index >= 0 && index < lightboxState.images.length;

  if (!indexExiste) {
    return;
  }

  lightboxImage.src = lightboxState.images[index].src;
  lightboxState.currentIndex = index;
}

// ============================================================================
// Menu d'ancrage sticky
// ============================================================================
function initialiserMenuAncrageSticky() {
  const anchorMenu = document.querySelector(".bloc-menu-ancrage");

  if (!anchorMenu) {
    return;
  }

  initialiserPositionSticky(anchorMenu);
  initialiserScrollDesLiensAncrage(anchorMenu);
}

function initialiserPositionSticky(anchorMenu) {
  const initialOffsetTop = anchorMenu.offsetTop;

  window.addEventListener("scroll", () => {
    if (window.scrollY >= initialOffsetTop) {
      anchorMenu.classList.add("fixed");
    } else {
      anchorMenu.classList.remove("fixed");
    }
  });
}

function initialiserScrollDesLiensAncrage(anchorMenu) {
  const anchorLinks = anchorMenu.querySelectorAll("a[href^='#']");

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        scrollerVersAncreAvecDecalage(target, anchorMenu);
      }
    });
  });
}

function scrollerVersAncreAvecDecalage(target, anchorMenu) {
  // Le decalage evite que le titre cible soit cache sous le menu sticky.
  const offset = anchorMenu.classList.contains("fixed") ? 88 : 146;
  const bodyTop = document.body.getBoundingClientRect().top;
  const elementTop = target.getBoundingClientRect().top;
  const scrollTo = elementTop - bodyTop - offset;

  window.scrollTo({
    top: scrollTo,
    behavior: "smooth",
  });
}
