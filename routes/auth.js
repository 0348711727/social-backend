const router = require("express").Router();
const UserModel = require("../models/usermodel");
const bcrypt = require("bcrypt");
//đăng ký
router.post('/register', async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        })
        //lưu vào mongo
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err)
    {
        res.status(500).json(err); 
    }
});

router.post("/login", async (req, res)=>{
    try{

        console.log(req.body.email);
        //kiểm tra email
        const user = await UserModel.findOne({ email: req.body.email });
        !user && res.status(404).json("Không tìm thấy người dùng");//nếu vế trước đúng thì chạy vế sau &&

        //kiểm tra mật khẩu
        const validPassword = await bcrypt.compare(req.body.password, user.password) ;
        !validPassword && res.status(404).json("Sai mật khẩu");
        
        

        //thành công trả về user ở json
        res.status(200).json(user);
    }   
    catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;