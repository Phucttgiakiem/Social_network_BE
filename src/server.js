const express = require ( "express");
const bodyParser = require ( "body-parser");
const viewEngine = require ( './config/viewEngine');
const initWebRoutes = require ( './route/web');
const {connectDB} = require ( './config/connectDB');
const cors = require ( 'cors');
const { createServer } = require ( 'http');
const { Server } = require ( 'socket.io');
const dotenv = require ( 'dotenv');
const { initSocket } = require("./socket");
//const path = require ( "path";
// Cấu hình dotenv để đọc file .env
dotenv.config();

let app = express();

// Cấu hình CORS để cho phép từ tất cả các nguồn hoặc từ client cụ thể
app.use(cors({
    origin: 'https://social-network-be-ll5p.onrender.com',  // Địa chỉ client đang chạy (React app)
    methods: ['GET', 'POST'],         // Các phương thức được phép
    credentials: true                 // Cho phép gửi cookies nếu cần
}));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
connectDB();

let port = process.env.PORT || 8096; // Bạn có thể lấy cổng từ process.env nếu cần: process.env.PORT

// Tạo một HTTP server từ ứng dụng Express
const httpServer = createServer(app);

initSocket(httpServer);

// Thiết lập route Web
initWebRoutes(app);

// Khởi tạo Socket.IO và cấu hình CORS cho phép kết nối từ client
/* const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",  // Cho phép client từ cổng 3000
        methods: ['GET', 'POST']
    }
}); */



// Lắng nghe sự kiện kết nối từ client
/* io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
    // Lắng nghe sự kiện ngắt kết nối
    socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);
    });
}); */

// Export io nếu cần sử dụng ở nơi khác
//module.exports.io = io;

// Bắt đầu HTTP server
httpServer.listen(port, () => {
    console.log('Backend Nodejs is running on the port: ' + port);
});


