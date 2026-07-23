import e from "express";

const app = e();

app.get("/", (req, resp)=>{
    resp.send({
        message:"Basic api",
        success:true
    })
})

app.listen(3000);