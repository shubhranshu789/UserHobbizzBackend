const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const uploadSchema = new mongoose.Schema(
  {
    pic: { type: String, required: true },
    uploadedBy: { type: ObjectId, ref: "USER", required: true },
    // isApproved: { type: Boolean, default: false },
    judge1: { type: Number, default: 0 },
    judge2: { type: Number, default: 0 },
    judge3: { type: Number, default: 0 },
    judge4: { type: Number, default: 0 },
  },
  { timestamps: true } 
);



const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    pic: { type: String, required: true }, 
    postedBy: [{ type: ObjectId, ref: "DIRECTOR" }],
    Registrations: [{ type: ObjectId, ref: "USER" }],
    isLive: { type: Boolean, default: false },
    resultLive: { type: Boolean, default: false },
    judges: [{ type: ObjectId, ref: "JUDGE" }],
    uploads: [uploadSchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("CRAFTCOMPITITION", activitySchema);
