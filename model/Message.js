const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        nameUser: {
            type: String,
            required: true
        },
        prenomUser:{
            type: String,
            required: true
        },
        destinataire: {
            type: String,
            required: true
        } 

    },
    { collection: "messages", timestamps: true}
);

module.exports = mongoose.model("Message", MessageSchema)