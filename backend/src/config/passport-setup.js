import dotenv from 'dotenv'
dotenv.config()  

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from "../models/user.model.js";



passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8000/api/v1/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                done(null, existingUser);
            } else {
                const newUser = await new User({
                    googleId: profile.id,
                    username: `google_${profile.id.substring(0, 8)}`,
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                }).save();
                done(null, newUser);
            }
        } catch (error) {
            done(error, null);
        }
    })
);
