const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { PORT } = require("./config/serverConfig");

const apiRoutes = require("./routes/index");
const db = require("./models/index");

const setupAndStartServer = async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/api", apiRoutes);

  app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);

    if (process.env.SYNC_DB) {
      db.sequelize.sync({ alert: true });
    }
  });
};

setupAndStartServer();
