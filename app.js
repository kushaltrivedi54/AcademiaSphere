import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { dbConnection } from "./config/mongoConnection.js";
import route from "./routes/index.js";


const databaseconnection = dbConnection();
const app = express();

// Serve static files from the 'icons' directory
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
const iconsDir = express.static(__dirname + "/static/icons");
app.use("/icons", iconsDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.CookieSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.mongoServerUrl,
      dbName: "UMS",
    }),
  })
);

app.use("/", (req, res, next) => {
  if (req.body._csrf) {
    req.headers["x-csrf-token"] = req.body._csrf;
    delete req.body._csrf;
  }
  next();
});


const eqHelper = function (a, b) {
  return a === b;
};

const gtHelper = function (a, b) {
  return a > b;
};

const gtD = function (a, b) {
  const x = new Date(a);
  const y = new Date(b);
  return x > y;
};
const ifUserType = function (roleString, session_type, options) {
  const roleArray = roleString.split(',');

  if (Array.isArray(roleArray) && roleArray.includes(session_type)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

const handlebars = exphbs.create({
  defaultLayout: "main",
  partialsDir: ["views/partials/"],
  helpers: { eq: eqHelper, gt: gtHelper, gtD: gtD, ifUserType: ifUserType },
});

app.engine("handlebars", handlebars.engine);

app.set("view engine", "handlebars");
app.set("views", "./views");

route(app);


app.listen(8080, () => {
  console.log("Running web server on port 8080");
  console.log(`http://localhost:8080/`);
});
