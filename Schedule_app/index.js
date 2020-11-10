const express = require('express');
const router = require('./routes/routes.js');
const path = require('path');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();

const public = path.join(__dirname, 'public');
app.use(express.static(public));

app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded({extended:false}));

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})

app.use('/', router);