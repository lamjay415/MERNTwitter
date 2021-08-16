const express = require("express");
const mongoose = require('mongoose');
const app = express();
const db = require('./config/keys').mongoURI;
const bodyParser = require("body-parser");
const User = require("./models/User");

//routes

const users = require("./routes/api/users.js");
const tweets = require("./routes/api/tweets.js");

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {
  const user = new User({
    handle: "Max",
    email: "maxrichter@richter.com",
    password: "musicislove"
  })
  user.save()
  res.send(`Hello ${user}`);
})



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use("/api/users", users);
app.use("/api/tweets", tweets);



app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

