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

// test route
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "This is a test route on users" });
});

app.use("/api/users", userRoute);

const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//   console.log(`Server is listening on http://localhost:${PORT}`);
// });

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
});

/*

Host: sql6.freesqldatabase.com
Database name: sql6425539
Database user: sql6425539
Database password: wREmjNwaNG
Port number: 3306

*/
