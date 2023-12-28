import { Sequelize } from "sequelize";

const db = new Sequelize("tigainterior", "restu", "restu", {
  dialect: "mysql",
  host: "localhost",
  timezone: "+07:00",
});

export default db;
