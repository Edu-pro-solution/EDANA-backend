// import jwt from "jsonwebtoken";

// const authenticateUser = (req, res, next) => {
//   console.log("AuthenticateUser middleware executed");

//   // Extract token from Authorization header
//   const authHeader = req.headers.authorization;
//   console.log("Authorization header:", authHeader);

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     console.log("Unauthorized - Token missing or invalid format");
//     return res
//       .status(401)
//       .json({ error: "Unauthorized - Token missing or invalid format" });
//   }

//   const token = authHeader.split(" ")[1];
//   console.log("Token:", token);

//   try {
//     // Verify the token
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decodedToken);

//     // Attach user information to the request object
//     req.user = decodedToken.user;

//     if (!req.user || !req.user._id) {
//       console.log("Unauthorized - User ID not found in token");
//       return res
//         .status(403)
//         .json({ error: "Unauthorized - User ID not found in token" });
//     }

//     next();
//   } catch (error) {
//     console.log("Unauthorized - Invalid token", error);
//     return res.status(401).json({ error: "Unauthorized - Invalid token" });
//   }
// };

// export default authenticateUser;
import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - Token missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both token formats:
    // { id } from generateToken utility
    // { user, role } from login controller
    const userId = decoded.id || decoded.user?._id || decoded.user?.id;
    if (!userId) {
      return res.status(403).json({ error: "Unauthorized - User ID not found in token" });
    }

    req.user = { id: userId, role: decoded.role, ...decoded.user };
    next();

  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

export default authenticateUser;