import { diffString } from "./stringDiff.js";
import { workbookRows } from "./tablevue.js";

export async function Test_DashboardObjects(qa_dashboard, prod_dashboard) {
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
      console.log(qa_objects[i]);
    }
  }
}

export async function Test_ValidateVisibleDataAsync(
  prod_viz,
  qa_viz,
  sheetlist = []
) {
  console.log(
    "Validating that the data is unchanged between sheets that should be the same in QA and in PROD."
  );
  var toBePublished =
    sheetlist.length == 0
      ? qa_viz.getWorkbook().getPublishedSheetsInfo()
      : sheetlist.slice(0);

  let firstSheet_qa = qa_viz.getWorkbook().getActiveSheet();
  let firstSheet_prod = prod_viz.getWorkbook().getActiveSheet();

  try {
    toBePublished[0].getParentDashboard();
  } catch {
    await prod_viz.revertAllAsync();
    await qa_viz.revertAllAsync();
  }
  for (const sheet of toBePublished) {
    try {
      var sheetName = sheet.getName();

      if (sheet.getSheetType() == "dashboard") {
        //Add the list of sheets in the dashboard to the list, after the dashboard list item
        //then skip processing the dashboard
        var dashboardName = sheet["$0"]["name"];

        await qa_viz.getWorkbook().activateSheetAsync(dashboardName);
        await prod_viz.getWorkbook().activateSheetAsync(dashboardName);

        let dashboard = qa_viz.getWorkbook().getActiveSheet();

        while (dashboard.getName() != dashboardName) {
          await qa_viz.getWorkbook().activateSheetAsync(dashboardName);
          await prod_viz.getWorkbook().activateSheetAsync(dashboardName);
          dashboard = qa_viz.getWorkbook().getActiveSheet();
        }
        await Test_DashboardObjects(
          dashboard,
          prod_viz.getWorkbook().getActiveSheet()
        );
        await Test_ValidateVisibleDataAsync(
          prod_viz,
          qa_viz,
          dashboard.getWorksheets()
        );
        continue;
      } else {
        await prod_viz.getWorkbook().activateSheetAsync(sheetName);
        await qa_viz.getWorkbook().activateSheetAsync(sheetName);
        var worksheet_prod = prod_viz.getWorkbook().getActiveSheet();
        var worksheet_qa = qa_viz.getWorkbook().getActiveSheet();
      }
      try {
        var data_prod = await worksheet_prod.getSummaryDataAsync();
        var data_qa = await worksheet_qa.getSummaryDataAsync();
      } catch {
        var data_prod = await sheet.getSummaryDataAsync();
        var data_qa = await sheet.getSummaryDataAsync();
      }

      if (JSON.stringify(data_prod) === JSON.stringify(data_qa)) {
        console.log(
          `Pass. Visible data on "${sheetName}" is the same between QA and PROD.`
        );
        workbookRows.pushTab({
          header: `${sheetName}`,
          contentflag: 0,
          content: "  ",
        });
        workbookRows.attachAccordions();
      } else {
        console.log(
          `Fail. Visible data on "${sheetName}" tab is not the same between QA and PROD.`
        );
        // TO-DO diff.
        var prod = JSON.stringify(data_prod);
        var qa = JSON.stringify(data_qa);
        console.log(
          "Scroll down the page to see the difference in data between QA and PROD."
        );
        document.getElementById("diffexplanation").innerHTML =
          "In red below is a comparison of the report data as JSON. \n\t Data that is the same between the two versions is plain.\n\t Data with a strikethrough is in PROD but not QA.\n\t Data that is underlined is in QA but not PROD.";

        workbookRows.pushTab({
          header: `${sheetName}`,
          contentflag: 1,
          //content: `${JSON.stringify(diffString(qa, prod))}`,
          content: "hi",
        });
        workbookRows.attachAccordions();

        console.log(
          `Fail. Visible data on "${sheetName}" tab is not the same between QA and PROD.`
        );
      }
    } catch (err) {
      if (err.tableauSoftwareErrorCode !== "sheetNotInWorkbook") {
        throw err;
      } else {
        //add the message to the document that the sheet wasn't found
        console.log("Sheet not found in Workbook");
        continue;
      }
    }
  }
  await qa_viz.getWorkbook().activateSheetAsync(firstSheet_qa);
  await prod_viz.getWorkbook().activateSheetAsync(firstSheet_prod);
}
