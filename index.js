const express = require("express");
const app = express();
const cors = require("cors");
//mở api
// app.use((req, res, next)=>{
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, context-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

const corsOptions = {
    origin: "http://localhost:3000", 
    methods: ['POST', 'PUT'],
    userCredential: true,
}
const dotenv = require("dotenv");
dotenv.config();// phải gọi dotenv trước mới chạy connect mongoose.connect dưới được
//khai báo các thư viện
const helmet = require("helmet");
const morgan = require("morgan");
//gọi kết nối tới mongodb
const mongoose = require("mongoose");
//upload file
const multer = require("multer");
//khai báo path để fe gọi public file từ be
const path = require("path");

//khai báo router api để sử dụng
const userRouter = require("./routes/users");
const userAuth = require("./routes/auth");
const postRouter = require("./routes/posts")

mongoose.connect(
    process.env.MONGO_URL, 
    {useNewUrlParser: true, useUnifiedTopology: true},
    console.log("CONNECT MONGO THÀNH CÔNG"));

// mongoose_connectconnect()
//     .then(() => {
//         console.log('CONNECTED THÀNH CÔNG');
//     })
//     .catch(err => {
//         console.error('App starting error:', err.stack);
//         process.exit(1)
//     });

app.use("/images", express.static(path.join(__dirname, "public/images")));

//kêt nối middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))
app.use(cors(corsOptions))

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public/images");
    },
    filename:(req, file, cb)=>{
        cb(null, req.body.name)
    }
})

const upload = multer({ storage });//khai báo multer ở trên và dùng ở đây

app.post("/Social-backend/upload", upload.single("file"), (req, res, next)=>{
    try {   
        return res.status(200).json("File đã upload");          
    } catch (error) {
        console.log(error)
    }
})

app.use("/social-backend/users", userRouter);
app.use("/social-backend/auth", userAuth);
app.use("/social-backend/posts", postRouter);





app.get("/", (req, res)=>{
    res.send(process.env.MONGO_URL);
})

app.listen(5000, ()=>{
    console.log("SERVER ONLINE");
})