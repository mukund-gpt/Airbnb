const express = require("express")
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const app = express()

const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';

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
app.use(express.static(path.join(__dirname,"/public")))
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


app.get("/listings", async (req, res) => {
    let allListings = await Listing.find({})
    // console.log(allListings)
    res.render("listings/index.ejs", { allListings })
})

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})


app.get("/listings/:id", async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
})

app.post("/listings/new", async (req, res) => {
    let newlisting = new Listing(req.body.listing)
    await newlisting.save()
    res.redirect("/listings")
})

app.get("/listings/edit/:id", async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
})

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, req.body.listing)
    res.redirect(`/listings/${id}`)
})

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})