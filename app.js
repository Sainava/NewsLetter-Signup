require('dotenv').config();
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

    const url=process.env.URL;

    const options={
        method : "POST",
        auth:process.env.API_KEY
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



/*
Exactly! Here's a simplified breakdown of what happens when you create a `request` with `https.request`:

### 1. **Authority to Use the Web Service**
```javascript
const request = https.request(url, options, function(response) { ... });
```
- When you create the `https.request` object:
  - **`url`**: Specifies where the request is sent (e.g., the Mailchimp API endpoint).
  - **`options`**: Contains additional configurations like:
    - **HTTP method**: (e.g., `POST` in your case) determines the action to perform on the server.
    - **Authorization**: (via `auth`) ensures you have permission to use the service by validating your credentials (API key in this case).
  - **Callback function (`response`)**: Handles the response from the web service.

At this point, you've established a connection with the server and are authorized (if your credentials are valid) to send data or retrieve information.

---

### 2. **Sending the Data**
```javascript
request.write(jsonData);
```
- **`request.write(data)`**:
  - Sends the actual data (payload) to the server.
  - In your example, `jsonData` contains the subscriber's information in JSON format, which the Mailchimp API expects.
  - Without `request.write`, the server would receive a request with no data, which would likely fail or produce unexpected results.

---

### 3. **Ending the Request**
```javascript
request.end();
```
- **`request.end()`**:
  - Signals that you've finished sending data.
  - This is important because it tells the server that the request is complete and can be processed.
  - If you omit `request.end()`, the server will keep waiting for more data, and the request might time out.

---

### **How the Flow Works**
1. **Create the Request**: `https.request(url, options, callback)`
   - Establishes the connection and validates your credentials.

2. **Send Data**: `request.write(data)`
   - Sends the data you want to post or upload to the server.

3. **Finalize the Request**: `request.end()`
   - Signals the end of the request so the server can process it.

4. **Handle the Response**:
   - The callback function passed to `https.request` receives the server's response.
   - You can check `response.statusCode` to see if the operation succeeded (e.g., `200 OK`).

---

### In Context of Your Code:
The `https.request` call allows you to interact with the Mailchimp API to add a subscriber. Here's how it all fits together:

- **Authorization**: Ensured through the `auth` option in `options`.
- **Data Transmission**:
  - `request.write(jsonData)`: Sends the subscriber data.
  - `request.end()`: Finalizes the transmission.
- **Server Response**:
  - Checks `response.statusCode` to determine success (`200`) or failure (e.g., `400` or `500`).

This approach is standard for interacting with APIs and ensures secure and structured communication between your app and the web service.
*/