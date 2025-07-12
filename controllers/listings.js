const { response } = require("express");
const Listing = require("../models/listing");
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const geocodingClient = mbxGeocoding({});

// by me
const geocoder = require("../utils/geocoder");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.ShowListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", " Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// map by me
module.exports.createListing = async (req, res) => {
  // 1. Geocode the location from the form
  const geoData = await geocoder.geocode(req.body.listing.location);

  if (!geoData || geoData.length === 0) {
    req.flash("error", "Location not found.");
    return res.redirect("/listings/new");
  }

  // 2. Create the listing with location and image
  const newListing = new Listing(req.body.listing);

  newListing.geometry = {
    type: "Point",
    coordinates: [geoData[0].longitude, geoData[0].latitude],
  };

  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // 3. Save to DB and redirect
  // await newListing.save();
  // req.flash("success", "New Listing Created!");
  // res.redirect(`/listings/${newListing._id}`);

  let url = req.file.path;
  let filename = req.file.filename;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", " Listing Deleted! ");
  res.redirect("/listings");
};
