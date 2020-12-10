const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

//passport config:
require('./config/passport')(passport)

//mongoose
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('Connected to mongoDB Database'))
.catch((err)=> console.log(err));

const app = express();

const public = path.join(__dirname, 'public');
app.use(express.static(public));

app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded({extended:false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
//use flash
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    res.locals.message = req.flash('message');
    next();
})

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})

app.use('/users', require('./routes/users'));
app.use('/', require('./routes/routes'));