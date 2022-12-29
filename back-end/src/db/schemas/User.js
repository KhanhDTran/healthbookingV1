import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    gender: { type: Schema.Types.ObjectId, ref: "Allcode" },
    address: String,
    phoneNumber: String,
    roleId: { type: Schema.Types.ObjectId, ref: "Allcode" },
    position: { type: Schema.Types.ObjectId, ref: "Allcode" },
    image: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
