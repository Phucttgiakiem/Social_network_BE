import postService from  "../services/postService";
import { S3Client,PutObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";
//import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
let GetAllpost = async(req,res) => {
    let userId = req.body.Iduser;
    let page = req.body._page;
    let limit = req.body._limit;
    let offset = (page - 1) * limit;
    let postData = await postService.GetAllPost(userId,limit,offset);
  //  console.log(postData);
     return res.status(200).json({
         errCode: postData.errCode,
         message: postData.errMessage,
         post: postData.data ? postData.data : []
     })
}

let GetPostwithiduser = async (req,res) => {
    //let Idpost = req.body.Id;
    let Iduser = parseInt(req.body.Iduser);
    let limit = parseInt(req.body._limit);
    let page = parseInt(req.body._page);
    let offset = (page - 1) * limit;
    console.log("result: ",Iduser," ",page," ",limit," ",offset);
    
    if(!Iduser){
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let PostData = await postService.GetpostwithId(Iduser,limit,offset);
    return res.status(200).json({
        errCode: PostData.errCode,
        message: PostData.errMessage,
        page: PostData.data.length > 0 ? page + 1 : page,
        post: PostData.data ? PostData.data : []
    })
}
let GetPostandinfonecessary = async (req,res) => {
    let Iduser = req.body.iduser;
    console.log("Iduser: ",Iduser);
    if(!Iduser){
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let PostData = await postService.Getpostneccessary(Iduser);
    return res.status(200).json({
        errCode: PostData.errCode,
        message: PostData.errMessage,
        post: PostData.data ? PostData.data : []
    })
}
// let GetPostwithiduser = async (req,res) => {
//     let Iduser = req.body.iduser;
//     if(!Iduser) {
//         return res.status(500).json({
//             errCode: 1,
//             message: 'Missing inputs parameter !'
//         })
//     }
//     let PostData = await postService.GetAllpostofowner(Iduser);
//     return res.status(200).json({
//         errCode: PostData.errCode,
//         message: PostData.errMessage,
//         post: PostData.data
//     })
// }
let uploadFile = async (file) => {
    // Tạo client S3
    const s3 = new S3Client({
        region: "ap-southeast-2", // Asia Pacific (Hanoi) RegionID
        endpoint: "https://mos.ap-southeast-2.sufybkt.com", // Asia Pacific (Hanoi) Endpoint
        credentials: {
        accessKeyId: process.env.ACCESSKEYID, // Thay bằng AccessKey của bạn
        secretAccessKey: process.env.SECRETACCESSKEY, // Thay bằng SecretKey của bạn
        },
    });
   // const fileStream = fs.createReadStream("./src/video_with_use_tiktok.mp4");
   // fileStream.on("error", (err) => console.error(err));
   const timestamp = Date.now(); // Thời gian hiện tại (ms từ 1970)
   const randomString = Math.random().toString(36).substring(2, 8); // Chuỗi ngẫu nhiên
   try {
        const command = new PutObjectCommand({
            Bucket: "storagevideo", 
            Key: `${timestamp}-${randomString}`, // Tên file (hoặc bạn có thể tùy chỉnh Key)
            Body: file.buffer, // Truyền buffer vào Body
            ContentType: file.mimetype // Đảm bảo ContentType chính xác
        });
        const response = await s3.send(command);
      //  console.log("Upload thành công:", response);
        return `${timestamp}-${randomString}`
    } catch (error) {
        console.error("Lỗi khi upload file:", error);
    }
};
let removefile = async (filename) => {
    const s3 = new S3Client({
        region: "ap-southeast-2", // Asia Pacific (Hanoi) RegionID
        endpoint: "https://mos.ap-southeast-2.sufybkt.com", // Asia Pacific (Hanoi) Endpoint
        credentials: {
            accessKeyId: process.env.ACCESSKEYID, // Thay bằng AccessKey của bạn
            secretAccessKey: process.env.SECRETACCESSKEY, // Thay bằng SecretKey của bạn
        },
      });
      console.log(filename)
      s3.send(
        new DeleteObjectCommand({
          Bucket: "storagevideo",
          Key: filename,
        })
      )
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
}
let Createpost = async (req, res) => {
    let jsonData;
    try {
        jsonData = JSON.parse(req.body.data || '{}');
    } catch (parseError) {
        return res.status(400).json({
            errCode: 1,
            message: 'Invalid JSON data!'
        });
    }

    const { iduser: Iduser, description: Description, namemusicvideo } = jsonData;
    const file = req.file;
    
    let Path = "";
    // Kiểm tra các thông tin bắt buộc
    if (!file || Iduser === "" || Description === "") {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing or empty inputs parameter! Please provide valid values.'
        });
    }

    try {
        const fileUrl = await uploadFile(file); // Upload file và nhận lại URL
        Path = `https://idoxc0k.sufydely.com/${fileUrl}`;
    } catch (uploadError) {
        return res.status(500).json({
            errCode: 1,
            message: "Upload failed.",
        });
    }

    // Lưu post vào cơ sở dữ liệu
    let Postdata = await postService.Createnewpost(Iduser, Description, Path, namemusicvideo);
    return res.status(200).json({
        errCode: Postdata.errCode,
        message: Postdata.errMessage,
        post: Postdata.data
    });
};

let Removepost = async (req,res) => {
    let idpost = req.body.idpost;
    if(!idpost) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let data = await postService.RemovePost(idpost);
    removefile(data.data);
    return res.status(200).json({
        errCode: data.errCode,
        message: data.errMessage,
    });
}
let Updatepost = async (req,res) => {
    let idpost = req.body.idpost;
    let namemusic = req.body.namemusicvideo;
    let description = req.body.description;
    console.log("result: ",idpost," ",namemusic," ",description);
    if(!idpost || !namemusic || !description){
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }
    let data = await postService.Updatepostuser(idpost,namemusic,description);
    return res.status(200).json({
        errCode: data.errCode,
        message: data.errMessage
    })
}
module.exports = {
    GetAllPost : GetAllpost,
    GetAllPostswithOwner : GetPostwithiduser,
    GetPostandinfonecessary:GetPostandinfonecessary,
    Createnewpost : Createpost,
    HandleRemovepost: Removepost,
    HandleUpdatepost: Updatepost
}