export function diffStringWrapper(string) {
  var indicies = [];
  var output = "";
  var i = 0;
  var windowSize = 1500;
  var count = 1;
  while (i < string.length - 5) {
    if (
      string.slice(i, i + 5) === "<del " ||
      string.slice(i, i + 5) === "<ins "
    ) {
      var backNo = i - 20 < 0 ? 0 : i - 20;
      var frontNo =
        i + windowSize > string.length ? string.length : i + windowSize;
      var returnString = string.slice(backNo, frontNo);

      var j = 0;
      var openHTML = [];
      var openHTMLKeys = {
        d: "</del>",
        i: "</ins>",
      };

      while (j < returnString.length - 4) {
        if (returnString.slice(j, j + 4) === "<del") {
          openHTML.push("d");
        } else if (returnString.slice(j, j + 4) === "<ins") openHTML.push("i");
        else if (returnString.slice(j, j + 6) === "</del>") {
          openHTML.pop();
        } else if (returnString.slice(j, j + 6) === "</ins>") {
          openHTML.pop();
        }
        j++;
      }

      while (openHTML.length > 0) {
        returnString = returnString.concat(openHTMLKeys[openHTML.pop()]);
      }

      output = output.concat(count, ")  ... ", returnString, "...<br><br>");
      count++;
      if (count > 30) {
        output = output.concat(
          "<strong>More differences were found, but the maximum allowed on this page is 30.</strong>"
        );
        break;
      }
      i = i + windowSize;
    } else {
      i++;
    }
  }
  return output;
}

//console.log(
//  diffStringWrapper(
//    "<del style='background: #ebffe0'>fkdiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijeifajwoeifjwaofjeifoweifjwi</del> <del style='background: #ebffe0'>fkd</del><ins> fdkjskeiinnkjfdkwjlkeeenfkwenlqkwnfqll"
//  )
//);
