const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: false },
    phone: { type: String, required: false },
    isAdmin: { type: Boolean, default: false },
    isAgent: { type: Boolean, default: false },
    isFirstTime: { type: Boolean, default: true },
    skills: { type: Array, required: false },
    profile: {
      type: String,
      required: true,
      default:
        "https://firebasestorage.googleapis.com/v0/b/jobmarketplace-a1007.appspot.com/o/jobMarket%2Fuser.png?alt=media&token=41640379-346c-489d-bb0c-4c2fb41d5ec4",
    },
    token: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
