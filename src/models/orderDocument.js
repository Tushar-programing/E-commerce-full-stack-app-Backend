import mongoose,{model, Schema} from "mongoose";
// import { User } from "./user.model.js";

const DocumentSchema = new Schema(
    {
        order: [
            {
                type: Schema.Types.ObjectId,
                ref: "Order"
            }
        ],
        total: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export const Document = mongoose.model("Document", DocumentSchema)