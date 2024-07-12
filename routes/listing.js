const express=require("express")
const router=express.Router()

const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../Schema.js")

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        console.log(error)
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else next()
}

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

router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({}).sort({ _id: -1 })
    // console.log(allListings)
    res.render("listings/index.ejs", { allListings })
}))

router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", { listing })
}))

router.post("/new", wrapAsync(async (req, res) => {
    let newlisting = new Listing(req.body.listing)
    await newlisting.save()
    res.redirect("/listings")
}))

router.get("/edit/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, req.body.listing)
    res.redirect(`/listings/${id}`)
}))

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))

module.exports=router;