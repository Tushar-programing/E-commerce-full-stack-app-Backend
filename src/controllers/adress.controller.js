import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { Adress } from "../models/adress.model.js";

const createAdress = asyncHandler(async(req, res) => {
    const {name, company, phone, adress1, adress2, city, zip, country, state} = req.body;
    console.log(name, company, phone, adress1, adress2, city, zip, country, state);

    if (!name || !company || !phone || !adress1 || !adress2 || !city || !zip || !country || !state) {
        throw new ApiError(400, "All fields are required")
    }

    const create = await Adress.create({
        name,
        company,
        phone,
        adress1,
        adress2,
        city,
        zip,
        country,
        state,
        owner: req.user._id
    })

    if (!create) {
        throw new ApiError(404, "unable to create Adress")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, create, "Product Created Successfully"));

})

const updateAdress = asyncHandler(async(req, res) => {
    const {name, company, phone, adress1, adress2, city, zip, country, state} = req.body;
    // console.log(name, company, phone, adress1, adress2, city, zip, country, state);
    const {adressId} = req.params;

    if (!name || !company || !phone || !adress1 || !adress2 || !city || !zip || !country || !state) {
        throw new ApiError(400, "All fields are required")
    }

    if (!adressId) {
        throw new ApiError(400, "unable to find the adressId")
    }

    const update = await Adress.findByIdAndUpdate(
        adressId,
        {
            $set: {
                name,
                company,
                phone,
                adress1,
                adress2,
                city,
                zip,
                country,
                state
            }
        },
        {new: true}
    )

    if (!update) {
        throw new ApiError(400, "unable to update the product")
    }


    return res
    .status(200)
    .json(new ApiResponse(200, update, "successfully updated the Product"))
})

const deleteAdress = asyncHandler(async(req, res) => {
    const {adressId} = req.params;
    // console.log(adressId);

    if (!adressId) {
        throw new ApiError(400, "adressId is missing from the url parameters")
    }

    const del = await Adress.findByIdAndDelete(adressId);

    if (!del) {
        throw new ApiError(400, "unable to delete Adress")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully deleted the Adress"));
})

const getAllAdress = asyncHandler(async(req, res) => {
    const get = await Adress.find({owner: req.user._id})
    return res
    .status(200)
    .json(new ApiResponse(200, get, "data fetched successfully"))
})

export {
    createAdress,
    updateAdress,
    deleteAdress,
    getAllAdress,
}