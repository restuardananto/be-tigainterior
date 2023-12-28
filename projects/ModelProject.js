import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Project = db.define(
  "project",
  {
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    url: DataTypes.STRING,
    kategori: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Project;
