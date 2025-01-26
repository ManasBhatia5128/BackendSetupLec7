import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subsciber: {
        type: Schema.Types.ObjectId, // one who is scbscribing to a channel
        ref: "User",
    },
    channel: {
        type: Schema.Types.ObjectId, // one who is getting subscribed
        ref: "User",
    },

}, {timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema);