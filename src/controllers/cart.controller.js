import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
// import { products } from "./product.controllers.js";
// import { Productss } from "../models/product.model.js";

const create = asyncHandler(async(req, res) => {
    const { quantity } = req.body;
    const { product } = req.params;


    if (!product || !quantity) {
        throw new ApiError(400, "Please provide product and quantity");
    }
    
    const existedCart = await Cart.findOne({
        product,
        userId: req.user._id
    })


    if (existedCart) {
        // throw new ApiError(400, "this is working")
        if (existedCart.quantity < 20) {
            const plus = await Cart.findByIdAndUpdate(
                existedCart._id,
                {
                    $set: {
                        quantity: ++existedCart.quantity ,
                    }
                },
                {new: true}
            )
    
            if (!plus) {
                throw new ApiError(401, "unable to update quantity")
            }
    
            return res
            .status(200)
            .json(new ApiResponse(200, plus, "update cart succesfully"))
        } else {
            throw new ApiError(400, "unable to add more than 20 pcs")
        }
        
    }

    const create = await Cart.create({
        userId: req.user._id,
        product,
        quantity,
    })

    if (!create) {
        throw new ApiError(400, "unable to create Cart")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, create, "Cart created successfully"));
})


const updateCart = asyncHandler(async(req, res) => {
    const {cart} = req.params;
    const {quantity} = req.body;

    if (!cart || !quantity) {
        throw new ApiError(400, "unable to find  the cart");
    }

    const update = await Cart.findByIdAndUpdate(
        cart,
        {
            $set: {
                quantity,
            }
        },
        {new: true}
    )

    if (!update) {
        throw new ApiError(400, "Unable to update the cart");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, update, "Cart updated Successfully"))

})

const removeCart = asyncHandler(async(req, res) => {
    const {cart} = req.params;
    
    if (!cart) {
        throw new ApiError(400, "cart id is missing")
    }

    const del = await Cart.findByIdAndDelete(cart);

    if (!del) {
        throw new ApiError(400, "unable to delete the item from the cart")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Item removed from the cart"));
})

const getAllCart = asyncHandler(async(req, res) => {
    const get = await Cart.aggregate([
        {
            $match: {
                userId: req.user._id
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            brand: 1,
                            price: 1,
                            image: 1,
                            quantity: 1,
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
        },
    ])

    if (!get) {
        throw new ApiError(400, "No carts found for this User")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, get, "cart retrived  successfully"));

})

export {
    create,
    updateCart,
    removeCart,
    getAllCart,
}