import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { create, getAllCart, removeCart, updateCart } from "../controllers/cart.controller.js";

const router = Router();

router.route("/create/:product").post(verifyJWT, create);

router.route("/updateCart/:cart").post(verifyJWT, updateCart);

router.route("/removeCart/:cart").post(verifyJWT, removeCart);

router.route("/getAllCart").post(verifyJWT, getAllCart)

export default router;