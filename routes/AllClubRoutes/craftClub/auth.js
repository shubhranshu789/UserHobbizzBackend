const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")


const USER = mongoose.model("CRAFTUSER");
const {Jwt_secret} = require("../../../keys");




router.post("/craftsignup" , (req,res)=> {
    const {name , password ,email , state , district , school , club} = req.body;
    const ip = req.headers['cf-connecting-ip'] ||
                req.headers['x-real-ip'] ||
                req.headers['x-forwarded-for'] ||
                req.socket.remoteAddress || '' ;


    if(!name ||!password ||!email || !state || !district || !school ){
        return res.status(422).json({error : "Please add all the fields"})
    }

    USER.findOne({$or : [{email : email} ]}).then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error : "user already exist with that email or userName"})
        }


        bcryptjs.hash(password , 12).then((hashedPassword) => {
            const teacher = new USER ({
                name , 
                email,    
                password:hashedPassword, //hiding password,
                ip,
                school,
                district,
                state,
                club
                

            })
        
            teacher.save()
            .then(teacher => {res.json({message : "Data Saved"})})
            .catch(err => {console.log(err)})
        })
    })
})



router.post("/craftsignin" , (req , res) => {
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(422).json({error: "please add all the fields"})
    }

    USER.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcryptjs.compare(password , savedUser.password).then((match) => {
            if(match){
                // return res.status(200).json({message :"Signed In Successufully" })
                const token = jwt.sign({_id:savedUser.id} , Jwt_secret)
                const {_id ,name , email , state , district , school, club } = savedUser
                res.json({token , user:{_id ,name , email , state , district , school ,club}})
                console.log({token , user:{_id ,name , email , state , district , school, club}})
            }else{
                return res.status(422).json({error :"Invalid password" })
            }
        })
        .catch(err => console.log(err))
        // console.log(savedUser)
    })
})







module.exports = router;