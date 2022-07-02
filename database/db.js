const mongoose = require("mongoose");
const url = process.env.DB

module.exports = function (app) {
  mongoose.connect(
    url,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
    .then((connection) => console.log("backend connecté à MongoDB !"))
    .catch((err) => console.log(err));
  mongoose.Promise = global.Promise;
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);
  if (app) {
    app.set("mongoose", mongoose);
  }
};

function cleanup() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
}

