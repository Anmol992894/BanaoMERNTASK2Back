const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const PostModel = mongoose.model("PostModel");

router.post("/API/createpost/:userId", (req, res) => {
    const { Content , Image} = req.body;
    console.log(Content, Image);
    if (!Content || !Image) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    const postObj = new PostModel({ Content: Content, Image: Image, TweetedBy: req.params.userId });
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ post: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});

router.get("/API/Tweetbyid/:tweetid",(req,res)=>{
    PostModel.findOne({_id:req.params.tweetid})
    .then((data)=>{
        res.status(200).json({ posts: data })
    })
    .catch((error)=>{
        res.status(404).json({result:"Post Not found"})
    })
})


router.get("/API/allposts", (req, res) => {
    PostModel.find()
        .populate("author", "_id UserName Image")
        .populate("comments.commentedBy", "_id UserName")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

router.delete("/API/deletepost/:postId", (req, res) => {
    PostModel.findOne({ _id: req.params.postId })
        .populate("author", "_id")
        .exec((error, postFound) => {
            if (error || !postFound) {
                return res.status(400).json({ error: "Post does not exist" });
            }
                postFound.remove()
                    .then((data) => {
                        res.status(200).json({ result: data });
                    })
                    .catch((error) => {
                        console.log(error);
                    })
        })
});


router.put('/API/updatepost',(req,res)=>{
    const {Content,Image}=req.body;
    PostModel.findByIdAndUpdate(req.body.postId,{
        $set:{Content:Content,Image:Image}
    },{new:true})
    .exec((error,result)=>{
        if (error) {
            return res.status(400).json({error:error});
        }else{
            res.json(result)
        }
    })
})

router.put("/API/like", (req, res) => {

    PostModel.findByIdAndUpdate(req.body.postid, {
        $push: { Likes: req.body.userId }
    }, {
        new: true //returns updated record
    }).populate("author", "_id fullName")
        .exec((error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                res.json(result);
            }
        })
});
router.put("/API/unlike", (req, res) => {
    PostModel.findByIdAndUpdate(req.body.postid, {
        $pull: { Likes: req.body.userId }
    }, {
        new: true //returns updated record
    }).populate("author", "_id fullName")
        .exec((error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                res.json(result);
            }
        })
});

router.put("/API/comment", (req, res) => {
    const {commentText,userId}=req.body
    const comment = { commentText: commentText, commentedBy: userId}

    PostModel.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true //returns updated record
    }).populate("comments.commentedBy", "_id UserName Image") //comment owner
        .populate("author", "_id UserName")// post owner
        .populate("comments.commentedBy", "_id UserName")// post owner
        .exec((error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                res.json(result);
            }
        })
});

module.exports=router;