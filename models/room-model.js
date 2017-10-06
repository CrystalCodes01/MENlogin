const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myRoomSchema = new Schema(
  {
    name: { type: String},
    description: {type: String},
    photoUrl: {type: String},
    hasPets: {type: Boolean, default: true},
    // the id of the user who owns the room
    owner: { type: Schema.Types.ObjectId }
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model('rooms', myRoomSchema);

module.exports = RoomModel;
