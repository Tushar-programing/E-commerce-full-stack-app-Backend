import mongoose,{model, Schema} from "mongoose";
// import { User } from "./user.model.js";

const orderSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        quantity: {
            type: Number,
            required: true,
        },
        adress: {
            type: Schema.Types.ObjectId,
            ref: "Adress"
        },
        status: {
            type: String,
            required: true,
        },
        paymentStatus: {
            type: String,
            required: true,
            lowercase: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        // price: {
        //     type: Number,
        //     required: true,
        // }
    },
    {
        timestamps: true,
    }
)

export const Order = mongoose.model("Order", orderSchema)