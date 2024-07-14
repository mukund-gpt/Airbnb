const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(isLoggedIn, wrapAsync(listingControllers.createListing));

router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)
);

router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

module.exports = router;
