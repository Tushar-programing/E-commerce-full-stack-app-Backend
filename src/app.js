import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
dotenv.config();

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"
import product from "./routes/product.routes.js"
import adress from "./routes/adress.routes.js"
import cart from "./routes/cart.routes.js"
import order from "./routes/order.routes.js"

// console.log("app.js working");
app.use("/api/v1/users", userRouter)

app.use("/api/v1/product", product)

app.use("/api/v1/adress", adress)

app.use("/api/v1/cart", cart)

app.use("/api/v1/order", order)

export { app }