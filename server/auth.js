const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

const {User} = require('./db');

router.get('/ping', (req, res) => res.send('pong'));

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                return done(err);
            if (!user)
                return done(null, false);

            if (user.password !== password)
                return done(null, false);

            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});

router.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.json({message: "Logged in successfully"});
    });

router.post('/signup', (req, res, next) => {
    const data = req.body;

    const user = new User(data);
    user.save((err, user) => {
        if (err)
            return next(err);

        res.json({
            message: "User was created",
            user: user,
        })
    })
});

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    return router;
};
