const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const uploadSchema = new mongoose.Schema(
  {
    pic: { type: String, required: true },
    uploadedBy: { type: ObjectId, ref: "USER", required: true },
    isApproved: { type: Boolean, default: false },
    isHallofFame: { type: Boolean, default: false },

  },
  { timestamps: true } 
);


const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    pic: { type: String, required: true }, 
    category: { type: String, required: true },
    postedBy: [{ type: ObjectId, ref: "DIRECTOR" }],
    Registrations: [{ type: ObjectId, ref: "USER" }],

    uploads: [uploadSchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("ACTIVITY", activitySchema);
