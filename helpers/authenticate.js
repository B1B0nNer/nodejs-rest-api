const jwt = require('jsonwebtoken');
const httpError = require('../helpers/httpError.js');
const { User } = require('../schemas/user-schema.js');

const { SECRET_KEY } = process.env;

function authenticate(req, res, next) {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(httpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    User.findById(id, (err, user) => {
      if (err || !user || !user.token || user.token !== token) {
        next(httpError(401, "Not authorized"));
      } else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    next(httpError(401, "Not authorized"));
  }
}

module.exports = authenticate;
