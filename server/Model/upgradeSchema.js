const mongoose = require("mongoose");

const upgradeSchema = new mongoose.Schema({
    Plan: {
        type: String,
    },
    method: {
        type: String,
    },

    status:{
        type:String,
        default: "pending"
    },

    image:{
        type: String,
        // required: true
    },
     owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
     }
},{timestamps:true})

const Upgrade = mongoose.model("upgrade", upgradeSchema)

module.exports = Upgrade;