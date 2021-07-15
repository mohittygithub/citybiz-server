const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

// password encryption
exports.encryptPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// password comparison
exports.comparePasswords = async (password, dbPassword) => {
  const isMatched = await bcrypt.compare(password, dbPassword);
  return isMatched;
};

// jwt creation
exports.createToken = async (id, email, name) => {
  const token = await jwt.sign(
    { id: id, email: email, name: name },
    process.env.JWT_SECRET,
    {
      expiresIn: "5h",
    }
  );
  return token;
};

// auth
exports.isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid token!" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No token!" });
  }
};

// sendgrid email implementation
exports.sendEmail = () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: "issforlineage2@gmail.com", // Change to your recipient
    from: "smartfriendmohit@gmail.com", // Change to your verified sender
    subject: "testing",
    text: "Welcome",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("error=>", error.response.body);
    });
};
