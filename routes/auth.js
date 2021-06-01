const router = require("express").Router();
const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
//đăng ký
router.post('/register', async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
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
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("Không tìm thấy người dùng");

        const validPassword = await bcrypt.compare(req.body.password, user.password) ;
        !validPassword && res.status(404).json("Sai mật khẩu");
        
        res.status(200).json(user);
    }   
    catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;