var data_tabRows = [
  {
    header: "rere",
    contentflag: 1,
    //content: `${JSON.stringify(diffString(qa, prod))}`,
    content: "hi",
  },
];

export var workbookRows = new Vue({
  el: "#workbookRows",
  data: { tabRows: data_tabRows },
  mounted: function () {
    this.accordions = bulmaAccordion.attach();
  },
  methods: {
    pushTab(data) {
      if (
        !data_tabRows
          .map((data_tabRow) => data_tabRow.header)
          .includes(data.header)
      ) {
        this.tabRows.push(data);
      }
    },
    attachAccordions() {
      this.accordions = bulmaAccordion.attach();
    },
  },
});
