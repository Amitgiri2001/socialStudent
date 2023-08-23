const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config()
// console.log(process.env)



const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const likeRoutes = require('./routes/like');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(express.json()); //



app.use('/images', express.static(__dirname + '/images'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/like', likeRoutes);


const uri = process.env.DATABASE_URL;

// Connect to MongoDB Atlas
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log("Connected to MongoDB Atlas");

}).catch(err => { console.log(err); });


const port = process.env.PORT || 8000;

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`);
});