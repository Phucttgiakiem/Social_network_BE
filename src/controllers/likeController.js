import likeService from "../services/likepostService";
import PostService from "../services/postService";
import { io } from '../server';
let AddLikepost = async (req,res) => {
    let idUser = req.body.iduser;
    let idPost = req.body.idpost;
    if(!idUser || !idPost){
        return res.status(500).json({
            errCode : 4,
            message : "all inputs parameter is imperative!"
        });
    }
    try{
        let resultLike = await likeService.AddLikepost(idPost,idUser);
        if(resultLike.errCode === 0){
            try {
               // let replacepost = await PostService.GetAllPost();
                let newpost = resultLike
                io.emit('add-like',newpost);
            } catch (socketError) {
                    console.log('Socket error:', socketError);
                    return res.status(500).json({
                    errCode: 1,
                    message: "Socket error"
                    });
                }
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
   // console.log(idUser+" "+idPost+"unlike");
    if(!idUser || !idPost){
        return res.status(500).json({
            errCode : 4,
            message : "all inputs parameter is imperative!"
        });
    }
    let resultLike = await likeService.RemoveLikepost(idPost,idUser);
    if(resultLike.errCode === 0){
        try {
           // let replacepost = await PostService.GetAllPost();
            let newpost = resultLike
            io.emit('remove-like',newpost);
          } catch (socketError) {
            console.log('Socket error:', socketError);
            return res.status(500).json({
              errCode: 1,
              message: "Socket error"
            });
        }
    }
    return res.status(200).json({
        errCode:resultLike.errCode,
        message:resultLike.errMessage,
    });
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