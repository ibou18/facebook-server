const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMail");

const maxAge = 10 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signUp = async (req, res) => {
  const { email, password, name, tel, address, city, postalCode, isAdmin } =
    req.body;
  const user = {
    email: email,
    name: name,
    tel: tel,
    password: password,
    address: address,
    city: city,
    postalCode: postalCode,
    isAdmin: isAdmin,
  };
  try {
    const data = await UserModel.create(req.body);
    res.status(201).json({ user: data });
  } catch (err) {
    res.status(200).send(err);
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    let data = await UserModel.login(email, password);
    const token = createToken(data._id);

    console.log("🔐token", token);
    res.cookie("jwt", token, { httpOnly: true, maxAge });

    return res.status(200).json({ status: "success", user: data, token });
  } catch (err) {
    return res.status(400).json("login not allowed");
  }
};

module.exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  // await req.session.destroy();
  return res.status(200).send({ status: "success", message: "logout" });
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  let user = await UserModel.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", message: "email non enregistrer" });
  }
  console.log("USER", user);
  try {
    const resetToken = createToken(user._id);
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `
      <h1>Cliquez sur le lien pour modifier votre mot de passe </h1>
      <p> plus de description de la tâche </p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
    try {
      await sendEmail({
        to: email,
        subject: "lien pour modifier votre mot de passe  tattoo Shop",
        text: message,
      });
      UserModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            token: resetToken,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
          if (!err) {
            return res.status(200).send({
              status: "success",
              message:
                "Veuillez consulter vos mail pour renitialiser votre mot de passe",
            });
          } else {
            return res.status(500).send({
              status: "errror",
              message: "erreur veuillez recommencer",
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ status: "error", message: "erreur veuillez recommencer" });
    }
  } catch (err) {
    next(err);
  }
};
exports.resetPassword = async (req, res) => {
  var user;
  jwt.verify(
    req.params.token,
    process.env.TOKEN_SECRET,
    async (err, decodedToken) => {
      if (err) {
        return res
          .status(400)
          .send({ status: "error", message: "Le token n'est pas valide" });
      } else {
        user = await UserModel.findById(decodedToken.id);
        if (!user) {
          return res
            .status(400)
            .send({ status: "error", message: "Le token n'est pas valide" });
        }
        if (user.token === req.params.token) {
          UserModel.findById(user._id, async (err, doc) => {
            if (err) {
              return res.status(200).send({
                status: "error",
                message: doc,
              });
            }
            doc.password = req.body.password;
            doc.token = null;
            await doc.save();

            return res.status(200).send({
              status: "success",
              message: "mot de passe modifier avec success",
            });
          });
        } else {
          return res.status(400).send({
            status: "error",
            message: "Le token n'est pas valide",
          });
        }
      }
    }
  );
};
