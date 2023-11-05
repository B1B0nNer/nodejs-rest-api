const httpError = require("../helpers/httpError.js");
const Wrapper = require("../helpers/Wrapper.js");
const User = require("../service/user-schema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require('fs').promises;

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) throw httpError(409, "Email in use");
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, {
    s: "250",
    r: "pg",
    d: "mm",
  });
  const newUser = await User.create({
    email,
    password: hashPassword,
    subscription,
    avatarURL,
  });
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {

  const {
    body: { email, password },
  } = req;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }
  
  const passwordCompare = await bcrypt.compare(password, user.password);
  
  if (!passwordCompare) {
    throw httpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });

  const responseUser = {
    email: user.email,
    subscription: user.subscription,
  };
  res.json({
    token,
    user: responseUser,
  });
};

const getCurrentUser = async (req, res) => {
  const token = (req.headers.authorization).split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id); // Предполагается, что у вас есть модель User

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const logout = async (req, res) => {
  const { body : { _id } } = req;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
};

const updateAvatar = async (req, res, next) => {;
  const avatarsDir = path.join("public", "avatars");
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  const image = await Jimp.read(tempUpload);
  image.resize(250, 250).write(tempUpload);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = {
  register: Wrapper(register),
  login: Wrapper(login),
  getCurrentUser: Wrapper(getCurrentUser),
  logout: Wrapper(logout),
  updateAvatar: Wrapper(updateAvatar)
};
