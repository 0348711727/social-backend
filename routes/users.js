const UserModel = require("../models/usermodel");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin)
    {   
        if(req.body.password)
        {
            try{
            const salt = bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
            }
            catch(err)
            {
                return res.status(500).json(err);
            }
        }
        try
        {
            const user = await UserModel.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            res.status(200).json("Tài khoản đã được cập nhật")
        }
        catch(err)
        {
            return res.status(500).json(err);
        }
    }
    else
    {
        res.status(403).json("Không đủ quyền cập nhật tài khoản user khác")
    }
}) 
//delete user
router.delete("/:id", async (req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin)
    {   
        try
        {
            const user = await UserModel.findByIdAndDelete(req.params.id)
            res.status(200).json("Tài khoản đã được xóa")
        }
        catch(err)
        {
            return res.status(500).json(err);
        }
    }
    else
    {
        res.status(403).json("Bạn chỉ có thể xóa tài khoản của bản thân")
    }
}) 
//get a user
router.get("/:id", async (req, res)=>{
    try{
        const user = await UserModel.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;

        res.status(200).json(other);
    }
    catch(err){
        return res.status(500).json(err);
    }
})

//follow user
router.put("/:id/follow", async (req, res)=>{
    if(req.body.userId != req.params.id)
    {
        try{
            const user = await UserModel.findById(req.params.id);

            const currentUser = await UserModel.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId))
            {
                await user.updateOne({ $push : {followers: req.body.userId} });

                await currentUser.updateOne({ $push : {followings: req.body.userId} });

                res.status(200).json("Follow thành công");
            }
            else
            {
                res.status(403).json("Bạn đã theo dõi người dùng này rồi");
            }
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    }
    else
    {
        return res.status(403).send("Bạn không thể follow chính bản thân")
    }
})

//unfollow a user
router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.userId != req.params.id)
    {
        try{
            const user = await UserModel.findById(req.params.id);

            const currentUser = await UserModel.findById(req.body.userId);

            if(user.followers.includes(req.body.userId))
            {
                await user.updateOne({ $pull : {followers: req.body.userId} });

                await currentUser.updateOne({ $pull : {followings: req.body.userId} });

                res.status(200).json("Unfollow thành công");
            }
            else
            {
                res.status(403).json("Bạn đã chưa theo dõi người dùng này");
            }
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    }
    else
    {
        return res.status(403).send("Bạn không thể unfollow chính bản thân")
    }
})

router.get('/', (req,res)=>{
    res.send("Đây là router user")
})
module.exports = router;