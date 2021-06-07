const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();// phải gọi dotenv trước mới chạy connect mongoose.connect dưới được
//khai báo các thư viện
const helmet = require("helmet");
const morgan = require("morgan");
//gọi kết nối tới mongodb
const mongoose = require("mongoose");


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


//kêt nối middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))

app.use("/api/users", userRouter);
app.use("/api/auth", userAuth);
app.use("/api/posts", postRouter);






app.get("/", (req, res)=>{
    res.send("Hello");
})

app.listen(3000, ()=>{
    console.log("SERVER ONLINE");
})