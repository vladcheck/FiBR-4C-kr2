import type { Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const getRequestHelperFactory = (status: number, reason: string) => {
  console.log(status, reason);
  return (res: Response, send?: any) => res.status(status).send(send ?? reason);
};
export const getOk = getRequestHelperFactory(StatusCodes.OK, ReasonPhrases.OK);
export const getNotFound = getRequestHelperFactory(
  StatusCodes.NOT_FOUND,
  ReasonPhrases.NOT_FOUND,
);
export const getBadRequest = getRequestHelperFactory(
  StatusCodes.BAD_REQUEST,
  ReasonPhrases.BAD_REQUEST,
);
export const getCreated = getRequestHelperFactory(
  StatusCodes.CREATED,
  ReasonPhrases.CREATED,
);
