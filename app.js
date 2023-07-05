// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/",function(req,res){
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email

  var data = {
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);
  const url = 'https://us13.api.mailchimp.com/3.0/lists/59822c7639';

  const options={
    method:"POST",
  };

  const request = https.request(url,options,function(response){
    response.on("data",function(data){
      sub_data = JSON.parse(data)
      if(response.statusCode !== 200){
        res.sendFile(__dirname+"/failure.html")
      }else{
        res.sendFile(__dirname+"/success.html")
      }
    });
  });

  request.write(jsonData);
  request.end();


});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000 ,function(){
  console.log("Server is running on port 3000");
});

//API kry = afe12e8f0e9b24fa62d1a1dbf24e9ac8-us13
// Audience id = 0487a3efc3
