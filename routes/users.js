const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Tweet = require('../models/tweet');
const router = express.Router();
const auth = require('../auth');

router.post('/signup', (req, res, next) => {
    let password = req.body.password;
    var pass = bcrypt.hashSync(password);
    User.create({
        username: req.body.username,
        password: pass,
        image: req.body.image,
        email: req.body.email
    }).then((user) => {
        let token = jwt.sign({ _id: user._id }, "process.env.SECRET");
        res.json({ status: "Signup success!", token: token });
    }).catch(next);
});


router.post('/login', (req, res, next) => {

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user == null) {
                let err = new Error('User not found!');
                err.status = 401;
                return next(err);
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('Password does not match!');
                            err.status = 401;
                            return next(err);
                        }
                        let token = jwt.sign({ _id: user._id }, "process.env.SECRET");
                        console.log("welcome")
                        res.json({ status: 'Login success!', token: token });
                    }).catch(next);
            }
        }).catch(next);
})

router.post('/me', auth.verifyUser, (req, res, next) => {

    res.json({ _id: req.user._id, email: req.user.email, username: req.user.username, image: req.user.image });
});

router.post('/check', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user == null) {
                res.json({ status: "good to go" });

            } else {
                res.json({ status: "not good to go" });
            }
        }

        )
});
router.post('/showalltweet',auth.verifyUser, (req, res, next) => {
    Tweet.find()
        .then(tweet => {
res.status(200).send(tweet);
            
        })
        .catch(err => { res.status(500).json({ status: "Failed", err }) })
})
router.post('/addTweet',auth.verifyUser, (req, res, next) => {
    Tweet.create({
        headingtext: req.body.headingtext,
        messagetext: req.body.messagetext,
        userimage: req.body.userimage,
        messageimage:req.body.messageimage
    })
        .then(tweet => {
            res.json({ status: "good to go", tweet });
        })
        .catch(err => { res.status(500).json({ status: "Failed", err }) })
})

module.exports = router;
