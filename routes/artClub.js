const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")

const {Jwt_secret} = require("../keys");

const CLUBNEWS = mongoose.model("CLUBNEWS");

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


module.exports = router;