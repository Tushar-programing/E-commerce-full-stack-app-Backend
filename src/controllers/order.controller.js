import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
// import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Adress } from "../models/adress.model.js"
import { Cart } from "../models/cart.model.js";

import mongoose from "mongoose";


const createOrder = asyncHandler(async(req, res) => {
    const {product} = req.params;
    const {quantity, adress, status, paymentStatus} = req.body;
    // console.log(product, quantity, adress, status, paymentStatus);

    if (!product || !quantity || !adress || !status || !paymentStatus) {
        throw new ApiError(400, "All fields are required")
    }

    const pro = await Product.findById({_id: product})

    const adr = await Adress.findById(adress)
    if (!adr) {
        throw new ApiError(400, "Adress is not found")
    }

    // console.log(adr);

    const create = await Order.create({
        product,
        buyer: req.user._id,
        quantity,
        adress,
        status,
        paymentStatus,
        owner: pro.owner,
        name: adr.name,
        company: adr.company,
        phone: adr.phone,
        adress1: adr.adress1,
        adress2: adr.adress2,
        city: adr.city,
        zip: adr.zip,
        country: adr.country,
        state: adr.state,
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
                            price: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                product_details: {
                    $arrayElemAt: ["$products", 0]
                }
            }
        },
        {
            $project: {
                products: 0,
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

    if (req?.user?.email === "ttushar476@gmail.com") {
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
                                price: 1,
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
                }
            },
            {
                $project: {
                    products: 0,
                }
            }
        ])
    
        if (!order) {
            throw new ApiError(400, "You have no order yet")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, order, "User orders retrieved Successfully"))
    } else {
        throw new ApiError(400, "Acess Denied!")
    }
    
})

const createCartOrder = asyncHandler(async(req, res) => {
    const {adress, status, paymentStatus} = req.body;
    // console.log(product, quantity, adress, status, paymentStatus);

    const carts = await Cart.find({userId: req.user._id})
    // console.log(carts);

    if (carts.length <= 0) {
        throw new ApiError("First add something in your cart")
    }

    if (!adress || !status || !paymentStatus) {
        throw new ApiError(400, "All fields are required")
    }

    const adr = await Adress.findById(adress)
    // const pro = await Product.findById({_id: product})

    if (!adr ) {
        throw new ApiError(400, "Adress is not found")
    }

    const arr = [];

    try {
        for (const cart of carts) {
            const pro = await Product.findById({_id: cart.product})

            if (!pro) {
                throw new ApiError(400, "unable to get product details")
            }

            const create = await Order.create({
                product: cart.product,
                buyer: req.user._id,
                quantity: cart.quantity,
                adress,
                status,
                paymentStatus,
                owner: pro.owner,
                name: adr.name,
                company: adr.company,
                phone: adr.phone,
                adress1: adr.adress1,
                adress2: adr.adress2,
                city: adr.city,
                zip: adr.zip,
                country: adr.country,
                state: adr.state,
                // price,
            })

            console.log("create", create);

            arr.push(create)
            console.log("arr", arr);
        }
    } catch (error) {
        throw new ApiError(400, error)
    }

    console.log("array", arr);

    if (arr.length <= 0) {
        throw new ApiError(400, "unable to create order")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, arr, "Order created successfully"))
})

const getOrderById = asyncHandler(async(req, res) => {
    const {orderId} = req.params
    // console.log(orderId);

    if (!orderId) {
        throw new ApiError(400, "orderId is required")
    }

    const order = await Order.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(orderId)
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
                            price: 1,
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
            }
        },
        {
            $project: {
                products: 0,
            }
        }
    ])

    // const get = await Order.findById(orderId);

    return res
    .status(200)
    .json(new ApiResponse(200, order, "order fetched successfully"))

})


export {
    createOrder,
    updateOrder,
    userOrder,
    ownerOrder,
    createCartOrder,
    getOrderById,
}