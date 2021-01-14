import { sleep, initialize_function } from "./initialize.js";
import { diffString } from "./stringDiff.js";
import {
  Test_ValidateFilterDefaults,
  Test_ValidateTabs,
  Test_ValidateVisibleDataAsync,
} from "./test_defs.js";
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
    [
      "https://public.tableau.com/views/CustomerRanking_15970671380680/Dashboard",
      "v2",
    ],
    [
      "https://public.tableau.com/views/coronavirus_15853097409580/coronavirus-TV",
      "v1",
    ],
  ];

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

  if (testflag) {
    await Test_ValidateVisibleData(vizlistb[1], vizlistb[0]);
  } else {
    console.log("test 1");
    vizlistb = await runTests(inputValue);
    testflag = 1;
  }
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
