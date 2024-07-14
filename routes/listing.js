const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../Schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else next();
};

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

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({}).sort({ _id: -1 });
    // console.log(allListings)
    res.render("listings/index.ejs", { allListings });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you  requested doesn't exist..");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you  requested doesn't exist..");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
