const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();


const DIRECTOR = mongoose.model("DIRECTOR");
const LOCALEVENT= mongoose.model("LOCALEVENT");
const CRAFTLOCALEVENT= mongoose.model("CRAFTLOCALEVENT");

const ARTCLUB = mongoose.model("ARTCLUB");
const CRAFTCLUB = mongoose.model("CRAFTCLUB");


// GET /get-chapter?club=artclub&district=Varanasi
router.get("/get-events", async (req, res) => {
  const eventModels = {
  "artclub": LOCALEVENT,
  "craftclub": CRAFTLOCALEVENT
};
  try {
    const { club, district } = req.query;


    const query = {};
    if (club) query.club = club;
    if (district) query.district = district;

    // Select club model dynamically
    const EventModel = eventModels[club];

    if (!EventModel) {
      return res.status(400).json({ message: `Invalid club type: ${club}` });
    } 

    const events = await EventModel.find(query)
      .populate("director", "name email")
      .populate("head", "name email")
      .sort({ createdAt: -1 }); // newest first

    const formattedEvents = events.map((chapter) => ({
      event_id: chapter._id,
      title: chapter.title,
      image: chapter.image,
      date: chapter.date,
      venue: chapter.venue,
      description: chapter.description || "",
      status: chapter.status,
      created_at: chapter.createdAt,
      updated_at: chapter.updatedAt,
      club_name: chapter.club,
      club_director_name: chapter.director ? chapter.director.name : "N/A",
      club_director_email: chapter.director ? chapter.director.email : "N/A",
      district_name: chapter.district,
      district_head_name: chapter.head ? chapter.head.name : "N/A",
      district_head_email: chapter.head ? chapter.head.email : "N/A",
  
    }));

    res.status(200).json({ events: formattedEvents });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
});






router.post("/create-event", async (req, res) => {
  const clubModels = {
    "artclub": ARTCLUB,
    "craftclub": CRAFTCLUB
  };
  const eventModels = {
    "artclub": LOCALEVENT,
    "craftclub": CRAFTLOCALEVENT
  };

  try {
    const { title, description, date, venue, club, district, status, image } = req.body;

    // Validate required fields
    if (!title || !date || !venue || !club || !district) {
      return res.status(400).json({ message: "Title, Date, Venue, Club, and District are required" });
    }

    // Fetch Director based on club
    const director = await DIRECTOR.findOne({ club: club });
    if (!director) {
      return res.status(404).json({ message: `Director not found for club: ${club}` });
    }

    // Select club model dynamically
    const ClubModel = clubModels[club];

    if (!ClubModel) {
      return res.status(400).json({ message: `Invalid club type: ${club}` });
    } 

    // Fetch Art Club for given district and club
    const Club = await ClubModel.findOne({ district });
    if (!Club) {
      return res.status(403).json({ message: `Art club not found for district: ${district}` });
    }

    const head = Club.head;
    
    const EventModel = eventModels[club];
    if (!EventModel) {
      return res.status(400).json({ message: `Invalid club type: ${club}` });
    } 

    // Create new Event
    const newEvent = new EventModel({
      title,
      image,
      description,
      date,
      venue,
      club,
      district,
      status,
      head,
      director: director._id,
      
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({ message: "Event created successfully", event: savedEvent });

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event", error: error.message });
  }
});


// DELETE Event by ID
router.delete("/delete-event/", async (req, res) => {
  const eventModels = {
    "artclub": LOCALEVENT,
    "craftclub": CRAFTLOCALEVENT
  };
  
  const eventId = req.query.eventId;
  const club = req.query.club;

  if (!eventId) {
    return res.status(400).json({ error: "Event ID is required" });
  }

  const EventModel = eventModels[club];

  try {
    const deletedEvent = await EventModel.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully", deletedEvent });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});



router.get("/event-details", async (req, res) => {

  const eventModels = {
    "artclub": LOCALEVENT,
    "craftclub": CRAFTLOCALEVENT
  };

  const event_id = req.query.event_id;
  const club = req.query.club;

  try {
    if (!event_id) {
      return res.status(400).json({ error: "event_id query parameter is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(event_id)) {
      return res.status(400).json({ error: "Invalid event_id format" });
    }

    const EventModel= eventModels[club];

    if (!EventModel) {
      return res.status(400).json({ error: `Invalid club type: ${club}` });
    }

    const event = await EventModel.findById(event_id)
      .populate("head", "name email phone position")
      .populate("director", "name email phone position");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);  // <-- directly sending event object here
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;