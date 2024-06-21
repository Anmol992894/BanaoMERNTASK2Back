const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const UserModel = mongoose.model('UserModel');
const PostModel = mongoose.model('PostModel');


router.post('/API/register', (req, res) => {
    const { UserName, Email, Password } = req.body;

    if (!UserName || !Email || !Password) {
        return res.status(404).json({ error: "One or more mandatory Field is missing" })
    }
    UserModel.findOne({ Email: Email })
        .then((EmailinDB) => {
            if (EmailinDB) {
                res.status(500).json({ error: "User with the email already exist" })
            }
            const user = new UserModel({ UserName, Email, Password })
            user.save()
                .then((newUser) => {
                    res.status(200).json({ result: "User registered Successfully" })
                })
                .catch((error) => {
                    console.log(error);
                })
        })
})

// API for Login
router.post('/API/login', (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
        res.status(400).json({ error: "One or more mandatory field is required" });
    }
    UserModel.findOne({ Email: Email })
        .then((userinDB) => {
            if (!userinDB) {
                res.status(401).json({ error: "User not Registered" })
            }
            if (userinDB.Password===Password) {
                const userinfo = { "_id": userinDB._id, "Email": userinDB.Email, "UserName": userinDB.UserName }
                return res.status(200).json({ result: { "UserInfo": userinfo } })
            }
            else {
                return res.status(401).json({ error: "Inncorrect Password" })
            }

        })
        .catch((error) => {
            console.log(error);
        })
})

router.post('/API/forgot',(req,res)=>{
    const {UserName,Email}=req.body;
    if(!Email || !UserName){
        res.status(400).json({error:"Provide the registered Email and UserName"})
    }
    UserModel.findOne({UserName:UserName,Email:Email})
    .then((userinDB)=>{
        if(!userinDB){
            res.status(401).json({ error: "User not Registered" })
        }
        if (userinDB.Email===Email && userinDB.UserName===UserName) {
            const userinfo = { "_id": userinDB._id, "Email": userinDB.Email, "UserName": userinDB.UserName, "Password":userinDB.Password }
            return res.status(200).json({ result: { "UserInfo": userinfo } })
        }
        else {
            return res.status(401).json({ error: "Inncorrect Password" })
        }
    })
    .catch((error)=>{
        res.status(401).json({result:"Provide correct data"})
    })
})

module.exports = router;