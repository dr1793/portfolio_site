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
const lostWBs = document.getElementById("lostWorkbooks");
var testflag = 0;
var vizlistb = [];

async function runTests(url) {
  //Running the demo if the user doesn't enter anything
  var urllist =
    url[0].length == 0 && url[1].length == 0
      ? [
          [
            "https://public.tableau.com/views/SuperstorePROD_Test/Customers",
            "v2",
          ],
          [
            "https://public.tableau.com/views/SuperstoreQA_Test/Customers",
            "v1",
          ],
        ]
      : [
          [url[1], "v2"],
          [url[0], "v1"],
        ];

  //clearing any visualizations/error messages from last time the script was ran
  lostWBs.classList.add("is-hidden");
  if (vizlistb) {
    for (var viz of vizlistb) {
      viz.dispose();
    }
  }

  buttonNode.classList.add("is-loading");

  let vizlist;
  try {
    vizlist = await Promise.all(
      urllist.map(async (url_div) => {
        return await initialize_function(url_div[0], url_div[1]);
      })
    );
  } catch (err) {
    lostWBs.classList.remove("is-hidden");
    buttonNode.classList.remove("is-loading");
    throw err;
  }

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
  buttonNode.classList.remove("is-loading");
  console.log("Test Complete");

  return vizlist;
}

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
