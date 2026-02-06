import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const documentSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileExt: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Document = model('Document', documentSchema);
export default Document;
