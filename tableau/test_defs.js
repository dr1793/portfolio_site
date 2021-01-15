//TODO: Choose sheets that shouldn't be the same to exclude on Dashboard
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

  try {
    toBePublished[0].getParentDashboard();
    console.log(toBePublished[0]);
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

        await Test_ValidateVisibleData(
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
          "The below is a comparison of the report data as JSON. \n\t Data that is the same between the two versions is plain.\n\t Data with a strikethrough is in PROD but not QA.\n\t Data that is underlined is in QA but not PROD.";
        document.getElementById("diff").innerHTML += `${sheetName}\n`;
        document.getElementById("diff").innerHTML += diffString(qa, prod);

        //throw new Error(`Fail. Visible data on "${sheet}" tab is not the same between QA and PROD.`)
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
}

export async function Test_ValidateTabs(viz) {
  //Finding the sheet that filters the Org Report Report by Organization
  var tabsinfo = viz.getWorkbook().getPublishedSheetsInfo();

  let toBePublished = [];

  let tabs = [];
  for (const tabinfo of tabsinfo) {
    tabs.push(tabinfo["$0"]["name"].trim());
  }

  if (JSON.stringify(toBePublished) === JSON.stringify(tabs)) {
    console.log("Pass. all expected tabs are published in the right order");
  } else {
    console.log("fail");
    for (var i = 0; i < tabs.length; i++) {
      //console.log(i)
      if (tabs[i] != toBePublished[i]) {
        console.log(
          `Tab published in position ${i} is "${tabs[i]}" but should be "${toBePublished[i]}"`
        );
        break;
        //throw new Error(`Tab published in position ${i} is "${tabs[i]}" but should be "${toBePublished[i]}"`)
      }
    }
  }
}

export async function Test_ValidateFilterDefaults(viz) {
  //Outputs the first line of the CSV withthe filter defaults.
  var csv_header = `Workbook_Name,Worksheet,Filter,Value,Selected_By_Default_Flag\n`;
  document.getElementById("diffexplanation").innerHTML += csv_header;

  await getParameterDefaultsFromWorkbook(viz);
  await getFilterDefaultsSheetOrDashboard(viz);
}

//TODO: Include the unselected values in this function, instead of with a new function
//TODO: Check that all the values are entered with the same formatting
async function getParameterDefaultsFromWorkbook(viz) {
  const workbook_name = viz.getWorkbook().getName();
  var parameters = await viz.getWorkbook().getParametersAsync();
  //console.log(parameters)
  for (const parameter of parameters) {
    var value =
      parameter["_impl"]["$c"]["formattedValue"] == null
        ? ""
        : parameter["_impl"]["$c"]["formattedValue"];
    document.getElementById(
      "diffexplanation"
    ).innerHTML += `${workbook_name},Parameter,${parameter["_impl"]["$h"]},${value},1\n`;
    addUnselectedValuesParameters(workbook_name, parameter);
  }
}

//Helper method to get a list of the names of all published sheets, given a viz object.
function getPublishedSheetsFromVizAsList(viz) {
  var sheetsobject = viz.getWorkbook().getPublishedSheetsInfo();
  var sheets_list = [];

  for (const object of sheetsobject) {
    sheets_list.push(object["$0"]["name"]);
  }
  return sheets_list;
}

//Applies getFilterDefaults() differently for sheets and dashboards.
async function getFilterDefaultsSheetOrDashboard(viz) {
  var output = "";

  //Gets the published sheets.
  const sheets = getPublishedSheetsFromVizAsList(viz);
  var workbook = viz.getWorkbook();

  for (const sheet of sheets) {
    await workbook.activateSheetAsync(sheet);
    const sheet_object = workbook.getActiveSheet();
    if (sheet_object.getSheetType() == "dashboard") {
      for (const worksheet of sheet_object.getWorksheets()) {
        var sheetname = `${sheet} - (${worksheet["_impl"]["$5"]})`;
        document.getElementById(
          "diffexplanation"
        ).innerHTML += await getFilterDefaults(viz, sheetname, worksheet);
      }
    } else {
      var worksheet = workbook.getActiveSheet();
      document.getElementById(
        "diffexplanation"
      ).innerHTML += await getFilterDefaults(viz, sheet, worksheet);
    }
    //throw new Error("test")
    console.log(`Finished "${sheet}"`);
  }
  console.log(`Finished "${workbook.getName()}"`);
  //document.getElementById('diffexplanation').innerHTML = output

  //return(output)
}

//Gets filter default values for each sheet of a report.
async function getFilterDefaults(viz, sheetname, worksheet) {
  var workbook = viz.getWorkbook();
  var workbook_name = workbook.getName();
  var filter_objects = await worksheet.getFiltersAsync();
  // console.log(filter_objects)
  var output = "";
  for (const [i, filter_object] of filter_objects.entries()) {
    var filter_values_object = filter_object["$9"];

    const filter_name = filter_object["$1"];
    // console.log(filter_name)
    if (
      ["Measure Names", "Measure Values"].indexOf(filter_name) >= 0 ||
      filter_name.startsWith("AGG") ||
      filter_name.startsWith("Action (")
    ) {
      console.log(`Skipping invalid filter: "${filter_name}"`);
      continue;
    }
    console.log(filter_name);
    if (filter_values_object != null) {
      var default_filter_values = Array.from(
        filter_values_object,
        ({ formattedValue }) => formattedValue
      );
    }

    if (filter_values_object == null) {
      output = output.concat(
        `${workbook_name},${sheetname},${filter_name},not applicable,1\n`
      );
    } else {
      await workbook.revertAllAsync();
      await worksheet.applyFilterAsync(
        filter_name,
        "",
        tableau.FilterUpdateType.ALL
      );
      var filter_objects_new = await worksheet.getFiltersAsync();
      var filter_object_new = filter_objects_new[i];
      var filter_values_object_new = filter_object_new["$9"];
      var all_filter_values = Array.from(
        filter_values_object_new,
        ({ formattedValue }) => formattedValue
      );
      if (
        JSON.stringify(filter_values_object) ==
        JSON.stringify(filter_values_object_new)
      ) {
        output = output.concat(
          `${workbook_name},${sheetname},${filter_name},all,1\n`
        );
      } else {
        for (const filter_value of all_filter_values) {
          console.log(filter_value, default_filter_values);
          if (default_filter_values.indexOf(filter_value) >= 0) {
            output = output.concat(
              `${workbook_name},${sheetname},${filter_name},${filter_value},1\n`
            );
          } else {
            output = output.concat(
              `${workbook_name},${sheetname},${filter_name},${filter_value},0\n`
            );
          }
        }
        //await addUnselectedValuesFilters(workbook_name, sheetname, filter_name, filter_values_object, filter_values_object_new)
      }
    }
  }

  return output;
}

//async function addUnselectedValuesFilters(workbook_name, sheetname, filter_name, filtervalues1, filtervalues2){
//	console.log(filtervalues1)
//	console.log(filtervalues2)
//}

//Can use getAllowableValues()
//Returns a list of unselected values to be added by getParameterDefaultsFromWorkbook()
async function addUnselectedValuesParameters(workbook_name, parameter) {
  var currentValue = parameter.getCurrentValue()["formattedValue"];
  var allowableValues = parameter.getAllowableValues();

  if (currentValue == null || !(Symbol.iterator in Object(allowableValues))) {
    //console.log("ignoring undefined")
    return;
  }

  for (const allowableValue of allowableValues) {
    if (allowableValue["formattedValue"] == currentValue) {
      continue;
    }
    document.getElementById(
      "diffexplanation"
    ).innerHTML += `${workbook_name},Parameter,${parameter["_impl"]["$h"]},${allowableValue["formattedValue"]},0\n`;
  }
}
