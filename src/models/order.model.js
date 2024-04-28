import mongoose,{model, Schema} from "mongoose";
import { User } from "./user.model";

const orderSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
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
        }
    },
    {
        timestamps: true,
    }
)

export const Order = mongoose.model("Order", orderSchema)