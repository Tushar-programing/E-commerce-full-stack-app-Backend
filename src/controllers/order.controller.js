import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
// import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { products } from "./product.controllers.js";


const createOrder = asyncHandler(async(req, res) => {
    const {product} = req.params;
    const {quantity, adress, status, paymentStatus} = req.body;
    // console.log(product, quantity, adress, status, paymentStatus);

    if (!product || !quantity || !adress || !status || !paymentStatus) {
        throw new ApiError(400, "All fields are required")
    }

    const pro = await Product.findById({_id: product})

    // console.log(pro);

    const create = await Order.create({
        product,
        buyer: req.user._id,
        quantity,
        adress,
        status,
        paymentStatus,
        owner: pro.owner,
        // price,
    })

    if (!create) {
        throw new ApiError(400, "unable to create order")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, create, "Order created successfully"))

})

const updateOrder = asyncHandler(async(req, res) => {
    const {orderId} = req.params;
    const {status} = req.body;

    if (!orderId) {
        throw new ApiError(400, "no order id found")
    }

    const update = await Order.findByIdAndUpdate(
        orderId,
        {
            $set: {
                status,
            }
        },
        {new: true}
    )

    if (!update) {
        throw new ApiError(400, "unable to update the order")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, update, "Order updated successfully"));

})

const userOrder = asyncHandler(async(req, res) => {
    
    const order = await Order.aggregate([
        {
            $match: {
                buyer: req.user._id,
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "products",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            description: 1,
                            brand: 1,
                            image: 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "adresses",
                localField: "adress",
                foreignField: "_id",
                as: "address",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            company: 1,
                            phone: 1,
                            address1: 1,
                            address2: 1,
                            city: 1,
                            zip: 1,
                            country: 1,
                            state: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                product_details: {
                    $arrayElemAt: ["$products", 0]
                },
                address_detail: {
                    $arrayElemAt: ["$address", 0]
                }
            }
        },
        {
            $project: {
                products: 0,
                address: 0,
            }
        }
        
    ]);
    

    if (!order) {
        throw new ApiError(400, "You have no order yet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, order, "your orders retrieved Successfully"))

})

const ownerOrder = asyncHandler(async(req, res) => {

    const order = await Order.aggregate([
        {
            $match: {
                owner: req.user._id
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "products",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            description: 1,
                            brand: 1,
                            image: 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "adresses",
                localField: "adress",
                foreignField: "_id",
                as: "address",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            company: 1,
                            phone: 1,
                            address1: 1,
                            address2: 1,
                            city: 1,
                            zip: 1,
                            country: 1,
                            state: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                product_details: {
                    $arrayElemAt: ["$products", 0]
                },
                address_detail: {
                    $arrayElemAt: ["$address", 0]
                }
            }
        },
        {
            $project: {
                products: 0,
                address: 0,
            }
        }
    ])

    if (!order) {
        throw new ApiError(400, "You have no order yet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, order, "User orders retrieved Successfully"))
})


export {
    createOrder,
    updateOrder,
    userOrder,
    ownerOrder,
}