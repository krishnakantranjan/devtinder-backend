const mongoose = require('mongoose');
const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["interested", "ignored", "accepted", "rejected"],
                message: `{VALUE} is not supported`
            }
        }
    },
    {
        timestamps: true,
    }
);
// this is not important to much
// connectionRequestSchema.pre("save", function (next) {
//     const connectionRequest = this;
//     if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//         throw new Error("you cannot send connection request to yourself");
//     }

//     next(); //very important to call next function because it is like a middleware
// });


const ConnectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;