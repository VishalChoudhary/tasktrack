const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ========== BASIC FIELDS ==========
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Name must be atleast 2 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be atleast 6 characters"],
      select: false,
    },

    // ========== METADATA FIELDS ==========
    // When user registered
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // When user last updated their profile
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // For future features (user profile picture)
    profileImage: {
      type: String,
      default: null, // ← Optional field
    },
  },
  { timestamps: true } // ← Auto-update createdAt, updatedAt
);

//Add Instance Methods (work on ONE user)

// Method: Check if password matches stored password
// (Called when user logs in)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method: Hash password before saving
// Called automatically before saving user to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
