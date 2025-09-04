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
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    phone: { type: String },
    address: { type: String },
    linkedin: { type: String },
    department: { type: String },
    yearOfStudy: { type: String },
    graduationYear: { type: String },
    jobTitle: { type: String },
    company: { type: String },
    profilePhoto: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
