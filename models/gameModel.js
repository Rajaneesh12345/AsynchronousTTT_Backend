const mongoose = require("mongoose");

const gameSchema = mongoose.Schema(
  {
    currentGame: {
      type: [String],  
      required: true,
    },
    currentChance: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {                    
      type: Number,        //0:Pending, 1:Winner, -1:Draw
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
    },
    player1: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    player2: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", gameSchema);
