const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Tweet = require("../../models/Tweet");
const validateTweetInput = require("../../validation/tweets");


router.get("/", (req, res) => {
    Tweet.find()
    .sort({date: -1})
    .then(tweets => res.json(tweets))
    .catch(err => res.status(404).json({notfound: "No tweets found"}));
})

router.get('/tweets/:user_id', (req,res) => {
    Tweet.find({user: req.params.user_id})
    .sort({date: -1})
    .then(tweets => res.json(tweets))
    .catch(err => res.status(404).json({notfound: `No tweets have found from ${req.username}`}))

})

router.get('/:id', (req, res) => {
    Tweet.findById(req.params.id)
    .then(tweet => res.json(tweet))
    .catch(err => {
        res.status(404).json({notfound: 'No tweet found with that ID'})
    })
})

router.post('/', passport.authenticate('jwt', {session: false}),  (req, res) => {
    const { errors, isValid } = validateTweetInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    const newTweet = new Tweet({
        text: req.body.text,
        user: req.user.id
    })
    newTweet.save().then(tweet => res.json(tweet));
})

module.exports = router;