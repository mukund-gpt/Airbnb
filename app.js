if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}

const express = require("express")
const mongoose = require("mongoose")

const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const ExpressError = require("./utils/ExpressError.js")
const app = express()

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const session = require("express-session")
const MongoStore = require('connect-mongo')
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const wrapAsync = require("./utils/wrapAsync.js")
const listingControllers = require("./controllers/listings.js");

// const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';
const MONGO_URL = process.env.ATLAS_URL

main().then(() => {
    console.log("Connected Successfully")
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL)
}
app.listen(3000, () => {
    console.log("Server is Listening to port 3000")
})


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:86400
})

store.on("error",()=>{
    console.log("Error in Mongo Session Store")
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
}


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})

app.get("/",wrapAsync(listingControllers.index))
app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/",userRouter)


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some went wrong" } = err
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message)
})