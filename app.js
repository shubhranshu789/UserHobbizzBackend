const express = require('express');
const cors = require('cors');


const port = 5000;
const app = express();

app.use(cors())
// All Models Database
require('./AllModels/ArtClub/user')
require('./AllModels/ArtClub/calender')
require('./AllModels/ArtClub/principle')
require('./AllModels/ArtClub/director')
require('./AllModels/ArtClub/editor')
require('./AllModels/ArtClub/localEvent')
require('./AllModels/ArtClub/cabinate')
require('./AllModels/ArtClub/school')
require('./AllModels/ArtClub/art/artClubs')
require('./AllModels/ArtClub/art/clublegacy')
require('./AllModels/ArtClub/art/clubNews')
require('./AllModels/ArtClub/art/addActivity')
require('./AllModels/ArtClub/art/addCompitition')
require('./AllModels/ArtClub/art/judge')
require('./AllModels/ArtClub/art/journal')
require('./AllModels/ArtClub/art/clubDomain')
require('./AllModels/ArtClub/art/clubGallery')
require('./AllModels/ArtClub/art/clubHeritage')



// ------------------------------------------------------DanceClub-------------------------------------------------------------------
require('./Model/danceClub/danceClubNews')



// --------------------------------------------------------CraftClub-------------------------------------------------------------------
require('./AllModels/CraftClub/cabinate')
require('./AllModels/CraftClub/director')
require('./AllModels/CraftClub/editor')
require('./AllModels/CraftClub/localevent')
require('./AllModels/CraftClub/principle')
require('./AllModels/CraftClub/user')
require('./AllModels/CraftClub/school')
require('./AllModels/CraftClub/craft/addActivity')
require('./AllModels/CraftClub/craft/addCompitition')
require('./AllModels/CraftClub/craft/craftClubs')
require('./AllModels/CraftClub/craft/clubDomain')
require('./AllModels/CraftClub/craft/clubGallery')
require('./AllModels/CraftClub/craft/clubHeritage')
require('./AllModels/CraftClub/craft/clubNews')
require('./AllModels/CraftClub/craft/clublegacy')
require('./AllModels/CraftClub/craft/journal')
require('./AllModels/CraftClub/craft/judge')




// All APIs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes/AllClubRoutes/artClub/auth'))
app.use(require('./routes/AllClubRoutes/artClub/artClub'))
app.use(require('./routes/AllClubRoutes/artClub/activity'))
app.use(require('./routes/AllClubRoutes/artClub/compitition'))
app.use(require('./routes/AllClubRoutes/artClub/school'))


app.use(require('./routes/AllClubRoutes/craftClub/activity'))
app.use(require('./routes/AllClubRoutes/craftClub/auth'))
app.use(require('./routes/AllClubRoutes/craftClub/compitition'))
app.use(require('./routes/AllClubRoutes/craftClub/craft'))
app.use(require('./routes/AllClubRoutes/craftClub/school'))

app.use(require('./routes/danceClub'))
app.use(require('./routes/chapter'))



// --------------------------------------------------------CraftClub-------------------------------------------------------------------


app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})



const mongoose = require('mongoose');
const {mongoURl}  = require('./keys');


mongoose.connect(mongoURl)


mongoose.connection.on("connected" , () => {
    console.log("Mongoose is connected");
})

mongoose.connection.on("error" , () => {
    console.log("Mongoose is not connected");
})



