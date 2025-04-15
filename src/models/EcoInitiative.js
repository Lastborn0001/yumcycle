import mongoose from "mongoose";

const EcoInitiativeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.models.EcoInitiative ||
  mongoose.model("EcoInitiative", EcoInitiativeSchema);
