require('dotenv').config()
const { ensureLoggedIn } = require('connect-ensure-login');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {create} = require('express-handlebars');

const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const localStrategy = require('passport-local').Strategy
const flash = require('connect-flash');

hbsHelpers = require('./helpers/handlebars')

global.ensureLoggedIn = ensureLoggedIn;

// model database
const User = require('./models/User');



// routes
const mainRouter = require('./routes/r_main');
const authRouter = require('./routes/r_auth');
const artistRouter = require('./routes/r_artist');
const apiRouter = require('./routes/r_api');

const app = express();
const mongoURL = `mongodb+srv://${process.env.M_ATLAS_USER}:${process.env.M_ATLAS_PASS}@${process.env.M_ATLAS_URL}`
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true});

// view engine setup
const hbs = create({
	layoutsDir: path.join(__dirname, '/views/layouts'),
	defaultLayout: 'default',
	extname: 'handlebars',
	partialsDir  : path.join(__dirname, 'views/partials'),
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault: true
	},
	helpers: hbsHelpers
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	name: 'audionus',
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({
		mongoUrl: mongoURL,
		autoRemove: 'interval',
		autoRemoveInterval: 10,
	}),
	cookie: {secure: false, maxAge: 1209600000 } // 14 days sesson expires
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', mainRouter);
app.use('/auth', authRouter);
app.use('/api', apiRouter);
app.use('/artist', artistRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
