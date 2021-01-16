import { sleep, initialize_function } from "./initialize.js";
import { diffString } from "./stringDiff.js";
import {
  Test_ValidateFilterDefaults,
  Test_ValidateTabs,
} from "./test_defs_inactive.js";
import { Test_ValidateVisibleDataAsync } from "./test_defs.js";

var diff = "";
const inputNode = document.getElementById("input");
const inputNode2 = document.getElementById("input2");
const buttonNode = document.getElementById("button");
const howToButtonNode = document.getElementById("howToButton");
const howToSection = document.getElementById("howToText");
var testflag = 0;
var vizlistb = [];

async function runTests(url) {
  var urllist = [
    ["https://public.tableau.com/views/SuperstorePROD_Test/Customers", "v2"],
    ["https://public.tableau.com/views/SuperstoreQA_Test/Customers", "v1"],
  ];

  if (vizlistb) {
    console.log(vizlistb);
    console.log("clearing vizzes");
    for (var viz of vizlistb) {
      viz.dispose();
    }
  }

  let vizlist = await Promise.all(
    urllist.map(async (url_div) => {
      return await initialize_function(url_div[0], url_div[1]);
    })
  );

  document.getElementById(
    "reportName"
  ).innerHTML += vizlist[1].getWorkbook().getName();
  document.getElementById(
    "reportName2"
  ).innerHTML += vizlist[0].getWorkbook().getName();

  console.log("Visualizations are fully loaded.");
  //await Test_ValidateFilterDefaults(vizlist[0])
  //await Test_ValidateTabs(vizlist[1])
  //console.log("Scroll down for CSV of Report Filters")
  console.log(
    "Validating that the data is unchanged between sheets that should be the same in QA and in PROD."
  );
  await Test_ValidateVisibleDataAsync(vizlist[1], vizlist[0]);
  console.log("Test Complete");

  return vizlist;
}

//TODO: If applicable, clear the current viz and run the new viz
buttonNode.addEventListener("click", async () => {
  const inputValue = [inputNode.value];
  inputValue.push(inputNode2.value);

  vizlistb = await runTests(inputValue);
});

howToButtonNode.addEventListener("click", () => {
  if (howToSection.classList.contains("is-hidden")) {
    howToSection.classList.remove("is-hidden");
    howToButtonNode.innerHTML = "Close";
  } else {
    howToSection.classList.add("is-hidden");
    howToButtonNode.innerHTML = "How-To";
  }
});

inputNode.addEventListener("input", () => {
  buttonNode.innerHTML = "Compare these Reports";
});
inputNode2.addEventListener("input", () => {
  buttonNode.innerHTML = "Compare these Reports";
});
