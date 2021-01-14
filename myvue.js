import { cardInfo as cardsInfo } from "./data/cardInfo.js";

//add a function that filters cardsInfo.
//Tie it to some drop down menu.

var projectCards = new Vue({
  el: "#projectCards",
  data: {
    cardData: cardsInfo,
    filterSet: { Project: 1, Blog: 1 },
  },
  computed: {
    shownCards: function () {
      return this.cardData.filter((card) => {
        return this.filterSet[card.tagText];
      });
    },
  },
});

function filterCardsInfo(filter) {
  var color = filter == "Blog" ? "is-info" : "is-success";
  var filter_classlist = document.getElementById(`${filter}_button`).classList;

  if (filter_classlist.contains(color)) {
    filter_classlist.remove(color);
    filter == "Blog"
      ? (projectCards.filterSet.Blog = 0)
      : (projectCards.filterSet.Project = 0);
  } else {
    filter_classlist.add(color);
    filter == "Blog"
      ? (projectCards.filterSet.Blog = 1)
      : (projectCards.filterSet.Project = 1);
  }
}

document
  .getElementById("Blog_button")
  .addEventListener("click", () => filterCardsInfo("Blog"));
document
  .getElementById("Project_button")
  .addEventListener("click", () => filterCardsInfo("Project"));
