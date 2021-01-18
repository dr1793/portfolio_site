const cardmodal = document.getElementById("cardModal");
const modalBackground = document.querySelector(".modal-background");
const modalClose = document.querySelector("#modal-delete");

modalClose.addEventListener("click", () => {
  toggleModal();
});

modalBackground.addEventListener("click", () => {
  toggleModal();
});

function toggleModal() {
  cardmodal.classList.contains("is-active")
    ? cardmodal.classList.remove("is-active")
    : cardmodal.classList.add("is-active");
}

function populateModal(modaldata) {
  console.log(modaldata);
  toggleModal();
}
