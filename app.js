const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const UserRoutes = require('./Routes/user');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const app = express();

// Connect DB
mongoose.connect(process.env.DB, {useNewUrlParser : true, useUnifiedTopology : true})
    .then( () => console.log('Database is connected successfully'))
    .catch( () => console.log('Check your DB'));

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// Routes Middleware
app.use('/api',UserRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})