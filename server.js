// Imports
const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const items = require('./routes/items');
const auth = require('./routes/auth');
const config = require('config');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', users);
app.use('/api/items', items);
app.use('/api/auth', auth);

// DB Config
const dbConnection = config.get('DBConfig.HOST');
mongoose.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log('DB Connected')).catch(err => console.log(`DB Connection Error: ${err}.`));

// Port/Server Config
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});