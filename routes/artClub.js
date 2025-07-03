const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")

const {Jwt_secret} = require("../keys");

const CLUBNEWS = mongoose.model("CLUBNEWS");
const CLUBJOURNAL = mongoose.model("CLUBJOURNAL");
const HERITAGE = mongoose.model("HERITAGE");
const CLUBDOMAIN = mongoose.model("CLUBDOMAIN");
const GALLERY = mongoose.model("GALLERY");
const CALENDAR = mongoose.model("CALENDAR");
const ACTIVITY = mongoose.model("ACTIVITY");

const requireLoginUser = require("../middleWares/requireLoginUser");


// ----------------------------------------------------CLUBNEWS--------------------------------------------------------------
// POST /api/news — Create news
router.post('/clubnews', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new CLUBNEWS(newsData);
    await newNews.save();

    res.status(201).json({
      success: true,
      message: "News posted successfully!",
      data: newNews,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to post news",
      error: err.message,
    });
  }
});



router.get('/clubnewsviewallpost', async (req, res) => {
  try {
    const allNews = await CLUBNEWS.find().sort({ publishedAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: allNews.length,
      data: allNews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    }); 
  }
});


router.get("/artNews/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CLUBNEWS.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// ------------------------------------------------------------------------------------------------------------------


router.post('/clubjournal', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new CLUBJOURNAL(newsData);
    await newNews.save();

    res.status(201).json({
      success: true,
      message: "News posted successfully!",
      data: newNews,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to post news",
      error: err.message,
    });
  }
});


router.get('/clubjpurnalviewallpost', async (req, res) => {
  try {
    const allNews = await CLUBJOURNAL.find().sort({ publishedAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: allNews.length,
      data: allNews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    }); 
  }
});


router.get("/artJouranls/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CLUBJOURNAL.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});





// ----------------------------------------------------HERITAGE---------------------------------------------------------------------
router.post('/heritage', async (req, res) => {
  try {
    const { title, category, origin, imageUrl, description, period, tags } = req.body;

    // Create new document
    const newEntry = new HERITAGE({
      title,
      category,
      origin,
      imageUrl,
      description,
      period,
      tags,
    });

    const saved = await newEntry.save();
    return res.status(201).json({
      success: true,
      message: 'Hall of Fame entry created successfully!',
      data: saved,
    });
  } catch (error) {
    console.error('Error creating Hall of Fame entry:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});



router.get('/heritagegetallpost', async (req, res) => {
  try {
    const hallOfFame = await HERITAGE.find().sort({ publishedAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: hallOfFame.length,
      data: hallOfFame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    }); 
  }
});


router.get("/artHeritage/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await HERITAGE.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// -------------------------------------------------------------------------------------------------------------------------






// -------------------------------------------------------------------------------------------------------------------------
router.post('/clubdomain', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new CLUBDOMAIN(newsData);
    await newNews.save();

    res.status(201).json({
      success: true,
      message: "News posted successfully!",
      data: newNews,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to post news",
      error: err.message,
    });
  }
});


router.get('/clubdomainviewallpost', async (req, res) => {
  try {
    const allNews = await CLUBDOMAIN.find().sort({ publishedAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: allNews.length,
      data: allNews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    }); 
  }
});

// -------------------------------------------------------------------------------------------------------------------------




// -----------------------------------------GALLERY-----------------------------------------------------------


router.post('/gallerypost', async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ error: "Title and imageUrl are required!" });
    }

    const newImage = new GALLERY({ title, imageUrl });
    await newImage.save();

    res.status(201).json({ message: "Image added successfully!", data: newImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  GET: API FOR IMAGE GALLERY
router.get('/viewgallerypost', async (req, res) => {
  try {
    const images = await  GALLERY.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// -------------------------------------------------------------------------------------------------------------------------



// ------------------------------------------------CALENDAR------------------------------------------------------------

router.get('/api/events', async (req, res) => {
  const events = await CALENDAR.find({});
  res.status(200).json(events);
});

router.post('/api/events', async (req, res) => {
  const { title, description, date } = req.body;
  if (!title || !date) {
    return res.status(400).json({ message: 'Missing title or date' });
  }
  const newEvent = await CALENDAR.create({ title, description, date });
  res.status(201).json(newEvent);
});


router.delete('/api/events/by-date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const result = await CALENDAR.deleteMany({ date });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No events found for this date' });
    }
    res.status(200).json({ message: `${result.deletedCount} event(s) deleted` });
  } catch (err) {
    console.error('Delete by date error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ------------------------------------------------------------------------------------------------------------


router.get("/hall-of-fame", async (req, res) => {
  try {
    const activities = await ACTIVITY.find({})
      .populate("uploads.uploadedBy", "name email"); // 👈 this adds user name/email

    const hallOfFameUploads = [];

    activities.forEach(activity => {
      const matchingUploads = activity.uploads.filter(upload => upload.isHallofFame === true);

      matchingUploads.forEach(upload => {
        hallOfFameUploads.push({
          ...upload.toObject(),
          activityId: activity._id,
          activityTitle: activity.title,
          category: activity.category,
          uploadedBy: upload.uploadedBy, // will now include name + email
        });
      });
    });

    res.json(hallOfFameUploads);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;