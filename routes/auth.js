const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const route = express.Router();

// Environment variables
const seed = config.get('tokenConfig.SEED');
const exp = config.get('tokenConfig.expiration');

route.post('/', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(data => {
            if(data){
                const validPass = bcrypt.compareSync(req.body.password, data.password);
                if(!validPass) return res.status(400).json({ 
                    error: 'Ok',
                    msg: 'Incorrect User or Password.'
                })

                const jwToken = jwt.sign({
                    user: {
                        _id: data._id,
                        name: data.name,
                        email: data.email
                    }
                }, seed, { expiresIn: exp });
                res.json({
                    user: {
                        _id: data._id,
                        name: data.name,
                        email: data.email
                    },
                    jwToken
                });
            } else {
                res.status(400).json({
                    error: 'Ok',
                    msg: 'Incorrect User or Password.'
                });
            }
        })
        .catch(err => {
            res.status(400).json({
                error: 'Ok',
                msg: 'Server error: ' + err
            });
        });
});


module.exports = route;