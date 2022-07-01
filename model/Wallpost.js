const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wallpostShema = new Schema(
    {
        title: {
          type: String,
          unique: false,
          required: true,
        },
        description: {
          type: String,
          unique: false,
          required: true,
        },
        createdDate: {
           type: Date,
        },
        imageUrl: {
          type: String,
          required: true
        },
        likes: {
          type: Number,
          required: false
        },
        id: {
          type: Number,
          required: false
        },
        location: {
          type: String,
          required: false
        },
        author: {
          type: String,
          required: false
        },       
        prenomUser: {
          type: String,
          required: false
        },       
        nameUser: {
          type: String,
          required: false
        },       
    
      },
      { collection: "wallposts", timestamps: true }
);

module.exports = mongoose.model("Wallpost", wallpostShema);