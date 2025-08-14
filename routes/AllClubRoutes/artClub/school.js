const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const requireLoginUser = require("../../../middleWares/requireLoginUser");

const DIRECTOR = mongoose.model("DIRECTOR");
const PRINCIPLE=mongoose.model("PRINCIPLE");
const EDITOR=mongoose.model("EDITOR");
const LOCALEVENT= mongoose.model("LOCALEVENT");
const ARTCLUB = mongoose.model("ARTCLUB");
const SCHOOL = mongoose.model("SCHOOL");
const USER = mongoose.model("USER");


// GET /get-school?district=Varanasi&club=artclub
router.get("/get-school", async (req, res) => {
  const { district, club } = req.query;

  if (!district || !club) {
    return res.status(400).json({ error: "Both 'district' and 'club' parameters are required" });
  }

  try {
    // Find schools by district and club, populate ambassador & captain details
    const schools = await SCHOOL.find({ district, club })
      .populate('ambassador', 'name email phone')
      .populate('captain', 'name email phone');

    if (!schools.length) {
      return res.status(404).json({ error: "No schools found for the given district and club" });
    }

    res.status(200).json({ schools });

  } catch (error) {
    console.error("Error fetching school info:", error);
    res.status(500).json({ error: "Failed to fetch school information" });
  }
});

// GET /get-students?club=artclub&district=Kanpur&school=St. Xavier's
router.get("/get-students", async (req, res) => {
  const { district, school } = req.query;

  // Validate required parameters
  if (!district || !school) {
    return res.status(400).json({ error: "club, district, and school parameters are required" });
  }

  try {
    // Find students with matching club, district, and school
    const students = await USER.find({
      district,
      school
    }).select('name email phone school district club');

    if (!students.length) {
      return res.status(404).json({ message: "No students found for the given criteria" });
    }

    res.status(200).json({ students });

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});



router.get("/get-captain", async (req, res) => {
  const { district, club, school } = req.query;

  if (!district || !club || !school) {
    return res.status(400).json({ error: "district, club, and school are required" });
  }

  try {
    const result = await SCHOOL.findOne({ district, club, school })
      .populate("captain", "name email phone");

    if (!result) {
      return res.status(404).json({ error: "School not found" });
    }

    res.status(200).json({ captain: result.captain });
  } catch (error) {
    console.error("Error fetching captain:", error);
    res.status(500).json({ error: "Failed to fetch captain details" });
  }
});


router.get("/get-correspondent", async (req, res) => {
  const { district, club, school } = req.query;

  if (!district || !club || !school) {
    return res.status(400).json({ error: "district, club, and school are required" });
  }

  try {
    const result = await SCHOOL.findOne({ district, club, school })
      .populate("correspondent", "name email phone");

    if (!result) {
      return res.status(404).json({ error: "School not found" });
    }

    res.status(200).json({ correspondent: result.correspondent });
  } catch (error) {
    console.error("Error fetching correspondent:", error);
    res.status(500).json({ error: "Failed to fetch correspondent details" });
  }
});


router.put("/make-captain", async (req, res) => {
  const { district, club, school, studentId } = req.body;

  if (!district || !club || !school || !studentId) {
    return res.status(400).json({ error: "district, club, school and userId are required" });
  }

  try {
    const updatedSchool = await SCHOOL.findOneAndUpdate(
      { district, club, school },
      { captain: studentId },
      { new: true }
    ).populate("captain", "name email phone");

    if (!updatedSchool) {
      return res.status(404).json({ error: "School not found" });
    }

    res.status(200).json({ message: "Captain assigned successfully", school: updatedSchool });
  } catch (error) {
    console.error("Error assigning captain:", error);
    res.status(500).json({ error: "Failed to assign captain" });
  }
});




router.get("/get-cabinate",async(req,res)=>{
  const { district, club, school } = req.query;
  if (!club) {
    return res.status(400).json({ error: "district, club, and school are required" });
  }
  
  try {
    
    // Fetch director record for the club
    const clubdirector=await DIRECTOR.findOne({ club })
    
    const clubprinciple = await PRINCIPLE.findOne({ club })
    
    const clubeditor=await EDITOR.findOne({ club })
    
    // Construct result array
    const result = [];
    
    if (clubdirector) {
      result.push({
        name: clubdirector.name,
        role: "Director",
        email: clubdirector.email
      });
    }
    
    if (clubprinciple) {
      result.push({
        name: clubprinciple.name,
        role: "Principle",
        email: clubprinciple.email
      });
    }

    if (clubeditor) {
      result.push({
        name: clubeditor.name,
        role: "Editor",
        email: clubeditor.email
      });
    }
    
    if(school && district){
      // Fetch club record and populate head
      const clubDoc = await ARTCLUB.findOne({ district })
      .populate("head", "name email phone");
      
      if (!clubDoc) {
        return res.status(404).json({ error: "Club not found in this district" });
      }

      // Fetch school record and populate ambassador and captain
      const schoolDoc = await SCHOOL.findOne({ district, club, school })
        .populate("ambassador", "name email phone")
        .populate("captain", "name email phone");

        if (!schoolDoc) {
        return res.status(404).json({ error: "School not found" });
      }

      if (clubDoc.head) {
        result.push({
          name: clubDoc.head.name,
          role: "District Head",
          email: clubDoc.head.email
        });
      }  

      if (schoolDoc.ambassador) {
        result.push({
          name: schoolDoc.ambassador.name,
          role: "Ambassador",
          email: schoolDoc.ambassador.email
        });
      }

      if (schoolDoc.captain) {
        result.push({
          name: schoolDoc.captain.name,
          role: "Captain",
          email: schoolDoc.captain.email
        });
      }
    }

    // Optional: If you have Editor or Principal roles, extend this similarly

    res.status(200).json({ cabinate: result });

  } catch (error) {
    console.error("Error fetching cabinate details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/userProfile/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const user = await USER.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});






module.exports = router;