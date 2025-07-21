const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
// const requireLogin = require("../middleWares/requireLogin");
// const requireLoginUser = require("../middleWares/requireLoginUser");
const requireLoginUser = require("../../../middleWares/requireLoginUser");


const CRAFTACTIVITY = mongoose.model("CRAFTACTIVITY");
const USER = mongoose.model("USER");



router.post("/craftcreate-activity", requireLoginUser, async (req, res) => {
  const { title, desc, pic, category } = req.body;

  if (!title || !desc || !pic || !category) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const event = new CRAFTACTIVITY({
      title,
      category ,
      desc,
      pic,
      postedBy: req.user,
    });

    const savedEvent = await event.save();

    res.json({ event: savedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create the activity" });
  }
});


router.get("/craftallActivities", (req, res) => {
  CRAFTACTIVITY.find().then((events) => {
    res.json(events);
  });
});


router.get("/craftgetactivity/:activityid", (req, res) => {
  CRAFTACTIVITY.findOne({ _id: req.params.activityid })
    .then(activity => {
      // console.log(activity)
      return res.json(activity)
    })
})



router.post("/craftregister-activity/:activityId", requireLoginUser, async (req, res) => {
  const userId = req.user._id;
  const { activityId } = req.params;

  try {
    const activity = await CRAFTACTIVITY.findById(activityId);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }


    if (activity.Registrations.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    activity.Registrations.push(userId);
    await activity.save();

    res.status(200).json({ message: "Successfully registered", activity });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/craftunregister-activity/:activityId", requireLoginUser, async (req, res) => {
  const userId = req.user._id;
  const { activityId } = req.params;

  try {
    const activity = await CRAFTACTIVITY.findById(activityId);

    if (!activity) return res.status(404).json({ error: "Activity not found" });


    activity.Registrations = activity.Registrations.filter(
      (id) => id.toString() !== userId.toString()
    );

    await activity.save();

    res.status(200).json({ message: "Unregistered successfully", activity });
  } catch (err) {
    console.error("Unregister error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/craftupload-photo/:eventId", requireLoginUser, async (req, res) => {
  try {
    const { pic } = req.body;
    const userId = req.user._id.toString();
    const eventId = req.params.eventId;

    const event = await CRAFTACTIVITY.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });


    const isRegistered = event.Registrations.includes(userId);
    if (!isRegistered) {
      return res.status(403).json({ error: "User not registered for this event" });
    }

    const alreadyUploaded = event.uploads.some(
      (upload) => upload.uploadedBy.toString() === userId
    );
    if (alreadyUploaded) {
      return res.status(409).json({ error: "You have already uploaded a photo for this event." });
    }


    event.uploads.push({ pic, uploadedBy: userId });
    await event.save();

    res.status(200).json({ success: true, message: "Photo uploaded successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/crafthas-uploaded/:eventId", requireLoginUser, async (req, res) => {
  const userId = req.user._id.toString();
  const eventId = req.params.eventId;

  const event = await CRAFTACTIVITY.findById(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const hasUploaded = event.uploads.some(
    (upload) => upload.uploadedBy.toString() === userId
  );

  res.status(200).json({ hasUploaded });
});



router.get("/craftevent-participants/:eventId", requireLoginUser, async (req, res) => {
  try {
    const event = await CRAFTACTIVITY.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const registrations = event.Registrations;
    const uploadsMap = new Map();

    // Map uploadedBy => pic
    event.uploads.forEach(upload => {
      uploadsMap.set(upload.uploadedBy.toString(), upload.pic);
    });

    // Fetch user details for registered users
    const users = await USER.find({ _id: { $in: registrations } })
      .select("_id name email ip");

    const participants = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      ip: user.ip,
      pic: uploadsMap.get(user._id.toString()) || null
    }));

    res.status(200).json({ participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/craftevent-participants-user/:eventId", requireLoginUser, async (req, res) => {
  try {
    const event = await CRAFTACTIVITY.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const registrations = event.Registrations;
    const uploadsMap = new Map();

    // Map uploadedBy => pic
    event.uploads.forEach(upload => {
      uploadsMap.set(upload.uploadedBy.toString(), upload);
    });

    // Fetch user details for registered users
    const users = await USER.find({ _id: { $in: registrations } })
      .select("_id name email ip");

    const participants = users.map(user => {
      const upload = uploadsMap.get(user._id.toString());

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        ip: user.ip,
        pic: upload ? upload.pic : null,
        uploadId: upload ? upload._id : null, // 👈 This is the fix
        isApproved: upload ? upload.isApproved : null,
      };
    });

    res.status(200).json({ participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});






// PUT request to approve an uploaded image
router.put("/craftactivity/approve-upload/:activityId/:uploadId", async (req, res) => {
  const { activityId, uploadId } = req.params;

  try {
    const activity = await CRAFTACTIVITY.findOneAndUpdate(
      {
        _id: activityId,
        "uploads._id": uploadId
      },
      {
        $set: { "uploads.$.isApproved": true }
      },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity or upload not found" });
    }

    res.status(200).json({ message: "Upload approved successfully", activity });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/craftactivity/disapprove-upload/:activityId/:uploadId", async (req, res) => {
  const { activityId, uploadId } = req.params;

  try {
    const activity = await CRAFTACTIVITY.findOneAndUpdate(
      { _id: activityId, "uploads._id": uploadId },
      { $set: { "uploads.$.isApproved": false } },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity or upload not found" });
    }

    res.status(200).json({ message: "Upload disapproved successfully", activity });
  } catch (error) {
    console.error("Disapproval error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/craftactivity/approved-uploads/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    // Step 1: Get the activity
    const activity = await CRAFTACTIVITY.findById(eventId);
    if (!activity) return res.status(404).json({ error: "Activity not found" });

    // Step 2: Filter approved uploads
    const approvedUploads = activity.uploads.filter(upload => upload.isApproved);

    // Step 3: Fetch user details for those uploads
    const userIds = approvedUploads.map(u => u.uploadedBy);
    const users = await USER.find({ _id: { $in: userIds } }).select("_id name email");

    // Step 4: Map user info into uploads
    const userMap = new Map();
    users.forEach(user => userMap.set(user._id.toString(), user));

    const enrichedUploads = approvedUploads.map(upload => {
      const user = userMap.get(upload.uploadedBy?.toString());

      return {
        _id: upload._id,
        pic: upload.pic,
        name: user?.name || "Unknown",
        email: user?.email || "N/A",
        uploadedBy: user?._id || null,
        createdAt: upload.createdAt,
      };
    });

    res.status(200).json({ approvedUploads: enrichedUploads });
  } catch (error) {
    console.error("Error fetching approved uploads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






module.exports = router;
