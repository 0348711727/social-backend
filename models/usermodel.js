const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        min: 3,
        max: 20
    },
    email:{
        type:String,
        require: true,
        max: 50,
        unique: true
    },
    password:{
        type:String,
        require: true,
        min: 6
    },
    profilePicture:{
        type:String,
        default: ""
    },
    coverPicture:{
        type:String,
        default: ""
    },
    followers:{
        type:Array,
        default: []
    },
    isAdmin:{
        type:Boolean,
        default: false
    },
    description:{
        type:String,
        max: 50
    },
    city:{
        type:String,
        max: 50
    },
    from:{
        type:String,
        max: 50
    },
    relationship:{
        type: Number,
        typerelation: [1,2,3]//1.single 2.married 3.divorce
    }
},
    {timestamps: true}
)

module.exports = mongoose.model("Users", UserSchema);