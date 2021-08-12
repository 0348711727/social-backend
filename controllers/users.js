const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const userModel = "../models/usermodel";

const updateUser = async (req, res)=>{
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
            const user = await UserModel.findByIdAndUpdate(req.params.id, { $set: req.body })
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
}
const deleteUser = async (req, res) => {
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
}
const getUser = async (req, res) => {
    const userId = req.query.userId; //localhost:5000/users?userId = 1234546787300
    const username = req.query.username;//localhost:5000/users?username = "QUAssNG" 
    try{
        const user = userId
        ? await UserModel.findById(userId) 
        : await UserModel.findOne({username});
        const {password, updatedAt, ...other} = user._doc;
        // return res.json({user});
        res.status(200).json(other);
    }
    catch(err){
        return res.status(500).json(err);
    }
}
const followUser = async (req, res) => {
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
}
const unfollowUser = async (req, res) => {
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
                res.status(403).json("Follow trước đã rồi unfollow nhé :)");
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
}
const getUserFriend = async (req, res) => {
    let friendList = [];
    try {
        const user = await UserModel.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId =>{
                return UserModel.findById(friendId)
            })
        )
        friends.map((friend) =>{
            // return {_id, username, profilePicture}
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture })
        })
        res.status(200).json({friendList})
        } catch (error) {
        res.status(500).json(error);
    }
}
module.exports = {router, getUserFriend, getUser, unfollowUser, followUser, updateUser, deleteUser}