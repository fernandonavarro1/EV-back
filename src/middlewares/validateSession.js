import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const { user } = req.cookies;
  if (!user) {
    return res
      .status(401)
      .json({ message: "No token, auth denied" });
  }

  jwt.verify(user, TOKEN_SECRET, (error, decodedUser) => {
    if (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decodedUser;

    next();
  });
};
