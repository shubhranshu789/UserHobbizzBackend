const express = require('express');
const cors = require('cors');


const port = 5000;
const app = express();

app.use(cors())
// All Models Database
require('./model/user')
require('./model/artClub/clubNews')
require('./model/danceClub/danceClubNews')
require('./model/artClub/addActivity')
require('./model/artClub/addCompitition')
require('./model/artClub/journal')
require('./model/artClub/clubDomain')
require('./model/artClub/clubGallery')
require('./model/artClub/clubHeritage')
require('./model/calender')
require('./model/director')
require('./model/principle')
require('./model/editor')
require('./model/artClub/judge')
require('./model/localEvent')
require('./model/cabinate')
require('./model/school')
require('./model/artClub/artClubs')
require('./model/artClub/clublegacy')



// All APIs
app.use(express.json());
app.use(require('./routes/AllClubRoutes/artClub/auth'))
app.use(require('./routes/AllClubRoutes/artClub/artClub'))
app.use(require('./routes/AllClubRoutes/artClub/activity'))
app.use(require('./routes/AllClubRoutes/artClub/compitition'))
app.use(require('./routes/AllClubRoutes/artClub/school'))



app.use(require('./routes/danceClub'))
app.use(require('./routes/chapter'))


// --------------------------------------------------------CraftClub-------------------------------------------------------------------
require('./AllModels/CraftClub/cabinate')
require('./AllModels/CraftClub/director')
require('./AllModels/CraftClub/editor')
require('./AllModels/CraftClub/principle')
require('./AllModels/CraftClub/user')
require('./AllModels/CraftClub/localevent')
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




app.use(require('./routes/AllClubRoutes/craftClub/activity'))
app.use(require('./routes/AllClubRoutes/craftClub/auth'))
app.use(require('./routes/AllClubRoutes/craftClub/compitition'))
app.use(require('./routes/AllClubRoutes/craftClub/craft'))
app.use(require('./routes/AllClubRoutes/craftClub/school'))
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



