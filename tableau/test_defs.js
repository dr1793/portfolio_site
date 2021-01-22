import { workbookRows } from "./tablevue.js";
import { diffStringWrapper } from "./diffStringWrapper.js";

export async function Test_DashboardObjects(
  qa_dashboard,
  prod_dashboard,
  dashboardName
) {
  let qa_objects = qa_dashboard.getObjects();
  let prod_objects = prod_dashboard.getObjects();
  let objectsNotToTest = ["worksheet"];

  for (var i = 0; i < qa_objects.length; i++) {
    if (
      (JSON.stringify(prod_objects[i].getPosition()) !=
        JSON.stringify(qa_objects[i].getPosition()) ||
        JSON.stringify(prod_objects[i].getSize()) !=
          JSON.stringify(qa_objects[i].getSize())) &&
      !objectsNotToTest.includes(qa_objects[i].getObjectType())
    ) {
      console.log(
        `In PROD, the '${prod_dashboard.getName()}' Dashboard may not have the same 
				${qa_objects[i].getObjectType()} at ${JSON.stringify(
          qa_objects[i].getPosition()
        )}.`
      );
      workbookRows.pushTab({
        header: `In PROD, the '${prod_dashboard.getName()}' Dashboard may not have the same 
				${qa_objects[i].getObjectType()} at ${JSON.stringify(
          qa_objects[i].getPosition()
        )}`,
        contentflag: "has-background-warning",
        content: ``,
      });
      console.log(qa_objects[i]);
    }
  }
}
async function compareSummaryData(
  worksheet_prod,
  worksheet_qa,
  sheetName,
  parentName = ""
) {
  var data_prod = await worksheet_prod.getSummaryDataAsync();
  var data_qa = await worksheet_qa.getSummaryDataAsync();

  if (parentName) {
    parentName = parentName.concat(" - ");
  }

  if (JSON.stringify(data_prod) === JSON.stringify(data_qa)) {
    console.log(
      `Pass. Visible data on "${parentName}${sheetName}" is the same between QA and PROD.`
    );
    workbookRows.pushTab({
      header: `${parentName}${sheetName}`,
      contentflag: "has-background-success",
      content: "  ",
    });
  } else {
    console.log(
      `Fail. Visible data on "${parentName}${sheetName}" tab is not the same between QA and PROD.`
    );

    // TO-DO diff.
    var prod = JSON.stringify(data_prod);
    var qa = JSON.stringify(data_qa);
    //Check all the filter values and return the difference

    var dmp = new diff_match_patch();
    workbookRows.pushTab({
      header: `${parentName}${sheetName}`,
      contentflag: "has-background-danger",
      content: `${JSON.stringify(
        diffStringWrapper(dmp.diff_prettyHtml(dmp.diff_main(qa, prod)))
      )}`,
      //content: "hi",
    });
  }
}

export async function Test_ValidateVisibleDataAsync(prod_viz, qa_viz) {
  console.log(
    "Validating that the data is unchanged between sheets that should be the same in QA and in PROD."
  );
  document.getElementById("diffexplanation").classList.remove("is-hidden");
  document.getElementById("diffexplanation").innerHTML =
    "Worksheets/Tabs in green passed the comparison and are the same between QA and PROD; tabs in red did not. <br> You can expand the red tabs for a view of the data that is changed.";

  //getting the list of published sheets. If it's a dashboard, the sheets were passed as an argument of the function
  var toBePublished = qa_viz.getWorkbook().getPublishedSheetsInfo();
  var published = prod_viz
    .getWorkbook()
    .getPublishedSheetsInfo()
    .map((sheet) => sheet["$0"].name);

  toBePublished = toBePublished.filter((sheet) =>
    published.includes(sheet["$0"].name)
  );

  //Getting the original sheet to return to it
  let firstSheet_qa = qa_viz.getWorkbook().getActiveSheet();
  let firstSheet_prod = prod_viz.getWorkbook().getActiveSheet();

  workbookRows.clearTab();
  //Main loop for comparison
  for (const sheet of toBePublished) {
    var sheetName = sheet.getName();

    if (sheet.getSheetType() == "dashboard") {
      //Add the list of sheets in the dashboard to the list, after the dashboard list item
      //then skip processing the dashboard
      var dashboardName = sheet["$0"]["name"];

      try {
        await prod_viz.getWorkbook().activateSheetAsync(dashboardName);
        await qa_viz.getWorkbook().activateSheetAsync(dashboardName);
      } catch (err) {
        if (err["tableauSoftwareErrorCode"] == "sheetNotInWorkbook") {
          console.log(`Sheet ${dashboardName} is not in PROD workbook`);
          workbookRows.pushTab({
            header: `Sheet ${dashboardName} is not in PROD workbook`,
            contentflag: "has-background-danger",
            content: ``,
          });
          continue;
        } else {
          console.log(err);
          throw err;
        }
      }

      console.log(`Sheet: ${sheetName}`);
      var qa_dashboard = qa_viz.getWorkbook().getActiveSheet();
      var prod_dashboard = prod_viz.getWorkbook().getActiveSheet();

      await Test_DashboardObjects(qa_dashboard, prod_dashboard, dashboardName);

      for (var worksheet_qa of qa_dashboard.getWorksheets()) {
        try {
          var sheetName = worksheet_qa.getName();
          var worksheet_prod = prod_dashboard.getWorksheets().get(sheetName);
        } catch (err) {
          console.log(err);
          throw err;
        }
        await compareSummaryData(
          worksheet_prod,
          worksheet_qa,
          sheetName,
          dashboardName
        );
      }
    } else {
      try {
        await prod_viz.getWorkbook().activateSheetAsync(sheetName);
        await qa_viz.getWorkbook().activateSheetAsync(sheetName);
      } catch (err) {
        if (err["tableauSoftwareErrorCode"] == "sheetNotInWorkbook") {
          console.log(`Sheet ${sheetName} is not in PROD workbook`);
          workbookRows.pushTab({
            header: `Sheet ${sheetName} is not in PROD workbook`,
            contentflag: "has-background-danger",
            content: ``,
          });
          continue;
        } else {
          console.log(err);
          throw err;
        }
      }
      console.log(`Sheet: ${sheetName}`);
      var worksheet_prod = prod_viz.getWorkbook().getActiveSheet();
      var worksheet_qa = qa_viz.getWorkbook().getActiveSheet();
      await compareSummaryData(worksheet_prod, worksheet_qa, sheetName);
    }
  }
  await qa_viz.getWorkbook().activateSheetAsync(firstSheet_qa);
  await prod_viz.getWorkbook().activateSheetAsync(firstSheet_prod);
}
