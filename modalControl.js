const cardmodal = document.getElementById("cardModal");
const modalButton = document.getElementById("modalButton");

modalButton.addEventListener("click", () => {
  console.log("hi");
  toggleModal();
});

function toggleModal() {
  cardmodal.classList.contains("is-active")
    ? card.classList.remove("is-active")
    : cardmodal.classList.add("is-active");
}
