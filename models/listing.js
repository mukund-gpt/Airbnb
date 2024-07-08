const mongoose = require("mongoose")


const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default:"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            //set: (v) => v === "" ? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.canva.com%2Fphone-wallpapers%2Ftemplates%2Fcute%2F&psig=AOvVaw37DCUC9_m4t40LhV-o4sr1&ust=1720376920089000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLjb2-yFk4cDFQAAAAAdAAAAABAE" : v,
        }
    },
    price: Number,
    location: String,
    country: String
})

const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing