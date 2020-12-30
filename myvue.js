import { cardInfo as cardsInfo } from "./data/cardInfo.js";

var projectCards = new Vue({
  el: "#projectCards",
  data: {
    cardData: cardsInfo,
  },
});
