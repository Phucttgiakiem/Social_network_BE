import usergoogleService from "../services/usergoogleService";

let handleLogingoogle = async(req,res) => {
    let {sub,email,name,picture} = req.body;
    let userData = await usergoogleService.Logingoogle(sub,email,name,picture);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.data
    })
}
module.exports = {
    logingoogle: handleLogingoogle
}