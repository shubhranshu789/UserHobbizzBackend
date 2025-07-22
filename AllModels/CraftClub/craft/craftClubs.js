const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;



const artClubSchema = new mongoose.Schema(
  {
    district: { type: String, required: true },
    activities: [{ type: ObjectId, ref: "CRAFTACTIVITY" }],
    head: { type: ObjectId, ref: "CRAFTCABINATE", default: null},
    members: [{ type: ObjectId, ref: "CRAFTCABINATE" }],
    memberRequests: [{ type: ObjectId, ref: "CRAFTCABINATE" }], 
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "CABINATE" }],
    director: { type: ObjectId, ref: "DIRECTOR", required: false },
    ambassadors: { type: ObjectId, ref: "CRAFTCABINATE" },
    ambassadorRequests: [{ type: ObjectId, ref: "CRAFTCABINATE" }],
    chapterStatus: {
      type: String,
      enum: ["Inactive", "Active"],
      default: "Inactive"
    } 
  },
  { timestamps : true }
);

module.exports = mongoose.model("CRAFTCLUB", artClubSchema);
