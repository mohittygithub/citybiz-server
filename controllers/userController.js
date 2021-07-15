const db = require("../models");
const {
  encryptPassword,
  comparePasswords,
  createToken,
  sendEmail,
} = require("../utils");

// test route
exports.testRoute = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: "This is a test route on users" });
};

// get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// register new user
exports.registerUser = async (req, res, next) => {
  console.log("key=>", process.env.SENDGRID_API_KEY);

  const { name, email, password, mobile, roles } = req.body;
  if (name && email && password && mobile && roles) {
    try {
      const user = await db.User.findAll({ where: { email: email } });
      if (user.length > 0) {
        return res.status(400).json({ success: false, error: "Email exists." });
      }

      const encryptedPassword = await encryptPassword(password);

      const newUser = await db.User.create({
        name: name,
        email: email,
        password: encryptedPassword,
        mobile: mobile,
        roles: roles,
        isActive: true,
      });

      res
        .status(201)
        .json({ success: true, message: "User created", data: newUser });

      // sendEmail();

      // sendEmail(
      //   newUser.email,
      //   "smartfriendmohit@gmail.com",
      //   "verify",
      //   "verify your email"
      // );
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.status(400).json({ success: false, error: "Incomplete data" });
  }
};

// user login
exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const user = await db.User.findOne({ where: { email: email } });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid username/password" });
      }

      const isMatched = await comparePasswords(password, user.password);

      if (!isMatched) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid username/password" });
      }

      const token = await createToken(user.id, user.email, user.name);
      res.status(200).json({ success: true, data: token });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.status(400).json({ success: false, error: "Incomplete data" });
  }
};

// change user password
exports.changeUserPassword = async (req, res, next) => {
  if (req.params.id) {
    try {
      const user = await db.User.findOne({ id: req.params.id });
      if (!user) {
        return res.status(400).json({ success: false, error: "Invalid id!" });
      }
      const hashedPassword = await encryptPassword(req.body.password);
      await db.User.update(
        { password: hashedPassword },
        { where: { id: req.params.id } }
      );

      res.status(201).json({ success: true, message: "Record updated!" });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  } else {
    return res.status(400).json({ success: false, error: "Incomplete data" });
  }
  res.send(id);
};

// delete user
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  if (id) {
    try {
      await db.User.destroy({ where: { id: id } });
      res.status(201).json({ success: true, message: "Record deleted!" });
    } catch (error) {
      return res.status(400).json({ success: false, error: "Incomplete data" });
    }
  } else {
    return res.status(400).json({ success: false, error: "Incomplete data" });
  }
};
