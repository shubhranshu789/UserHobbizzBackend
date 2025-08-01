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
    ref: "PHOTOCABINATE",
    required: true,
},
captain:{
    type: ObjectId,
    ref: "PHOTOUSER",
    default: null
}
})

mongoose.model("PHOTOSCHOOL", schoolSchema);