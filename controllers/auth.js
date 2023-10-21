const httpError = require("../helpers/httpError.js");
const Wrapper = require("../helpers/Wrapper.js");
const { User } = require("../schemas/user-schema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const {
    body: { email, password, subscription },
  } = req;

  const user = await User.findOne({ email });
  
  if (user) throw httpError(409, "Email in use");
  
  const hashPassword = await bcrypt.hash(password, 10);
  
  const newUser = await User.create({
    email,
    password: hashPassword,
    subscription,
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

const getCurrentUser = (req, res) => {
  
    const { user: { email, subscription } } = req;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  
    const { user: { _id } } = req;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
};

const updateSubscription = async (req, res) => {
  
  const { _id } = req.user;
  const { subscription: newSubscription } = req.body;
  const { email, subscription } = await User.findByIdAndUpdate(
    _id,
    {
      subscription: newSubscription,
    },
    { new: true }
  );
  res.json({
    email,
    subscription,
  });
};

module.exports = {
  register: Wrapper(register),
  login: Wrapper(login),
  getCurrentUser: Wrapper(getCurrentUser),
  logout: Wrapper(logout),
  updateSubscription: Wrapper(updateSubscription),
};
