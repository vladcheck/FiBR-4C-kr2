import type { Request, Response } from "express";
import { getBadRequest, getNotFound } from "../utils/requestHelpers";
import { StatusCodes } from "http-status-codes";
import products from "../mock/products";
import users from "../mock/users";
import { Router } from "express";

const usersRouter: Router = Router();

usersRouter.get("/", async (_req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json(users);
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return getBadRequest(res);
  }
  const user = users.find((u) => u.id === id);
  if (!user) {
    return getNotFound(res);
  }

  return res.status(StatusCodes.OK).json(products);
});

export default usersRouter;
