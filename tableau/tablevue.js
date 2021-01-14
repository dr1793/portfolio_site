var data_tabRows = [
  {
    header: "1st Tab",
    contentflag: 1,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque
                                            risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum
                                        rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis
                                            venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis
                                        lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor
                                        ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget,
                                        facilisis sodales sem. `,
  },
  {
    header: "2nd Tab",
    contentflag: 0,
    content: "",
  },
];

var workbookRows = new Vue({
  el: "#workbookRows",
  data: { tabRows: data_tabRows },
  mounted: function () {
    this.accordions = bulmaAccordion.attach();
  },
});
