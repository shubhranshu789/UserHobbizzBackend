const mongoose= require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const schoolSchema = new mongoose.Schema({
school:{
    type: String,
    required: true
},
district:{
    type: String,
    required: true
},
club:{
    type: String,
    required: true
},
ambassador:{
    type: ObjectId,
    ref: "TECHCABINATE",
    required: true,
},
captain:{
    type: ObjectId,
    ref: "TECHUSER",
    default: null
}
})

mongoose.model("TECHSCHOOL", schoolSchema);