const express=require('express');
const { access } = require('fs');
const path=require('path');
const app=express();
const PORT=5001

app.use(express.json())
app.use(express.static('public'))


app.get('/digilocker/login',(req,res)=>{
    const redirect_url=req.query.redirect_uri;
    const auth_code='123456';
    res.redirect(`${redirect_url}?auth_code=${auth_code}`);
});

app.post('/digilocker/token',(req,res)=>{
    const {auth_token}=req.body;
    if(auth_token!='123456') return res.status(400).json({error:"invalid auth token"});
    res.json({
        access_token:`123456`,
        token_type:'Bearer',
        expires_in:3600
    });
});

app.get('/digilocker/profile',(req,res)=>{
    const auth=req.headers.authorization;
    if(auth!='Bearer 123456') return res.sendStatus(401)
    res.json({
        name: 'Advitiya Prakash',
        dob: '08-06-2005',
        gender: 'FEMALE',
        Address:"C/O D O Prem Prakash Srivastava, T4\n1106 Akash Residency, Kanth Road,\nBehind Madhubani Park, Near Madhubani\nPark, Moradabad, PO: Moradabad, Dist:\nMoradabad,\n\nUttar Pradesh, 244001",
        uid : 'XXXX-XXXX-5746'
});
});

app.get("/digilocker/documents/aadhar",(req,res)=>{
    const auth=req.headers.authorization;
    if(auth!== 'Bearer 123456') return res.sendStatus(401)
    const file_path=path.join(__dirname,'adharcard.pdf');
    const file_content=require('fs').readFileSync(file_path).toString('base64');
    res.json({
        filename:'adharcard.pdf',
        file_content
    });
});
app.listen(PORT,()=>{
    console.log(`Mock Digilocker running at http://localhost:${PORT}`);
});
