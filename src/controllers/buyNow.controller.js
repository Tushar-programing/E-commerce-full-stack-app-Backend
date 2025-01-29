import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { BuyNow } from "../models/buyNow.model.js";

const addBuyNow = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId) {ss
        console.log("Step 2: Product ID is missing");
        throw new ApiError(400, "Product ID is required");
    }

    const existingBuyNow = await BuyNow.findOne({
        productId,
        buyer_id: req.user._id,
    });

    if (existingBuyNow) {

        existingBuyNow.repeat += 1;
        await existingBuyNow.save();
        console.log("Step 5: Updated repeat quantity for existing entry");
        return res
            .status(200)
            .json(new ApiResponse(200, existingBuyNow, "Quantity updated for Buy Now"));
    }
    
    const newBuyNow = await BuyNow.create({
        productId,
        buyer_id: req.user._id,
        repeat: 1, // Default quantity for new buy-now entries
    });

    if (!newBuyNow) {
        throw new ApiError(400, "Unable to create Buy Now entry");
    }
    
    return res
        .status(201)
        .json(new ApiResponse(201, newBuyNow, "Successfully created Buy Now entry"));
});

const deleteBuyNow = asyncHandler(async (req, res) => {
    const { buyNowId } = req.params;

    if (!buyNowId) {
        throw new ApiError(400, "Buy Now ID is required");
    }

    const deletedBuyNow = await BuyNow.findByIdAndDelete(buyNowId);

    if (!deletedBuyNow) {
        throw new ApiError(400, "Unable to delete Buy Now entry");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Successfully deleted Buy Now entry"));
});

const getOrdersByDateRange = asyncHandler(async (req, res) => {
    console.log('workin2');
    
    if (req?.user?.email === "ttushar476@gmail.com") {
        console.log("working 1");
        
        const { startDate, endDate } = req.body;
        console.log("working 1", startDate, endDate );


        const start = new Date(startDate);
        const end = new Date(endDate);

        end.setUTCHours(23, 59, 59, 999);

        const orders = await BuyNow.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start,
                        $lte: end,
                    },
                },
            },
            {
                $lookup: {
                    from: "products", // Name of the Product collection
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            {
                $lookup: {
                    from: "users", // Name of the User collection
                    localField: "buyer_id",
                    foreignField: "_id",
                    as: "buyerDetails",
                },
            },
            {
                $unwind: "$productDetails", // Decompose productDetails array
            },
            {
                $unwind: "$buyerDetails", // Decompose buyerDetails array
            },
            {
                $project: {
                    _id: 1,
                    productId: 1,
                    buyer_id: 1,
                    repeat: 1,
                    createdAt: 1,
                    "productDetails.title": 1,
                    "productDetails.price": 1,
                    "productDetails.image": 1,

                    "buyerDetails._id": 1,
                    "buyerDetails.fullName": 1,
                    "buyerDetails.email": 1,
                    "buyerDetails.mobile": 1,
                },
            },
            {
                $sort: { createdAt: -1 }, // Sort by most recent orders
            },
        ]);

        // console.log(orders);

        if (!orders.length) {
            return res
                .status(200)
                .json(new ApiResponse(200, [], "No orders found in the specified date range"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, orders, "Successfully retrieved orders"));
    } else {
        throw new ApiError(400, "access Denied")
    }
});


export {
    addBuyNow,
    deleteBuyNow,
    getOrdersByDateRange,
};
