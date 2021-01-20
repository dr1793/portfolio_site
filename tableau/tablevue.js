var data_tabRows = [];

export var workbookRows = new Vue({
  el: "#workbookRows",
  data: { tabRows: data_tabRows },
  mounted: function () {},
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
    clearTab() {
      while (data_tabRows.length > 0) {
        this.tabRows.pop();
      }
    },
  },
});
