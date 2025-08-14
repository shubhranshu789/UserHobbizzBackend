const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
// const requireLogin = require("../middleWares/requireLogin");
const requireLoginUser = require("../../../middleWares/requireLoginPhotoUser");

// const CABINATE = mongoose.model("CABINATE");
const ACTIVITY = mongoose.model("PHOTOACTIVITY");
const USER = mongoose.model("PHOTOUSER");
// const DIRECTOR = mongoose.model("DIRECTOR");
// const ARTCLUB = mongoose.model("ARTCLUB");
const COMPITITION = mongoose.model("PHOTOCOMPITITION");






router.get("/photoallCompitition", async (req, res) => {
  try {
    const liveEvents = await COMPITITION.find({ isLive: true });
    res.status(200).json(liveEvents);
  } catch (err) {
    console.error("Error fetching live competitions:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


router.get("/photogetCompitition/:compititionid", (req, res) => {
  COMPITITION.findOne({ _id: req.params.compititionid })
    .then(activity => {
      // console.log(activity)
      return res.json(activity)
    })
})




router.put("/photoactivity/set-live/:activityID", async (req, res) => {
  try {
    const activityId = req.params.activityID;
    const { isLive } = req.body;

    // ✅ Basic validation
    if (typeof isLive !== "boolean") {
      return res.status(400).json({ error: "`isLive` must be true or false" });
    }

    // ✅ Update the field
    const updated = await COMPITITION.findByIdAndUpdate(
      activityId,
      { isLive },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json({
      message: `Activity is now ${isLive ? "LIVE ✅" : "OFFLINE ❌"}`,
      isLive: updated.isLive,
    });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




router.post("/photoregister-compitition/:activityId", requireLoginUser, async (req, res) => {
  const userId = req.user._id;
  const { activityId } = req.params;

  try {
    // 1️⃣ Find the competition
    const activity = await COMPITITION.findById(activityId);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // 2️⃣ Find the logged-in user
    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3️⃣ Allow if either main club is photoclub OR joinedClubs contains photoclub
    if (user.club !== "photoclub" && !user.joinedClubs.includes("photoclub")) {
      return res.status(403).json({ message: "You must be in the photo club before registering for this competition" });
    }

    // 4️⃣ Prevent duplicate registration
    if (activity.Registrations.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    // 5️⃣ Register the user
    activity.Registrations.push(userId);
    await activity.save();

    res.status(200).json({ message: "Successfully registered", activity });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.post("/photounregister-compitition/:activityId", requireLoginUser, async (req, res) => {
  const userId = req.user._id;
  const { activityId } = req.params;

  try {
    const activity = await COMPITITION.findById(activityId);

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


router.post("/photoupload-photo-compitition/:eventId", requireLoginUser, async (req, res) => {
  try {
    const { pic } = req.body;
    const userId = req.user._id.toString();
    const eventId = req.params.eventId;

    const event = await COMPITITION.findById(eventId);
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

router.get("/photohas-uploaded-compitition/:eventId", requireLoginUser, async (req, res) => {
  const userId = req.user._id.toString();
  const eventId = req.params.eventId;

  const event = await COMPITITION.findById(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const hasUploaded = event.uploads.some(
    (upload) => upload.uploadedBy.toString() === userId
  );

  res.status(200).json({ hasUploaded });
});


router.get("/photoevent-participants-compi/:eventId", requireLoginUser, async (req, res) => {
  try {
    const event = await COMPITITION.findById(req.params.eventId);
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






router.get("/photocompetitions/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid competition ID" });
  }

  try {
    const competition = await COMPITITION.findById(id)
      .populate("postedBy", "name email")
      .populate("Registrations", "name email")
      .populate("judges", "name email")
      .populate("uploads.uploadedBy", "name email");

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    res.json(competition);
  } catch (error) {
    console.error("Error fetching competition:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





























module.exports = router;
