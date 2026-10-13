(() => {
  "use strict";

  /* ---------- Menú móvil ---------- */
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const menuIcon = menuBtn.querySelector("i");

  const setMenu = (open) => {
    navLinks.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menuIcon.className = open ? "ri-close-line" : "ri-menu-line";
  };

  menuBtn.addEventListener("click", () =>
    setMenu(!navLinks.classList.contains("open"))
  );

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Carrusel (reemplaza a Bootstrap) ---------- */
  const carousel = document.getElementById("carousel");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll(".carousel__slide")];
  const dotsBox = document.getElementById("carousel-dots");
  const INTERVAL = 4000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;
  let timer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir a la imagen ${i + 1}`);
    dot.addEventListener("click", () => { goTo(i); restart(); });
    dotsBox.appendChild(dot);
    return dot;
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, i) =>
      dot.setAttribute("aria-current", String(i === current))
    );
  }

  const start = () => {
    if (reduceMotion || timer) return;
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const restart = () => { stop(); start(); };

  carousel.querySelector(".carousel__btn--prev")
    .addEventListener("click", () => { goTo(current - 1); restart(); });
  carousel.querySelector(".carousel__btn--next")
    .addEventListener("click", () => { goTo(current + 1); restart(); });

  // Pausa al interactuar
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  // Solo avanza cuando el carrusel está en pantalla
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    .observe(carousel);

  goTo(0);
})();
