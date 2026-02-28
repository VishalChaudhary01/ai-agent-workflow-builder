import mongoose, { Schema } from "mongoose";

const workflowSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    config: {
      type: String,
      default: "{}",
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Workflow = mongoose.model("Workflow", workflowSchema);
