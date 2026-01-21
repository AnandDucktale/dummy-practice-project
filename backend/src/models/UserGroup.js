import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userGroupSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
  },
  { timestamps: true }
);

const UserGroup = model('UserGroup', userGroupSchema);
export default UserGroup;
