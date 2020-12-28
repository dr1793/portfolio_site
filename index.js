const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");

const home = document.querySelector("#home");
const home_section = document.querySelector("#home-section");
const resume = document.querySelector("#resume");
const about = document.querySelector("#about");

about.addEventListener("click", () => {
  home_section.classList.add("hidden");
});

resume.addEventListener("click", () => {
  home_section.classList.add("hidden");
});

home.addEventListener("click", () => {
  home_section.classList.remove("hidden");
});

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
  burgerIcon.classList.toggle("is-active");
});
