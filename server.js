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

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

// db.sequelize.sync().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is listening on http://localhost:${PORT}`);
//   });
// });

// this is dev branch
