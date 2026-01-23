import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

const Group = model('Group', groupSchema);
export default Group;
