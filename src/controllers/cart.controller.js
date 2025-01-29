import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
// import { products } from "./product.controllers.js";
// import { Productss } from "../models/product.model.js";

const create = asyncHandler(async(req, res) => {
    const { quantity } = req.body;
    const { product } = req.params;
    console.log(quantity, product);

    if (!product || !quantity) {
        throw new ApiError(400, "Please provide product and quantity");
    }
    
    const existedCart = await Cart.findOne({
        product,
        userId: req.user._id
    })

    if (existedCart) {
        // throw new ApiError(400, "this is working")
        if ((existedCart.quantity + quantity) <= 10) {
            const plus = await Cart.findByIdAndUpdate(
                existedCart._id,
                {
                    $set: {
                        quantity: (quantity + existedCart.quantity ) ,
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
            const plus = await Cart.findByIdAndUpdate(
                existedCart._id,
                {
                    $set: {
                        quantity: 10,
                    }
                },
                {new: true}
            )
    
            if (!plus) {
                throw new ApiError(401, "unable to update quantity")
            }
    
            return res
            .status(200)
            .json(new ApiResponse(200, plus, "You can not add more than 10 pcs"))
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
        {
            $sort: {
                createdAt: -1 // Sort by createdAt in descending order
            }
        }
    ])

    if (!get) {
        throw new ApiError(400, "No carts found for this User")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, get, "cart retrived  successfully"));

})

const getCartsByDate = asyncHandler(async (req, res) => {
    if (req?.user?.email === "ttushar476@gmail.com") {
        const { startDate, endDate } = req.body;
        
        console.log(startDate, endDate);
        
        // Validate that both dates are provided
        if (!startDate || !endDate) {
            throw new ApiError(400, "Start date and end date are required");
        }

        // Convert dates to proper Date objects for querying
        const start = new Date(startDate);
        const end = new Date(endDate);

        end.setUTCHours(23, 59, 59, 999);

        // Fetch carts between the date range
        const carts = await Cart.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start, // Greater than or equal to start date
                        $lte: end,   // Less than or equal to end date
                    },
                },
            },
            {
                $lookup: {
                    from: "users", // Join with the Users collection
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $lookup: {
                    from: "products", // Join with the Products collection
                    localField: "product",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            {
                $unwind: "$userDetails", // Flatten user details array
            },
            {
                $unwind: {
                    path: "$productDetails", // Flatten product details array
                    preserveNullAndEmptyArrays: true, // Handle cases with no products
                },
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    userId: 1,
                    "userDetails._id": 1,
                    "userDetails.fullName": 1,
                    "userDetails.mobile": 1,
                    "userDetails.email": 1,
                    "productDetails._id": 1,
                    "productDetails.title": 1,
                    "productDetails.brand": 1,
                    "productDetails.price": 1,
                    "productDetails.image": 1,
                    "productDetails.quantity": 1,
                    "productDetails.description": 1,
                },
            },
            {
                $sort: {
                    createdAt: -1, // Sort by createdAt in descending order
                },
            },
        ]);

        // console.log(carts, );
        

        // if (!carts || carts.length === 0) {
        //     throw new ApiError(400, "No carts found for the given date range");
        // }

        return res
            .status(200)
            .json(new ApiResponse(200, carts, "Carts retrieved successfully"));
    } else {
        throw new ApiError(400, "Access Denied!");
    }
});


export {
    create,
    updateCart,
    removeCart,
    getAllCart,
    getCartsByDate,
}