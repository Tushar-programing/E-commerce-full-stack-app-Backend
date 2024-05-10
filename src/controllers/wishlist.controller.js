import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Wishlist } from "../models/wishlist.model.js";


const addWishlist = asyncHandler(async(req, res) => {
    const {productId} = req.params
    // console.log(productId);

    if (!productId) {
        throw new ApiError(400, "All fields are required")
    }

    const existed = await Wishlist.findOne({
        product: productId,
        userId: req.user._id
    })

    if (existed) {
        const del = await Wishlist.findByIdAndDelete(existed._id);

        if (!del) {
            throw new ApiError(400, "Unable to delete wishlist")
        }

        return res
        .status(200)
        .json(new ApiResponse(200, false, "Successfully deleted the wishlist"))
    }

    const create = await Wishlist.create({
        product: productId,
        userId: req.user._id,
    })

    if (!create) {
        throw new ApiError(400, "unable to create wishlist")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, true, "succesfully created the wishlist"))
})

const deleteList = asyncHandler(async(req, res) => {
    const {wishlistId} = req.params;

    if (!wishlistId) {
        throw new ApiError(400, "Wishlist Id is not found")
    }

    const del = await Wishlist.findByIdAndDelete(wishlistId);

    if (!del) {
        throw new ApiError(400, "Unable to delete wishlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully deleted the wishlist"))
})

const getWishlistById = asyncHandler(async(req, res) => {
    const {productId} = req.params;

    if (!productId) {
        throw new ApiError(400, "unable to find wishlistId")
    }

    const get = await Wishlist.findOne({
        userId : req.user._id ,
        product : productId,
    })

    let value;
    if (get) {
        value = true
    } else {
        value = false
    }

    return res
    .status(201)
    .json(new ApiResponse(201, value, "succesfully get the wishlist"))
})

const getWishlists = asyncHandler(async(req, res) => {
    const get = await Wishlist.aggregate([
        {
            $match: {
                userId: req.user._id,
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'product',
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            brand: 1,
                            price: 1,
                            image: 1,
                            description: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                product_details: {
                    $first: "$product"
                }
            }
        },
        {
            $project: {
                product: 0,
            }
        }
    ])

    if (!get) {
        throw new ApiError(400, "unable to get wishlists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, get, "succesfully get the wishlist"))
})

export {
    addWishlist,
    deleteList,
    getWishlistById,
    getWishlists,
}