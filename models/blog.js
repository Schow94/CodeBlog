var mongoose = require("mongoose");


//BLOG MODEL
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    author: {
        id: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment_v1"
        }
    ],
    created: 
        {
            type: Date, 
            default: Date.now
        }
});


module.exports = mongoose.model("Blog_v1", blogSchema);