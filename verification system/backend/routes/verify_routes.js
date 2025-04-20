const express=require("express");
const multer=require("multer");
const axios=require("axios")
const path=require("path")
const fs = require("fs");
const router=express.Router();
let digilockerJsonPath = null;

const storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,"uploads/");
  },
  filename : function(req,file,cb){
    cb(null,file.originalname);
  }
})

const upload=multer({storage : storage});
router.post("/verify",upload.fields([
  {name:"front_img",maxCount:1},
  {name:"back_img",maxCount:1},
]),async(req,res)=>{
  try
  {
    console.log("Heloooo !!!!");
    const auth_code = req.body.auth_code || "123456"; // can pass or hardcode for now

    const callbackRes = await axios.get("http://localhost:3000/api/digilocker/callback", {
      params: { auth_code }
    });

    const json_path = callbackRes.data.json_path;

    if (!fs.existsSync(json_path)) {
      return res.status(400).json({ error: "DigiLocker data not saved" });
    }
    const doc_file=req.files.front_img[0];
    console.log("DOC FILE : ",doc_file);
    const img_file=req.files.back_img[0];
    const paths={
      front_img_path:path.resolve("uploads/"+doc_file.originalname),
      back_img_path:path.resolve("uploads/"+img_file.originalname),
    digilocker_path:digilockerJsonPath
    };
    console.log(paths.front_img_path);
    console.log(paths.back_img_path);
    const response=await axios.post("http://0.0.0.0:5000/verify_document",paths);
    res.json(response.data);
  }
  catch(err)
  {
    console.error("error frowarding request to python . ",err.message);
    if(err.response)
    {
      return res.status(err.response.status).json(err.response.data);
    }
    res.status(500).json({error:"internal server error"});
  }
});

router.get('/digilocker/callback',async(req,res)=>{
  const {auth_code}=req.query;
  try{
    const token_res=await axios.post('http://localhost:5001/digilocker/token',{auth_token:auth_code});
    const access_token=token_res.data.access_token;
    const profile_res=await axios.get('http://localhost:5001/digilocker/profile',{
      headers:{Authorization:`Bearer ${access_token}`}
    });
    const doc_res=await axios.get('http://localhost:5001/digilocker/documents/aadhar',{
      headers:{Authorization:`Bearer ${access_token}`}
    });
    const jsonPath = path.resolve("uploads", "digilocker_data.json");
    fs.writeFileSync(jsonPath, JSON.stringify(profile_res.data, null, 2));
    digilockerJsonPath = jsonPath;
    res.json({ message: "DigiLocker data saved", json_path: jsonPath });

}
   catch(err)
  {
    console.error(err.message);
    res.status(500).json({error:"something crashed"});
  }
});

module.exports=router;