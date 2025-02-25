import db from "../models/index";
import bcrypt from "bcryptjs";
import {Op,Sequelize, where} from "sequelize";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();


let handleUserLogin = (email,password) => {
    return new Promise(async(resolve,reject)=>{
        try{
            let userData = {};
                let isExist = await checkUseremail(email);
                if (isExist) {
                    //user already exist
                    //compare password

                    let user = await db.User.findOne({
                        attributes: ['id','email','password','fullName','avatar'],
                        where: { email: email },
                        raw: true

                    });
                    if (user) {
                        let check = bcrypt.compareSync(password, user.password); // false
                        //let check = true;
                        if (check) {
                            userData.errCode = 0;
                            userData.errMessage = 'OK';
                            delete user.password;
                            userData.user = user;
                        } else {
                            userData.errCode = 3;
                            userData.errMessage = 'Wrong password';
                        }
                    } else {
                        userData.errCode = 2;
                        userData.errMessage = `User's not found`
                    }

                } else {
                    //return error
                    userData.errCode = 1;
                    userData.errMessage = "Your's Email isn't exist in your system. plz try other email!"

                }
                resolve(userData);
        } catch (e) {
            reject(e)
        }
    })
}
let handleUserRegister = (email,password,dateofbirth) => {
    return new Promise (async(resolve,reject) =>{
        try{
            let userData = {};
            let checkpass = await checkPassword(password);
                if (checkpass) {
                    //user already exist
                    userData.errCode = 1;
                    userData.errMessage = "the password was using please changing another pass !!!";
                }
                else {
                    // create one salt
                    const saltRounds = 5;
                    const salt = bcrypt.genSaltSync(saltRounds);
                    // create new pass
                    let hashedpass = bcrypt.hashSync(password,salt);
                    // add new user to database
                    let newUser = await db.User.create({
                        email: email,
                        password: hashedpass, // save pass was hast pass
                        dateofbirth: dateofbirth
                    });
                    // create data response
                    userData.errCode = 0;
                    userData.errMessage = 'OK';
                    userData.user = newUser.email;
                }
                resolve(userData);
        }catch(e){
            reject(e)
        }
    })
}
let handleChoosePass = (email,newpass) => {
    return new Promise(async(resolve,reject) => {
        try{
            let userData = {};
            let user = await db.User.findOne({
                attributes: ['email','password'],
                where: { email: email },
                raw: true
            });
                if (user) {
                    let check = bcrypt.compareSync(newpass, user.password);
                    //let check = true;
                    if (check) {
                        userData.errCode = 1;
                        userData.errMessage = 'password was using please choose another pass !';
                        console.log(user);
                        userData.user = user.email;
                    }
                    else {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        userData.user = user.email;

                        // create one salt
                        const saltRounds = 5;
                        const salt = bcrypt.genSaltSync(saltRounds);
                         // create new pass
                        let hashedpass = bcrypt.hashSync(newpass,salt);
                        await db.User.update({password : hashedpass},{where: {email: user.email}}) ;
                    }
                }
                resolve(userData);
        }catch(e){
            reject(e)
        }
    })
}
let checkPassword = (pass) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy tất cả mật khẩu từ cơ sở dữ liệu
            let users = await db.User.findAll({
                attributes: ['password']
            });

            // Duyệt qua từng người dùng để kiểm tra mật khẩu
            for (let user of users) {
                if (bcrypt.compareSync(pass, user.password)) {
                    resolve(true); // Nếu tìm thấy mật khẩu trùng khớp
                }
            }

            // Không có mật khẩu nào khớp
            resolve(false);
        } catch (e) {
            reject(e); // Xử lý lỗi
        }
    });
}
let checkUseremail = (emails) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            let user = await db.User.findOne({
                where: {email:emails}
            })
            if(user){
                resolve(true)
            }
            else{
                resolve(false)
            }
        }catch(e){
            reject(e)
        }
    })
}
let getUserByID = (IDUser) => {
    return new Promise(async(resolve,reject)=>{
        try {
            let user = await db.User.findByPk(IDUser);
            if (user) {
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data: user
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found",
                    data: null
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getAllUserByID = (IDUsers) => {
    return new Promise(async(resolve,reject) => {
        try{
            let UserData = {};
            let Users = await db.User.findAll({
                where:{
                    id: {
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
function generateUniqueSixDigitNumber() {
    let result = new Set();
    while (result.size < 6) {
        result.add(Math.floor(Math.random() * 10)); // Thêm số ngẫu nhiên từ 0 đến 9
    }
    return [...result].join(''); // Chuyển Set thành mảng và nối lại thành chuỗi
}
let sendEmailforuser = (Email,type) => {
    return new Promise(async(resolve,reject) => {
        try{
            let existemail = await checkUseremail(Email);
            let dataarr = {};
            let htmltext = '';
            let subjecttext = 'inform from admin of Tiktok';
            if(type === 'regainpass'){
                if(!existemail){
                    dataarr.errCode = 1;
                    dataarr.errMessage = "Email not exist, please checking again !!!";
                    dataarr.data = {};
                    resolve(dataarr); 
                }
                else{
                    htmltext = 'This is code set up again password: ';
                }   
            }
            else{
                
                if(existemail){
                    dataarr.errCode = 1;
                    dataarr.errMessage = "Email already exists, please use another email !!!";
                    dataarr.data = {};
                    resolve(dataarr); 
                }
                else {
                    htmltext = 'This is code check survival of email: ';
                }
            }
            //generateUnique
            let createcode = generateUniqueSixDigitNumber();
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                user: "phuctran2802@gmail.com",
                pass: process.env.EMAIL_PASSWORD,
                },
            });
          // Cấu hình email
            let mailOptions = {
                from: '"Tiktok social network" <phuctran2802@gmail.com>',
                to: Email,
                subject: subjecttext,
                text: 'This is a test email.',
                text: "Hello world?", // plain text body
                html: `<b>${htmltext} ${createcode}</b>`, // html body
            };
            try {
                // Gửi email và chờ kết quả
                let info = await transporter.sendMail(mailOptions);

                // Kiểm tra kết quả
                dataarr.errCode = 0;
                dataarr.errMessage = "OK";
                dataarr.data = createcode;
                console.log('Email sent: ', info.response);

            } catch (error) {
                // Xử lý lỗi khi gửi email
                dataarr.errCode = 2;
                dataarr.errMessage = `Error sending email: ${error.message}`;
                dataarr.data = {};
                console.error('Error occurred: ', error);
            }
            resolve(dataarr); 
        }catch(e){
            reject(e)
        }
    })
}
let GetProfileUser = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id:id},
                row:true
            });
            let result = {};
            if(!user){
                result.errCode = 1;
                result.errMessage = 'Cannot found Profile User, Please try again !!!';
                result.data = [];
            }else {
                let videoowner = await db.Post.findAll({
                    attributes: ['id','MediaURL','Timestamp','UserID'],
                    where: {UserID: user.id},
                    row:true
                });
                let totallikevideoowner = 0;
                for(const item of videoowner){
                    let countitem = await db.Likepost.count({
                        where: {PostID:item.id}
                    })
                    totallikevideoowner += countitem;
                }
                let videolike = await db.Post.findAll({
                    attributes: ['id', 'MediaURL', 'Timestamp','UserID'], // Chỉ lấy các thông tin cần thiết
                    where: {
                        UserID: user.id // Video thuộc về người dùng
                    },
                    include: [
                        {
                            model: db.Likepost,
                            attributes: [], // Không cần lấy thông tin về lượt like, chỉ kiểm tra điều kiện
                            required: true, // Chỉ lấy video có ít nhất một lượt like
                            as: 'likes', // Alias trùng với định nghĩa association
                        }
                    ]
                });
                videolike = videolike.map(item => ({
                    id: item.id,
                    MediaURL: item.MediaURL,
                    UserID: item.UserID,
                    Timestamp: item.Timestamp
                }));
                result.errCode = 0;
                result.errMessage = 'OK';
                result.data = {
                    profile: user,
                    videoowner: videoowner,
                    videolike: videolike,
                    totallike: totallikevideoowner
                }
            }
            resolve(result);
        } catch(err){
            reject(err);
        }
    })
}
let handleUpdateProfile = (fullname,bio,iduser) => {
    return new Promise (async(resolve,reject) => {
        try {   
            let user = await db.User.findOne({
                where: {id:iduser},
                raw:true
            })
            let result = {};
            if(user) {
                let itemname = fullname.split(" ");
                let firstname = itemname[itemname.length - 1]
                let lastname = itemname[0];
                const [updatedRows] = await db.User.update({
                    firstName:firstname,
                    lastName:lastname,
                    fullName:fullname,
                    Bio:bio},
                    {where: {id:user.id}}
                );
                if(updatedRows > 0) {
                    result.errCode = 0;
                    result.errMessage = "Your profile is updated success, Please try check new info !!!"
                }else {
                    result.errCode = 1;
                    result.errMessage = "Your profile is not updated success, Please try again !!!"
                }
            }else {
                result.errCode = 2;
                result.errMessage = "Cannot found info your profile, Please try again !!!"
            }
            resolve(result);
        } catch(e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin : handleUserLogin,
    handleUserRegister : handleUserRegister,
    handleUserChoosepass : handleChoosePass,
    handleUserGetByID: getUserByID,
    handleUserGetAllByID: getAllUserByID,
    sendEmailforuser: sendEmailforuser,
    handleGetProfile: GetProfileUser,
    handleUpdateprofileuser: handleUpdateProfile
}