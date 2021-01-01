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

window.onload = rememberPage(sessionStorage.getItem("current-page"));

function go_home() {
  home_section.classList.remove("hidden");
  sessionStorage.setItem("current-page", "home");
  home.classList.remove("has-text-link");
  resume_section.classList.add("hidden");
  resume.classList.add("has-text-link");
  about_section.classList.add("hidden");
  about.classList.add("has-text-link");
}

function go_resume() {
  home_section.classList.add("hidden");
  home.classList.add("has-text-link");
  resume_section.classList.remove("hidden");
  sessionStorage.setItem("current-page", "resume");
  resume.classList.remove("has-text-link");
  about_section.classList.add("hidden");
  about.classList.add("has-text-link");
}

function go_about() {
  home_section.classList.add("hidden");
  home.classList.add("has-text-link");
  resume_section.classList.add("hidden");
  resume.classList.add("has-text-link");
  about_section.classList.remove("hidden");
  sessionStorage.setItem("current-page", "about");
  about.classList.remove("has-text-link");
}

function rememberPage(page) {
  if (page == "home") {
    go_home();
  } else if (page == "resume") {
    go_resume();
  } else if (page == "about") {
    go_about();
  } else {
  }
}

about.addEventListener("click", () => {
  go_about();
  if (!about_section.classList.contains("hidden")) {
    navbarMenu.classList.toggle("is-active");
    burgerIcon.classList.toggle("is-active");
    toggleCave();
  }
});

resume.addEventListener("click", () => {
  go_resume();
  if (!resume_section.classList.contains("hidden")) {
    navbarMenu.classList.toggle("is-active");
    burgerIcon.classList.toggle("is-active");
    toggleCave();
  }
});

home.addEventListener("click", () => {
  go_home();
  if (!home_section.classList.contains("hidden")) {
    navbarMenu.classList.toggle("is-active");
    burgerIcon.classList.toggle("is-active");
    toggleCave();
  }
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

krab.addEventListener("click", () => {
  sessionStorage.getItem("current-page") == "home" ? go_about() : go_home();
  if (navbarMenu.classList.contains("is-active")) {
    navbarMenu.classList.remove("is-active");
    burgerIcon.classList.remove("is-active");
    toggleCave();
  }
});
