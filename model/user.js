const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name : {
        type:String,
        require:true
    },
    email:{
        type: String,
        require:true
    },
    state:{
        type: String,
        require:true
    },
    district:{
        type: String,
        require:true
    },
    school:{
        type: String,
        require:true
    },
    password:{
        type: String,
        require:true
    },
    //add IP
    ip:{
        type: String,
        require:true
    }
})

mongoose.model("USER" ,userSchema )