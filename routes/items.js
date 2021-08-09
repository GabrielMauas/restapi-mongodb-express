const express = require('express');
const Item = require('../models/item.model');
const tokenVerif = require('../middlewares/auth');
const route = express.Router();


// ROUTES
// List all items - GET
route.get('/', tokenVerif, (req, res) => {

    let result = listItems();
    result
        .then(items => res.json(items))
        .catch(err => res.status(400).json(err));
});

// List item - GET
route.get('/:id', tokenVerif, (req, res) => {
    let result = listItem(req.params.id);
    result
        .then(item => res.json(item))
        .catch(err => res.status(400).json(err)); 
});

// Create item - POST
route.post('/', tokenVerif, (req, res) => {
    let result = createItem(req);
    result
        .then(item => res.json({ item }))
        .catch(err => res.status(400).json({ err }));
});

// Update item - PUT
route.put('/:id', tokenVerif, (req, res) => {
    let result = updateItem(req.params.id, req.body);
    result
        .then(item => res.json({ item }))
        .catch(err => res.status(400).json({ err }));
});

// Delete item (change state) - DELETE
route.delete('/:id', tokenVerif, (req, res) => {
    let result = desacItem(req.params.id);
    result
        .then(item => res.json({ item }))
        .catch(err => res.status(400).json({ err }));
});


// FUNCTIONS
async function createItem(req) {
    let item = new Item({
        title: req.body.title,
        owner: req.user._id,
        description: req.body.description,
        priority: req.body.priority
    });
    return await item.save();
}

async function updateItem(id, body) {
    let item = await Item.findByIdAndUpdate(id, {
        $set: {
            title: body.title,
            description: body.description,
            priority: body.priority
        }
    }, { new: true });
    return item;
}

async function desacItem(id){
    let item = await Item.findByIdAndUpdate(id, {
        $set: {
            state: false
        }
    }, { new: true });
    return item;
} // Cambia el estado a false (desactivado)

async function listItems() {
    let items = await Item
        .find({ "state": true })
        .populate('owner', 'name -_id');
    return items;
}

async function listItem(id) {
    let item = await Item.findById(id);
    return item;
}

module.exports = route;
