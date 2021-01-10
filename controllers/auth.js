const mongoose = require('mongoose');
const User = mongoose.model("ecomUser");
const {JWT_SECRET} = require("../db/keys")
const {errorHandler} = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup =(req,res)=>{
    const user = new User(req.body);
    user.save((error,user)=>{
        if(error){
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        user.salt =undefined;
        user.hashed_password = undefined;
        res.json({
            user
        })
    })
}
exports.signin =(req,res)=>{
    const{email,password}= req.body
    User.findOne({email},(error,user)=>{
        if(error || !user){
            return res.status(400).json({
                error: "User doesn't exist"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email or Password dont match"
            })
        }


        const token = jwt.sign({_id: user._id},JWT_SECRET)
        res.cookie('t',token,{expire: new Date() +100000})
        const{_id,name,email,role} = user
        return res.json({token, user:{_id,email,name,role}})


    })
}
   
exports.signout=(req,res)=>{

    res.clearCookie('t');
    res.json({message:"Signout successfull"});

}    

exports.requireSignin = expressJwt({
    secret: JWT_SECRET,
    algorithms:["HS256"],
    userProperty: "auth"
})

exports.isAuth=(req,res,next)=>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user){
        return res.status(403).json({
            error:"Access denied"
        })
    }
    next();
}

exports.isAdmin=(req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error:"Admin resourse! Access denied"
        })
    }
    next();
}