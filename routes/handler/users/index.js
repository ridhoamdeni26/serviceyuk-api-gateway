const register = require("./register");
const login = require("./login");
const verificationEmail = require("./verificationEmail");
const update = require("./update");
const updatePassword = require("./updatePassword");
const updateImage = require("./updateImage");
const getUser = require("./getUser");
const getUserId = require("./getUserId");
const logout = require("./logout");

module.exports = {
  register,
  login,
  verificationEmail,
  update,
  updatePassword,
  updateImage,
  getUser,
  getUserId,
  logout,
};
