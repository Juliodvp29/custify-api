import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
      jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
        if (err) res.status(403).json({ status: "error", message: "Invalid token", data: []  });
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({ status: "error", message: "You are not authorized", data: []  });
    }
  };

  export default verifyToken
 