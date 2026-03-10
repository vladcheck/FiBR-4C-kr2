import jwt from "jsonwebtoken";

const JWT_CONFIG = {
  ACCESS_SECRET: "access_secret",
  REFRESH_SECRET: "refresh_secret",
  EXP: "15m",
  REFRESH_EXP: "28d",
};

class JwtSingleton {
  grantAccessToken(
    sub: string,
    body: [string, any][],
    expiresIn: any = JWT_CONFIG.REFRESH_EXP,
  ): string {
    return jwt.sign(
      {
        sub,
        ...body,
      },
      JWT_CONFIG.ACCESS_SECRET,
      {
        expiresIn: expiresIn,
      },
    );
  }

  grantRefreshToken(
    sub: string,
    body: [string, any][],
    expiresIn: any = JWT_CONFIG.REFRESH_EXP,
  ): string {
    return jwt.sign(
      {
        sub,
        ...body,
      },
      JWT_CONFIG.REFRESH_SECRET,
      {
        expiresIn,
      },
    );
  }
}

export default new JwtSingleton();
