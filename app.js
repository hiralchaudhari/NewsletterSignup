// Load different modules
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }

    ]
  };

  var jsonData = JSON.stringify(data);  //Set the body as a string
// Pass an object containing additional options
  var options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/", //url to hit
    method: "post",
    headers: {

      "Authorization": "" // API key
    },
    body: jsonData

  };

//Make a http post request to mailchimp website
  request(options, function(error, response, body) {
    // Check for error
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      // Check for right status code
      if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");

      } else {
        res.sendFile(__dirname + "/failure.html");
      }

    }
  })
});

app.post("/failure", function(req, res) {
  res.redirect("/");

});
app.listen(process.env.PORT || 3000, function() {
  console.log("Server runnig");
});
