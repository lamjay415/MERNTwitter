const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");


const options = {};

options.jwtFromRequestFrom = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use( new jwtStrategy(options, (jwt_payload, done) => {
        console.log(jwt_payload);
        done();
    }))
}