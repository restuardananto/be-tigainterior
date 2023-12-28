import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Social = db.define(
  "social",
  {
    media: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Social;
