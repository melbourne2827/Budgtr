if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const port = process.env.PORT || 3000;

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const MongoStore = require('connect-mongo')

const ExpressError = require('./utils/expressError')

const userRoutes = require('./routes/users')
const entryRoutes = require('./routes/entries')
const analyticRoutes = require('./routes/analytics')

const User = require('./models/user')

const dbUrlp = process.env.DB_URL
const dbUrll = 'mongodb://127.0.0.1:27017/budgtr';

mongoose.set('strictQuery', false) //to avoid deprecation warning

mongoose.connect(dbUrlp || dbUrll, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database connected')
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const store = MongoStore.create({
    mongoUrl: dbUrll,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET || 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    secret: process.env.SESSION_SECRET || 'thiscouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware to set currentUser before rendering views
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', analyticRoutes)
app.use('/', userRoutes)
app.use('/', entryRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { message = 'Oh!! Something went wrong', statusCode = 500 } = err
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log('Server running on port ' + port)
})
