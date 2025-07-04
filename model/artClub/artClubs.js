const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;



const artClubSchema = new mongoose.Schema(
  {
    district: { type: String, required: true },
    activities: [{ type: ObjectId, ref: "ACTIVITY" }],
    head: { type: ObjectId, ref: "CABINATE", default: null},
    members: [{ type: ObjectId, ref: "CABINATE" }],
    memberRequests: [{ type: ObjectId, ref: "CABINATE" }], 
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "CABINATE" }],
    director: { type: ObjectId, ref: "DIRECTOR", required: false },
    ambassadors: { type: ObjectId, ref: "CABINATE" },
    ambassadorRequests: [{ type: ObjectId, ref: "CABINATE" }],
    chapterStatus: {
      type: String,
      enum: ["Inactive", "Active"],
      default: "Inactive"
    } 
  },
  { timestamps : true }
);

module.exports = mongoose.model("ARTCLUB", artClubSchema);
