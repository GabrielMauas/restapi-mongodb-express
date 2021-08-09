const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Joi = require('Joi');
const tokenVerif = require('../middlewares/auth');
const route = express.Router();

// Validation Schema
const schema = Joi.object({
   name: Joi.string()
        .min(3)
        .max(10)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})


// List All Users (GET)
route.get('/', tokenVerif, (req, res) => {
    let result = listUsers();
    result
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(400).jso({
                error: err
            });
        });
});

// List one User (GET)
route.get('/:id', tokenVerif, (req, res) => {
    let result = listUser(req.params.id);

    result
        .then(user => {
            res.json({
                name: user.name,
                email: user.email
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
});

// Create User (POST)
route.post('/', (req, res) => {
    let body = req.body;

    // Comprueba si el email ya existe
    User.findOne({ email: body.email }, (err, user) => {
        if(err){
            return res.status(400).json({ error: 'Server error' });
        }
        if(user){
            // Si exsite el usuario envía un mensaje de error.
            return res.status(400).json({ msg: 'The user already exist.' });
        }
    });

    const { error, value } = schema.validate({ name: body.name, email: body.email });
    if(!error) {
        let result = createUser(body);

        result
            .then(usr => {
                res.json({
                    name: usr.name,
                    email: usr.email 
                });
            })
            .catch(err => {
                res.status(404).json({
                    error: err
                })
            });
    } else {
        res.status(400).json({
            error: error.details[0].message
        });
    }
});

// Update User (PUT)
route.put('/:id', tokenVerif, (req, res) => {

    const { error, value } = schema.validate({ name: req.body.name });
    
    if(!error) {
        let result = updateUser(req.params.id, req.body);

        result
            .then(usr => {
                res.json({
                    name: usr.name, 
                    email: usr.email
                });
            })
            .catch(err => {
                res.status(404).json({
                    error: err
                })
            });
    } else {
        res.status(400).json({
            error: error.details[0].message
        });
    }
});


// Delete User (DELETE)
route.delete('/:id', tokenVerif, (req, res) => {
    let result = desacUser(req.params.id);
    
    result
        .then(value => {
            res.json({
                name: value.name,
                email: value.email 
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
})

// FUNCTIONS
async function createUser(body) {
    let user = new User({
        email: body.email,
        name: body.name,
        password: bcrypt.hashSync(body.password, 10)  
    });
    return await user.save();
}

async function updateUser(id, body) {
    let user = await User.findByIdAndUpdate(id, {
        $set: {
            name: body.name,
            password: body.password
        }
    }, { new: true });
    return user;
}

async function desacUser(id){
    let user = await User.findByIdAndUpdate(id, {
        $set: {
            state: false
        }
    }, { new: true });
    return user;
} // Cambia el estado a false (desactivado)

async function listUsers() {
    let users = await User.find({ "state": true })
        .select({ name: 1, email: 1 });
    return users;
}

async function listUser(id) {
    let user = await User.findById(id);
    return user;
}


module.exports = route;
