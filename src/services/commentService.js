import db from "../models/index";
import {Op,Sequelize, where} from "sequelize";
import postService from "./postService";
import userService from "./userService";
import usergoogleService from "./usergoogleService";
import moment from "moment";
let GetCountcomment = (idpost) => {
    return new Promise (async(resolve,reject) => {
        try {
            let countcomment = await db.Comment.count({
                where: {PostID:idpost}
            })
            if(countcomment > 0) resolve(countcomment);
            else resolve(0);
        } catch (error) {
            reject(error)
        }
    });
}
let GetAllDetailcomment = (idpost,limit,offset) => {
    return new Promise (async(resolve,reject) => {
        try {
            //let isExist = await Checkpost(idpost);
            let commentdata = {};
            let comment = await db.Comment.findAll({
                attributes: ['id','PostID','UserID','Content','createdAt','updatedAt'],
                include: [
                    {
                        model: db.User,
                        as: 'User',
                        attributes: ['id','email','firstName','lastName','fullName','avatar']
                    }
                ],
                where: {PostID:idpost},
                limit: limit,
                offset: offset,
                raw: false
            })
            if(comment.length > 0) {
                commentdata.errCode = 0;
                commentdata.errMessage = 'OK';
                commentdata.data = comment;
            }else {
                commentdata.errCode = 1;
                commentdata.errMessage = 'Not fount any comment';
                commentdata.data = [];
            }
            resolve(commentdata);
            // if(isExist){
            //     let resultquery = await db.Comment.findAll({
            //         attributes: ['id','PostID','UserID','Content','createdAt','updatedAt'],
            //         include: [
            //             {
            //                 model: db.User,
            //                 as: 'User',
            //                 attributes: ['id','email','firstName','lastName','fullName','avatar']
            //             }
            //         ],
            //         where: {PostID: idpost},
            //         raw: true
            //     });
            //     commentdata.errCode = 0;
            //    if(resultquery){
            //         commentdata.errMessage = "OK";
            //         commentdata.data = []
            //         resultquery.forEach((content) => {
            //            let itemdata = {
            //                 id: content.id,
            //                 idPost: content.PostID,
            //                 idUser: content.UserID,
            //                 Detailcomment: content.Content,
            //                 Email:content['User.email'],
            //                 FirstName: content['User.firstName'],
            //                 LastName: content['User.lastName'],
            //                 FullName: content['User.fullName'],
            //                 Avatar: content['User.avatar'],
            //                 CreatedAt:content.createdAt,
            //                 UpdatedAt: content.updatedAt
            //             };
            //             commentdata.data.push(itemdata);
            //         });
            //    }else{
            //         commentdata.errMessage = "Cannot found comment";
            //         commentdata.data = {}
            //    }
            // }else{
            //     commentdata.errCode = 1;
            //     commentdata.errMessage = 'Cannot found post';
            //     commentdata.data = {};
            // }
            // resolve(commentdata);
        } catch(e){
            reject(e)
        }
    })
}
let HandleAddCommentPost = (Checkpost,idpost,idUser,contentcomment) => {
    return new Promise (async(resolve,reject) => {
        try{
            let commentData = {};
            let isExist = await Checkpost(idpost);
            if(isExist){
                let newComment = await db.Comment.create({
                    PostID : idpost,
                    UserID : idUser,
                    Content : contentcomment,
                    Timestamp : moment().format('YYYY-MM-DD HH:mm:ss')
                });
                //Get Info comment of user
                 let user = await userService.handleUserGetByID(newComment.UserID);

               /* if(user.data == null){
                    user = await usergoogleService.handleGetUser(newComment.UserID);
                } */
                let countcomment = await GetCountcomment(idpost);
                let newcommentData = {
                    ...newComment.dataValues, // Spread existing properties of newComment
                    User: {
                        id: user.data.id,
                        email: user.data.email,
                        firstName: user.data.firstName,
                        lastName: user.data.lastName,
                        fullName: user.data.fullName,
                        avatar: user.data.avatar
                    }, // Add user data
                };
                // create data response
                commentData.errCode = 0;
                commentData.errMessage = 'OK';
                commentData.data = {newcommentData, countcomment};
            }
            else {
                commentData.errCode = 1;
                commentData.errMessage = 'Update comment fail Please retry';
            }
            resolve(commentData);
        }catch(e){
            reject(e);
        }
    });
}
let HandleRemoveComment = (idComment) => {
    return new Promise (async(resolve,reject) => {
        try{
            let idpost = await db.Comment.findOne({attributes: ['PostID'], where: {id: idComment}});
            let commentdata = {};
            let result = await db.Comment.destroy({
                where: {
                    id : idComment
                }
            });
            if (result > 0){
                commentdata.errCode = 0;
                commentdata.errMessage = 'OK';
                commentdata.data = await GetCountcomment(idpost.PostID);
            }else{
                commentdata.errCode = 1;
                commentdata.errMessage = "Cannot delete comment Please retry";
                commentdata.data = await GetCountcomment(idpost.PostID);
            }
            resolve(commentdata);
        }catch(e){
            reject(e);
        }
    })
}
let HandleEditcomment = (idcomment,comment) => {
    return new Promise (async(resolve,reject) => {
        try{
            let commentData = {};
            let [rowUpdated,updatedcomment] = await db.Comment.update({Content:comment},{where: {id : idcomment}});
            if(rowUpdated){
                let commentjustedit = await db.Comment.findOne({where: {id : idcomment}});
                commentData.errCode = 0;
                commentData.errMessage = "Comment is updated success !!!";
                commentData.data = commentjustedit;
            }else{
                commentData.errCode = 1;
                commentData.errMessage = "Comment is updated fail, please try again";
                commentData.data = {};
            }
            resolve(commentData);
        }catch(e){
            reject(e);
        }
    })
}
module.exports = {
    GetCountcomment : GetCountcomment,
    HandleAddCommentPost : HandleAddCommentPost,
    HandleRemoveComment : HandleRemoveComment,
    HandleGetAllDetailComment : GetAllDetailcomment,
    Handleeditcomment: HandleEditcomment
}