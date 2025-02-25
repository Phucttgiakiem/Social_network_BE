import userService from "../services/userService";
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.pass;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleRegister = async (req,res) => {
    let email = req.body.email;
    let password = req.body.password;
    let dateofbirth = req.body.dateofbirth;
    if (!email || !password || !dateofbirth){
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let userData = await userService.handleUserRegister(email,password,dateofbirth);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleChoosePass = async (req,res) => {
    let email = req.body.email;
    let newpass = req.body.pass;
    if(!email || !newpass){
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let userData = await userService.handleUserChoosepass(email,newpass);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let sendEmail = async (req,res) => {
    let email = req.body.email;
    let type = req.body.typeauthen;
    if(!email){
        return res.status(500).json({
            errCode:1,
            message: 'Missing inputs parameter !'
        })
    }
    let data = await userService.sendEmailforuser(email,type);
    return res.status(200).json({
        errCode: data.errCode,
        message: data.errMessage,
        info: data.data ? data.data : {}
    })
}
let GetProfileUser = async (req,res) => {
    let id = req.body.id;
    if(!id){
        return res.status(500).json({
            errCode:1,
            message: 'Missing inputs parameter !'
        })
    }
    let data = await userService.handleGetProfile(id);
    return res.status(200).json({
        errCode: data.errCode,
        message: data.errMessage,
        profileuser: data.data ? data.data : {}
    })
}
let handleUpdateprofile = async (req,res) => {
    let fullname = req.body.fullname;
    let bio = req.body.bio;
    let iduser = req.body.iduser;
    if(!fullname || !bio || !iduser) {
        return res.status(500).json({
            errCode:1,
            message: 'Missing inputs parameter !'
        })
    }
    let data = await userService.handleUpdateprofileuser(fullname,bio,iduser);
    return res.status(200).json({
        errCode: data.errCode,
        message: data.errMessage,
    })
}
module.exports = {
    handleLogin: handleLogin,
    handleRegister:handleRegister,
    handleChoosepass: handleChoosePass,
    handleSendEmail: sendEmail,
    handleGetProfile: GetProfileUser,
    handleUpprofile: handleUpdateprofile
}
