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

krab.addEventListener("mouseover", () => {
  krab.src = "images/krab-512.png";
});

krab.addEventListener("mouseout", () => {
  krab.src = "images/krab.png";
});
