const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")

const {Jwt_secret} = require("../keys");

const DANCECLUBNEWS = mongoose.model("DANCECLUBNEWS");

// POST /api/news — Create news
router.post('/danceClubNews', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new DANCECLUBNEWS(newsData);
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


router.get('/danceClubNewsviewallpost', async (req, res) => {
  try {
    const allNews = await DANCECLUBNEWS.find().sort({ publishedAt: -1 }); // Latest first
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


module.exports = router;





// Cloudinary setup
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup with cloudinary-storage
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'danceclub_news',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage }); // Yeh hamara upload middleware hai


// POST route
router.post(
  '/danceClubNews',
  upload.single('image'), // file field ka naam "image"
  async (req, res) => {
    try {
      const imageUrl = req.file ? req.file.path : '';
      const { title, content, category, author, tags, isFeatured } = req.body;

      const newNews = new DANCECLUBNEWS({
        title,
        content,
        category,
        author,
        imageUrl,
        tags: tags ? tags.split(',') : [],
        isFeatured: isFeatured === 'true',
      });

      await newNews.save();

      res.status(201).json({ success: true, data: newNews });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// GET route
router.get('/danceClubNewsviewallpost', async (req, res) => {
  try {
    const allNews = await DANCECLUBNEWS.find().sort({ publishedAt: -1 });
    res.status(200).json({ success: true, count: allNews.length, data: allNews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch news', error: error.message });
  }
});

// module.exports = router;
