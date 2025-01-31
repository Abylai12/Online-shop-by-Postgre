import jwt, { JwtPayload } from "jsonwebtoken";

// export const decodeToken = (token: string) => {
//   return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "");
// };

export const decodeToken = (accessToken: string) => {
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;
    return decoded.userId; // Access the `userId` property from the decoded token
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

export const decodeTokenRefresh = (accessToken: string) => {
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;
    return decoded.userId; // Access the `userId` property from the decoded token
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};
