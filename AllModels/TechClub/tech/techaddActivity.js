const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const uploadSchema = new mongoose.Schema(
  {
    pic: { type: String, required: true },
    uploadedBy: { type: ObjectId, ref: "TECHUSER", required: true },
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
    postedBy: [{ type: ObjectId, ref: "TECHDIRECTOR" }],
    Registrations: [{ type: ObjectId, ref: "TECHUSER" }],

    uploads: [uploadSchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("TECHACTIVITY", activitySchema);
