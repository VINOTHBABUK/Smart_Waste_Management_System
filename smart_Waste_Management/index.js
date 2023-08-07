const accountSid = "AC8ce96fce0e8e04e7a8eb80beb83cd004";
const authToken = "0894ca17b7b9318f4d8dc27770b8731e";
const client = require('twilio')(accountSid, authToken);
const http = require("http")

const url = require("url")


const server = http.createServer(async(req,res)=>{

    const urlStr = url.parse(req.url,true)
    
    const phone = '+'+urlStr.query.phone.trim()

    const msg = urlStr.query.message

    console.log(phone);

    const data = await client.messages
    .create({
        body: msg,
        from: '+14707458135',
        to: phone
    })

    console.log(data);
    console.log("Message sent successfully");
        
    res.end("Hello World")
})

server.listen(3000,"127.0.0.1",()=> console.log("Server is running"))

