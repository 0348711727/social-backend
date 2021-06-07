const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    likes:{
        type:Array,
        default: []
    },
    img: String,
    description:{
        type:String,
        max: 300
    }
},
    {timestamps: true}
)

module.exports = mongoose.model("Posts", PostSchema);