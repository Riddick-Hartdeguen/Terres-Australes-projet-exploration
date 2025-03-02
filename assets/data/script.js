document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
      threshold: 0.1 // Déclenche l'observation lorsque 10% de l'élément est visible
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show'); // Ajouter la classe 'show' pour déclencher l'animation
        } else {
          entry.target.classList.remove('show'); // Retirer la classe 'show' lorsque l'élément quitte la vue
        }
      });
    }, observerOptions);
  
    const elementsToAnimate = document.querySelectorAll('h1, h2, p, img');
    elementsToAnimate.forEach(element => {
      observer.observe(element);
    });
  });
  