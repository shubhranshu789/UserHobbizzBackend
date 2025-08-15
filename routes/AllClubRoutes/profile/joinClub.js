const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");

const requireLogin = require("../../../middleWares/requireLoginUser");


const USER = mongoose.model("USER");





// router.put('/userjoinArtClub/:id', async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const user = await USER.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.club === "artclub") {
//       return res.status(400).json({ message: 'User is already in artClub as their main club' });
//     }

//     const updatedUser = await USER.findByIdAndUpdate(
//       userId,
//       { $addToSet: { joinedClubs: "artclub" } },
//       { new: true }
//     );

//     return res.json({
//       message: '"artClub" added to joinedClubs successfully',
//       user: updatedUser,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// });


router.put('/userjoinArtClub/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if artclub is already the main club
    if (user.club === "artclub") {
      return res.status(400).json({ message: 'User is already in artClub as their main club' });
    }

    // Check if user already joined the artclub
    if (user.joinedClubs.includes("artclub")) {
      return res.status(400).json({ message: 'User already joined artClub' });
    }

    // Prevent more than 2 joined clubs
    if (user.joinedClubs.length >= 2) {
      return res.status(400).json({ message: 'User has already joined 2 clubs' });
    }

    // Add artclub without duplicates
    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      { $addToSet: { joinedClubs: "artclub" } },
      { new: true }
    );

    return res.json({
      message: '"artclub" added to joinedClubs successfully',
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});






router.put('/userjoinCraftClub/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If craftclub is already their main club
    if (user.club === "craftclub") {
      return res.status(400).json({ message: 'User is already in craftClub as their main club' });
    }

    // Prevent adding if already joined craftclub
    if (user.joinedClubs.includes("craftclub")) {
      return res.status(400).json({ message: 'User already joined craftClub' });
    }

    // Limit to maximum of 2 joined clubs
    if (user.joinedClubs.length >= 2) {
      return res.status(400).json({ message: 'User has already joined 2 clubs' });
    }

    // Add to joined clubs (no duplicates)
    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      { $addToSet: { joinedClubs: "craftclub" } },
      { new: true }
    );

    return res.json({
      message: '"craftclub" added to joinedClubs successfully',
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.put('/userjoinTechClub/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If techclub is already their main club
    if (user.club === "techclub") {
      return res.status(400).json({ message: 'User is already in techClub as their main club' });
    }

    // Prevent adding if already joined techclub
    if (user.joinedClubs.includes("techclub")) {
      return res.status(400).json({ message: 'User already joined techClub' });
    }

    // Limit to maximum of 2 clubs
    if (user.joinedClubs.length >= 2) {
      return res.status(400).json({ message: 'User has already joined 2 clubs' });
    }

    // Add to joined clubs (no duplicates)
    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      { $addToSet: { joinedClubs: "techclub" } },
      { new: true }
    );

    return res.json({
      message: '"techclub" added to joinedClubs successfully',
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});


// testing 






router.put('/userjoinPhotoClub/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If photoclub is already their main club
    if (user.club === "photoclub") {
      return res.status(400).json({ message: 'User is already in photoClub as their main club' });
    }

    // ✅ Check if already in photoclub
    if (user.joinedClubs.includes("photoclub")) {
      return res.status(400).json({ message: 'User already joined photoClub' });
    }

    // ✅ Prevent more than 2 clubs in joinedClubs array
    if (user.joinedClubs.length >= 2) {
      return res.status(400).json({ message: 'You has already joined 2 clubs' });
    }

    // Add photoclub (no duplicates)
    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      { $addToSet: { joinedClubs: "photoclub" } },
      { new: true }
    );

    return res.json({
      message: '"photoclub" added to joinedClubs successfully',
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});















module.exports = router;
