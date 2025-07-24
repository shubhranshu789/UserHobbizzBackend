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
    ref: "CRAFTCABINATE",
    required: true,
},
captain:{
    type: ObjectId,
    ref: "CRAFTUSER",
    default: null
}
})

mongoose.model("CRAFTSCHOOL", schoolSchema);