const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { body, validationResult } = require('express-validator'); 

router.get('/register', (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.render('v_auth/v_register', {
        title: 'Register and Listening Music!',
        layout: 'auth'
    })
});

router.get('/login', (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.render('v_auth/v_login', {
        title: 'Login Page.',
        flashMsg: req.flash(),
        layout: 'auth'
    })
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/',
    failureFlash: true
}))

router.post('/register', 
    // validate form
    body('email').notEmpty().isEmail().withMessage('Email is not valid.').custom(async value => {
        if (await User.findOne({email: value})) throw new Error('Email already in use.')
    }),
    body('username').notEmpty().isAlphanumeric().isLength({min: 6, max: 16}).withMessage('Username must be between 6-12 characters long and contains only numbers and letters.').custom(async value => {
        if (await User.findOne({username: value})) throw new Error('Username already in use.')
    }),
    body('password').notEmpty().isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0}).withMessage('Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number'),

(req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.render('v_auth/v_register', {title: 'Register Failed.', formErrors: errors, layout: 'auth'})
    } else {
        User.register(new User({
            username: req.body.username,
            email: req.body.email,
            profilePicture: `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${req.body.username}&size=155&rounded=true`
        }), req.body.password, (error) => {
            res.redirect('/auth/login')
        })
    }

});

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.session.destroy()
        res.clearCookie('hellsounds');
        res.redirect('/auth/login');
    });
});

module.exports = router;
