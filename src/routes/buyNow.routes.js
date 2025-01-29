import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
    addBuyNow, 
    deleteBuyNow, 
    getOrdersByDateRange
} from "../controllers/buyNow.controller.js";

const router = Router();

// Add a new "Buy Now" order
router.route("/addBuyNow/:productId").post(verifyJWT, addBuyNow);

// Update an existing "Buy Now" order
router.route("/deleteBuyNow/:buyNowId").post(verifyJWT, deleteBuyNow);

// Retrieve all "Buy Now" orders within a date range (Admin Access)
router.route("/getBuyNowByDateRange").post(verifyJWT, getOrdersByDateRange);


export default router;
