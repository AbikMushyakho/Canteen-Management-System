require("dotenv").config();
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const UserService = require("../service/User.service");


const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    let user = payload.sub;

    const gotUser = await UserService.findById(user.id);
    gotUser.role_id = user.role_id;
    if (gotUser) return done(null, gotUser);
    return done(null, false);
  } catch (err) {
    return done(err, null);
  }
});

module.exports = (passport) => {
  passport.use(strategy);
};
