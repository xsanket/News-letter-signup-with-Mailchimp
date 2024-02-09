const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    console.log(fname, lname, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/f20aeb18e5";

    const options = {
        method: "POST",
        auth: "sanket:03f98de4f998c76704c332aece866697-us21"
    };

    const request = https.request(url, options, function(response) {
        let responseData = '';

        response.on("data", function(chunk) {
            responseData += chunk;
        });

        response.on("end", function() {
            try {
                const responseDataJSON = JSON.parse(responseData);
                console.log(responseDataJSON);
                if (response.statusCode === 200) {
                    res.sendFile(__dirname + "/success.html");
                } else {
                    res.sendFile(__dirname + "/failure.html");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });

    request.write(jsonData);
    request.end();
});


app.post("/failure", function(req, res){
    res.redirect("/");
})
app.post("/success", function(req, res){
    res.redirect("/");
})



app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
