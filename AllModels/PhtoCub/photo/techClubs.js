const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const techClubSchema = new mongoose.Schema(
  {
    district: { type: String, required: true },
    activities: [{ type: ObjectId, ref: "PHOTOACTIVITY" }],
    head: { type: ObjectId, ref: "PHOTOCABINATE", default: null},
    members: [{ type: ObjectId, ref: "PHOTOCABINATE" }],
    memberRequests: [{ type: ObjectId, ref: "PHOTOCABINATE" }], 
    pendingRequests: [{ type: ObjectId, ref: "PHOTOCABINATE" }],
    director: [{ type: ObjectId, ref: "PHOTODIRECTOR" }],
    ambassadors: [{ type: ObjectId, ref: "PHOTOCABINATE" }],
    ambassadorRequests: [{ type: ObjectId, ref: "PHOTOCABINATE" }],
    chapterStatus: {
      type: String,
      enum: ["Inactive", "Active"],
      default: "Inactive"
    } 
  },
  { timestamps: true }
);

mongoose.model("PHOTOCLUB", techClubSchema);