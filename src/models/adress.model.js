import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
            lowecase: true,
        },
        phone: {
            type: Number,
            required: true,
            trim: true,
        },
        adress1: {
            type: String,
            required: true,
        },
        adress2: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        zip: {
            type: Number,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        
    },
    {timestamps: true}
)

export const Adress = mongoose.model("Adress", cartSchema)