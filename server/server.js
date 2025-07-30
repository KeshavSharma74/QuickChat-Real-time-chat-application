import express from "express"
// import http from "http"
import "dotenv/config"

const app=express();

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Server is listening at port :",port)
})

app.get('/api/status',(req,res)=>{
    return res.send("App is live");
} )

