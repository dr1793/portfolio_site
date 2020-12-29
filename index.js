const body = document.querySelector("#body");

const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");
const caveBottom = document.querySelector("#cave2");

const home = document.querySelector("#home");
const home_section = document.querySelector("#home-section");
const resume = document.querySelector("#resume");
const resume_section = document.querySelector("#resume-section");
const about = document.querySelector("#about");
const about_section = document.querySelector("#about-section");

function toggleCave() {
  if (navbarMenu.classList.contains("is-active")) {
    caveBottom.style.display = "block";
  } else {
    caveBottom.style.display = "none";
  }
}

about.addEventListener("click", () => {
  home_section.classList.add("hidden");
  resume_section.classList.add("hidden");
  about_section.classList.remove("hidden");
});

resume.addEventListener("click", () => {
  home_section.classList.add("hidden");
  resume_section.classList.remove("hidden");
  about_section.classList.add("hidden");
});

home.addEventListener("click", () => {
  home_section.classList.remove("hidden");
  resume_section.classList.add("hidden");
  about_section.classList.add("hidden");
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
