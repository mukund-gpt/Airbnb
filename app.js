const express = require("express")
const mongoose = require("mongoose")

const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const ExpressError = require("./utils/ExpressError.js")
const app = express()

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

const session = require("express-session")
const flash = require("connect-flash")

const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';
// const MONGO_URL = 'mongodb+srv://abhishek:abhishek@atlascluster.tx78vye.mongodb.net/airbnb';

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

const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
}

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.use(session(sessionOptions))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some went wrong" } = err
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message)
})