const UserModel = require("../models/usermodel");
const router = require("express").Router();
const bcrypt = require("bcrypt");

const {updateUser, unfollowUser, followUser, deleteUser, getUser, getUserFriend} = require("../controllers/users")

router.get("/", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("friends/:userId", getUserFriend);

//update user
// router.put("/:id", async (req, res)=>{
//     if(req.body.userId === req.params.id || req.body.isAdmin)
//     {   
//         if(req.body.password)
//         {
//             try{
//             const salt = bcrypt.genSalt(10);
//             req.body.password = await bcrypt.hash(req.body.password, salt)
//             }
//             catch(err)
//             {
//                 return res.status(500).json(err);
//             }
//         }
//         try
//         {
//             const user = await UserModel.findByIdAndUpdate(req.params.id, { $set: req.body })
//             res.status(200).json("Tài khoản đã được cập nhật")
//         }
//         catch(err)
//         {
//             return res.status(500).json(err);
//         }
//     }
//     else
//     {
//         res.status(403).json("Không đủ quyền cập nhật tài khoản user khác")
//     }
// }) 
// //delete user
// router.delete("/:id", async (req, res)=>{
//     if(req.body.userId === req.params.id || req.body.isAdmin)
//     {   
//         try
//         {
//             const user = await UserModel.findByIdAndDelete(req.params.id)
//             res.status(200).json("Tài khoản đã được xóa")
//         }
//         catch(err)
//         {
//             return res.status(500).json(err);
//         }
//     }
//     else
//     {
//         res.status(403).json("Bạn chỉ có thể xóa tài khoản của bản thân")
//     }
// }) 
// //get a user
// router.get("/", async (req, res)=>{
//     const userId = req.query.userId; //localhost:5000/users?userId = 1234546787300
//     const username = req.query.username;//localhost:5000/users?username = "QUAssNG" 
//     try{
//         const user = userId
//         ? await UserModel.findById(userId) 
//         : await UserModel.findOne({username});
//         const {password, updatedAt, ...other} = user._doc;
//         // return res.json({user});
//         res.status(200).json(other);
//     }
//     catch(err){
//         return res.status(500).json(err);
//     }
// })

// //follow user
// router.put("/:id/follow", async (req, res)=>{
//     if(req.body.userId != req.params.id)
//     {
//         try{
//             const user = await UserModel.findById(req.params.id);

//             const currentUser = await UserModel.findById(req.body.userId);

//             if(!user.followers.includes(req.body.userId))
//             {
//                 await user.updateOne({ $push : {followers: req.body.userId} });

//                 await currentUser.updateOne({ $push : {followings: req.body.userId} });

//                 res.status(200).json("Follow thành công");
//             }
//             else
//             {
//                 res.status(403).json("Bạn đã theo dõi người dùng này rồi");
//             }
//         }
//         catch(err)
//         {
//             res.status(500).json(err);
//         }
//     }
//     else
//     {
//         return res.status(403).send("Bạn không thể follow chính bản thân")
//     }
// })

// //unfollow a user
// router.put("/:id/unfollow", async (req, res)=>{
//         if(req.body.userId != req.params.id)
//         {
//             try{
//                 const user = await UserModel.findById(req.params.id);

//                 const currentUser = await UserModel.findById(req.body.userId);

//                 if(user.followers.includes(req.body.userId))
//                 {
//                     await user.updateOne({ $pull : {followers: req.body.userId} });

//                     await currentUser.updateOne({ $pull : {followings: req.body.userId} });

//                     res.status(200).json("Unfollow thành công");
//                 }
//                 else
//                 {
//                     res.status(403).json("Follow trước đã rồi unfollow nhé :)");
//                 }
//             }
//             catch(err)
//             {
//                 res.status(500).json(err);
//             }
//         }
//         else
//         {
//             return res.status(403).send("Bạn không thể unfollow chính bản thân")
//         }
// })

// //get user's friends
// router.get("/friends/:userId", async (req, res)=>{
//     let friendList = [];
//     try {
//         const user = await UserModel.findById(req.params.userId);
//         const friends = await Promise.all(
//             user.followings.map(friendId =>{
//                 return UserModel.findById(friendId)
//             })
//         )
//         friends.map((friend) =>{
//             // return {_id, username, profilePicture}
//             const { _id, username, profilePicture } = friend;
//             friendList.push({ _id, username, profilePicture })
//         })
//         res.status(200).json({friendList})
//         } catch (error) {
//         res.status(500).json(error);
//     }
// })
// router.get('/', (req,res)=>{
//     res.send("Đây là router user")
// })
module.exports = router;