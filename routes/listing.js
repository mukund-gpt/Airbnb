const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

router.get("/", wrapAsync(listingControllers.index));

router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router.get("/:id", wrapAsync(listingControllers.showListing));

router.post("/", isLoggedIn, wrapAsync(listingControllers.createListing));

router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingControllers.updateListing)
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.deleteListing)
);

module.exports = router;
