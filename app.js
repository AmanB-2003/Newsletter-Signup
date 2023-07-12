const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const http = require("https");       //in built module

const app = express();

app.use(express.static("public"));     //express module for static files (should be in public folder)
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function (req, res) {
    const username = req.body.username;
    const email = req.body.email;

    const data = {
        members:[
            {   email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: username,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);          //To convert to JSON format

    const url = "https://us14.api.mailchimp.com/3.0/lists/af261da0dc";

    const options = {
       method : "POST" ,    //post data to external server
       auth : "Ax0ra:bcece0b40a72c53050133ce1cfad0109-us14"
    }

    const request = http.request(url, options, function (response) {        //HTTP Request to post data to an external resource

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

       response.on("data",function (data) {     //response for our sent request
           console.log(JSON.parse(data));
       })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");               //Redirect to Home & Refresh
});

app.listen(process.env.PORT || 3000 , function(){       //to listen on any port on HEROKU
    console.log("Server is running on port 3000...")
});

//API Key
//bcece0b40a72c53050133ce1cfad0109-us14
//audience[list] ID   af261da0dc