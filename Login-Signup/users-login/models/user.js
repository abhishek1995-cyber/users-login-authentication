var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, minlength: 6, required: true },
    age: { type: Number, min: 18, required: true },
    phone: { type: Number, minlength: 10, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.password && !this.isModified("password")) {
      return next();
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Set the hashed password
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

module.exports = mongoose.model("User", userSchema);
