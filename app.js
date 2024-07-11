const express = require("express")
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")

const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./Schema.js")
const app = express()

// const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';
const MONGO_URL = 'mongodb+srv://abhishek:abhishek@atlascluster.tx78vye.mongodb.net/airbnb';

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
app.get("/", (req, res) => {
    res.send("Hello world")
})
/* 
app.get("/listing", async(req, res) => {
    let sampleListing=new Listing({
        title:"hotel",
        description:"Nothing",
        price:12554,
        location:"jaipur",
        country:"india"
    })
    await sampleListing.save()
    res.send("Added successfully")
})
 */


app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({}).sort({ _id: -1 })
    // console.log(allListings)
    res.render("listings/index.ejs", { allListings })
}))

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})


app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", { listing })
}))

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        console.log(error)
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else next()
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        console.log(error)
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else next()
}

app.post("/listings/new", wrapAsync(async (req, res) => {
    let newlisting = new Listing(req.body.listing)
    await newlisting.save()
    res.redirect("/listings")
}))

app.get("/listings/edit/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, req.body.listing)
    res.redirect(`/listings/${id}`)
}))

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))

// Reviews
app.post("/listings/reviews/:id", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    res.redirect(`/listings/${listing.id}`)
}))

// Reviews delete
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findById(reviewId)
    res.redirect(`/listings/${id}`)
}))

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some went wrong" } = err
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message)
})