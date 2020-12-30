import { cardInfo as cardsInfo } from "./data/cardInfo.js";

//add a function that filters cardsInfo.
//Tie it to some drop down menu.

var projectCards = new Vue({
  el: "#projectCards",
  data: {
    cardData: cardsInfo,
  },
});
