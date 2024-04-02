import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AuthenticationMiddleware {
  async generateToken(_id, tokens) {
    try {
      const token = await jwt.sign({ _id: _id.toString() }, process.env.JWTKEY);
      return token;
    } catch (error) {
      throw new Error(error);
    }
  }

  async isAuthenticate(request, response, next) {
    try {
      if (request.headers.token) {
        const verifiedToken = await jwt.verify(
          request.headers.token,
          process.env.JWTKEY
        );
        request.user = { id: verifiedToken.id };
        return next();
      }
    } catch (error) {
      return response.status(401).send("Token invalid");
    }
    return response.status(401).send("Token not found in request");
  }
}

export { AuthenticationMiddleware };
