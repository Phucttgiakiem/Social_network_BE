import { where } from "sequelize";
import db from "../models/index";

let GetAllFollowofUser = (IdUser) => {
    return new Promise(async(resolve,reject) => {
        try{
            let followData = {}
            let follow = await db.Follow.findAll({
                attributes: ['userID','userIDsub'],
                where: {userIDsub:IdUser},
                raw: true
            })
            followData.errCode = 0;
            followData.errMessage = 'OK';
            if(follow != {}){
                followData.data = follow;
            }
            else followData.data = {};
           
            resolve(followData);
        }catch(e){
            reject(e);
        }
    });
}
let GetFollowofUser = (IDUser,IDUserSub) => {
    return new Promise(async(resolve,reject) => {
        try{
            let followData = {};
            let result = await db.Follow.findOne({
                where: {
                    userIDsub:IDUserSub,
                    userID:IDUser
                },
                raw:true
            });
            if(result){
                followData.errCode = 0;
                followData.errMessage = "OK";
                followData.data = result;
            }else{
                followData.errCode = 1;
                followData.errMessage = "Cannot found your follow";
                followData.data = {};
            }
            resolve(followData);
        }catch(e){
            reject(e)
        }
    })
}
let GetTotalFollowPost = (IDUser) => {
    return new Promise(async(resolve,reject) => {
        try{
            let followData = {};
            let result = await db.Follow.count({
                where: {
                    userID: IDUser
                }
            });
            followData.errCode = 0;
            followData.errMessage = "OK";
            followData.data = result;
            resolve(followData);
        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    GetAllFollowofUser : GetAllFollowofUser,
    GetFollowofUser : GetFollowofUser,
    GetTotalFollowPost:GetTotalFollowPost
}