const Joi = require("joi")

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null)
        }).allow(null),
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),

    }).required()
})