const likeService = require ("../services/likepostService");
const { getIo } = require ('../socket');
let AddLikepost = async (req,res) => {
    let idUser = req.body.iduser;
    let idPost = req.body.idpost;
    if(!idUser || !idPost){
        return res.status(500).json({
            errCode : 4,
            message : "all inputs parameter is imperative!"
        });
    }
    let resultLike = await likeService.AddLikepost(idPost,idUser);
    try{
            if(resultLike.errCode === 0){
                const io = getIo();
                let newpost = resultLike.data;
                io.emit('add-like',newpost);
            } 
            return res.status(200).json({
                errCode:resultLike.errCode,
                message:resultLike.errMessage
            });
    } catch(err){
        return res.status(500).json({
            errCode: 1,
            message: "Internal server error"
        });
    }
}
let RemoveLikepost = async (req,res) => {
    let idUser = req.body.iduser;
    let idPost = req.body.idpost;
    if(!idUser || !idPost){
        return res.status(500).json({
            errCode : 4,
            message : "all inputs parameter is imperative!"
        });
    }
    let resultLike = await likeService.RemoveLikepost(idPost,idUser);
    try {
            if(resultLike.errCode === 0){
                const io = getIo();
                let newpost = resultLike.data;
                io.emit('remove-like',newpost);
            } 
            return res.status(200).json({
                errCode:resultLike.errCode,
                message:resultLike.errMessage,
            });
        
    }catch (err) {
        return res.status(500).json({
            errCode: 1,
            message: "Internal server error"
        });
    }
}
let CheckLikepostUser = async (req,res) => {
    let idUser = req.body.iduser;
    let idPost = req.body.idpost;
    if(!idUser || !idPost){
        return res.status(500).json({
            errCode : 4,
            message : "all inputs parameter is imperative!"
        });
    }
    let resultLike = await likeService.CheckLikeofUser(idPost,idUser);
    return res.status(200).json({
        errCode:resultLike.errCode,
        message:resultLike.errMessage,
        data: resultLike.data
    });
}
module.exports = {
    AddLikepost:AddLikepost,
    RemoveLikepost:RemoveLikepost,
    CheckLikepostUser:CheckLikepostUser
}