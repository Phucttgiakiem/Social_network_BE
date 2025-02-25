import { where } from "sequelize";
import db from "../models/index";

let GetAllLikepost = (idPost) => {
    return new Promise (async(resolve,reject) => {
        try {
            let alllike = await db.Likepost.count({
                where: {PostID:idPost}
            });
            
            if(alllike && alllike > 0){
                resolve(alllike);
            }else {
                resolve(0);
            }
        } catch (error) {
            reject(error)
        }
    })
}

let AddLikepost = (idPost,idUser) => {
    
    return new Promise (async(resolve,reject) => {
        try{
            let likeData = {}
            let findUserLike = await CheckLikeofUser(idPost,idUser);
            
            if(!findUserLike.data){
                let createLikepost = await db.Likepost.create({
                    PostID: idPost,
                    UserID:idUser,
                });
                likeData.errCode = 0;
                likeData.errMessage = "OK"; 
                likeData.data = {
                    id: idPost,
                    countlike : await GetAllLikepost(idPost)
                };
            }else {
                likeData.errCode = 1;
                likeData.errMessage = "You have like post!";
                likeData.data = {
                    id: idPost,
                    countlike : await GetAllLikepost(idPost)
                };
            }
            resolve(likeData);
        }catch(e){
            reject(e)
        }
    })
}
let RemoveLikepost = (idPost,idUser) => {
    return new Promise (async(resolve,reject) => {
        try{
            let result = await db.Likepost.findOne({
                where:{
                    PostID:idPost,
                    UserID:idUser
                }
            });
            let LikepostData = {};
            if(result){
                let resultdestroy = await db.Likepost.destroy({
                    where: {
                        id : result.id
                    }
                });
                if(resultdestroy > 0){
                    LikepostData.errCode = 0;
                    LikepostData.errMessage = "OK";
                    LikepostData.data = {
                        id: idPost,
                        countlike : await GetAllLikepost(idPost)
                    };
                    
                }else{
                    LikepostData.errCode = 1;
                    LikepostData.errMessage = "Cannot Destroy Like of your";
                    LikepostData.data = {
                        id: idPost,
                        countlike : await GetAllLikepost(idPost)
                    };
                }
                
            }else{
                LikepostData.errCode = 2;
                LikepostData.errMessage = "Cannot found Like of your";
                LikepostData.data = "";
            }
            resolve(LikepostData);
        }catch(e){
            reject(e);
        }
    })
}
let GetAllIDuserlikepost = (idPost) => {
    return new Promise(async(resolve,reject) => {
        try {
            let result = await db.Likepost.findAll({
                attributes: ['UserID'],
                where: {PostID: idPost}
            })
            resolve(result);
        }catch(e){
            reject(e);
        }
    })
}
let CheckLikeofUser = (idPost,idUser) => {
    return new Promise (async(resolve,reject) => {
        try{
            let Likedata = {}
            let isExist = await db.Likepost.findOne({
                where: {
                    PostID:idPost,
                    UserID:idUser
                }
            })
            if(isExist){
                Likedata.errCode = 0;
                Likedata.errMessage = "OK";
                Likedata.data = true;
            }else{
                Likedata.errCode = 1;
                Likedata.errMessage = "Cannot found Like of user";
                Likedata.data = false;
            } 
            resolve(Likedata);
        }catch(e){
            reject(e);
        }
    });
}
module.exports = {
    GetAllLikepost:GetAllLikepost,
    RemoveLikepost:RemoveLikepost,
    AddLikepost:AddLikepost,
    CheckLikeofUser:CheckLikeofUser,
    GetAllIDuLikepost:GetAllIDuserlikepost
}