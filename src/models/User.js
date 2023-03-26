import mongoose from "mongoose";
import {randomUUID } from "crypto";
const UserSchema = new mongoose.Schema(
  {
    uid: {
        type: String,
        default: function genUUID() {
          return randomUUID();
        },
      },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
