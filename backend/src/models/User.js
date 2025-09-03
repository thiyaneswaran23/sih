import mongoose from "mongoose";

export const USER_ROLES = ["Alumni", "Student"];

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, 
    },
    password: { type: String, required: true }, 
    role: { type: String, enum: USER_ROLES, default: "Alumni" },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
