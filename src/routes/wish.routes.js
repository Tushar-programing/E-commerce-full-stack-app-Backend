import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addWishlist, deleteList, getWishlistById, getWishlists } from "../controllers/wishlist.controller.js";

const router = Router();

router.route("/addWishlist/:productId").post(verifyJWT, addWishlist);

router.route("/deleteList/:wishlistId").post(verifyJWT, deleteList);

router.route("/getWishlistById/:productId").post(verifyJWT, getWishlistById)

router.route("/getWishlists").post(verifyJWT, getWishlists)

export default router;