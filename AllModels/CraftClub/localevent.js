const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image:{type:String, required:true},
    description: { type: String },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    club: { type: String, required: true },
    district: { type: String, required: true },
    head: { type: ObjectId, ref: "CRAFTCABINATE", required: false },
    director: { type: ObjectId, ref: "DIRECTOR", required: false },
    
    status: {
      type: String,
      enum: ["Inactive", "Active"],
      default: "Active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CRAFTLOCALEVENT", chapterSchema);
