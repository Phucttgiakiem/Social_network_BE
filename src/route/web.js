const express =  require("express");
const homeController = require ("../controllers/homeController");
const userController = require("../controllers/userController");
const postController = require ("../controllers/postController");
const commentController = require ("../controllers/commentController");
const likeController = require ("../controllers/likeController");
const usergoogleController = require ("../controllers/usergoogleController");
const upload = require('../middleware/upload');
const {authUserMiddleware} = require ('../middleware/authMiddleware');
let router = express.Router();

let initWebRoutes = (app) => {
    // router.get('/',homeController.getHomePage);
    router.post('/api/getPosts',postController.GetAllPost);
    router.post('/api/getPost',postController.GetPost);
    router.post('/api/login',userController.handleLogin);
    router.post('/api/choosepass',userController.handleChoosepass);
    router.post('/api/Profileuser',authUserMiddleware,userController.handleGetProfile);
    router.post('/api/getInfouser',userController.handleGetProfile);
    router.post('/api/register',userController.handleRegister);
    router.post('/api/refresh-token',userController.refreshToken);
    router.post('/api/logout',userController.logoutUser);
    router.post('/api/logingoogle',usergoogleController.logingoogle);
    router.post('/api/getallpostwithowner',postController.GetAllPostswithOwner);
    router.post('/api/getallpostnecessary',postController.GetPostandinfonecessary);
    router.post('/api/createpost',upload.single('file'),postController.Createnewpost);
    router.post('/api/updatepost',postController.HandleUpdatepost);
    router.post('/api/removepost',postController.HandleRemovepost);
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

