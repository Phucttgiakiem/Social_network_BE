import db from "../models/index";
import {Op,Sequelize} from "sequelize";
let Logingoogle = (sub,email,name,avatar) => {
    return new Promise (async(resolve,reject) => {
        try {
            let userData = {};
            let isExist = await checkuser(sub);
            if(isExist){
                userData.errCode = 1;
                userData.errMessage = "Account is found in database !";
                userData.data = {
                    sub:sub,
                    email:email,
                    name:name,
                    avatar:avatar
                };
            }else{
                let newuser = await db.Usergoogle.create({
                    sub:sub,
                    email:email,
                    name:name,
                    avatar:avatar
                });
                userData.errCode = 0;
                userData.errMessage = "OK";
                userData.data = newuser;
            }
            resolve(userData);
        } catch (err) {
            reject(err);
        }
    })
}
let GetUsergoogleByid = (iduser) => {
    return new Promise(async(resolve,reject) => {
        try{
            let UserData = {};
            let Users = await db.Usergoogle.findOne({
                where: {sub:iduser}
            });
            if(Users){
                UserData.errCode = 0;
                UserData.errMessage = "OK";
                UserData.data = Users;
            }
            else{
                UserData.errCode = 1;
                UserData.errMessage = "Cannot all Users with all IDUser"
                UserData.data = {};
            }
            resolve(UserData);
        }catch(err){
            reject(err);
        }
    })
}
let GetAllUserinidList = (IDUsers) => {
    return new Promise(async(resolve,reject) => {
        try{
            let UserData = {};
            let Users = await db.Usergoogle.findAll({
                where:{
                    sub: {
                        [Op.in]:IDUsers
                    }
                }
            });
            if(Users){
                UserData.errCode = 0;
                UserData.errMessage = "OK";
                UserData.data = Users;
            }
            else{
                UserData.errCode = 1;
                UserData.errMessage = "Cannot all Users with all IDUser"
                UserData.data = {};
            }
            resolve(UserData);
        }catch(e){
            reject(e);
        }
    })
}
let checkuser = (sub) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.Usergoogle.findOne({
                where: {sub:sub}
            });
            if(user){
                resolve(true);
            }else{
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    Logingoogle : Logingoogle,
    handleGetUser : GetUsergoogleByid,
    handleGetAllUserwithID: GetAllUserinidList
}