import db from "../models/index";
import {Op,Sequelize} from "sequelize";
//import followService from "./followService";
import LikepostService from "./likepostService";
import CommentService from "./commentService";
import UserService from "./userService";
////
let GetPostwithId = (Iduser,limit,offset) => {
    return new Promise(async (resolve, reject) => {
        try {
            let postData = {}
            let result = await db.Post.findAll({
                where: {
                    UserID:Iduser
                },
                include : [
                      { model: db.User,as: 'User',attributes: ['id','email','firstName','lastName','fullName','avatar']},
                      { model: db.Likepost,as: 'likes', attributes: ['UserID']},
                ],
                attributes: {
                    include: [
                        [Sequelize.literal(`(SELECT COUNT(*) FROM comments WHERE comments.postId = Post.id)`), 'commentCount']
                ]},
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: offset,
                raw: false
            })
            if(result.length > 0) {
                postData.errCode = 0;
                postData.errMessage = 'OK'
                postData.data = result;
            }else {
                postData.errCode = 1;
                postData.errMessage = "Cannot fount any post";
                postData.data = [];
            }
            //console.log(result[0])
            resolve(postData);
            // let result = await db.Post.findOne({
            //     attributes: ['id','UserID','content','createdAt','updatedAt','Namemusicvideo','MediaURL'],
            //     include: [
            //         {
            //             model: db.User,
            //             as: 'User',
            //             attributes: ['id','email','firstName','lastName','fullName','avatar']
            //         }
            //     ],
            //     where: {id:Idpost},
            //     raw: true
            // })
            // postData.errCode = 0;
            // if(result){
            //     let iduserlike = await LikepostService.GetAllIDuLikepost(result.id);
            //     let countlike = await LikepostService.GetAllLikepost(result.id);
            //     postData.errMessage = "OK"
            //     postData.data = {
            //             id: result.id,
            //             UserID: result.UserID,
            //             content: result.content,
            //             countlike: countlike,
            //             iduserlike:iduserlike,
            //             createdAt: result.createdAt,
            //             updatedAt: result.updatedAt,
            //             hashtabvideo: result.hashtabvideo,
            //             Namemusicvideo: result.Namemusicvideo,
            //             MediaURL: result.MediaURL,
            //             UserId: result['User.id'], // Đổi tên thành UserId
            //             UserEmail: result['User.email'], // Đổi tên thành UserEmail
            //             UserFirstName: result['User.firstName'], // Đổi tên thành UserFirstName
            //             UserLastName: result['User.lastName'], // Đổi tên thành UserLastName
            //             UserFullName: result['User.fullName'], // Đổi tên thành UserFullName
            //             UserAvatar: result['User.avatar'] // Đổi tên thành UserAvatar
            //     };
            // }else{
            //     postData.errMessage = "Cannot fount Post with the ID";
            //     postData.data = {}
            // }
            // resolve(postData);
        } catch (e) {
            reject(e);
        }
    });
}

let Getallpostofowner = (idUser) => {
    return new Promise(async(resolve,reject) => {
        try{
            let postDatauserId = {};
            let posts = await db.Post.findAll({
                where: {UserID:idUser},
                order: [['createdAt', 'DESC']],
                raw: true
            });
            if(posts.length > 0){
                let allposts = [];
                for(const post of posts){
                    let countlike = await LikepostService.GetAllLikepost(post.id);
                    let countcomment = await CommentService.GetCountcomment(post.id);
                    let newpost = {
                        id: post.id,
                        urlvideo: post.MediaURL,
                        namemusic:post.Namemusicvideo,
                        totallike: countlike,
                        totalcomment: countcomment,
                        datecreated: post.createdAt,
                        dateupdated: post.updatedAt,
                        description: post.Content
                    }
                    allposts.push(newpost);
                }
                postDatauserId.errCode = 0;
                postDatauserId.errMessage = 'OK';
                postDatauserId.data = allposts;
            }
            else{
                postDatauserId.errCode = 1;
                postDatauserId.errMessage = 'Cannot found any posts !!!'
                postDatauserId.data = {}
            } 
            resolve(postDatauserId);
        }catch(e){
            reject(e);
        }
    })
}
let Getpostofowner = (Iduser) => {
    return new Promise(async(resolve,reject) => {
        try {
            let postData = {};
            let result = await db.Post.findAll({
                where: {
                    UserID:Iduser
                },
                attributes: {
                    include: [
                        [Sequelize.literal(`(SELECT COUNT(*) FROM comments WHERE comments.postId = Post.id)`), 'commentCount'],
                        [Sequelize.literal(`(SELECT COUNT(*) FROM likespost WHERE likespost.PostId = Post.id)`), 'likeCount']
                    ]},
                raw: true
            });
            if(result.length > 0){
                let Post = [];
                for(let post of result){
                    let newpost = {
                        id: post.id,
                        urlvideo: post.MediaURL,
                        namemusic:post.Namemusicvideo,
                        totallike: post.likeCount,
                        totalcomment: post.commentCount,
                        datecreated: post.createdAt,
                        dateupdated: post.updatedAt,
                        description: post.Content
                    }
                    Post.push(newpost);
                }
             //  console.log(Post);
                postData.errCode = 0;
                postData.errMessage = "OK";
                postData.data = Post;
            }else {
                postData.errCode = 1;
                postData.errMessage = "Cannot found any post";
                postData.data = [];
            }
            resolve(postData);
        }
        catch(e){
            reject(e);
        }
    })
}
let GetAllPost = (userId,limit,offset) => {
    /* return new Promise(async(resolve,reject) => {
        try{
            if (isNaN(limit) || isNaN(offset)) {
                reject(new Error('Invalid limit or offset value'));
            }
            let postData = {};
            
            const subqueryResult = await db.Post.findAll({
                attributes: [
                    [Sequelize.fn('MAX', Sequelize.col('id')), 'id']
                ],
                group: ['UserID'],
                raw: true
            });

            // Trích xuất các ID từ kết quả của subquery
            const postIds = subqueryResult.map(row => row.id);
            
            // Truy vấn chính để lấy chi tiết của post mới nhất cho mỗi user
            let post = await db.Post.findAll({
                where: {
                    id: {
                        [Op.in]: postIds
                    }
                },
                include: [
                    { model: db.User,as: 'User', attributes: ['id', 'fullName', 'avatar','email'] },
                    { model: db.Likepost,as: 'likes', attributes: ['id', 'UserID'] },
                ],
                attributes: {
                    include: [
                        [Sequelize.literal(`(SELECT COUNT(*) FROM comments WHERE comments.postId = Post.id)`), 'commentCount']
                    ]
                },
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: offset,
                raw: false,
            });
            
            postData.errCode = 0;
            if(post.length > 0){
                let allpost = post.map(postofuser => ({
                    idpost: postofuser.id,
                    userID: postofuser.UserID,
                    content: postofuser.Content,
                    mediaURL: postofuser.MediaURL,
                    formatvideo: postofuser.Formatvideo,
                    hashtabvideo: postofuser.Hashtabvideo,
                    namemusicvideo: postofuser.Namemusicvideo,
                    islikepost: userId && postofuser.likes.length > 0 && postofuser.likes.find(like => parseInt(like.UserID) === parseInt(userId)) ? true : false,
                    countlike: postofuser.likes.length || 0,
                    countcomment: postofuser.commentCount || 0,
                    userinfo: {
                        id: postofuser.UserID,
                        fullName: postofuser.User.fullName || "",
                        avatar: postofuser.User.avatar || "",
                        email: postofuser.User.email ||  "",
                    }
                }));
                postData.errMessage = 'OK';
                postData.data = allpost;
            }
            else{
                postData.errMessage = "Cannot found post";
                postData.data = {};
            } 
            resolve(postData);
        }catch(e){
            reject(e);
        }
    }); */
    return new Promise(async (resolve, reject) => {
        try {
            if (isNaN(limit) || isNaN(offset)) {
                return reject(new Error('Invalid limit or offset value'));
            }

            const subqueryResult = await db.Post.findAll({
                attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']],
                group: ['UserID'],
                raw: true
            });

            const postIds = subqueryResult.map(row => row.id);
            if (postIds.length === 0) {
                return resolve({ errCode: 1, errMessage: "Cannot found post", data: [] });
            }

            const posts = await db.Post.findAll({
                where: { id: { [Op.in]: postIds } },
                include: [
                    { model: db.User, as: 'User', attributes: ['id', 'fullName', 'avatar', 'email'] },
                    { model: db.Likepost, as: 'likes', attributes: ['UserID'] },
                ],
                attributes: {
                    include: [
                        [Sequelize.literal(`(SELECT COUNT(*) FROM Comments WHERE Comments.PostID = Post.id)`), 'commentCount']
                    ]
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                raw: false
            });

            if (!posts.length) {
                return resolve({ errCode: 1, errMessage: "Cannot found post", data: [] });
            }

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: posts.map(post => ({
                    idpost: post.id,
                    userID: post.UserID,
                    content: post.Content,
                    mediaURL: post.MediaURL,
                    formatvideo: post.Formatvideo,
                    hashtabvideo: post.Hashtabvideo,
                    namemusicvideo: post.Namemusicvideo,
                    listlike: post.likes,
                    countlike: post.likes.length || 0,
                    countcomment: post.getDataValue('commentCount') || 0,
                    userinfo: {
                        id: post.UserID,
                        fullName: post.User?.fullName || "",
                        avatar: post.User?.avatar || "",
                        email: post.User?.email || ""
                    }
                }))
            });

        } catch (e) {
            reject(e);
        }
    });
}
let checkUserId = (idUser) => {
    return new Promise(async(resolve,reject) => {
        try{
            let user = await db.User.findOne({
                where: {id:idUser}
            })
            if(user) resolve(true);
            else {
                user = await db.Usergoogle.findOne({
                    where: {sub:idUser}
                });
                if(user) resolve(true);
                else resolve(false);
            }
        }catch(e){
            reject(e)
        }
    })
}
let CheckPost = (idpost) => {
    return new Promise(async(resolve,reject) => {
        try{
            let result = await db.Post.findOne({where :{id:idpost}});
            if(result){
                resolve(true);
            }else{ 
                resolve(false);
            }
        }catch(e){
            reject(e);
        }
    });
}



let Createpost = (iduser,description,path,namemusicvideo) => {
    return new Promise(async(resolve,reject) => {
        try {
            let postdata = {};
            let newpost = await db.Post.create({
                UserID: iduser,
                Content: description,
                MediaURL: path,
                Namemusicvideo: namemusicvideo
            })
            if(newpost) {
                postdata.errCode = 0;
                postdata.errMessage = "Create post success !!!";
                postdata.data = newpost;
            }else {
                postdata.errCode = 1;
                postdata.errMessage = "Create post faild, Please try again !!!";
                postdata.data = {};
            }
            resolve(postdata);
        }catch(e){
            reject(e);
        }
    })
}
let Updatepost = (idpost,namemusic,description) => {
    return new Promise(async(resolve,reject) => {
        try {
            let result = {};
            let post = await db.Post.findOne({
                where: {id:idpost}
            });
            if(post){
                const [updateRow] = await db.Post.update(
                    {
                        Content:description,
                        Namemusicvideo:namemusic
                    },
                    {
                        where:{id:idpost}
                    }
                )
                if(updateRow > 0){
                    result.errCode = 0;
                    result.errMessage = "post update success, Please check again !!!"
                }else {
                    result.errCode = 1;
                    result.errMessage = "post update failed, Please try again !!!"
                }
            }
            else {
                result.errCode = 2;
                result.errMessage = "Cannot find your post, Please try again !!!"
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}
let removepost = (idpost) => {
    return new Promise(async(resolve,reject) => {
        try {
            let result = {};
            let namefile = "";
            let post = await db.Post.findOne({
                where: {id:idpost}
            });
            if(post){
                namefile = post.MediaURL.split('/').pop();
                let Alllike = await db.Likepost.findAll({
                    where: {PostID: post.id},
                    raw: true
                })
                let Allcomment = await db.Comment.findAll({
                    where: {PostID: post.id},
                    raw: true
                });
                if(Alllike){
                    await db.Likepost.destroy({
                        where: { PostID: post.id }
                    });
                }
                if(Allcomment){
                    await db.Comment.destroy({
                        where: {PostID:post.id}
                    });
                }
                await db.Post.destroy({
                    where: {id: post.id}
                })
                result.errCode = 0;
                result.data = namefile
                result.errMessage = "All information about the post has been successfully deleted, please check the results again !!!"
            }else{
                result.errCode = 1;
                result.errMessage = "Cannot found The post is chosen by you"
            }
            resolve(result);
        } catch(err){
            reject(err);
        }
    })
}
module.exports = {
    GetAllPost : GetAllPost,
    GetpostwithId: GetPostwithId,
    GetAllpostofowner: Getallpostofowner,
    Getpostneccessary: Getpostofowner,
    Checkpost: CheckPost,
    Createnewpost: Createpost,
    RemovePost: removepost,
    Updatepostuser: Updatepost 
}