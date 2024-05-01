import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { createAdress, deleteAdress, getAllAdress, updateAdress } from "../controllers/adress.controller.js";

const router = Router();

router.route("/createAdress").post(verifyJWT, createAdress)

router.route("/updateAdress/:adressId").post(verifyJWT, updateAdress)

router.route("/deleteAdress/:adressId").post(verifyJWT, deleteAdress)

router.route("/getAllAdress").post(verifyJWT, getAllAdress)


export default router;