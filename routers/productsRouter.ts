import { Router, type Request, type Response } from "express";
import { getErrorString, nextId } from "../server";
import { getBadRequest, getNotFound, getOk } from "../utils/requestHelpers";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import Product from "../entities/Product";
import originalProducts from "../mock/products";

const productsRouter: Router = Router();

let products = originalProducts;

productsRouter.get("/api/products", async (_req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json(products);
});

productsRouter.post("/api/products", async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).send("body is empty");
  }
  if (!req.body.price || !req.body.title || !req.body.category) {
    return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
  }
  if (isNaN(req.body.price) || parseFloat(req.body.price) < 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        getErrorString(
          `Некорректная цена`,
          req.body.price,
          `неотрицательное число`,
        ),
      );
  }

  const newProduct: Product = {
    id: nextId(),
    title: req.body.title,
    category: req.body.category,
    price: parseFloat(req.body.price),
    description: req.body.description ?? "",
  };

  products.push(newProduct);
  return res
    .status(StatusCodes.CREATED)
    .json(newProduct)
    .send(ReasonPhrases.CREATED);
});

productsRouter.get("/api/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return getBadRequest(res);
  }
  const product = products.find((p) => p.id === id);
  if (!product) {
    return getNotFound(res);
  }

  return getOk(res);
});

productsRouter.put("/api/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return getBadRequest(res);
  }

  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return getNotFound(res);
  }

  const p = products[productIndex]!;
  const b = req.body;

  if (b.title) p.title = b.title;
  if (b.description) p.description = b.description;
  if (b.price) {
    if (isNaN(b.price) || parseFloat(b.price) < 0) {
      return getBadRequest(
        res,
        getErrorString("Некорректная цена", b.price, "неотрицательное число"),
      );
    } else {
      p.price = parseFloat(b.price);
    }
  }

  products = products.splice(productIndex, 1, p);
  return getOk(res);
});

productsRouter.delete(
  "/api/products/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return getBadRequest(res);
    }

    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return getNotFound(res);
    }

    products = products.splice(productIndex, 1);
    return getOk(res);
  },
);

export default productsRouter;
