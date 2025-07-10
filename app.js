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



// All APIs
app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/artClub'))
app.use(require('./routes/danceClub'))
app.use(require('./routes/activity'))
app.use(require('./routes/compitition'))
app.use(require('./routes/chapter'))
app.use(require('./routes/school'))


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



