import express from "express";
import bodyParser from "body-parser";
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import multer from 'multer';
//import path from "path";
// Cấu hình dotenv để đọc file .env
dotenv.config();

let app = express();

// Cấu hình CORS để cho phép từ tất cả các nguồn hoặc từ client cụ thể
app.use(cors({
    origin: 'http://localhost:3000',  // Địa chỉ client đang chạy (React app)
    methods: ['GET', 'POST'],         // Các phương thức được phép
    credentials: true                 // Cho phép gửi cookies nếu cần
}));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
connectDB();

let port = 8096; // Bạn có thể lấy cổng từ process.env nếu cần: process.env.PORT

// Tạo một HTTP server từ ứng dụng Express
const httpServer = createServer(app);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports.upload = upload;


// Khởi tạo Socket.IO và cấu hình CORS cho phép kết nối từ client
const io = new Server(httpServer, {
    cors: {
        origin: '*',  // Cho phép client từ cổng 3000
        methods: ['GET', 'POST']
    }
});

// Thiết lập route Web
initWebRoutes(app);

// Lắng nghe sự kiện kết nối từ client
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
    // Lắng nghe sự kiện ngắt kết nối
    socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);
    });
});

// Export io nếu cần sử dụng ở nơi khác
module.exports.io = io;

// Bắt đầu HTTP server
httpServer.listen(port, () => {
    console.log('Backend Nodejs is running on the port: ' + port);
});


