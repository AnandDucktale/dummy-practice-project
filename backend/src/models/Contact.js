import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    contactOwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = model('Contact', contactSchema);
export default Contact;
