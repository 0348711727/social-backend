const User = require("../models/usermodel");
const router = require("express").Router();

//update user
router.put("/:id", async (req, res)=>{
    if(req.body.userId === req.params.id || req.user.isAdmin)
    {   

    }
    else
    {
        res.status(403).json("Không đủ quyền cập nhật")
    }
}) 
//delete user
//get a user
//get all users
//follow user


router.get('/', (req,res)=>{
    res.send("Đây là router user")
})
module.exports = router;