const mongoose = require("mongoose");
const Notes = new mongoose.Schema(
    {   
        userId: {
            type: String
        },
        content: {
            type: String
        },
        date: {
            type: String
        },
        user: {
            nickname: {
                type: String
            },
            email: {
                type: String
            },
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);
module.exports = mongoose.model("notes", Notes)
