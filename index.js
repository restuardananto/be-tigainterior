import express from "express";
import db from "./config/Database.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import RouteProject from "./projects/RouteProject.js";
import RouteHero from "./heroes/RouteHero.js";
import RoutePromo from "./promo/RoutePromo.js";
import RouteAuth from "./auth/RouteAuth.js";
import RouteUser from "./auth/RouteUser.js";
import RouteSocial from "./social/RouteSocial.js";

const app = express();
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
  checkExpirationInterval: 1 * 60 * 60 * 1000,
});

// (async () => {
//   await db.sync({ alter: true });
// })();

app.use(
  session({
    secret: "7dsf9ucsLKKNNNKnlklkefn9797098",
    store: store,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
      secure: "auto",
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost"],
  })
);

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(RoutePromo);
app.use(RouteProject);
app.use(RouteHero);
app.use(RouteAuth);
app.use(RouteUser);
app.use(RouteSocial);

app.listen(8097, () => {
  console.log("API Running");
});
