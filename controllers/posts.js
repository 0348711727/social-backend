const express = require('express');
const mongoose = require("mongoose");

const PostModel = require("../models/postmodel");
const UserModel = require("../models/usermodel");

const router = express.Router();
const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
}
const likePost = async (req, res) => {
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
}
const updatePost = async (req, res) => {
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
}
const deletePost = async (req, res) => {
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
}
const getPost = async (req, res) => {
    try {
        const newPost = await PostModel.findById(req.params.id)
         res.status(200).json(newPost);   
        } catch (err) {
        res.status(500).json(err)   
    }
}
const getTimlinePost = async (req, res) => {
    try {
        const currentUser = await UserModel.findById(req.params.userId);
        const userPosts = await PostModel.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) =>{
                return PostModel.find({userId: friendId})
            })
        )
        res.status(200).json({posts : userPosts.concat(...friendPosts)});
        // res.status(200).json(userPosts.concat(...friendPosts));
        // res.status(200).json({posts: [...userPosts, ...friendPosts]});
    } catch (err) {
        res.status(500).json(err)
    }
}
const getAllUserPost = async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.params.username });
        const posts = await PostModel.find({ userId: user._id })
        res.status(200).json({posts: posts});
    } catch (err) {
        res.status(500).json(err)
    }
}
module.exports = {router, createPost, likePost, updatePost, deletePost, getPost, getTimlinePost, getAllUserPost};