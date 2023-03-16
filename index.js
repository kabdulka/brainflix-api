const express = require("express");
const app = express();
// const router = express.Router();
const { v4: uuidv4 } = require("uuid");
// const videoRoutes = require("./routes/videos");
const videoRoutes = require("./routes/videos.js")
const cors = require("cors");

// const data = require("./data/videos.json");
// which port is best to use, if any?
// const port = 9000;
// const {CORS_ORIGIN} = process.env

require("dotenv").config();
const CORS_ORIGIN = process.env.CORS_ORIGIN;
console.log(CORS_ORIGIN)
// or write it like this
// const dotenv = require("dotenv");

const PORT = process.env.PORT || 9000

console.log("process.env.PORT ", process.env.PORT)

// MiddleWare
app.use(cors({origin: CORS_ORIGIN}))
app.use(express.static('public')); // allows access to public folder
// app.use('/static', express.static(path.join(__dirname, 'public')))
// app.use(express.static(path.join(__dirname, 'public')))


app.use('/videos', videoRoutes);

app.listen (PORT, () => {
    console.log(`Express listening on port ${PORT}`);
})

  //  "client": "cd client && npm start",
  //   "server": "cd server && nodemon server",