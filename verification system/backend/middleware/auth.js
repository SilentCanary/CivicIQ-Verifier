const jwt=require('jsonwebtoken');
const SECRET_KEY="password";

function authenticate(req,res,next)
{
    const token=req.cookies?.auth_token;
    if(!token)
    {
        return res.status(401).json({error:"Unauthorized: No Token Provided"});
    }
    jwt.verify(token,SECRET_KEY,(err,decoded)=>{
        if(err)
        {
            return res.status(403).json({error:"Unauthorized:Invalid Token"});
        }
        req.user=decoded;
        next();
    });
}

module.exports=authenticate;