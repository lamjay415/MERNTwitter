const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const User = require("../../models/User.js");
const validRegisterInput = require("../../validation/register");
const validLoginInput = require("../../validation/login");

router.get("/test", (req, res) => {
  res.json({msg: "This is the test route"})
  
})

router.post('/register', (req, res) => {

  const { errors, isValid } = validRegisterInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }

  // Check to make sure nobody has already registered with a duplicate email
  User.find({ email: req.body.email })
    .then(user => {
      if (user) {
        // Throw a 400 error if the email address already exists
        return res.status(400).json({email: "A user has already registered with this address"})
      } else {
        // Otherwise create a new user
        const newUser = new User({
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
})

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { errors, isValid } = validLoginInput(req.body);

  if(!isValid){
    return res.status(400).json(errors)
  };

  User.findOne({ email })
  .then(user => {
    if(!user){
      return res.status(404).json({email: "This user does not exist"})
    }

    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch){
        res.json({msg: "Success!"})
      }else{
        return res.status(400).json({password: "The password was incorrect."});
      }
    })
  })
})

module.exports = router;