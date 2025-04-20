const express=require("express");
const cors = require('cors');
const app=express();
app.use(cors({
    // origin: 'http://127.0.0.1:5500' // or '*' to allow all origins (for dev)
    origin: '*' // or '*' to allow all origins (for dev)
  }));
const verify_routes=require('./routes/verify_routes.js')
app.use(express.json());
app.get("/test",(req,res)=>{
    return res.json({message:"hello from the server"});
});

app.use("/api",verify_routes);

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
