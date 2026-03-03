import { Router, type Request, type Response } from "express";
import authRouter from "./authRouter";
import usersRouter from "./usersRouter";
import productsRouter from "./productsRouter";
import { getOk } from "../utils/requestHelpers";

const apiRouter: Router = Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/products", productsRouter);

apiRouter.get("/", async (_req: Request, res: Response) => {
  return getOk(res);
});

export default apiRouter;
