const express = require("express");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRoutes)

// insertion config database
require("./database/db")(app)

app.get("/", (req, res) => {
  console.log("bien sur les routes backend !")
})

app.listen(PORT, () => {
  console.log(`serveur écoute sur le port ${PORT}`)
})

// static files path
// app.use(express.static(path.join(__dirname, "mykin/src/assets")));

// // api root
// app.use("/api", userRoute);

// // PORT
// const port = process.env.PORT || 3000;

// // 404 handler
// app.use((req, res, next) => {
//   // next(createError(404));
//   res.send("error 404 route n'existe pas");
// });

// //Base route
// app.get("/", (req, res) => {
//   res.json({ messagejson: "route principale délivrée par le backend" });
// });

// // Base Route
// app.get("/", (req, res) => {
//   res.send("invalid endpoint");
// });

// app.get("*", (req, res) => {
//   res.json({ messagejson: "route principale délivrée par le backend" });
//   // res.sendFile(path.join(__dirname, "mykin/src/app/app.component.html"));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   console.error(err.message);
//   if (!err.statusCode) err.statusCode = 500;
//   res.status(err.statusCode).send(err.message);
// });

// app.use("/img", express.static(path.join(__dirname, "public/images")));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // app.get("/", (req, res) => {
// //   res.json({ messagejson: "route principale délivrée par le backend" });
// // });

// ///////////////////// Création compte utilistateur/////////////////////
// app.post("/register", (req, res) => {
//   console.log("req route poste back: ", req);
// });

// const httpServer = app.listen(port, () => {
//   console.log(`Le serveur backend écoute sur le port ${port}`);
// });
