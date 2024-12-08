const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
    console.log(req.body);

    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;

    const data={
        members:[{
            email_address : email,
            status:"unsubscribed",
            merge_fields:{
                FNAME : fname,
                LNAME : lname
            }
        }]
    };

    const jsonData=JSON.stringify(data);

    const url="https://us12.api.mailchimp.com/3.0/lists/880d98e295";

    const options={
        method : "POST",
        auth:"Sainav:42c99530d3ed3b8d1dfc888f1dab38ad-us11"
    }

    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
            // res.send("Successfully subscribed");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
            // res.send("There was an error with signing up, please try again");
        }
        // response.on("data",function(data){
        //     console.log(JSON.parse(data));
        // })
    })

    request.write(jsonData);

    request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
})

//API key
// 42c99530d3ed3b8d1dfc888f1dab38ad-us12

//List ID
// 880d98e295