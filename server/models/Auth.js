const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const AuthSchema = new Schema ( {
    email: {
        type: String,
        required: [true, "please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "please enter a password"],
        minlength: [6, "Minimum password length is 6 characters"]
    }
});

// fire a function after doc saved to db
AuthSchema.post("save", function(doc, next) {
    console.log("New user created and save", doc);
    next();
})

// fire a function before doc saved to db
AuthSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


module.exports = mongoose.model("Auth", AuthSchema);