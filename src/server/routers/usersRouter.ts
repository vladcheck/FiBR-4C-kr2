import type { Request, Response } from "express";
import { getBadRequest, getNotFound, getOk } from "../utils/requestHelpers";
import { StatusCodes } from "http-status-codes";
import initialUsers from "../mock/users";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";

let users = initialUsers;

const usersRouter: Router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *       - id
 *       - firstName
 *       - lastName
 *       - email
 *       - password
 *      properties:
 *        id:
 *          type: string
 *          description: Уникальный ID пользователя
 *        firstName:
 *          type: string
 *          description: Имя
 *        lastName:
 *          type: string
 *          description: Фамилия
 *        email:
 *          type: string
 *          description: Почта, она же и логин
 *        password:
 *          type: string
 *          description: Пароль
 *      example:
 *        id: "adfs31"
 *        firstName: Сергей
 *        lastName: Овчинников
 *        email: sergei_ovchinnikov@yandex.ru
 *        password: "12345678"
 */

/**
 * @swagger
 * /api/users:
 *  get:
 *    summary: Получить всех пользователей
 *    tags: [Users]
 *    responses:
 *      200:
 *        descrition: Пользователи найдены
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */
usersRouter.get("/", async (_req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json(users);
});

/**
 * @swagger
 * /api/users/:id:
 *  get:
 *    summary: Получить пользователя по ID
 *    tags: [Users]
 *    responses:
 *      400:
 *        description: ID не определен
 *      404:
 *        description: Пользователя с таким ID не существует
 *      200:
 *        description: Пользователь найден
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *  delete:
 *    summary: Удалить пользователя по ID
 *    tags: [Users]
 *    responses:
 *      400:
 *        description: ID не определен
 *      404:
 *        description: Пользователя с таким ID не существует
 *      200:
 *        description: Пользователь удален
 */
usersRouter
  .get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return getBadRequest(res);
    }
    const user = users.find((u) => u.id === id);
    if (!user) {
      return getNotFound(res);
    }

    return res.status(StatusCodes.OK).json(user);
  })
  .delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return getBadRequest(res, "uid not provided");
    }

    let index = -1;
    const user = users.find((u, i) => {
      if (u.id === id) {
        index = i;
        return true;
      }
      return false;
    });
    if (!user && index === -1) {
      return getNotFound(res, `user with id ${id} was not found`);
    }

    users = users.toSpliced(index, 1);
    return getOk(res, "user deleted");
  });

export default usersRouter;
