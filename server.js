const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");
const { urlencoded } = require("express");
const userRoute = require("./routes/userRoute.js");

dotenv.config();

const app = express();
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);

const PORT = process.env.PORT || 5001;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
});
