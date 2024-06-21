const mongoose=require('mongoose');
const {ObjectId}= mongoose.Schema.Types;


const postSchema=mongoose.Schema({
    Content:{
        type:String,
        required:true
    },
    Image:{
        type:String
    },
    UserName:{
        type:String,
        ref:"UserModel"
    },
    TweetedBy:{
        type:String,
        required:true
    },
    Likes:[
        {
            type:ObjectId,
            ref:"UserModel"
        }
    ],
    comments: [
        {
            commentText: String,
            commentedBy: { type: ObjectId, ref: "UserModel" }
        }
    ],
    author: {
        type: ObjectId,
        ref: "UserModel"
    }
},{timestamps:true})

mongoose.model("PostModel",postSchema);