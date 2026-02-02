const jwt = require ('jsonwebtoken');
const dotenv = require ('dotenv');
dotenv.config();
const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token;
    const userId = req.body.id;
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,user) => {
        if(err){
            return res.status(404).json({
                status: "error",
                message:"the authentication",
            })
        }
        if(user?.id === userId){
            next();
        }else{
            return res.status(404).json({
                status: "error",
                message:"The authentication",
            });
        }
    })
}
/* const authMiddleWare = (req,res,next) => {
    const token = req.headers.token;
    jwt.verify(token, process.env.ACCESS_TOKEN,function(err,user){
        if(err){
            return res.status(404).json({
                status: "error",
                message: "the authentication",
            })
        }
        if(user?.isAdmin == "Admin"){
            next();
        }else {
            return res.status(404).json({
                status: "error",
                message: "The authentication",
            })
        }
    })
} */
module.exports = {
    authUserMiddleware,
   // authMiddleWare
}