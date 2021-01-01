async function submitMessageAbout() {
  //setting the submit button to load
  const button = document.getElementById("submitButton");
  button.classList.add("is-loading");
  var submission = {};
  submission.Name = document
    .getElementById("Name")
    .value.replace(/[\r\n]+/gm, "");
  submission.Email = document
    .getElementById("Email")
    .value.replace(/[\r\n]+/gm, "");
  submission.Subject = document
    .getElementById("Subject")
    .value.replace(/[\r\n]+/gm, "");
  submission.Message = document.getElementById("Message").value;

  //Removing any previous errors
  for (arg in submission) {
    document.getElementById(arg).classList.remove("is-danger");
  }
  document.getElementById("submissionErrorMessage").innerHTML = "";

  //Running the validation methods
  await validation(submission, button);

  //Send the data to the API
  await sendToAPI();
  //Button success
  button.classList.remove("is-loading");
  button.classList.add("is-success");
  button.innerHTML = "Message Received";
  button.setAttribute("disabled", "");

  //Sending the success message
  document
    .getElementById("submissionErrorMessage")
    .classList.remove("has-text-danger");
  document
    .getElementById("submissionErrorMessage")
    .classList.add("has-text-success");
  document.getElementById("submissionErrorMessage").innerHTML =
    "Thanks for reaching out. I'll get back to you as soon as possible.";
}

async function validation(submission, button) {
  //first check that the user entered anything
  for (arg in submission) {
    if (!submission[arg]) {
      setdanger(arg, button);
      if (arg == "Subject") {
        pushErrorMessagetoUser(
          `Please enter the ${arg.toLowerCase()} of your message.`
        );
      } else {
        pushErrorMessagetoUser(`Please enter your ${arg.toLowerCase()}`);
      }
      throw new Error(`User did not enter a ${arg}`);
    }
  }

  //then check if the user entered a valid email
  validateEmail(submission.Email, button);

  //Check that none of the fields are too long
  if (submission.Name.length > 50) {
    setdanger("Name", button);
    pushErrorMessagetoUser(
      "Error processing information in the name field. Please shorten it and try again."
    );
    throw new Error("Name too long.");
  }
  if (submission.Email.length > 320) {
    setdanger("Email", button);
    pushErrorMessagetoUser(
      "Error processing information in the email field. Please shorten it and try again."
    );
    throw new Error("Email too long ");
  }
  if (submission.Subject.length > 200) {
    setdanger("Subject", button);
    pushErrorMessagetoUser(
      "Error processing information in the subject field. Please shorten it and try again."
    );
    throw new Error("Email too long ");
  }
  if (submission.Message.length > 5000) {
    setdanger("Message", button);
    pushErrorMessagetoUser(
      "Error processing information in the message field. Please shorten it and try again."
    );
    throw new Error("Email too long ");
  }
}

async function sendToAPI() {
  return true;
}

function pushErrorMessagetoUser(message) {
  document.getElementById("submissionErrorMessage").innerHTML = message;
}

function setdanger(arg, button) {
  button.classList.remove("is-loading");
  document.getElementById(arg).classList.add("is-danger");
}

function validateEmail(email, button) {
  var emailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(emailformat)) {
    setdanger("Email", button);
    pushErrorMessagetoUser("Please enter a valid Email address.");
    throw new Error("Invalid Email");
  }
}
