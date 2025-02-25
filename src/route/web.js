import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import postController from "../controllers/postController";
import commentController from "../controllers/commentController";
import likeController from "../controllers/likeController";
import usergoogleController from "../controllers/usergoogleController";
import {upload} from '../server';
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/',homeController.getHomePage);
    router.post('/api/login',userController.handleLogin);
    router.post('/api/register',userController.handleRegister);
    router.post('/api/logingoogle',usergoogleController.logingoogle);
    router.post('/api/choosepass',userController.handleChoosepass);
    router.post('/api/getPost',postController.GetAllPost);
    router.post('/api/getallpostwithowner',postController.GetAllPostswithOwner);
    router.post('/api/getallpostnecessary',postController.GetPostandinfonecessary);
    router.post('/api/createpost',upload.single('file'),postController.Createnewpost);
    router.post('/api/updatepost',postController.HandleUpdatepost);
    router.post('/api/removepost',postController.HandleRemovepost);
    router.post('/api/Profileuser',userController.handleGetProfile);
    router.post('/api/updateprofile',userController.handleUpprofile);
    router.post('/api/getDetailcomment',commentController.GetAlldetailComment);
    router.post('/api/createcomment',commentController.PushCommentpost);
    router.post('/api/removecomment',commentController.RemoveCommentpost);
    router.post('/api/createLikepost',likeController.AddLikepost);
    router.post('/api/checklikepost',likeController.CheckLikepostUser); 
    router.post('/api/removelikepost',likeController.RemoveLikepost);
    router.post('/api/editcomment',commentController.EditCommentpost); 
    router.post('/api/createcodeauthenemail',userController.handleSendEmail);
    router.get('/crud',homeController.getCRUD);
    return app.use("/",router);
}

module.exports = initWebRoutes;

