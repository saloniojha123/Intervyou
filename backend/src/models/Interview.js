import mongoose from "mongoose";

const turnSchema = new mongoose.Schema(
  {
    speaker: String,
    personaId: String,
    text: String,
    timestamp: Date,
  },
  { _id: false }
);

const flagSchema = new mongoose.Schema(
  {
    type: String, // 'vague' | 'contradiction'
    note: String,
    timestamp: Date,
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    transcript: [turnSchema],
    flags: [flagSchema],
    finalDifficulty: String,
    report: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);
