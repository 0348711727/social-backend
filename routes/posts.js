const PostModel = require("../models/postmodel");
const UserModel = require("../models/usermodel");
const router = require("express").Router();

//create a post
router.post("/", async (req, res)=>{
    const newPost = new PostModel(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update a post
router.put("/:id", async (req, res)=>{
    try {
    const newPost = await PostModel.findById(req.params.id)
        if(newPost.userId === req.body.userId)
        {
            await newPost.updateOne({ $set : req.body });
            res.status(200).json("update thành công");
        }
        else
        {
            res.status(403).json("Bạn chỉ có thể cập nhật bài đăng của bản thân thôi !!!")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

//delete a post
router.delete("/:id", async (req, res)=>{
    try {
        const newPost = await PostModel.findById(req.params.id)
            if(newPost.userId === req.body.userId)
            {
                await newPost.deleteOne();
                res.status(200).json("Xóa bài thành công");
            }
            else
            {
                res.status(403).json("Bạn chỉ có thể xóa bài đăng của bản thân thôi !!!")
            }
        } catch (err) {
            res.status(500).json(err)
        }
})
//like a post
router.put("/:id/like", async (req, res)=>{
    try {
        const newPost = await PostModel.findById(req.params.id);
        if(!newPost.likes.includes(req.body.userId)){
            await newPost.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("Đã like bài post");
        }
        else
        {
            await newPost.updateOne({$pull:{likes: req.body.userId}});
            res.status(200).json("Đã dislike bài post");
        }
    } catch (err) {
     res.status(500).json(err)   
    }
})

//get a post
router.get("/:id", async (req, res)=>{
    try {
    const newPost = await PostModel.findById(req.params.id)
     res.status(200).json(newPost);   
    } catch (err) {
     res.status(500).json(err)   
    }
})

//get timeline post
router.get("/timeline/all", async (req, res)=>{
    try {
        const currentUser = UserModel.findById(req.body.userId);
        const userPosts = PostModel.find({userId: currentUser._id});
        const friendPosts = Promise.all(
            currentUser.followings.map(friendId =>{
                PostModel.find({userId: friendId})
            })
        )
        res.json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(err)
    }
})


module.exports = router;
