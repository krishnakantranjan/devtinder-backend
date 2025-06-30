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

//Compound index -> Read about it. (efficient searching in database)
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


// connectionRequestSchema.pre("save", function (next) {
//     const connectionRequest = this;
//     if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//         throw new Error("you cannot send connection request to yourself");
//     }

//     next(); //very important to call next function because it is like a middleware
// });


const ConnectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;