const moongoose=require('mongoose')

const userSchema=new moongoose.Schema({
    UserName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
})

moongoose.model("UserModel",userSchema)