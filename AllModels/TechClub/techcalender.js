const mongoose = require('mongoose');


const calendarSchema = new mongoose.Schema({
    title : {
        type:String,
        require:true
    },
    description:{
        type: String,
        require:true
    },
    date:{
        type: String,
        require:true
    },
})



mongoose.model("TECHCALENDAR" ,calendarSchema )