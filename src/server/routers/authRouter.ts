import { Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../entities/User";
import users from "../mock/users";
import authMiddleware from "../middleware/authMiddleware";
import { hashPassword, verifyPassword } from "../utils/password";
import {
  getBadRequest,
  getNotFound,
  getInternalServerError,
  getUnauthorized,
} from "../utils/requestHelpers";
import JwtSingleton, { TokenType } from "../utils/jwt";
import { getErrorString, nextId } from "../server";
import { JwtPayload } from "jsonwebtoken";
import dbAdapter from "../utils/DbAdapter";
import path from "node:path";

function sanitize<T extends { hash: string }>(value: T): Omit<T, "hash"> {
  const valueCopy = Object.assign(value);
  delete valueCopy.hash;
  return valueCopy;
}

const authRouter: Router = Router();
const userPath = path.resolve("db", "users.json");

function getUserTokenBody(user: User, type: TokenType) {
  return type === "access"
    ? Object.entries(user).filter(([k]) => {
        return k !== "id";
      })
    : { firstName: user.firstName };
}

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     description: Создает нового пользователя с хешированным паролем
 *     tags: [Auth, Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - password
 *               - email
 *             properties:
 *                firstName:
 *                 type: string
 *                 example: Ivan
 *                lastName:
 *                  type: string
 *                  example: Sidelnikov
 *                password:
 *                 type: string
 *                 example: qwerty123
 *                email:
 *                 type: string
 *                 example: ivan@yandex.ru
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  id:
 *                    type: string
 *                    example: ab12cd
 *                  firstName:
 *                    type: string
 *                    example: Ivan
 *                  lastName:
 *                    type: string
 *                    example: Sidelnikov
 *                  email:
 *                    type: string
 *                    example: ivan@yandex.ru
 *                  hashedPassword:
 *                    type: string
 *                    example: $2b$10$kO6Hq7ZKfV4cPzGm8u7mEuR7r4Xx2p9mP0q3t1yZbCq9Lh5a8b1QW
 *       400:
 *         description: Некорректные данные
 *       409:
 *         description: Пользователь с такой почтой уже существует
 */
authRouter.post("/register", async (req: Request, res: Response) => {
  const b = req.body;

  if (["email", "password", "firstName", "lastName"].some((key) => !b[key])) {
    return getBadRequest(res);
  }
  if (b.password.length < 4) {
    return getBadRequest(
      res,
      getErrorString("Слишком короткий пароль", b.password),
    );
  } else if (b.password.length > 32) {
    return getBadRequest(
      res,
      getErrorString("Слишком длинный пароль", b.password),
    );
  } else if (
    !b.password.match(/[a-zA-Z0-9_\{\}\[\]\(\);:!\?\$%\.\,\^\\\/]{4,32}/)
  ) {
    return getBadRequest(
      res,
      getErrorString(
        "Пароль может содержать только латинские буквы, цифры от 0 до 9, и символы !?:;.,$^/\[](){}%",
        b.password,
      ),
    );
  }

  if (!b.firstName.match(/[A-ZА-ЯЁ][a-zа-яё]{1,63}/)) {
    return getBadRequest(res, getErrorString("Некорретное имя", b.firstName));
  }

  if (!b.lastName.match(/[A-ZА-ЯЁ][a-zа-яё]{1,63}/)) {
    return getBadRequest(
      res,
      getErrorString("Некорретная фамилия", b.firstName),
    );
  }

  if (b.email.length < 5) {
    return getBadRequest(
      res,
      getErrorString("Почта не может быть короче пяти символов", b.firstName),
    );
  } else if (!b.email.match(/[a-zA-Z0-9_]{1,}@[a-z0-9]{1,}\.[ru|com|yahoo]/)) {
    return getBadRequest(
      res,
      getErrorString("Неправильная почта", b.firstName),
    );
  } else if (users.some((u) => u.email === b.email)) {
    return res
      .status(StatusCodes.CONFLICT)
      .send("Профиль с такой почтой уже существует.");
  }

  const u: User = {
    id: nextId(),
    firstName: b.firstName,
    lastName: b.lastName,
    email: b.email,
    hash: await hashPassword(b.password),
  };
  users.push(u);

  try {
    await dbAdapter.appendEntry(userPath, u);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(`couldn't write to database: ${error}`);
  }

  const userCopy: any = sanitize(u);
  return res.status(StatusCodes.CREATED).json(userCopy);
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Проверяет логин и пароль пользователя
 *     tags: [Auth, Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: ivan
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       400:
 *         description: Отсутствуют обязательные поля или введены неверные учетные данные (напр. пароли не совпадают)
 *       404:
 *         description: Пользователь не найден
 *       200:
 *         description: Пользователь успешно авторизован
 */
authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return getBadRequest(res);
  }

  const u = users.find((u) => u.email === email);
  if (!u) {
    return getNotFound(res);
  }
  console.log(u);

  const passwordsMatch = await verifyPassword(password, u.hash);
  if (!passwordsMatch) {
    return getBadRequest(res, "Invalid credentials.");
  }

  const accessToken = JwtSingleton.grantAccessToken(
    u.id,
    getUserTokenBody(u, "access"),
  );
  const refreshToken = JwtSingleton.grantRefreshToken(u.id, {
    firstName: u.firstName,
  });

  return res
    .status(StatusCodes.OK)
    .json({ accessToken, refreshToken, uid: u.id });
});

authRouter.post("/refresh", (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return getBadRequest(res, "Refresh token is required");
  }

  if (JwtSingleton.isTokenValid(refreshToken, "refresh")) {
    return getUnauthorized(res, "Invalid refresh token");
  }

  try {
    const payload = JwtSingleton.verify(refreshToken, "refresh");

    const u = users.find((u) => u.id === payload.sub);
    if (!u) {
      return getUnauthorized(res, "User not found");
    }

    const { newAccessToken, newRefreshToken } = JwtSingleton.rotateTokens(
      refreshToken,
      u.id,
      getUserTokenBody(u, "access"),
      getUserTokenBody(u, "refresh"),
    );

    return res
      .status(StatusCodes.OK)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return getUnauthorized(res, "Invalid or expired refresh token");
  }
});

/**
 * @swagger
 * /api/auth/me:
 *  get:
 *    summary: Получить данные клиента, если он авторизован
 *    tags: [Users, Auth]
 *    description: Если клиент авторизован, то вернет информацию о нем
 *    headers:
 *      Authorization:
 *        required: true
 *    responses:
 *      500:
 *        description: Ошибка на стороне сервера
 *      404:
 *        description: Пользователь с таким ID не обнаружен
 *      200:
 *        description: Пользователь авторизован
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  type: string
 *                  example: dfas12
 *                firstName:
 *                  type: string
 *                  example: Сергей
 *                lastName:
 *                  type: string
 *                  example: Овчинников
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 */
authRouter.get(
  "/me",
  authMiddleware,
  async (req: Request & JwtPayload, res: Response) => {
    const id = req["user"].sub;
    if (!id) {
      return getInternalServerError(res);
    }

    const u = users.find((u) => u.id === id);
    if (!u) {
      return getNotFound(res);
    }

    res.status(StatusCodes.OK).json(sanitize(u));
  },
);

export default authRouter;
