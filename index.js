const body = document.querySelector("#body");
const krab = document.querySelector("#krab");
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");
const caveBottom = document.querySelector("#cave2");
const site_navbar = document.querySelector("#site-navbar");

const home = document.querySelector("#home");
const home_section = document.querySelector("#home-section");
const resume = document.querySelector("#resume");
const resume_section = document.querySelector("#resume-section");
const about = document.querySelector("#about");
const about_section = document.querySelector("#about-section");
const site_footer = document.querySelector("#site-footer");

function toggleCave() {
  if (navbarMenu.classList.contains("is-active")) {
    caveBottom.style.display = "block";
  } else {
    caveBottom.style.display = "none";
  }
}

about.addEventListener("click", () => {
  home_section.classList.add("hidden");
  home.classList.add("has-text-link");
  resume_section.classList.add("hidden");
  resume.classList.add("has-text-link");
  about_section.classList.remove("hidden");
  about.classList.remove("has-text-link");
  if (about_section.classList.contains("hidden")) {
    navbarMenu.classList.toggle("is-active");
    burgerIcon.classList.toggle("is-active");
    toggleCave();
  }
});

resume.addEventListener("click", () => {
  home_section.classList.add("hidden");
  home.classList.add("has-text-link");
  resume_section.classList.remove("hidden");
  resume.classList.remove("has-text-link");
  about_section.classList.add("hidden");
  about.classList.add("has-text-link");
  if (resume_section.classList.contains("hidden")) {
    navbarMenu.classList.toggle("is-active");
    burgerIcon.classList.toggle("is-active");
    toggleCave();
  }
});

home.addEventListener("click", () => {
  if (home_section.classList.contains("hidden")) {
    navbarMenu.classList.toggle("is-active");
    burgerIcon.classList.toggle("is-active");
    toggleCave();
  }
  home_section.classList.remove("hidden");
  home.classList.remove("has-text-link");
  resume_section.classList.add("hidden");
  resume.classList.add("has-text-link");
  about_section.classList.add("hidden");
  about.classList.add("has-text-link");
});

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
  burgerIcon.classList.toggle("is-active");
  toggleCave();
});

home_section.addEventListener("click", () => {
  navbarMenu.classList.remove("is-active");
  burgerIcon.classList.remove("is-active");
  toggleCave();
});

resume_section.addEventListener("click", () => {
  navbarMenu.classList.remove("is-active");
  burgerIcon.classList.remove("is-active");
  toggleCave();
});

about_section.addEventListener("click", () => {
  navbarMenu.classList.remove("is-active");
  burgerIcon.classList.remove("is-active");
  toggleCave();
});

site_footer.addEventListener("click", () => {
  navbarMenu.classList.remove("is-active");
  burgerIcon.classList.remove("is-active");
  toggleCave();
});

krab.addEventListener("mouseover", () => {
  krab.src = "images/krab-512.png";
});

krab.addEventListener("mouseout", () => {
  krab.src = "images/krab.png";
});
